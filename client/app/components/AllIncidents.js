"use client";
import React, { useState, useEffect, useRef } from "react";
import { getIncidents, getAllTrips } from "../utils/api";
import {
  Bell,
  Clock,
  AlertTriangle,
  Phone,
  Moon,
  Cigarette,
  Filter,
  Search,
  Calendar,
  User,
  Car,
  ArrowLeft,
  CheckCircle,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Notifications from "./Notifications";

const AllIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [trips, setTrips] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("all"); // all, incidents, trips
  const [socketStatus, setSocketStatus] = useState("disconnected");
  const socketRef = useRef(null);
  const router = useRouter();

  // Map incident numbers to their respective types and messages
  const incidentTypeMap = {
    1: {
      type: "PHONE_USAGE",
      message: "Phone usage detected",
      severity: "high",
    },
    2: {
      type: "CIGARETTE",
      message: "Cigarette usage detected",
      severity: "medium",
    },
    3: {
      type: "SEATBELT",
      message: "Seatbelt violation detected",
      severity: "medium",
    },
    4: {
      type: "DROWSINESS",
      message: "Driver drowsiness detected",
      severity: "high",
    },
  };

  // Get incident type info based on incident_no
  const getIncidentTypeInfo = (incidentNo) => {
    return incidentTypeMap[incidentNo] || null;
  };

  // Add sound playback for notifications
  const playNotificationSound = (type) => {
    try {
      // Try with different paths
      const soundFile = type === "incident" ? 
        "/sounds/alert.mp3" : 
        "/sounds/notification.mp3";
      
      const audio = new Audio(soundFile);
      audio.volume = type === "incident" ? 0.7 : 0.5;
      
      // Add error handling
      audio.addEventListener('error', (e) => {
        console.warn(`Error loading sound ${soundFile}, trying fallback`, e);
        // Try fallback paths
        const fallbackFile = type === "incident" ? 
          "/alert.mp3" : 
          "/notification.mp3";
        const fallbackAudio = new Audio(fallbackFile);
        fallbackAudio.play().catch(err => {
          console.log("Fallback audio error:", err);
        });
      });
      
      audio.play().catch(err => {
        console.log("Audio play error:", err);
      });
    } catch (err) {
      console.log("Audio setup error:", err);
    }
  };

  // Set up socket connection for real-time notifications
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const setupSocketConnection = async () => {
      try {
        setSocketStatus("connecting");
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "https://dbms-o3mb.onrender.com";

        // Dynamically import socket.io-client
        const { io } = await import("socket.io-client");

        const socket = io(API_URL, {
          transports: ["websocket"],
          withCredentials: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
        });

        socketRef.current = socket;

        // Setup socket event listeners
        socket.on("connect", () => {
          console.log("Socket connected for AllIncidents!");
          setSocketStatus("connected");
        });

        socket.on("disconnect", () => {
          console.log("Socket disconnected!");
          setSocketStatus("disconnected");
        });

        socket.on("connect_error", (err) => {
          console.error("Socket connection error:", err);
          setSocketStatus("error");
        });

        // Listen for new incidents
        socket.on("newIncident", (incident) => {
          console.log("Received new incident in AllIncidents:", incident);

          // Format the incident
          const formattedIncident = {
            id: incident.id || `incident-${Date.now()}`,
            driver_id: incident.driver_id,
            driver_name: incident.driver_name || "Unknown Driver",
            vehicle_id: incident.vehicle_id,
            vehicle_number: incident.vehicle_number || "Unknown Vehicle",
            incident_no: incident.incident_no,
            incident_type: incident.incident_type,
            created_at: incident.timestamp || new Date().toISOString(),
            type: "incident",
            is_realtime: true,
            message:
              incident.message ||
              `Safety incident detected by ${
                incident.driver_name || "Unknown Driver"
              }`,
          };

          // Add to incidents list
          setIncidents((prev) => [formattedIncident, ...prev]);

          // Also add to combined activities list
          setAllActivities((prev) => [
            {
              ...formattedIncident,
              activity_type: "incident",
              timestamp: formattedIncident.created_at,
            },
            ...prev,
          ]);
          
          // Play notification sound
          playNotificationSound("incident");
        });

        // Listen for trip updates
        socket.on("tripUpdate", (tripEvent) => {
          console.log("Received trip update in AllIncidents:", tripEvent);

          // Format the trip event
          const formattedTrip = {
            id: `trip-${tripEvent.trip_id || Date.now()}`,
            driver_id: tripEvent.driver_id,
            driver_name: tripEvent.driver_name || "Unknown Driver",
            vehicle_id: tripEvent.vehicle_id,
            vehicle_number: tripEvent.vehicle_number || "Unknown Vehicle",
            trip_id: tripEvent.trip_id,
            timestamp: tripEvent.timestamp || new Date().toISOString(),
            trip_type: tripEvent.type, // 'trip_started' or 'trip_ended'
            status: tripEvent.type === "trip_started" ? "active" : "completed",
            distance: tripEvent.distance,
            duration_minutes: tripEvent.duration_minutes,
            type: "trip",
            is_realtime: true,
          };

          // Add to trips list
          setTrips((prev) => [formattedTrip, ...prev]);

          // Also add to combined activities list
          setAllActivities((prev) => [
            {
              ...formattedTrip,
              activity_type: "trip",
            },
            ...prev,
          ]);
          
          // Play notification sound for trips
          playNotificationSound("trip");
        });

        return () => {
          socket.disconnect();
        };
      } catch (err) {
        console.error("Failed to initialize socket:", err);
        setSocketStatus("error");
      }
    };

    setupSocketConnection();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Fetch initial incidents and trips data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch both incidents and trips in parallel
        const [incidentsData, tripsData] = await Promise.all([
          getIncidents(),
          getAllTrips(),
        ]);

        // Process incidents
        const formattedIncidents = (incidentsData || []).map((incident) => ({
          ...incident,
          type: "incident",
          is_realtime: false,
        }));

        // Process trips
        const formattedTrips = (tripsData?.trips || []).map((trip) => ({
          ...trip,
          type: "trip",
          is_realtime: false,
          trip_type: trip.status === "active" ? "trip_started" : "trip_ended",
        }));

        // Set state for individual categories
        setIncidents(formattedIncidents);
        setTrips(formattedTrips);

        // Combine and sort by timestamp (newest first)
        const allActivities = [
          ...formattedIncidents.map((incident) => ({
            ...incident,
            activity_type: "incident",
            timestamp: incident.created_at,
          })),
          ...formattedTrips.map((trip) => ({
            ...trip,
            activity_type: "trip",
            timestamp:
              trip.trip_type === "trip_started"
                ? trip.start_time
                : trip.end_time || trip.start_time,
          })),
        ].sort((a, b) => {
          const dateA = new Date(a.timestamp || a.created_at);
          const dateB = new Date(b.timestamp || b.created_at);
          return dateB - dateA;
        });

        setAllActivities(allActivities);
      } catch (err) {
        setError(err.message || "Failed to load data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to reconnect socket
  const reconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.connect();
      setSocketStatus("connecting");
    }
  };

  // Icon for different incident types
  const getAlertIcon = (incident_no) => {
    switch (Number(incident_no)) {
      case 1: // Phone usage
        return <Phone className="w-5 h-5" />;
      case 4: // Drowsiness
        return <Moon className="w-5 h-5" />;
      case 2: // Cigarette
        return <Cigarette className="w-5 h-5" />;
      case 3: // Seatbelt
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  // Get trip icon
  const getTripIcon = (trip_type) => {
    if (trip_type === "trip_started") {
      return <Car className="w-5 h-5 text-blue-500" />;
    } else if (trip_type === "trip_ended") {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <Car className="w-5 h-5" />;
  };

  // Get severity style for different alert types
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

  // Get trip card style
  const getTripStyle = (trip_type) => {
    if (trip_type === "trip_started") {
      return "bg-blue-100 text-blue-800 border-l-4 border-blue-500";
    } else if (trip_type === "trip_ended") {
      return "bg-green-100 text-green-800 border-l-4 border-green-500";
    }
    return "bg-gray-100 text-gray-800 border-l-4 border-gray-500";
  };

  // Get severity dot color
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

  // Filter and search activities
  const filteredActivities = allActivities
    .filter((activity) => {
      // Filter by category
      if (
        filterCategory === "incidents" &&
        activity.activity_type !== "incident"
      )
        return false;
      if (filterCategory === "trips" && activity.activity_type !== "trip")
        return false;

      // For incidents, ensure they have valid incident numbers
      if (
        activity.activity_type === "incident" &&
        (!activity.incident_no || !incidentTypeMap[activity.incident_no])
      ) {
        return false;
      }

      return true;
    })
    .filter((activity) => {
      // Apply search filter
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      return (
        activity.driver_name?.toLowerCase().includes(searchLower) ||
        activity.vehicle_number?.toLowerCase().includes(searchLower) ||
        String(activity.driver_id).includes(searchLower)
      );
    })
    .filter((activity) => {
      // Apply incident type filter (only for incidents)
      if (!filterType) return true;
      if (activity.activity_type !== "incident") return true;

      return Number(activity.incident_no) === Number(filterType);
    });

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Error";
    }
  };

  // Function to navigate back
  const goBack = () => {
    router.back();
  };

  // Get socket status style and icon
  const getSocketStatusStyle = () => {
    switch (socketStatus) {
      case "connected":
        return "text-green-500";
      case "connecting":
        return "text-amber-500 animate-pulse";
      case "disconnected":
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getSocketStatusIcon = () => {
    switch (socketStatus) {
      case "connected":
        return <Wifi className="w-4 h-4" />;
      case "connecting":
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case "disconnected":
      case "error":
        return <WifiOff className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <Notifications />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={goBack}
              className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Activity Monitor
            </h1>
          </div>

          {/* Socket status indicator */}
          <div className="flex items-center">
            <span className={`flex items-center ${getSocketStatusStyle()}`}>
              {getSocketStatusIcon()}
              <span className="ml-2 text-sm">
                {socketStatus === "connected"
                  ? "Live Updates"
                  : socketStatus === "connecting"
                  ? "Connecting..."
                  : "Disconnected"}
              </span>
            </span>
            {(socketStatus === "disconnected" || socketStatus === "error") && (
              <button
                onClick={reconnectSocket}
                className="ml-3 px-2 py-1 text-xs bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
              >
                Reconnect
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="md:col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by driver or vehicle"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <select
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Incident Types</option>
                <option value="1">Phone Usage</option>
                <option value="2">Cigarette</option>
                <option value="3">Seatbelt Violation</option>
                <option value="4">Drowsiness</option>
              </select>
            </div>
          </div>
          <div>
            <div className="relative">
              <Bell
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <select
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Activities</option>
                <option value="incidents">Safety Incidents</option>
                <option value="trips">Trip Updates</option>
              </select>
            </div>
          </div>
          <div className="text-right flex items-center justify-end">
            <span className="text-gray-600 dark:text-gray-400">
              {filteredActivities.length} activities found
            </span>
          </div>
        </div>

        {/* Activities List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading activities data...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Activities Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || filterType || filterCategory !== "all"
                ? "Try adjusting your search filters"
                : "No driver activities have been recorded"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className="grid grid-cols-1 gap-4 max-h-[calc(100vh-240px)] overflow-y-auto pr-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#CBD5E0 #EDF2F7",
              }}
            >
              {filteredActivities.map((activity) => {
                if (activity.activity_type === "incident") {
                  // Render incident card
                  const incidentInfo = getIncidentTypeInfo(
                    activity.incident_no
                  );
                  if (!incidentInfo) return null;

                  return (
                    <div
                      key={activity.id}
                      className={`rounded-lg p-4 transition-all ${getSeverityStyle(
                        incidentInfo.severity
                      )} ${activity.is_realtime ? "animate-pulse-once" : ""}`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`p-2 rounded-lg ${
                            incidentInfo.severity === "high"
                              ? "bg-red-200"
                              : incidentInfo.severity === "medium"
                              ? "bg-amber-200"
                              : "bg-green-200"
                          } mr-4`}
                        >
                          {getAlertIcon(activity.incident_no)}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <h4 className="font-medium mb-1 sm:mb-0">
                              {incidentInfo.message} - Driver{" "}
                              {activity.driver_name}
                            </h4>
                            <div className="flex items-center text-sm">
                              {activity.is_realtime && (
                                <span className="mr-2 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-600 animate-pulse">
                                  LIVE
                                </span>
                              )}
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{formatDate(activity.created_at)}</span>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <div className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50 flex items-center">
                              <span
                                className={`w-2 h-2 rounded-full ${getSeverityDot(
                                  incidentInfo.severity
                                )} mr-1`}
                              ></span>
                              {incidentInfo.severity.charAt(0).toUpperCase() +
                                incidentInfo.severity.slice(1)}
                            </div>
                            <div className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                              Vehicle: {activity.vehicle_number}
                            </div>
                            <div className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                              ID: {activity.id}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else if (activity.activity_type === "trip") {
                  // Render trip card
                  return (
                    <div
                      key={activity.id}
                      className={`rounded-lg p-4 transition-all ${getTripStyle(
                        activity.trip_type
                      )} ${activity.is_realtime ? "animate-pulse-once" : ""}`}
                    >
                      <div className="flex items-start">
                        <div className="p-2 rounded-lg bg-blue-200 mr-4">
                          {getTripIcon(activity.trip_type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <h4 className="font-medium mb-1 sm:mb-0">
                              {activity.trip_type === "trip_started"
                                ? `Trip started by driver ${activity.driver_name}`
                                : `Trip completed by driver ${activity.driver_name}`}
                              {activity.distance
                                ? ` (${activity.distance} km)`
                                : ""}
                              {activity.duration_minutes
                                ? ` in ${activity.duration_minutes} min`
                                : ""}
                            </h4>
                            <div className="flex items-center text-sm">
                              {activity.is_realtime && (
                                <span className="mr-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-600 animate-pulse">
                                  LIVE
                                </span>
                              )}
                              <Clock className="w-4 h-4 mr-1" />
                              <span>
                                {formatDate(
                                  activity.trip_type === "trip_started"
                                    ? activity.start_time
                                    : activity.end_time || activity.start_time
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <div className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50 flex items-center">
                              <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                              {activity.trip_type === "trip_started"
                                ? "Started"
                                : "Completed"}
                            </div>
                            <div className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                              Vehicle: {activity.vehicle_number}
                            </div>
                            <div className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                              Trip ID: {activity.trip_id || activity.id}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllIncidents;
