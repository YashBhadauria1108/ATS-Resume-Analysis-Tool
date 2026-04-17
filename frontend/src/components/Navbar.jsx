import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const navLinks = isLoggedIn
    ? [
        { to: "/upload", label: "Analyze" },
        { to: "/dashboard", label: "Dashboard" }
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/login", label: "Login" }
      ];

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="nav-logo-icon">⚡</span>
          ATS<span className="logo-accent">Pro</span>
        </Link>

        <div className="nav-links desktop-only">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link ${location.pathname === l.to ? "active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions desktop-only">
          {isLoggedIn ? (
            <div className="nav-user">
              <div className="nav-avatar">{(user.name || user.email || "U")[0].toUpperCase()}</div>
              <span className="nav-username">{user.name || user.email?.split("@")[0]}</span>
              <button className="nav-logout-btn" onClick={handleLogout}>Sign Out</button>
            </div>
          ) : (
            <Link to="/signup" className="btn-primary nav-cta">
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile */}
        <button className="hamburger mobile-only" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="mobile-link" onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <button className="mobile-link logout" onClick={handleLogout}>Sign Out</button>
          ) : (
            <Link to="/signup" className="mobile-link cta" onClick={() => setMenuOpen(false)}>
              Get Started
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
