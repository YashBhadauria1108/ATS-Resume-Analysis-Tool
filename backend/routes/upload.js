const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const Resume = require("../models/Resume");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Multer - memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files allowed"), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Get user from JWT
const getUser = (req) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");
  } catch { return null; }
};

// Direct Gemini fetch - tries multiple models
async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const models = ["gemini-1.5-flash", "gemini-1.0-pro", "gemini-pro"];

  for (const modelName of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1024 }
        })
      });

      if (!response.ok) {
        const err = await response.json();
        console.log(`Model ${modelName} failed:`, err?.error?.message);
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        console.log("Gemini success with:", modelName);
        return text;
      }
    } catch (err) {
      console.log(`Model ${modelName} error:`, err.message);
      continue;
    }
  }
  return null;
}

// Main route
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });
    const jobDesc = req.body.jobDesc || "";
    if (!jobDesc.trim()) return res.status(400).json({ msg: "Job description required" });

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;
    if (!resumeText.trim()) return res.status(400).json({ msg: "Could not extract text from PDF." });

    const prompt = `You are an expert ATS resume analyzer. Analyze the resume against the job description and return ONLY valid JSON with no markdown, no backticks, no extra text.

RESUME: ${resumeText.substring(0, 3000)}

JOB DESCRIPTION: ${jobDesc.substring(0, 1000)}

Return exactly this JSON:
{"atsScore":75,"matchedKeywords":["keyword1"],"missingKeywords":["keyword2"],"suggestions":["suggestion1","suggestion2","suggestion3"],"summary":"2-3 sentence summary","strengthAreas":["area1","area2"],"overallVerdict":"Good"}

atsScore must be a number 0-100. overallVerdict must be one of: Excellent, Good, Average, Needs Improvement. Return ONLY the JSON object.`;

    const geminiText = await callGemini(prompt);
    let analysis = null;

    if (geminiText) {
      try {
        const cleaned = geminiText.replace(/```json/gi,"").replace(/```/gi,"").trim();
        analysis = JSON.parse(cleaned);
      } catch (e) {
        console.log("Parse failed:", e.message);
      }
    }

    // Fallback keyword analysis
    if (!analysis) {
      const resumeLower = resumeText.toLowerCase();
      const jobWords = [...new Set(jobDesc.toLowerCase().split(/[\s,.\-\/]+/).filter(w => w.length > 3))];
      const matched = jobWords.filter(w => resumeLower.includes(w));
      const missing = jobWords.filter(w => !resumeLower.includes(w));
      const score = jobWords.length ? Math.round((matched.length / jobWords.length) * 100) : 0;
      analysis = {
        atsScore: score,
        matchedKeywords: matched.slice(0, 10),
        missingKeywords: missing.slice(0, 10),
        suggestions: ["Add more relevant keywords from the job description","Quantify achievements with numbers","Use strong action verbs","Add a professional summary","Tailor skills section to the job"],
        summary: "Keyword-based analysis. Add a valid Gemini API key for full AI analysis.",
        strengthAreas: matched.slice(0, 3),
        overallVerdict: score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Average" : "Needs Improvement"
      };
    }

    // Save to DB if logged in
    const user = getUser(req);
    if (user) {
      try {
        await new Resume({
          user: user.id, fileName: req.file.originalname,
          jobDesc: jobDesc.substring(0, 500), score: analysis.atsScore,
          missingKeywords: analysis.missingKeywords, matchedKeywords: analysis.matchedKeywords,
          suggestions: analysis.suggestions, summary: analysis.summary, overallVerdict: analysis.overallVerdict
        }).save();
      } catch (e) { console.log("DB save skipped:", e.message); }
    }

    res.json({ success: true, ...analysis });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ msg: "Error analyzing resume: " + err.message });
  }
});

// History route
router.get("/history", async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ msg: "Not authenticated" });
    const resumes = await Resume.find({ user: user.id }).sort({ createdAt: -1 }).limit(10).select("-__v");
    res.json({ success: true, history: resumes });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching history" });
  }
});

module.exports = router;
