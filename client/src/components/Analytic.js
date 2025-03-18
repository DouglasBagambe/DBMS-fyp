// src/components/Analytic.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "../styles/Analytic.css";
import Header from "../components/Header";

// Import Chart.js modules
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytic = () => {
  const [dateRange, setDateRange] = useState("7days");
  const [selectedVehicle, setSelectedVehicle] = useState("all");
  const [analyticsData, setAnalyticsData] = useState({
    vehicles: [
      {
        id: 1,
        vehicleNumber: "UG1234A",
        driverName: "John Doe",
        status: "Active",
        incidents: 2,
      },
      {
        id: 2,
        vehicleNumber: "UG5678B",
        driverName: "Jane Smith",
        status: "Inactive",
        incidents: 1,
      },
      {
        id: 3,
        vehicleNumber: "UG9012C",
        driverName: "Michael Brown",
        status: "Active",
        incidents: 0,
      },
      {
        id: 4,
        vehicleNumber: "UG3456D",
        driverName: "Sarah Johnson",
        status: "Active",
        incidents: 3,
      },
      {
        id: 5,
        vehicleNumber: "UG7890E",
        driverName: "David Wilson",
        status: "Active",
        incidents: 1,
      },
    ],
    trends: [
      { vehicleId: "UG1234A", incidents: 2 },
      { vehicleId: "UG5678B", incidents: 1 },
      { vehicleId: "UG9012C", incidents: 0 },
      { vehicleId: "UG3456D", incidents: 3 },
      { vehicleId: "UG7890E", incidents: 1 },
    ],
    breakdown: {
      drowsiness: 25,
      phoneUsage: 45,
      eating: 15,
      talking: 15,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(
          `/api/analytics?dateRange=${dateRange}&vehicleId=${selectedVehicle}`
        );
        setAnalyticsData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to load analytics data. Using sample data instead.");
        // Keep using the sample data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [dateRange, selectedVehicle]);

  // Prepare data for bar chart
  const barChartData = {
    labels: analyticsData.trends.map((item) => item.vehicleId),
    datasets: [
      {
        label: "Incidents",
        data: analyticsData.trends.map((item) => item.incidents),
        backgroundColor: "#2e7d32",
        borderColor: "#1b5e20",
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for pie chart
  const pieChartData = {
    labels: [
      "Drowsiness",
      "Phone Usage",
      "Eating/Drinking",
      "Talking to Passengers",
    ],
    datasets: [
      {
        data: [
          analyticsData.breakdown.drowsiness,
          analyticsData.breakdown.phoneUsage,
          analyticsData.breakdown.eating,
          analyticsData.breakdown.talking,
        ],
        backgroundColor: [
          "#2196f3", // Blue
          "#f44336", // Red
          "#ff9800", // Orange
          "#9c27b0", // Purple
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Incidents by Vehicle",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Incidents",
        },
        ticks: {
          precision: 0,
        },
      },
      x: {
        title: {
          display: true,
          text: "Vehicle ID",
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Behavior Breakdown",
        font: {
          size: 16,
        },
      },
    },
  };

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };

  const handleVehicleChange = (e) => {
    setSelectedVehicle(e.target.value);
  };

  return (
    <div className="analytics-container">
      <Header />
      <header className="analytics-header">
        <div className="analytics-title">
          <h1>Analytics Dashboard</h1>
          <p>In-depth insights into driver behavior and fleet safety</p>
        </div>
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="dateRange">Date Range:</label>
            <select
              id="dateRange"
              value={dateRange}
              onChange={handleDateRangeChange}
              className="filter-select"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="vehicleSelect">Vehicle:</label>
            <select
              id="vehicleSelect"
              value={selectedVehicle}
              onChange={handleVehicleChange}
              className="filter-select"
            >
              <option value="all">All Vehicles</option>
              {analyticsData.vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.vehicleNumber}>
                  {vehicle.vehicleNumber}
                </option>
              ))}
            </select>
          </div>
          <button className="btn-apply-filters">Apply Filters</button>
        </div>
      </header>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      ) : (
        <>
          {error && <div className="error-message">{error}</div>}

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Vehicle Number</th>
                  <th>Driver Name</th>
                  <th>Status</th>
                  <th>Incidents</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.vehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>{vehicle.id}</td>
                    <td>{vehicle.vehicleNumber}</td>
                    <td>{vehicle.driverName}</td>
                    <td>
                      <span
                        className={`status-badge ${vehicle.status.toLowerCase()}`}
                      >
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="incidents-cell">
                      <span
                        className={`incidents-value ${
                          vehicle.incidents === 0
                            ? "good"
                            : vehicle.incidents < 2
                            ? "average"
                            : "poor"
                        }`}
                      >
                        {vehicle.incidents}
                      </span>
                    </td>
                    <td>
                      <button className="btn-view-details">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="charts-container">
            <div className="chart-card">
              <div className="chart-wrapper">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </div>
            <div className="chart-card">
              <div className="chart-wrapper">
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            </div>
          </div>

          <div className="analytics-summary">
            <h2>Key Insights</h2>
            <div className="insights-grid">
              <div className="insight-card">
                <h3>Most Incidents</h3>
                <p className="insight-value">UG3456D</p>
                <p className="insight-description">
                  3 incidents in selected period
                </p>
              </div>
              <div className="insight-card">
                <h3>Most Common Behavior</h3>
                <p className="insight-value">Phone Usage</p>
                <p className="insight-description">45% of all incidents</p>
              </div>
              <div className="insight-card">
                <h3>Safest Vehicle</h3>
                <p className="insight-value">UG9012C</p>
                <p className="insight-description">
                  0 incidents in selected period
                </p>
              </div>
              <div className="insight-card">
                <h3>Fleet Health</h3>
                <p className="insight-value good">Good</p>
                <p className="insight-description">
                  60% of vehicles with 1 or fewer incidents
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytic;
