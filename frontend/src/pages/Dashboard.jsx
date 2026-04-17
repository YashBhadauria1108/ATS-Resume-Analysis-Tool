import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/upload/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setHistory(data.history);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#6366f1";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getVerdictClass = (v) => {
    if (!v) return "";
    return v.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className="dash-wrapper">
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>
      <Navbar />

      <div className="dash-container">
        {/* Header */}
        <div className="dash-header fade-in">
          <div>
            <h1>Welcome back, <span className="gradient-text">{user.name || "User"}</span> 👋</h1>
            <p className="dash-sub">{user.email}</p>
          </div>
          <div className="dash-header-actions">
            <Link to="/upload" className="btn-primary">
              <span>🚀</span> New Analysis
            </Link>
            <button className="logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Row */}
        {history.length > 0 && (
          <div className="dash-stats fade-in">
            {[
              { label: "Total Analyses", value: history.length, icon: "📊" },
              { label: "Avg ATS Score", value: `${Math.round(history.reduce((a, r) => a + r.score, 0) / history.length)}%`, icon: "🎯" },
              { label: "Best Score", value: `${Math.round(Math.max(...history.map(r => r.score)))}%`, icon: "🏆" },
              { label: "Last Analyzed", value: new Date(history[0]?.createdAt).toLocaleDateString(), icon: "📅" }
            ].map((stat, i) => (
              <div key={i} className="dash-stat-card">
                <span className="stat-icon">{stat.icon}</span>
                <span className="stat-val">{stat.value}</span>
                <span className="stat-name">{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* History */}
        <div className="dash-section fade-in">
          <h2 className="section-heading">
            📋 Analysis History
          </h2>

          {loading ? (
            <div className="dash-loading">
              <div className="spinner"></div>
              <span>Loading history...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="dash-empty">
              <div className="empty-icon">📄</div>
              <h3>No analyses yet</h3>
              <p>Upload your first resume to see results here</p>
              <Link to="/upload" className="btn-primary">Start Analyzing</Link>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item, i) => (
                <div key={item._id} className="history-card" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="history-left">
                    <div className="history-file">
                      <span className="file-emoji">📄</span>
                      <div>
                        <div className="history-filename">{item.fileName}</div>
                        <div className="history-date">
                          {new Date(item.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                        </div>
                      </div>
                    </div>
                    {item.summary && <p className="history-summary">{item.summary}</p>}
                  </div>

                  <div className="history-right">
                    <div className="history-score" style={{ color: getScoreColor(item.score) }}>
                      {Math.round(item.score)}%
                    </div>
                    {item.overallVerdict && (
                      <span className={`verdict-chip ${getVerdictClass(item.overallVerdict)}`}>
                        {item.overallVerdict}
                      </span>
                    )}
                    {item.missingKeywords?.length > 0 && (
                      <div className="history-missing">
                        <span className="missing-label">Missing:</span>
                        {item.missingKeywords.slice(0, 3).map((kw, j) => (
                          <span key={j} className="kw-tag kw-missing">{kw}</span>
                        ))}
                        {item.missingKeywords.length > 3 && (
                          <span className="more-tag">+{item.missingKeywords.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
