/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
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
  Moon,
  Cigarette,
  AlertTriangle as BeltIcon,
} from "lucide-react";
import {
  getDrivers,
  updateDriver,
  deleteDriver,
  getIncidents,
  getDriverTrips,
} from "../utils/api";

const DriverDetails = ({ driverId: propDriverId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlDriverId = searchParams ? searchParams.get("driverId") : null;
  const driverId = propDriverId || urlDriverId;
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

  // Track fetch attempts to prevent infinite loops
  const [fetchAttempts, setFetchAttempts] = useState(0);

  // Map incident numbers to their respective types and messages
  const incidentTypeMap = {
    1: {
      type: "PHONE_USAGE",
      message: "Phone usage detected",
      severity: "high",
      weight: 5, // Most severe - direct distraction
      icon: <Phone className="w-5 h-5" />,
    },
    2: {
      type: "CIGARETTE",
      message: "Cigarette usage detected",
      severity: "medium",
      weight: 4, // Very severe - distraction and health risk
      icon: <Cigarette className="w-5 h-5" />,
    },
    3: {
      type: "SEATBELT",
      message: "Seatbelt violation detected",
      severity: "medium",
      weight: 3, // Moderate - safety equipment
      icon: <BeltIcon className="w-5 h-5" />,
    },
    4: {
      type: "DROWSINESS",
      message: "Driver drowsiness detected",
      severity: "high",
      weight: 4, // Severe - affects alertness
      icon: <Moon className="w-5 h-5" />,
    },
  };

  // Helper function to get incident type info based on incident_no
  const getIncidentTypeInfo = (incidentNo) => {
    return incidentTypeMap[incidentNo] || null;
  };

  // Convert between incident_type strings and incident_no numbers
  const normalizeIncidentType = (value) => {
    // If it's already a number between 1-4, return it
    if (typeof value === "number" && value >= 1 && value <= 4) {
      return value;
    }

    // If it's a string that can be parsed directly to a valid incident number
    if (typeof value === "string") {
      const num = parseInt(value, 10);
      if (!isNaN(num) && num >= 1 && num <= 4) {
        return num;
      }

      // Convert to lowercase for case-insensitive matching of text types
      const lowerType = value.toLowerCase().trim();

      // Map text descriptions to incident numbers
      if (lowerType.includes("phone") || lowerType === "phone usage") {
        return 1; // Phone usage
      }

      if (lowerType.includes("cigarette") || lowerType.includes("smoking")) {
        return 2; // Cigarette
      }

      if (
        lowerType.includes("seatbelt") ||
        lowerType.includes("belt") ||
        lowerType === "seatbelt absence" ||
        lowerType === "no seatbelt"
      ) {
        return 3; // Seatbelt
      }

      if (
        lowerType.includes("sleep") ||
        lowerType.includes("drowsy") ||
        lowerType === "sleepy" ||
        lowerType === "drowsiness"
      ) {
        return 4; // Drowsiness
      }
    }

    // Default to seatbelt (3) as most common violation if we can't determine
    console.log("Unknown incident type, defaulting to Seatbelt (3):", value);
    return 3;
  };

  // Calculate safety score based on incidents
  const calculateSafetyScore = (incidents, incidentNumber) => {
    if (!incidents || incidents === 0) return 100;

    // Handle both number and string input for incidentNumber
    let incidentNo;
    if (
      typeof incidentNumber === "string" ||
      typeof incidentNumber === "number"
    ) {
      incidentNo = normalizeIncidentType(incidentNumber);
    } else {
      incidentNo = 3; // Default to seatbelt if undefined or invalid
    }

    // Get the weight for this incident type, default to 1 if not found
    const weight = incidentTypeMap[incidentNo]?.weight || 1;

    const baseReduction = incidents * weight;
    const diminishingFactor = Math.log10(incidents + 1);
    const totalReduction = baseReduction * diminishingFactor;
    return Math.max(0, Math.round(100 - totalReduction));
  };

  // Get incident severity level
  const getIncidentSeverity = (incidentNo) => {
    const info = getIncidentTypeInfo(Number(incidentNo));
    return info ? info.severity : "low";
  };

  // Get user-friendly incident message
  const getIncidentMessage = (incidentNo) => {
    const info = getIncidentTypeInfo(Number(incidentNo));
    return info ? info.message : "Safety violation detected";
  };

  // Get incident icon based on incident type
  const getIncidentIcon = (incidentNo) => {
    const info = getIncidentTypeInfo(Number(incidentNo));
    return info ? info.icon : <AlertTriangle className="w-5 h-5" />;
  };

  // Fetch driver details - use the getDrivers() API instead of individual fetch
  useEffect(() => {
    const fetchDriverData = async () => {
      if (loading || !driverId) return;

      // Prevent excessive fetch attempts
      if (fetchAttempts > 3) {
        setError("Failed to load driver data after multiple attempts.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching data for driver: ${driverId}`);
        // Get driver data, incidents, and trip data in parallel
        const [driverData, incidentsData, tripData] = await Promise.all([
          getDrivers(),
          getIncidents(),
          getDriverTrips(driverId),
        ]);

        if (driverData && driverData.drivers && driverData.drivers.length > 0) {
          const foundDriver = driverData.drivers.find(
            (d) => d.driver_id === driverId || d.id === driverId
          );

          if (foundDriver) {
            console.log("Found driver:", foundDriver);

            // Ensure we have incidents data and it's an array
            if (!incidentsData || !Array.isArray(incidentsData)) {
              console.error(
                "Incidents data is missing or not an array",
                incidentsData
              );
              throw new Error("Failed to load incidents data");
            }

            // Log raw incidents data for debugging
            console.log(
              `Raw incidents data (total ${incidentsData.length}):`,
              incidentsData.slice(0, 5)
            );

            // Filter incidents for this driver - log all matching driver_id values
            console.log(
              "Looking for incidents with driver_id:",
              foundDriver.driver_id
            );
            console.log(
              "Sample incident driver_ids:",
              incidentsData.slice(0, 10).map((i) => i.driver_id)
            );

            // Filter incidents for this specific driver only
            const driverIncidents = incidentsData.filter(
              (incident) =>
                incident.driver_id &&
                String(incident.driver_id) === String(foundDriver.driver_id)
            );

            console.log(
              `Found ${driverIncidents.length} incidents for driver ${foundDriver.driver_id}`
            );
            console.log(
              "Sample driver incidents:",
              driverIncidents.slice(0, 3)
            );

            // Convert incidents to activity items with all required properties
            const activities = driverIncidents
              .filter((incident) => {
                // Make sure incident has a valid incident_no
                const incidentNo = incident.incident_no
                  ? Number(incident.incident_no)
                  : 0;
                // Log invalid incidents for debugging
                if (incidentNo < 1 || incidentNo > 4) {
                  console.warn(
                    `Invalid incident_no: ${incident.incident_no} for incident:`,
                    incident
                  );
                }
                return incidentNo >= 1 && incidentNo <= 4;
              })
              .map((incident) => ({
                id:
                  incident.id ||
                  `incident-${Math.random().toString(36).substr(2, 9)}`,
                incidentNo: Number(incident.incident_no),
                message: getIncidentMessage(incident.incident_no),
                severity: getIncidentSeverity(incident.incident_no),
                timestamp: new Date(
                  incident.created_at || new Date()
                ).toLocaleString(),
                type:
                  incidentTypeMap[
                    Number(incident.incident_no)
                  ]?.type?.toLowerCase() || "unknown",
                vehicleId: incident.vehicle_id,
                date: incident.created_at,
              }))
              .sort((a, b) => new Date(b.date) - new Date(a.date));

            console.log(
              `Processed ${activities.length} activities for display`
            );

            // Calculate total incidents
            const totalIncidents = driverIncidents.length;

            // Calculate most common incident type
            const incidentTypeCount = {};
            driverIncidents.forEach((incident) => {
              const incidentNo = Number(incident.incident_no);
              if (incidentNo >= 1 && incidentNo <= 4) {
                incidentTypeCount[incidentNo] =
                  (incidentTypeCount[incidentNo] || 0) + 1;
              }
            });

            let mostCommonIncidentType = 3; // Default to seatbelt
            let maxCount = 0;

            Object.entries(incidentTypeCount).forEach(([type, count]) => {
              if (count > maxCount) {
                maxCount = count;
                mostCommonIncidentType = Number(type);
              }
            });

            // Process trip data if available
            console.log("Trip data:", tripData);
            const completedTrips =
              tripData && tripData.trips
                ? tripData.trips.filter((trip) => trip.status === "completed")
                    .length
                : 0;

            // Create complete driver object with all required properties
            const driverObj = {
              id: foundDriver.id,
              driverId: foundDriver.driver_id,
              name: foundDriver.name || "Unknown Driver",
              phoneNumber: foundDriver.phone || foundDriver.phone_number || "",
              vehicle: foundDriver.vehicle || "None",
              vehicleId: foundDriver.vehicle_id || null,
              totalTrips: completedTrips || foundDriver.total_trips || 0,
              incidents: totalIncidents || foundDriver.incidents || 0,
              incidentType: mostCommonIncidentType || 3,
              recentActivity: activities,
              createdAt: foundDriver.created_at || new Date().toISOString(),
              lastLogin: foundDriver.last_login,
              score: calculateSafetyScore(
                totalIncidents || foundDriver.incidents || 0,
                mostCommonIncidentType || 3
              ),
            };

            setDriver(driverObj);
            setEditForm({
              name: driverObj.name || "",
              phoneNumber: driverObj.phoneNumber || "",
              vehicleId: driverObj.vehicleId || null,
            });
          } else {
            throw new Error(`Driver with ID ${driverId} not found`);
          }
        } else {
          throw new Error("No drivers found");
        }
      } catch (err) {
        console.error("Error fetching driver details:", err);
        setError(err.message || "Failed to load driver details");
        setFetchAttempts((prevAttempts) => prevAttempts + 1);
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
      const updatedDriver = await updateDriver(driver.id, {
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
      ? "text-green-600 dark:text-green-400"
      : score >= 70
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400";
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-l-4 border-red-500";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-l-4 border-amber-500";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-l-4 border-green-500";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-l-4 border-blue-500";
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
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading driver details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-md max-w-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">
                Error Loading Driver
              </h3>
              <p className="text-red-700 dark:text-red-300">{error}</p>
              <button
                onClick={handleBack}
                className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-md max-w-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-400 mb-2">
                Driver Not Found
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300">
                Could not find driver information. Please try again or select a
                different driver.
              </p>
              <button
                onClick={handleBack}
                className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
              >
                Go Back
              </button>
            </div>
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
                <div className="w-full space-y-4 mt-4">
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Phone className="w-5 h-5 text-primary-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {driver.phoneNumber || "No phone number"}
                    </span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Car className="w-5 h-5 text-primary-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {driver.vehicle || "No vehicle assigned"}
                    </span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Joined: {new Date(driver.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                  <div
                    className={`h-2 rounded-full ${
                      driver.score >= 90
                        ? "bg-green-500"
                        : driver.score >= 70
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${driver.score}%` }}
                  ></div>
                </div>
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
                <div
                  className={`text-4xl font-bold mb-2 ${
                    driver.incidents === 0
                      ? "text-green-500"
                      : driver.incidents < 3
                      ? "text-amber-500"
                      : "text-red-500"
                  }`}
                >
                  {driver.incidents || 0}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Safety violations
                </p>
              </div>
            </div>

            {/* Most Common Violations */}
            {driver.incidents > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mt-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                  Most Common Violation
                </h3>
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg mr-4">
                    {getIncidentIcon(driver.incidentType)}
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {incidentTypeMap[driver.incidentType]?.type.replace(
                        "_",
                        " "
                      ) || "Safety Violation"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Take appropriate action to prevent future occurrences
                    </p>
                  </div>
                </div>
              </div>
            )}
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
                          ? "bg-red-200 dark:bg-red-800/50"
                          : activity.severity === "medium"
                          ? "bg-amber-200 dark:bg-amber-800/50"
                          : "bg-green-200 dark:bg-green-800/50"
                      } mr-4`}
                    >
                      {getIncidentIcon(activity.incidentNo)}
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
                        <div className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50 dark:bg-gray-700 dark:bg-opacity-50 flex items-center">
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
                        {activity.vehicleId && (
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            Vehicle ID: {activity.vehicleId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  No incidents recorded
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  This driver has a clean safety record!
                </p>
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
