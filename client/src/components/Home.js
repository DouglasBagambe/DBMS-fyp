// src/components/Home.js

import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <Header />
      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="slide-up">Driver Behavior Monitoring System</h1>
            <p className="slide-up">
              Advanced analytics and insights to improve driver safety and
              efficiency.
            </p>
            <div className="cta-buttons slide-up">
              <Link to="/signup" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login to Dashboard
              </Link>
            </div>
          </div>
          <div className="hero-image slide-up">
            <div className="image-placeholder">
              <div className="dashboard-preview"></div>
            </div>
          </div>
        </div>
      </header>
      <section className="features">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="icon-analytics"></i>
              </div>
              <h3>Real-time Analytics</h3>
              <p>
                Monitor driver behavior patterns with advanced analytics tools.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="icon-alert"></i>
              </div>
              <h3>Incident Alerts</h3>
              <p>
                Receive immediate notifications for unsafe driving behaviors.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="icon-report"></i>
              </div>
              <h3>Comprehensive Reports</h3>
              <p>Generate detailed reports to track improvements over time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="icon-ai"></i>
              </div>
              <h3>AI-Powered Insights</h3>
              <p>Leverage machine learning to predict potential risks.</p>
            </div>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <span>DB</span>MS
            </div>
            <p>© 2025 Driver Behavior Monitoring System</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
