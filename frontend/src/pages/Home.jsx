import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css";

const features = [
  {
    icon: "🤖",
    title: "Gemini AI Powered",
    desc: "Google's cutting-edge AI analyzes your resume with precision and depth, providing human-level insights."
  },
  {
    icon: "📊",
    title: "ATS Score Analysis",
    desc: "Get an instant compatibility score showing exactly how well your resume matches the job requirements."
  },
  {
    icon: "🔍",
    title: "Missing Keywords",
    desc: "Identify critical keywords missing from your resume that ATS systems screen for automatically."
  },
  {
    icon: "💡",
    title: "Smart Suggestions",
    desc: "Receive tailored, actionable improvement tips to maximize your chances of getting past ATS filters."
  },
  {
    icon: "⚡",
    title: "Instant Results",
    desc: "Upload your PDF and get comprehensive analysis in under 10 seconds — no waiting around."
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    desc: "Your resume data is never stored permanently. Analysis is done in real-time and discarded."
  }
];

const stats = [
  { value: "95%", label: "Accuracy Rate" },
  { value: "10s", label: "Analysis Time" },
  { value: "50+", label: "Keywords Checked" },
  { value: "100%", label: "Free to Use" }
];

export default function Home() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="home-wrapper">
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span>✨</span> Powered by Google Gemini AI
          </div>
          <h1 className="hero-title">
            Beat the ATS.<br />
            <span className="gradient-text">Land Your Dream Job.</span>
          </h1>
          <p className="hero-subtitle">
            Upload your resume and get an instant AI-powered ATS compatibility score,
            missing keywords, and actionable suggestions to get past the filters.
          </p>
          <div className="hero-actions">
            <Link to={isLoggedIn ? "/upload" : "/signup"} className="btn-primary hero-cta">
              Analyze My Resume
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {stats.map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-value gradient-text">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card-mockup">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span></span><span></span><span></span>
              </div>
              <span className="mockup-title">ATS Analysis</span>
            </div>
            <div className="mockup-score-ring">
              <svg viewBox="0 0 120 120" width="120" height="120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="10"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="url(#grad)" strokeWidth="10"
                  strokeDasharray="314" strokeDashoffset="78" strokeLinecap="round"
                  transform="rotate(-90 60 60)"/>
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1"/>
                    <stop offset="100%" stopColor="#22c55e"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="mockup-score-text">
                <span className="score-num">75%</span>
                <span className="score-sub">ATS Score</span>
              </div>
            </div>
            <div className="mockup-keywords">
              <p className="mockup-label">Missing Keywords</p>
              <div className="mockup-tags">
                <span className="tag tag-red">Docker</span>
                <span className="tag tag-red">Kubernetes</span>
                <span className="tag tag-red">CI/CD</span>
                <span className="tag tag-red">AWS</span>
              </div>
            </div>
            <div className="mockup-suggestion">
              <span>💡</span>
              <span>Add quantifiable metrics to work experience</span>
            </div>
            <div className="mockup-verdict good">👍 Good Match</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <div className="section-label">How It Works</div>
        <h2 className="section-title">3 Simple Steps to Success</h2>
        <div className="steps">
          {[
            { num: "01", icon: "📄", title: "Upload Resume", desc: "Upload your resume as a PDF file" },
            { num: "02", icon: "📝", title: "Paste Job Description", desc: "Add the job description you're applying for" },
            { num: "03", icon: "🚀", title: "Get AI Insights", desc: "Receive detailed analysis, score and suggestions" }
          ].map((step, i) => (
            <div key={i} className="step-card">
              <div className="step-num">{step.num}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {i < 2 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="section-label">Features</div>
        <h2 className="section-title">Everything You Need to Get Hired</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="cta-box">
          <div className="cta-glow"></div>
          <h2>Ready to Optimize Your Resume?</h2>
          <p>Join thousands of job seekers using AI to land their dream jobs</p>
          <Link to={isLoggedIn ? "/upload" : "/signup"} className="btn-primary">
            Get Started — It's Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
