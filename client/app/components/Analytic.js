// src/components/Analytics.js

"use client";
import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import Header from "./Header";
import { Bell, AlertTriangle, Car, Clock, Eye, XCircle } from "lucide-react";

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

const Analytics = () => {
  const [dateRange, setDateRange] = useState("7days");
  const [selectedVehicle, setSelectedVehicle] = useState("all");
  const [analyticsData] = useState({
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
    breakdown: { drowsiness: 25, phoneUsage: 45, eating: 15, talking: 15 },
    timeline: [
      {
        id: 1,
        message: "Driver UG1234A: Phone usage detected",
        timestamp: "Today, 14:32",
        severity: "high",
      },
      {
        id: 2,
        message: "Driver UG5678B: Drowsiness detected",
        timestamp: "Today, 13:45",
        severity: "medium",
      },
      {
        id: 3,
        message: "Driver UG1234A: Talking to passenger",
        timestamp: "Today, 12:10",
        severity: "low",
      },
    ],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  }, [dateRange, selectedVehicle]);

  // Bar Chart Data
  const barChartData = {
    labels: analyticsData.trends.map((item) => item.vehicleId),
    datasets: [
      {
        label: "Incidents",
        data: analyticsData.trends.map((item) => item.incidents),
        backgroundColor: "rgba(59, 130, 246, 0.8)", // Blue
        borderColor: "rgb(37, 99, 235)",
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: "rgba(59, 130, 246, 1)",
      },
    ],
  };

  // Pie Chart Data
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
          "rgba(33, 150, 243, 0.85)", // Blue
          "rgba(244, 67, 54, 0.85)", // Red
          "rgba(255, 152, 0, 0.85)", // Orange
          "rgba(156, 39, 176, 0.85)", // Purple
        ],
        borderColor: [
          "rgba(33, 150, 243, 1)",
          "rgba(244, 67, 54, 1)",
          "rgba(255, 152, 0, 1)",
          "rgba(156, 39, 176, 1)",
        ],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  // Chart Options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Incidents by Vehicle",
        font: { size: 16 },
        color: "#ffffff",
      },
      tooltip: { backgroundColor: "rgba(0, 0, 0, 0.8)", padding: 12 },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#9ca3af" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      x: { ticks: { color: "#9ca3af" }, grid: { display: false } },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right", labels: { color: "#ffffff", padding: 15 } },
      title: {
        display: true,
        text: "Behavior Breakdown",
        font: { size: 16 },
        color: "#ffffff",
      },
      tooltip: { backgroundColor: "rgba(0, 0, 0, 0.8)", padding: 12 },
    },
  };

  const getSeverityStyle = (severity) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-l-4 border-red-500";
      case "medium":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-l-4 border-amber-500";
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-l-4 border-green-500";
      default:
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-l-4 border-blue-500";
    }
  };

  const getSeverityDot = (severity) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-amber-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              In-depth insights into driver behavior and fleet safety
            </p>
          </div>
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="block w-40 pl-3 pr-8 py-2 text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vehicle
              </label>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="block w-40 pl-3 pr-8 py-2 text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
              >
                <option value="all">All Vehicles</option>
                {analyticsData.vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.vehicleNumber}>
                    {vehicle.vehicleNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-primary-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading analytics data...
            </p>
          </div>
        ) : (
          <>
            {/* Key Metrics and Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Key Insights */}
              <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Key Insights
                </h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Most Incidents
                    </h3>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400 mb-1">
                      UG3456D
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      3 incidents in selected period
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Most Common Behavior
                    </h3>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400 mb-1">
                      Phone Usage
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      45% of all incidents
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Safest Vehicle
                    </h3>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">
                      UG9012C
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      0 incidents in selected period
                    </p>
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-80">
                <Bar data={barChartData} options={barChartOptions} />
              </div>

              {/* Pie Chart */}
              <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-80">
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            </div>

            {/* Fleet Performance and Incident Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Fleet Performance */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center">
                  <Car className="w-5 h-5 text-primary-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Fleet Performance Metrics
                  </h2>
                </div>
                <div className="overflow-x-auto p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Vehicle
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Driver
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Incidents
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {analyticsData.vehicles.map((vehicle) => (
                        <tr
                          key={vehicle.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-200">
                            {vehicle.id}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                            {vehicle.vehicleNumber}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {vehicle.driverName}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                vehicle.status === "Active"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                              }`}
                            >
                              {vehicle.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                vehicle.incidents === 0
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                  : vehicle.incidents < 2
                                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                              }`}
                            >
                              {vehicle.incidents}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Incident Timeline */}
              <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center">
                  <Bell className="w-5 h-5 text-primary-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Incident Timeline
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {analyticsData.timeline.map((incident) => (
                    <div
                      key={incident.id}
                      className={`rounded-lg p-4 ${getSeverityStyle(
                        incident.severity
                      )}`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`p-2 rounded-lg ${
                            incident.severity === "high"
                              ? "bg-red-200 dark:bg-red-800/50"
                              : incident.severity === "medium"
                              ? "bg-amber-200 dark:bg-amber-800/50"
                              : "bg-green-200 dark:bg-green-800/50"
                          } mr-4`}
                        >
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-gray-200">
                              {incident.message}
                            </h4>
                            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{incident.timestamp}</span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center">
                            <div className="text-xs font-medium px-2 py-1 rounded-full bg-white dark:bg-gray-700 flex items-center">
                              <span
                                className={`w-2 h-2 rounded-full ${getSeverityDot(
                                  incident.severity
                                )} mr-1`}
                              ></span>
                              {incident.severity.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-3 space-x-2">
                        <button className="flex items-center px-3 py-1 text-xs font-medium rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600">
                          <XCircle className="w-3 h-3 mr-1" />
                          Dismiss
                        </button>
                        <button className="flex items-center px-3 py-1 text-xs font-medium rounded-md bg-primary-500 text-white hover:bg-primary-600">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Safety Recommendations
              </h2>
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 bg-opacity-10 rounded-lg p-4 backdrop-blur-sm text-white">
                  <h3 className="font-medium mb-2 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Schedule Driver Training for UG1234A
                  </h3>
                  <p className="text-sm text-white/90">
                    Driver has shown consistent phone usage while driving.
                    Recommend scheduling remedial training on distracted driving
                    risks.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 bg-opacity-10 rounded-lg p-4 backdrop-blur-sm text-white">
                  <h3 className="font-medium mb-2 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Implement Rest Break Policy
                  </h3>
                  <p className="text-sm text-white/90">
                    Multiple drowsiness incidents detected across the fleet.
                    Consider implementing mandatory rest breaks for drivers on
                    shifts longer than 4 hours.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Analytics;
