/* eslint-disable react-hooks/exhaustive-deps */
// src/components/Analytics.js

"use client";
import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import Header from "./Header";
import { Bell, AlertTriangle, Car, Clock, Eye, XCircle } from "lucide-react";
import { getVehicles, getDrivers, normalizeIncidentType } from "../utils/api";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [dateRange, setDateRange] = useState("7days");
  const [selectedVehicle, setSelectedVehicle] = useState("all");
  const [analyticsData, setAnalyticsData] = useState({
    vehicles: [],
    trends: [],
    breakdown: {
      drowsiness: 0,
      cigarette: 0,
      seatbelt: 0,
      phoneUsage: 0,
    },
    timeline: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Map date range to days for filtering
  const getDaysFromRange = (range) => {
    switch (range) {
      case "7days":
        return 7;
      case "30days":
        return 30;
      case "90days":
        return 90;
      default:
        return 7; // Default to 7 days for custom or invalid range
    }
  };

  // Fetch data based on date range and selected vehicle
  useEffect(() => {
    // Analytics data state cache
    const dataCache = {
      lastFetch: 0,
      lastDateRange: null,
      lastSelectedVehicle: null,
    };

    const fetchData = async () => {
      // Skip if already loading
      if (loading) return;

      // Cache for 30 seconds unless filters change
      const now = Date.now();
      const cacheExpired = now - dataCache.lastFetch > 30000;
      const filtersChanged =
        dataCache.lastDateRange !== dateRange ||
        dataCache.lastSelectedVehicle !== selectedVehicle;

      // Skip if cache is valid and filters haven't changed
      if (
        !cacheExpired &&
        !filtersChanged &&
        analyticsData.vehicles?.length > 0
      ) {
        return;
      }

      // Update cache markers
      dataCache.lastFetch = now;
      dataCache.lastDateRange = dateRange;
      dataCache.lastSelectedVehicle = selectedVehicle;

      setLoading(true);
      setError(null);

      try {
        // Stagger requests to avoid rate limiting
        const vehiclesData = await getVehicles();
        // Small delay between requests
        await new Promise((resolve) => setTimeout(resolve, 200));
        const driversData = await getDrivers();

        // Process vehicles and drivers
        const vehicles = vehiclesData.vehicles.map((vehicle, index) => {
          const driver =
            driversData.drivers.find(
              (d) => d.vehicle === vehicle.vehicle_number
            ) || {};
          return {
            id: vehicle.vehicle_id || index + 1,
            vehicleNumber: vehicle.vehicle_number,
            driverName: driver.name || "Unknown",
            driverId: driver.driver_id || null,
            status: vehicle.status || "Active",
            incidents: driver.incidents || 0,
          };
        });

        // Filter vehicles based on selectedVehicle
        const filteredVehicles =
          selectedVehicle === "all"
            ? vehicles
            : vehicles.filter((v) => v.vehicleNumber === selectedVehicle);

        // Calculate trends (incidents per vehicle)
        const trends = filteredVehicles.map((vehicle) => ({
          vehicleId: vehicle.vehicleNumber,
          incidents: vehicle.incidents,
        }));

        // Calculate breakdown of incident types using standard categories
        const breakdown = {
          drowsiness: 0,
          cigarette: 0,
          seatbelt: 0,
          phoneUsage: 0,
        };

        // Analyze driver incidents and categorize them properly
        filteredVehicles.forEach((vehicle) => {
          const driver = driversData.drivers.find(
            (d) => d.vehicle === vehicle.vehicleNumber
          );

          if (driver && driver.incidents > 0) {
            if (driver.incidents_list && driver.incidents_list.length > 0) {
              // If we have detailed incident list, categorize each incident
              driver.incidents_list.forEach((incident) => {
                const normalizedType = normalizeIncidentType(
                  incident.incident_type
                );
                switch (normalizedType) {
                  case "DROWSINESS":
                    breakdown.drowsiness++;
                    break;
                  case "CIGARETTE":
                    breakdown.cigarette++;
                    break;
                  case "SEATBELT":
                    breakdown.seatbelt++;
                    break;
                  case "PHONE_USAGE":
                    breakdown.phoneUsage++;
                    break;
                  // Ignore other types
                }
              });
            } else {
              // If we don't have detailed incidents, estimate distribution
              // This is just a fallback if incident details aren't available
              breakdown.drowsiness += Math.round(driver.incidents * 0.25);
              breakdown.cigarette += Math.round(driver.incidents * 0.25);
              breakdown.seatbelt += Math.round(driver.incidents * 0.25);
              breakdown.phoneUsage += Math.round(driver.incidents * 0.25);
            }
          }
        });

        // Simulate timeline with specific incident types
        const timeline = filteredVehicles
          .filter((vehicle) => vehicle.incidents > 0)
          .map((vehicle, index) => {
            // Use standardized incident types
            const standardIncidentTypes = [
              { type: "DROWSINESS", message: "Drowsiness detected" },
              { type: "CIGARETTE", message: "Cigarette usage detected" },
              { type: "SEATBELT", message: "Seatbelt violation detected" },
              { type: "PHONE_USAGE", message: "Phone usage detected" },
            ];

            // Get incident data for this vehicle
            const driver = driversData.drivers.find(
              (d) => d.vehicle === vehicle.vehicleNumber
            );
            let incidentType, message;

            if (driver && driver.incident_type) {
              // Use the driver's most common incident type if available
              const normalizedType = normalizeIncidentType(
                driver.incident_type
              );
              const matchedIncident = standardIncidentTypes.find(
                (i) => i.type === normalizedType
              );
              incidentType = matchedIncident
                ? matchedIncident.type.toLowerCase()
                : "drowsiness";
              message = matchedIncident
                ? matchedIncident.message
                : "Safety violation detected";
            } else {
              // Otherwise use rotational assignment
              const incidentData =
                standardIncidentTypes[index % standardIncidentTypes.length];
              incidentType = incidentData.type.toLowerCase();
              message = incidentData.message;
            }

            // Determine severity based on incident type
            const getSeverity = (type) => {
              switch (type.toUpperCase()) {
                case "PHONE_USAGE":
                  return "high";
                case "DROWSINESS":
                  return "high";
                case "CIGARETTE":
                  return "medium";
                case "SEATBELT":
                  return "medium";
                default:
                  return "low";
              }
            };

            const severity = getSeverity(incidentType);

            return {
              id: index + 1,
              message: `Vehicle ${vehicle.vehicleNumber}: ${message}`,
              timestamp: `Today, ${14 - index}: ${30 - index * 5}`,
              severity,
              type: incidentType,
            };
          })
          .slice(0, 3);

        setAnalyticsData({ vehicles, trends, breakdown, timeline });
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError(err.message || "Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    // Only refetch when dateRange or selectedVehicle changes
    // or if analyticsData is empty
    if (
      !analyticsData?.vehicles?.length ||
      dateRange !== dataCache.lastDateRange ||
      selectedVehicle !== dataCache.lastSelectedVehicle
    ) {
      fetchData();
    }
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
      "Cigarette Usage",
      "Seatbelt Violation",
      "Phone Usage",
    ],
    datasets: [
      {
        data: [
          analyticsData.breakdown.drowsiness,
          analyticsData.breakdown.cigarette,
          analyticsData.breakdown.seatbelt,
          analyticsData.breakdown.phoneUsage,
        ],
        backgroundColor: [
          "rgba(255, 152, 0, 0.85)", // Orange for drowsiness
          "rgba(244, 67, 54, 0.85)", // Red for cigarette
          "rgba(33, 150, 243, 0.85)", // Blue for seatbelt
          "rgba(156, 39, 176, 0.85)", // Purple for phone
        ],
        borderColor: [
          "rgba(255, 152, 0, 1)",
          "rgba(244, 67, 54, 1)",
          "rgba(33, 150, 243, 1)",
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
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#9ca3af" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      x: {
        ticks: { color: "#9ca3af" },
        grid: { display: false },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: { color: "#ffffff", padding: 15 },
      },
      title: {
        display: true,
        text: "Behavior Breakdown",
        font: { size: 16 },
        color: "#ffffff",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
      },
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

  // Find vehicles with highest and lowest incidents
  const highestIncidentVehicle = analyticsData.vehicles.reduce(
    (max, vehicle) => (vehicle.incidents > max.incidents ? vehicle : max),
    { incidents: -1, vehicleNumber: "N/A" }
  );
  const lowestIncidentVehicle = analyticsData.vehicles.reduce(
    (min, vehicle) => (vehicle.incidents < min.incidents ? vehicle : min),
    { incidents: Infinity, vehicleNumber: "N/A" }
  );

  // Find most common behavior
  const mostCommonBehavior = Object.entries(analyticsData.breakdown).reduce(
    (max, [key, value]) => (value > max.value ? { key, value } : max),
    { key: "N/A", value: -1 }
  );
  const totalIncidents = Object.values(analyticsData.breakdown).reduce(
    (sum, val) => sum + val,
    0
  );
  const mostCommonPercentage =
    totalIncidents > 0
      ? Math.round((mostCommonBehavior.value / totalIncidents) * 100)
      : 0;
  const behaviorLabels = {
    drowsiness: "Drowsiness",
    cigarette: "Cigarette Usage",
    seatbelt: "Seatbelt Violation",
    phoneUsage: "Phone Usage",
  };

  const handleViewDriverDetails = (driverId) => {
    router.push(`/driver-details?driverId=${driverId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Safety Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor driver behavior and safety violations in real-time
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
            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading analytics data...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Most Common Violation
                </h3>
                <p className="text-xl font-bold text-red-600 dark:text-red-400 mb-1">
                  {behaviorLabels[mostCommonBehavior.key] || "N/A"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {mostCommonPercentage}% of all violations
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Total Violations
                </h3>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                  {totalIncidents}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  In selected period
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Safest Vehicle
                </h3>
                <p className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {lowestIncidentVehicle.vehicleNumber}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {lowestIncidentVehicle.incidents} violations
                </p>
              </div>
            </div>

            {/* Bar and Pie Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
                          ID
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
                            {vehicle.driverId && (
                              <button
                                onClick={() =>
                                  handleViewDriverDetails(vehicle.driverId)
                                }
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors duration-200 ease-in-out shadow-sm hover:shadow-md"
                              >
                                <Eye className="w-4 h-4 mr-1.5" />
                                Driver Details
                              </button>
                            )}
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
                  {analyticsData.timeline.length > 0 ? (
                    analyticsData.timeline.map((incident) => (
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
                            Driver Details
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      No incidents in the selected period
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-6 shadow-sm text-white mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Safety Recommendations
              </h2>
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 bg-opacity-10 rounded-lg p-4 backdrop-blur-sm text-white">
                  <h3 className="font-medium mb-2 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    {mostCommonBehavior.key === "drowsiness"
                      ? "Implement Rest Break Policy"
                      : mostCommonBehavior.key === "cigarette"
                      ? "Enforce No Smoking Policy"
                      : mostCommonBehavior.key === "seatbelt"
                      ? "Strengthen Seatbelt Enforcement"
                      : "Address Phone Usage"}
                  </h3>
                  <p className="text-sm text-white/90">
                    {mostCommonBehavior.key === "drowsiness"
                      ? "Multiple drowsiness incidents detected. Consider implementing mandatory rest breaks for drivers on shifts longer than 4 hours."
                      : mostCommonBehavior.key === "cigarette"
                      ? "Cigarette usage violations detected. Implement strict no-smoking policy and provide smoking cessation support."
                      : mostCommonBehavior.key === "seatbelt"
                      ? "Seatbelt violations detected. Conduct regular safety checks and implement automatic seatbelt reminder system."
                      : "Phone usage violations detected. Install phone blocking technology and conduct distraction-free driving training."}
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
