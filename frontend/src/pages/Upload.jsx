import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import "./Upload.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function CircularScore({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#6366f1";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getVerdict = () => {
    if (score >= 80) return { label: "Excellent Match!", icon: "🔥", cls: "excellent" };
    if (score >= 60) return { label: "Good Match", icon: "👍", cls: "good" };
    if (score >= 40) return { label: "Average Match", icon: "⚠️", cls: "average" };
    return { label: "Needs Improvement", icon: "❌", cls: "poor" };
  };

  const color = getColor();
  const verdict = getVerdict();

  return (
    <div className="score-section">
      <div className="score-ring-wrapper">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#1e293b" strokeWidth="12"/>
          <circle
            cx="70" cy="70" r={radius} fill="none"
            stroke={color} strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
            style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="score-center">
          <span className="score-pct" style={{ color }}>{Math.round(score)}%</span>
          <span className="score-lbl">ATS Score</span>
        </div>
      </div>
      <div className={`verdict-badge ${verdict.cls}`}>
        {verdict.icon} {verdict.label}
      </div>
    </div>
  );
}

export default function Upload() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();
  const resultsRef = useRef();

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") {
      setFile(f);
      setError("");
    } else {
      setError("Please upload a PDF file only.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return setError("Please upload your resume PDF.");
    if (!jobDesc.trim()) return setError("Please enter the job description.");
    if (jobDesc.trim().length < 50) return setError("Job description is too short. Add more details.");

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDesc", jobDesc);

      const token = localStorage.getItem("token");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers,
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        setResult(data);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        setError(data.msg || "Analysis failed. Please try again.");
      }
    } catch (err) {
      setError("Server error. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFile(null);
    setJobDesc("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="upload-wrapper">
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>
      <Navbar />

      <div className="upload-container">
        <div className="upload-header fade-in">
          <div className="upload-badge">🤖 Gemini AI Powered</div>
          <h1>Analyze Your Resume</h1>
          <p>Get instant ATS compatibility score, missing keywords & improvement tips</p>
        </div>

        {/* UPLOAD FORM */}
        {!result && (
          <div className="upload-form-card fade-in">
            {/* File Upload Zone */}
            <div
              className={`drop-zone ${dragOver ? "drag-over" : ""} ${file ? "has-file" : ""}`}
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => handleFile(e.target.files[0])}
                style={{ display: "none" }}
              />
              {file ? (
                <>
                  <div className="file-icon">📄</div>
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{(file.size / 1024).toFixed(1)} KB · PDF</div>
                  <button className="change-file-btn" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                    ✕ Remove
                  </button>
                </>
              ) : (
                <>
                  <div className="drop-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <div className="drop-title">Drop your resume here</div>
                  <div className="drop-sub">or click to browse · PDF only · Max 5MB</div>
                </>
              )}
            </div>

            {/* Job Description */}
            <div className="jd-section">
              <label className="jd-label">
                <span>📋</span> Job Description
                <span className="char-count">{jobDesc.length} chars</span>
              </label>
              <textarea
                className="jd-textarea"
                placeholder="Paste the full job description here... Include required skills, responsibilities, and qualifications for best results."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={8}
              />
            </div>

            {error && (
              <div className="error-banner">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              className={`analyze-btn ${loading ? "loading" : ""}`}
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Analyzing with Gemini AI...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Analyze Resume
                </>
              )}
            </button>

            {loading && (
              <div className="loading-steps">
                <div className="load-step active">📄 Extracting resume text...</div>
                <div className="load-step">🤖 Running Gemini AI analysis...</div>
                <div className="load-step">📊 Calculating ATS score...</div>
              </div>
            )}
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <div className="results-wrapper fade-in" ref={resultsRef}>

            {/* Score + Summary Row */}
            <div className="results-top">
              <div className="results-score-card">
                <CircularScore score={result.atsScore} />
                {result.summary && (
                  <div className="summary-box">
                    <p className="summary-label">📝 AI Summary</p>
                    <p className="summary-text">{result.summary}</p>
                  </div>
                )}
              </div>

              {/* Strength Areas */}
              {result.strengthAreas?.length > 0 && (
                <div className="strength-card">
                  <h3 className="card-title">💪 Strengths</h3>
                  <div className="strength-list">
                    {result.strengthAreas.map((s, i) => (
                      <div key={i} className="strength-item">
                        <span className="check-icon">✓</span>
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className="verdict-display">
                    Overall:&nbsp;
                    <span className={`verdict-text ${result.overallVerdict?.toLowerCase().replace(" ", "-")}`}>
                      {result.overallVerdict}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Keywords Row */}
            <div className="keywords-row">
              {/* Matched Keywords */}
              {result.matchedKeywords?.length > 0 && (
                <div className="keyword-card matched">
                  <h3 className="card-title">
                    <span className="card-title-icon">✅</span>
                    Matched Keywords
                    <span className="kw-count">{result.matchedKeywords.length}</span>
                  </h3>
                  <div className="keyword-tags">
                    {result.matchedKeywords.map((kw, i) => (
                      <span key={i} className="kw-tag kw-matched">{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Keywords */}
              {result.missingKeywords?.length > 0 && (
                <div className="keyword-card missing">
                  <h3 className="card-title">
                    <span className="card-title-icon">❌</span>
                    Missing Keywords
                    <span className="kw-count missing-count">{result.missingKeywords.length}</span>
                  </h3>
                  <p className="keyword-hint">Add these to your resume to improve your score:</p>
                  <div className="keyword-tags">
                    {result.missingKeywords.map((kw, i) => (
                      <span key={i} className="kw-tag kw-missing">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {result.suggestions?.length > 0 && (
              <div className="suggestions-card">
                <h3 className="card-title">
                  <span className="card-title-icon">💡</span>
                  AI Improvement Suggestions
                </h3>
                <div className="suggestions-list">
                  {result.suggestions.map((s, i) => (
                    <div key={i} className="suggestion-item">
                      <span className="suggestion-num">{i + 1}</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="result-actions">
              <button className="btn-primary" onClick={handleReset}>
                <span>🔄</span> Analyze Another Resume
              </button>
              <a href="/dashboard" className="btn-secondary">
                📊 View History
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
