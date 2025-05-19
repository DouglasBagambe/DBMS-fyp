/* eslint-disable react-hooks/exhaustive-deps */
// src/components/Dashboard.js

"use client";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  XCircle,
  Activity,
  ArrowRight,
  Car,
  UserCircle,
  Phone,
  Moon,
} from "lucide-react";
import {
  getDashboardMetrics,
  getDrivers,
  getVehicles,
  normalizeIncidentType,
} from "../utils/api";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState({
    totalTrips: 0,
    safeDrivingPercentage: 0,
    averageScore: 0,
    alerts: [],
  });
  const [metrics, setMetrics] = useState({
    activeDrivers: 0,
    totalVehicles: 0,
    recentIncidents: 0,
  });
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch dashboard metrics, alerts, and activity
  useEffect(() => {
    const fetchData = async () => {
      // Skip fetching if already loading
      if (loading) return;

      setLoading(true);
      setError(null);
      try {
        // Fetch metrics
        const metricsData = await getDashboardMetrics();
        const drivers = await getDrivers();
        const vehicles = await getVehicles();

        // Calculate total trips (sum of last_trip counts from vehicles)
        const totalTrips = vehicles.vehicles.reduce((sum, vehicle) => {
          return vehicle.last_trip ? sum + 1 : sum;
        }, 0);

        // Calculate average driver score
        const averageScore =
          drivers.drivers.length > 0
            ? Math.round(
                drivers.drivers.reduce(
                  (sum, driver) => sum + (driver.safety_score || 0),
                  0
                ) / drivers.drivers.length
              )
            : 0;

        // Calculate safe driving percentage (trips without incidents)
        const incidentCount = metricsData.incidentCount || 0;
        const safeDrivingPercentage =
          totalTrips > 0
            ? Math.round(((totalTrips - incidentCount) / totalTrips) * 100)
            : 0;

        // Update metrics state
        setMetrics({
          activeDrivers: metricsData.activeDrivers || 0,
          totalVehicles: metricsData.vehicles || 0,
          recentIncidents: metricsData.recentIncidents || 0,
        });

        // Simulate alerts based on driver incidents
        const alerts = drivers.drivers
          .filter((driver) => driver.incidents > 0)
          .map((driver, index) => {
            // Get standard incident types based on incident history
            const standardIncidentTypes = [
              "PHONE_USAGE",
              "DROWSINESS",
              "CIGARETTE",
              "SEATBELT",
            ];
            const incidentType = driver.incident_type
              ? normalizeIncidentType(driver.incident_type)
              : standardIncidentTypes[index % standardIncidentTypes.length];

            // Determine message and severity based on normalized incident type
            const getMessage = (type) => {
              switch (type) {
                case "PHONE_USAGE":
                  return "Phone usage detected";
                case "DROWSINESS":
                  return "Driver drowsiness detected";
                case "CIGARETTE":
                  return "Cigarette usage detected";
                case "SEATBELT":
                  return "Seatbelt violation detected";
                default:
                  return "Safety violation detected";
              }
            };

            const getSeverity = (type) => {
              switch (type) {
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

            return {
              id: index + 1,
              message: `Driver ${driver.driver_id}: ${getMessage(
                incidentType
              )}`,
              timestamp: new Date().toLocaleTimeString(),
              severity: getSeverity(incidentType),
              driverId: driver.driver_id,
              vehicleId: driver.vehicle || "N/A",
              type: incidentType.toLowerCase(),
            };
          })
          .slice(0, 3);

        // Simulate activity data based on vehicle trips and driver incidents
        const activity = [
          ...vehicles.vehicles
            .filter((vehicle) => vehicle.last_trip)
            .map((vehicle, index) => ({
              id: `trip-${index}`,
              type: "safe",
              message: `Vehicle ${vehicle.vehicle_number} completed trip safely`,
              timestamp: new Date(vehicle.last_trip).toLocaleTimeString(),
            })),
          ...drivers.drivers
            .filter((driver) => driver.incidents > 0)
            .map((driver, index) => {
              // Use standardized incident types
              const standardIncidentTypes = [
                "PHONE_USAGE",
                "DROWSINESS",
                "CIGARETTE",
                "SEATBELT",
              ];
              const incidentType = driver.incident_type
                ? normalizeIncidentType(driver.incident_type)
                : standardIncidentTypes[index % standardIncidentTypes.length];

              const getMessage = (type) => {
                switch (type) {
                  case "PHONE_USAGE":
                    return "Phone usage detected";
                  case "DROWSINESS":
                    return "Driver drowsiness detected";
                  case "CIGARETTE":
                    return "Cigarette usage detected";
                  case "SEATBELT":
                    return "Seatbelt violation detected";
                  default:
                    return "Safety violation detected";
                }
              };

              // Determine severity based on incident type
              const getSeverity = (type) => {
                switch (type) {
                  case "PHONE_USAGE":
                    return "danger";
                  case "DROWSINESS":
                    return "danger";
                  case "CIGARETTE":
                    return "warning";
                  case "SEATBELT":
                    return "warning";
                  default:
                    return "warning";
                }
              };

              return {
                id: `incident-${index}`,
                type: getSeverity(incidentType),
                message: `Driver ${driver.driver_id}: ${getMessage(
                  incidentType
                )}`,
                timestamp: new Date().toLocaleTimeString(),
              };
            }),
        ].slice(0, 3);

        setDashboardData({
          totalTrips,
          safeDrivingPercentage,
          averageScore,
          alerts,
        });
        setActivityData(activity);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Empty dependency array ensures it only runs once when component mounts
  }, []);

  const getAlertIcon = (type) => {
    switch (type) {
      case "phone_usage":
        return <Phone className="w-5 h-5" />;
      case "drowsiness":
        return <Moon className="w-5 h-5" />;
      case "cigarette":
        return <AlertTriangle className="w-5 h-5" />;
      case "seatbelt":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-l-4 border-red-500";
      case "medium":
        return "bg-amber-100 text-amber-800 border-l-4 border-amber-500";
      case "low":
        return "bg-green-100 text-green-800 border-l-4 border-green-500";
      default:
        return "bg-blue-100 text-blue-800 border-l-4 border-blue-500";
    }
  };

  const getSeverityDot = (severity) => {
    switch (severity) {
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

  const getActivityIcon = (type) => {
    switch (type) {
      case "safe":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "danger":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getCurrentDate = () => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date().toLocaleDateString(undefined, options);
  };

  const handleViewDriverDetails = (driverId) => {
    router.push(`/driver-details?driverId=${driverId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Driver Safety Monitoring
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Real-time monitoring for safer roads in Uganda
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 font-medium">
              <UserCircle className="w-5 h-5" />
              <span>
                {user
                  ? user.gender === "male"
                    ? `Mr. ${user.first_name} ${user.last_name}`
                    : user.gender === "female"
                    ? `Ms. ${user.first_name} ${user.last_name}`
                    : `${user.first_name} ${user.last_name}`
                  : "Fleet Manager"}
              </span>
            </div>
            <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>{getCurrentDate()}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading dashboard data...
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
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Total Trips
                  </h3>
                  <Car className="w-8 h-8 text-primary-500" />
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {dashboardData.totalTrips}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last 24 hours
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Safety Score
                  </h3>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div
                  className={`text-4xl font-bold mb-2 ${
                    dashboardData.safeDrivingPercentage >= 90
                      ? "text-green-600 dark:text-green-400"
                      : dashboardData.safeDrivingPercentage >= 70
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {dashboardData.safeDrivingPercentage}%
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Safe driving compliance
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                  <div
                    className={`h-2 rounded-full ${
                      dashboardData.safeDrivingPercentage >= 90
                        ? "bg-green-500"
                        : dashboardData.safeDrivingPercentage >= 70
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${dashboardData.safeDrivingPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Active Drivers
                  </h3>
                  <Activity className="w-8 h-8 text-primary-500" />
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {metrics.activeDrivers}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Currently on duty
                </p>
              </div>
            </div>

            {/* Two Column Layout for Alerts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Safety Alerts */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center">
                      <Bell className="w-5 h-5 text-primary-500 mr-2" />
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Safety Violations
                      </h2>
                    </div>
                    <Link
                      to="/alerts"
                      className="flex items-center text-primary-500 hover:text-primary-600 text-sm font-medium"
                    >
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                  <div className="p-6">
                    {dashboardData.alerts && dashboardData.alerts.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardData.alerts.map((alert) => (
                          <div
                            key={alert.id}
                            className={`rounded-lg p-4 transition-all ${getSeverityStyle(
                              alert.severity
                            )}`}
                          >
                            <div className="flex items-start">
                              <div
                                className={`p-2 rounded-lg ${
                                  alert.severity === "high"
                                    ? "bg-red-200"
                                    : alert.severity === "medium"
                                    ? "bg-amber-200"
                                    : "bg-green-200"
                                } mr-4`}
                              >
                                {getAlertIcon(alert.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">
                                    {alert.message}
                                  </h4>
                                  <div className="flex items-center space-x-1 text-sm">
                                    <Clock className="w-4 h-4" />
                                    <span>{alert.timestamp}</span>
                                  </div>
                                </div>
                                <div className="mt-2 flex items-center">
                                  <div className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50 flex items-center">
                                    <span
                                      className={`w-2 h-2 rounded-full ${getSeverityDot(
                                        alert.severity
                                      )} mr-1`}
                                    ></span>
                                    {alert.severity.charAt(0).toUpperCase() +
                                      alert.severity.slice(1)}
                                  </div>
                                  <div className="text-xs ml-2">
                                    Vehicle: {alert.vehicleId}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end mt-3 space-x-2">
                              <button className="flex items-center px-3 py-1 text-xs font-medium rounded-md bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition-colors">
                                <XCircle className="w-3 h-3 mr-1" />
                                Dismiss
                              </button>
                              <button
                                onClick={() =>
                                  handleViewDriverDetails(alert.driverId)
                                }
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors duration-200 ease-in-out shadow-sm hover:shadow-md"
                              >
                                <Eye className="w-4 h-4 mr-1.5" />
                                Driver Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                          No safety violations detected
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                          All drivers are following safety protocols
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                  <div className="relative">
                    <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="space-y-6">
                      {activityData.length > 0 ? (
                        activityData.map((activity) => (
                          <div
                            key={activity.id}
                            className="relative flex items-start"
                          >
                            <div
                              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                activity.type === "safe"
                                  ? "bg-green-100 dark:bg-green-900"
                                  : activity.type === "warning"
                                  ? "bg-amber-100 dark:bg-amber-900"
                                  : "bg-red-100 dark:bg-red-900"
                              } z-10`}
                            >
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="ml-4 bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm">
                              <p className="text-sm text-gray-800 dark:text-gray-200 font-medium mb-1">
                                {activity.message}
                              </p>
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>{activity.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          No recent activity
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
