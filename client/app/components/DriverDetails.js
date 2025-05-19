/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthContext";
import {
  UserCircle,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Car,
  Phone,
  Calendar,
  BarChart2,
  Edit,
  Trash2,
  ArrowLeft,
  Shield,
  Activity,
  MapPin,
} from "lucide-react";
import {
  getDrivers,
  updateDriver,
  deleteDriver,
  normalizeIncidentType,
} from "../utils/api";

const DriverDetails = ({ driverId }) => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phoneNumber: "",
    vehicleId: null,
  });

  // Data cache for driver details
  const dataCache = {
    driverLoaded: false,
  };

  // Calculate safety score based on incidents
  const calculateSafetyScore = (incidents, incidentType) => {
    if (!incidents || incidents === 0) return 100;

    // Define severity weights for the four standard incident types
    const incidentWeights = {
      PHONE_USAGE: 5, // Most severe
      CIGARETTE: 4, // High severity
      DROWSINESS: 4, // High severity
      SEATBELT: 3, // Medium severity
      OTHER: 1,
    };

    const normalizedType = normalizeIncidentType(incidentType);
    const weight = incidentWeights[normalizedType] || incidentWeights.OTHER;
    const baseReduction = incidents * weight;
    const diminishingFactor = Math.log10(incidents + 1);
    const totalReduction = baseReduction * diminishingFactor;
    return Math.max(0, Math.round(100 - totalReduction));
  };

  // Get incident severity level
  const getIncidentSeverity = (incidentType) => {
    const normalizedType = normalizeIncidentType(incidentType);

    switch (normalizedType) {
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

  // Get user-friendly incident message
  const getIncidentMessage = (incidentType) => {
    const normalizedType = normalizeIncidentType(incidentType);

    switch (normalizedType) {
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

  // Fetch driver details - use the getDrivers() API instead of individual fetch
  useEffect(() => {
    const fetchDriverData = async () => {
      if (loading || !driverId || dataCache.driverLoaded) return;
      setLoading(true);
      setError(null);

      try {
        const driverData = await getDrivers();

        if (driverData && driverData.drivers && driverData.drivers.length > 0) {
          const foundDriver = driverData.drivers.find(
            (d) => d.driver_id === driverId || d.id === driverId
          );

          if (foundDriver) {
            // Process incidents into activity items
            let activities = [];

            // If incidents_list is provided, use it directly
            if (
              foundDriver.incidents_list &&
              foundDriver.incidents_list.length > 0
            ) {
              activities = foundDriver.incidents_list
                .filter((incident) => {
                  // Only include the four standard incident types
                  const normalizedType = normalizeIncidentType(
                    incident.incident_type
                  );
                  return [
                    "PHONE_USAGE",
                    "DROWSINESS",
                    "CIGARETTE",
                    "SEATBELT",
                  ].includes(normalizedType);
                })
                .map((incident) => ({
                  id: incident.id,
                  message: getIncidentMessage(incident.incident_type),
                  severity: getIncidentSeverity(incident.incident_type),
                  timestamp: new Date(
                    incident.incident_date || incident.created_at
                  ).toLocaleString(),
                  type: normalizeIncidentType(
                    incident.incident_type
                  ).toLowerCase(),
                }))
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            }
            // If recent_activity is provided, use that instead
            else if (
              foundDriver.recent_activity &&
              foundDriver.recent_activity.length > 0
            ) {
              activities = foundDriver.recent_activity
                .filter((activity) => {
                  // Only include the four standard incident types
                  const normalizedType = normalizeIncidentType(
                    activity.incident_type
                  );
                  return [
                    "PHONE_USAGE",
                    "DROWSINESS",
                    "CIGARETTE",
                    "SEATBELT",
                  ].includes(normalizedType);
                })
                .map((activity) => ({
                  id: activity.id,
                  message: getIncidentMessage(activity.incident_type),
                  severity: getIncidentSeverity(activity.incident_type),
                  timestamp: new Date(
                    activity.incident_date || activity.created_at
                  ).toLocaleString(),
                  type: normalizeIncidentType(
                    activity.incident_type
                  ).toLowerCase(),
                }))
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            }

            const driverObj = {
              id: foundDriver.id,
              driverId: foundDriver.driver_id,
              name: foundDriver.name || "Unknown Driver",
              phoneNumber: foundDriver.phone || foundDriver.phone_number || "",
              vehicle: foundDriver.vehicle || "None",
              vehicleId: foundDriver.vehicle_id || null,
              totalTrips: foundDriver.total_trips || 0,
              incidents: foundDriver.incidents || 0,
              incidentType: normalizeIncidentType(
                foundDriver.incident_type || "OTHER"
              ),
              recentActivity: activities,
              createdAt: foundDriver.created_at || new Date().toISOString(),
              lastLogin: foundDriver.last_login,
              score: calculateSafetyScore(
                foundDriver.incidents,
                foundDriver.incident_type
              ),
            };

            setDriver(driverObj);
            setEditForm({
              name: driverObj.name || "",
              phoneNumber: driverObj.phoneNumber || "",
              vehicleId: driverObj.vehicleId || null,
            });
            dataCache.driverLoaded = true;
          } else {
            throw new Error(`Driver with ID ${driverId} not found`);
          }
        } else {
          throw new Error("No drivers found");
        }
      } catch (err) {
        console.error("Error fetching driver details:", err);
        setError(err.message || "Failed to load driver details");
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [driverId]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const updatedDriver = await updateDriver(driverId, {
        name: editForm.name,
        phone: editForm.phoneNumber, // Changed from phoneNumber to phone to match backend
        vehicleId: editForm.vehicleId === "None" ? null : editForm.vehicleId,
      });

      if (updatedDriver && updatedDriver.driver) {
        // Update the local state with the new data
        setDriver({
          ...driver,
          name: updatedDriver.driver.name,
          phoneNumber: updatedDriver.driver.phone || "", // Changed from phone_number to phone
          vehicle: updatedDriver.driver.vehicle,
          vehicleId: updatedDriver.driver.vehicle_id,
        });
        setShowEditModal(false);
      }
    } catch (err) {
      console.error("Error updating driver:", err);
      setError(err.message || "Failed to update driver");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteDriver(driverId);
      router.push("/profile");
    } catch (err) {
      console.error("Error deleting driver:", err);
      setError(err.message || "Failed to delete driver");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    return score >= 90
      ? "text-green-600"
      : score >= 70
      ? "text-amber-600"
      : "text-red-600";
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-1-4 border-red-500";
      case "medium":
        return "bg-amber-100 text-amber-800 border-1-4 border-amber-500";
      case "low":
        return "bg-green-100 text-green-800 border-1-4 border-green-500";
      default:
        return "bg-blue-100 text-blue-800 border-1-4 border-blue-500";
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border-1-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-1-4 border-yellow-500 p-4 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
            <p className="text-yellow-700 dark:text-yellow-400">
              Driver not found
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4 md:mb-0">
            <button
              onClick={handleBack}
              className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Driver Details
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Comprehensive driver information and performance metrics
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Driver
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Driver
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Driver Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
                  <UserCircle className="w-16 h-16 text-primary-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {driver.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  ID: {driver.driverId}
                </p>
                <div className="w-full space-y-4">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {driver.phoneNumber || "No phone number"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Car className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {driver.vehicle || "No vehicle assigned"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Joined: {new Date(driver.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {/* <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Last Login:{" "}
                      {driver.lastLogin
                        ? new Date(driver.lastLogin).toLocaleString()
                        : "Never"}
                    </span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Safety Score
                  </h3>
                  <Shield className="w-8 h-8 text-primary-500" />
                </div>
                <div
                  className={`text-4xl font-bold ${getScoreColor(
                    driver.score
                  )} mb-2`}
                >
                  {driver.score || "N/A"}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Overall performance
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Total Trips
                  </h3>
                  <MapPin className="w-8 h-8 text-primary-500" />
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {driver.totalTrips || 0}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Completed journeys
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Incidents
                  </h3>
                  <AlertTriangle className="w-8 h-8 text-primary-500" />
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {driver.incidents || 0}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Safety violations
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Recent Activity
            </h3>
            <Activity className="w-6 h-6 text-primary-500" />
          </div>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {driver.recentActivity && driver.recentActivity.length > 0 ? (
              driver.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className={`rounded-lg p-4 ${getSeverityStyle(
                    activity.severity
                  )}`}
                >
                  <div className="flex items-start">
                    <div
                      className={`p-2 rounded-lg ${
                        activity.severity === "high"
                          ? "bg-red-200"
                          : activity.severity === "medium"
                          ? "bg-amber-200"
                          : "bg-green-200"
                      } mr-4`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{activity.message}</h4>
                        <div className="flex items-center space-x-1 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{activity.timestamp}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center">
                        <div className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50 flex items-center">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              activity.severity === "high"
                                ? "bg-red-500"
                                : activity.severity === "medium"
                                ? "bg-amber-500"
                                : "bg-green-500"
                            } mr-1`}
                          ></span>
                          {activity.severity.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                No incidents recorded
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Driver
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XCircle size={20} />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Driver Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editForm.phoneNumber}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phoneNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vehicle Assigned
                  </label>
                  <select
                    value={editForm.vehicleId || "None"}
                    onChange={(e) =>
                      setEditForm({ ...editForm, vehicleId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="None">None</option>
                    {/* Note: Vehicle options would typically be fetched and mapped here */}
                  </select>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                    disabled={loading}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Delete Driver
                </h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XCircle size={20} />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this driver? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  disabled={loading}
                >
                  Delete Driver
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DriverDetails;
