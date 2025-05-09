/* eslint-disable no-undef */
// src/components/Dashboard.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";
import Header from "../components/Header";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalTrips: 142,
    safeDrivingPercentage: 92,
    averageScore: 87,
    alerts: [
      {
        id: 1,
        message: "Driver UG1234A: Phone usage detected",
        timestamp: "14:32",
        severity: "high",
        driverId: "D001",
        vehicleId: "UG1234A",
      },
      {
        id: 2,
        message: "Driver UG5678B: Drowsiness detected",
        timestamp: "13:45",
        severity: "medium",
        driverId: "D002",
        vehicleId: "UG5678B",
      },
      {
        id: 3,
        message: "Driver UG1234A: Talking to passenger",
        timestamp: "12:10",
        severity: "low",
        driverId: "D001",
        vehicleId: "UG1234A",
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await axios.get("/api/dashboard");
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Using sample data instead.");
        // Keep using the sample data if API fails
      } finally {
        setLoading(false);
      }
    };

    // Fetch data on initial load
    fetchDashboardData();

    // Set up interval for real-time updates (every 30 seconds)
    const intervalId = setInterval(fetchDashboardData, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "#d9534f"; // Red
      case "medium":
        return "#f0ad4e"; // Yellow/Orange
      case "low":
        return "#5cb85c"; // Green
      default:
        return "#5cb85c"; // Default green
    }
  };

  const getCurrentDate = () => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date().toLocaleDateString(undefined, options);
  };

  return (
    <div className="dashboard-container">
      <Header />
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>Driver Behavior Monitoring Dashboard</h1>
          <p>Real-time monitoring for safer roads in Uganda</p>
        </div>
        <div className="dashboard-meta">
          <div className="user-info">
            Welcome, {user?.name || "Fleet Manager"}
          </div>
          <div className="current-date">{getCurrentDate()}</div>
        </div>
      </header>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {error && <div className="error-message">{error}</div>}

          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Total Trips</h3>
              <div className="metric-value">{dashboardData.totalTrips}</div>
              <p>Last 24 hours</p>
            </div>

            <div className="metric-card">
              <h3>Safe Driving</h3>
              <div
                className={`metric-value ${
                  dashboardData.safeDrivingPercentage >= 90
                    ? "good"
                    : dashboardData.safeDrivingPercentage >= 70
                    ? "average"
                    : "poor"
                }`}
              >
                {dashboardData.safeDrivingPercentage}%
              </div>
              <p>Trips without incidents</p>
            </div>

            <div className="metric-card">
              <h3>Average Driver Score</h3>
              <div className="metric-value">{dashboardData.averageScore}</div>
              <p>Out of 100</p>
            </div>
          </div>

          <div className="alerts-section">
            <div className="section-header">
              <h2>Safety Alerts</h2>
              <Link to="/alerts" className="view-all">
                View All
              </Link>
            </div>

            <div className="alerts-container">
              {dashboardData.alerts && dashboardData.alerts.length > 0 ? (
                dashboardData.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="alert-card"
                    style={{
                      borderLeft: `4px solid ${getSeverityColor(
                        alert.severity
                      )}`,
                    }}
                  >
                    <div className="alert-content">
                      <div className="alert-message">{alert.message}</div>
                      <div className="alert-meta">
                        <span className="alert-time">{alert.timestamp}</span>
                        <span
                          className="alert-severity"
                          style={{
                            backgroundColor: getSeverityColor(alert.severity),
                          }}
                        >
                          {alert.severity}
                        </span>
                      </div>
                    </div>
                    <div className="alert-actions">
                      <button className="btn-view">View</button>
                      <button className="btn-dismiss">Dismiss</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-alerts">
                  <p>No safety alerts at this time.</p>
                </div>
              )}
            </div>
          </div>

          <div className="recent-activity">
            <div className="section-header">
              <h2>Recent Activity</h2>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon safe"></div>
                <div className="activity-content">
                  <p>Driver UG9012C completed trip without incidents</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon warning"></div>
                <div className="activity-content">
                  <p>Driver UG5678B had 1 alert during last trip</p>
                  <span className="activity-time">3 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon danger"></div>
                <div className="activity-content">
                  <p>Driver UG1234A had multiple alerts during trip</p>
                  <span className="activity-time">5 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
