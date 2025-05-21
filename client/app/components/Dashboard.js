/* eslint-disable react-hooks/exhaustive-deps */
// src/components/Dashboard.js

"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Activity,
  ArrowRight,
  Car,
  UserCircle,
  Phone,
  Moon,
  Cigarette,
  AlertTriangle as BeltIcon,
  Info,
  Calendar,
  Shield,
  Wifi,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import {
  getDashboardMetrics,
  getDrivers,
  getVehicles,
  getIncidents,
  getTripCounts,
  getAllTrips,
} from "../utils/api";
import { useRouter } from "next/navigation";
import { useNotifications } from "../context/NotificationsContext";
import Notifications from "./Notifications";
import {
  calculateSafetyScore,
  getScoreColorScheme,
} from "../utils/safetyScore";

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
    totalDrivers: 0,
    totalVehicles: 0,
    recentIncidents: 0,
  });
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [safetyRecommendation, setSafetyRecommendation] = useState({
    title: "",
    description: "",
    incidentNo: 3, // Default to seatbelt
  });
  const [socketStatus, setSocketStatus] = useState("disconnected");
  const socketRef = useRef(null);

  // Use the notifications context
  const { getIncidentInfo } = useNotifications();

  // Date filter state
  const [startDate, setStartDate] = useState(() => {
    // Default to 7 days ago
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    // Default to today
    return new Date().toISOString().split("T")[0];
  });

  const router = useRouter();

  // Set up socket connection for real-time activity updates
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
          transports: ["websocket", "polling"], // Include polling as fallback
          withCredentials: true,
          reconnectionAttempts: 10, // Increased attempts
          reconnectionDelay: 1000,
          timeout: 20000, // Increased timeout
          forceNew: true, // Force new connection
        });

        socketRef.current = socket;

        // Setup socket event listeners
        socket.on("connect", () => {
          console.log("Socket connected for Dashboard!");
          setSocketStatus("connected");

          // Keep connection alive with ping
          const pingInterval = setInterval(() => {
            if (socket.connected) {
              socket.emit("ping", { timestamp: new Date().toISOString() });
            } else {
              clearInterval(pingInterval);
            }
          }, 30000);

          socket.on("disconnect", () => {
            clearInterval(pingInterval);
          });
        });

        socket.on("disconnect", () => {
          console.log("Socket disconnected!");
          setSocketStatus("disconnected");

          // Try to reconnect after a delay
          setTimeout(() => {
            if (socketRef.current && !socketRef.current.connected) {
              console.log("Attempting to reconnect...");
              socketRef.current.connect();
            }
          }, 3000);
        });

        socket.on("connect_error", (err) => {
          console.error("Socket connection error:", err);
          setSocketStatus("error");

          // Try with different transport after delay
          setTimeout(() => {
            if (socketRef.current) {
              console.log("Trying alternative transport...");
              socketRef.current.io.opts.transports = ["polling", "websocket"];
              socketRef.current.connect();
            }
          }, 5000);
        });

        // Enhanced listener for new incidents in real-time with better error handling
        socket.on("newIncident", (incident) => {
          try {
            console.log("Received new incident in Dashboard:", incident);
            // Validate incident data
            if (!incident) {
              console.error("Received empty incident data");
              return;
            }

            // Get incident number, properly handling different field names
            const incidentNo = incident.incidentNo || incident.incident_no;

            if (!incidentNo) {
              console.error("Invalid incident number", incident);
              return;
            }

            // Get incident type info
            const incidentInfo = getIncidentInfo(incidentNo);
            if (!incidentInfo) {
              console.error(`Unknown incident type: ${incidentNo}`);
              return;
            }

            // Format the incident for display
            const driverName =
              incident.driverName || incident.driver_name || "Unknown Driver";
            const vehicleNumber =
              incident.vehicleNumber || incident.vehicle_number || "Unknown";
            const timestamp = new Date(
              incident.timestamp || incident.created_at || new Date()
            );

            const formattedIncident = {
              id: incident.id || Date.now(),
              driverId: incident.driverId || incident.driver_id,
              driverName,
              vehicleId: incident.vehicleId || incident.vehicle_id,
              vehicleNumber,
              incidentNo,
              timestamp,
              type: incidentInfo.type.toLowerCase(),
              severity: incidentInfo.severity,
              message: `Driver ${driverName}: ${incidentInfo.message}`,
            };

            // Update alerts state (add to beginning)
            setDashboardData((prev) => ({
              ...prev,
              alerts: [formattedIncident, ...(prev.alerts?.slice(0, 2) || [])],
            }));

            // Update activity data state
            setActivityData((prev) => [
              {
                id: `incident-${formattedIncident.id}`,
                type:
                  formattedIncident.severity === "high" ? "danger" : "warning",
                message: formattedIncident.message,
                timestamp,
                displayTime: timestamp.toLocaleTimeString(),
                incident_no: formattedIncident.incidentNo,
                sortTime: timestamp.getTime(),
              },
              ...(prev?.slice(0, 19) || []),
            ]);

            // Update metrics
            setMetrics((prev) => ({
              ...prev,
              recentIncidents: (prev?.recentIncidents || 0) + 1,
            }));

            // Show browser notification
            showBrowserNotification(
              "⚠️ Driver Safety Alert",
              formattedIncident.message,
              `incident-${formattedIncident.id}`,
              true
            );

            // Play an alert sound
            playSound("alert");
          } catch (err) {
            console.error("Error processing new incident:", err);
          }
        });

        // Enhanced listener for trip updates in real-time
        socket.on("tripUpdate", (tripEvent) => {
          try {
            console.log("Received trip update in Dashboard:", tripEvent);
            // Validate trip data
            if (!tripEvent) {
              console.error("Received empty trip data");
              return;
            }

            const driverName =
              tripEvent.driver_name || tripEvent.driverName || "Unknown Driver";
            const vehicleNumber =
              tripEvent.vehicle_number || tripEvent.vehicleNumber || "Unknown";
            const timestamp = new Date(tripEvent.timestamp || new Date());

            // Format the trip activity
            const activityType =
              tripEvent.type === "trip_started" ? "trip_start" : "safe";
            const message =
              tripEvent.type === "trip_started"
                ? `Driver ${driverName} started trip with vehicle ${vehicleNumber}`
                : `Driver ${driverName} completed trip with vehicle ${vehicleNumber}${
                    tripEvent.distance ? ` (${tripEvent.distance} km)` : ""
                  }`;

            // Update activity data
            setActivityData((prev) => [
              {
                id: `trip-${tripEvent.trip_id || Date.now()}`,
                type: activityType,
                message,
                timestamp,
                displayTime: timestamp.toLocaleTimeString(),
                driver_id: tripEvent.driver_id,
                vehicle_id: tripEvent.vehicle_id,
                sortTime: timestamp.getTime(),
              },
              ...(prev?.slice(0, 19) || []),
            ]);

            // Update metrics if a trip is completed
            if (tripEvent.type === "trip_ended") {
              setDashboardData((prev) => ({
                ...prev,
                totalTrips: (prev?.totalTrips || 0) + 1,
              }));
            } else if (tripEvent.type === "trip_started") {
              // If trip started, increment active trips count
              setDashboardData((prev) => ({
                ...prev,
                activeTrips: (prev?.activeTrips || 0) + 1,
                tripsToday: (prev?.tripsToday || 0) + 1,
              }));
            }

            // Show browser notification
            showBrowserNotification(
              tripEvent.type === "trip_started"
                ? "Trip Started"
                : "Trip Completed",
              message,
              `trip-${tripEvent.trip_id || Date.now()}`,
              false
            );

            // Play trip sound
            playSound("trip");
          } catch (err) {
            console.error("Error processing trip update:", err);
          }
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

    // Request notification permission on component mount
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

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
        // Fetch incidents directly
        const incidents = await getIncidents();
        // Fetch trip data
        const tripCounts = await getTripCounts();
        const allTrips = await getAllTrips();

        // Filter incidents by date range if provided
        // Filter incidents by date range if provided
        const filteredIncidents =
          incidents && Array.isArray(incidents)
            ? incidents.filter((incident) => {
                if (!startDate || !endDate || !incident) return false;

                const incidentDate =
                  incident.incident_date || incident.created_at;
                if (!incidentDate) return false;

                const date = new Date(incidentDate);
                const start = new Date(startDate);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // Include the entire end day

                return date >= start && date <= end;
              })
            : [];

        // Count total and active drivers
        const totalDrivers =
          drivers && drivers.drivers ? drivers.drivers.length : 0;
        const activeDrivers =
          drivers && drivers.drivers
            ? drivers.drivers.filter(
                (driver) =>
                  driver && driver.vehicle && driver.vehicle !== "None"
              ).length
            : 0;

        // Get total trips from the trip data (completed trips in date range)
        const totalTrips =
          tripCounts && tripCounts.total_trips ? tripCounts.total_trips : 0;

        // Filter trips by date range
        const filteredTrips =
          allTrips && allTrips.trips
            ? allTrips.trips.filter((trip) => {
                if (!startDate || !endDate || !trip || !trip.start_time)
                  return false;

                const tripDate = new Date(trip.start_time);
                const start = new Date(startDate);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);

                return tripDate >= start && tripDate <= end;
              })
            : [];

        // Use the safety score calculation utility
        const safetyScoreData = calculateSafetyScore(
          filteredIncidents,
          filteredTrips,
          {
            timeWindow: 30, // Consider incidents from the last 30 days
          }
        );

        // Get the calculated safety score
        const averageScore = safetyScoreData.score;
        const safeDrivingPercentage = averageScore; // Use the calculated score directly

        // Update metrics state
        setMetrics({
          activeDrivers,
          totalDrivers,
          totalVehicles: metricsData.vehicles || 0,
          recentIncidents: filteredIncidents.length || 0,
        });

        // Track incidents by number for analytics
        const incidentsByNumber = {
          1: 0, // Phone usage
          2: 0, // Cigarette
          3: 0, // Seatbelt
          4: 0, // Drowsiness
        };

        // Process alerts directly from incidents data
        let alerts = [];

        if (filteredIncidents && filteredIncidents.length > 0) {
          // Filter incidents with valid incident_no values (1-4)
          const validIncidents = filteredIncidents.filter(
            (incident) =>
              incident &&
              incident.incident_no &&
              typeof incident.incident_no === "number" &&
              incident.incident_no >= 1 &&
              incident.incident_no <= 4 &&
              getIncidentInfo(incident.incident_no)
          );

          // Count incidents by type
          validIncidents.forEach((incident) => {
            if (
              incident.incident_no &&
              incidentsByNumber[incident.incident_no] !== undefined
            ) {
              incidentsByNumber[incident.incident_no]++;
            }
          });

          // Get the most recent 3 incidents
          alerts = validIncidents.slice(0, 3).map((incident, index) => {
            // Get incident type info based on incident_no
            const incidentInfo = getIncidentInfo(incident.incident_no);

            // Ensure driver name and vehicle number are available
            const driverName = incident.driver_name || "Unknown Driver";
            const vehicleNumber = incident.vehicle_number || "Unknown Vehicle";

            return {
              id: index + 1,
              message: `Driver ${incident.driver_name}: ${incidentInfo.message}`,
              timestamp: new Date(incident.created_at).toLocaleTimeString(),
              severity: incidentInfo.severity,
              driverName: incident.driver_name,
              vehicleNumber: incident.vehicle_number,
              driverId: incident.driver_id,
              vehicleId: incident.vehicle_id,
              type: incidentInfo.type.toLowerCase(),
              incident_no: incident.incident_no,
            };
          });
        }

        // Determine the most common violation type
        let mostCommonIncidentNo = 3; // Default to seatbelt
        let maxCount = 0;

        for (const [incidentNo, count] of Object.entries(incidentsByNumber)) {
          if (count > maxCount) {
            maxCount = count;
            mostCommonIncidentNo = Number(incidentNo);
          }
        }

        // Set safety recommendation based on most common violation
        setSafetyRecommendation(getRecommendationByType(mostCommonIncidentNo));

        // Process activity data based on real trips and incidents - fixed to properly sort by timestamp
        const activity = processAllActivity();

        setDashboardData({
          totalTrips,
          safeDrivingPercentage,
          averageScore,
          alerts,
          activeTrips: tripCounts.active_trips || 0,
          tripsToday: tripCounts.trips_today || 0,
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
  }, [startDate, endDate]);

  // Get recommendation based on incident number
  const getRecommendationByType = (incidentNo) => {
    switch (incidentNo) {
      case 4: // Drowsiness
        return {
          title: "Implement Rest Break Policy",
          description:
            "Multiple drowsiness incidents detected. Consider implementing mandatory rest breaks for drivers on shifts longer than 4 hours.",
          incidentNo: 4,
        };
      case 2: // Cigarette
        return {
          title: "Enforce No Smoking Policy",
          description:
            "Cigarette usage violations detected. Implement strict no-smoking policy and provide smoking cessation support.",
          incidentNo: 2,
        };
      case 3: // Seatbelt
        return {
          title: "Strengthen Seatbelt Enforcement",
          description:
            "Seatbelt violations detected. Conduct regular safety checks and implement automatic seatbelt reminder system.",
          incidentNo: 3,
        };
      case 1: // Phone usage
        return {
          title: "Address Phone Usage",
          description:
            "Phone usage violations detected. Install phone blocking technology and conduct distraction-free driving training.",
          incidentNo: 1,
        };
      default:
        return {
          title: "Strengthen Safety Protocols",
          description:
            "Review and reinforce current safety protocols with all drivers. Consider implementing more frequent safety training.",
          incidentNo: 3,
        };
    }
  };

  const getAlertIcon = (incident_no) => {
    switch (Number(incident_no)) {
      case 1: // Phone usage
        return <Phone className="w-5 h-5" />;
      case 4: // Drowsiness
        return <Moon className="w-5 h-5" />;
      case 2: // Cigarette
        return <Cigarette className="w-5 h-5" />;
      case 3: // Seatbelt
        return <BeltIcon className="w-5 h-5" />;
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
      case "trip_start":
        return <Car className="w-5 h-5 text-blue-500" />;
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

  const handleViewAllIncidents = () => {
    router.push("/incidents");
  };

  // Process activity data based on real trips and incidents - fixed to properly sort by timestamp
  const processAllActivity = () => {
    try {
      // Create arrays for all activities
      const allActivities = [];

      // Add trip started events
      if (filteredTrips && filteredTrips.length > 0) {
        filteredTrips
          .filter((trip) => trip.status !== "cancelled" && trip.start_time)
          .forEach((trip) => {
            const startTime = new Date(trip.start_time);
            allActivities.push({
              id: `trip-start-${trip.id || Date.now()}`,
              type: "trip_start",
              message: `Driver ${
                trip.driver_name || "Unknown"
              } started trip with vehicle ${trip.vehicle_number || "Unknown"}`,
              timestamp: startTime,
              displayTime: startTime.toLocaleTimeString(),
              driver_id: trip.driver_id,
              vehicle_id: trip.vehicle_id,
              sortTime: startTime.getTime(),
            });
          });
      }

      // Add trip ended events
      if (filteredTrips && filteredTrips.length > 0) {
        filteredTrips
          .filter((trip) => trip.status === "completed" && trip.end_time)
          .forEach((trip) => {
            const endTime = new Date(trip.end_time);
            allActivities.push({
              id: `trip-end-${trip.id || Date.now()}`,
              type: "safe",
              message: `Driver ${
                trip.driver_name || "Unknown"
              } completed trip with vehicle ${
                trip.vehicle_number || "Unknown"
              }${trip.distance ? ` (${trip.distance} km)` : ""}`,
              timestamp: endTime,
              displayTime: endTime.toLocaleTimeString(),
              driver_id: trip.driver_id,
              vehicle_id: trip.vehicle_id,
              duration: trip.duration ? `${trip.duration} min` : null,
              sortTime: endTime.getTime(),
            });
          });
      }

      // Add incidents
      if (filteredIncidents && filteredIncidents.length > 0) {
        filteredIncidents
          .filter(
            (incident) =>
              incident &&
              incident.incident_no &&
              getIncidentInfo(incident.incident_no)
          )
          .forEach((incident) => {
            // Get incident type info based on incident_no
            const incidentInfo = getIncidentInfo(incident.incident_no);
            if (!incidentInfo) return;

            // Determine activity type based on severity
            const activityType =
              incidentInfo.severity === "high" ? "danger" : "warning";
            const incidentTime = new Date(
              incident.created_at || incident.incident_date || new Date()
            );

            allActivities.push({
              id: `incident-${incident.id || Date.now()}`,
              type: activityType,
              message: `Driver ${incident.driver_name || "Unknown"}: ${
                incidentInfo.message
              }`,
              timestamp: incidentTime,
              displayTime: incidentTime.toLocaleTimeString(),
              incident_no: incident.incident_no,
              sortTime: incidentTime.getTime(),
            });
          });
      }

      // Sort all activities by timestamp (newest first)
      allActivities.sort((a, b) => b.sortTime - a.sortTime);

      // Take only the 20 most recent
      return allActivities.slice(0, 20);
    } catch (error) {
      console.error("Error processing activities:", error);
      return [];
    }
  };

  // Helper to show browser notifications
  const showBrowserNotification = (
    title,
    body,
    tag,
    requireInteraction = false
  ) => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        // Use setTimeout to ensure notification is shown immediately
        setTimeout(() => {
          try {
            const notification = new Notification(title, {
              body,
              icon: "/favicon.ico",
              tag,
              requireInteraction,
              silent: false, // Let browser handle sound
              vibrate: [200, 100, 200], // Vibration pattern for mobile
            });

            notification.onclick = () => {
              window.focus();
              notification.close();
            };
          } catch (err) {
            console.error("Error showing notification:", err);
          }
        }, 0);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  };

  // Helper to play notification sounds
  const playSound = (type) => {
    try {
      const soundFile = type === "alert" ? "/alert.mp3" : "/notification.mp3";
      const audio = new Audio(soundFile);
      audio.volume = type === "alert" ? 1.0 : 0.7;
      audio.play().catch((err) => console.log("Audio play error:", err));
    } catch (err) {
      console.log("Audio error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      {/* The Notifications component will handle the real-time alerts
      <Notifications /> */}

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
          {/* Socket Status */}
          <div className="flex justify-end items-center text-sm mb-4">
            <div
              className={`flex items-center ${
                socketStatus === "connected"
                  ? "text-green-500"
                  : socketStatus === "connecting"
                  ? "text-amber-500 animate-pulse"
                  : "text-red-500"
              }`}
            >
              {socketStatus === "connected" ? (
                <Wifi className="w-4 h-4 mr-1" />
              ) : socketStatus === "connecting" ? (
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <WifiOff className="w-4 h-4 mr-1" />
              )}
              <span>
                {socketStatus === "connected"
                  ? "Live Updates Active"
                  : socketStatus === "connecting"
                  ? "Connecting..."
                  : "Live Updates Disconnected"}
              </span>
            </div>
            {(socketStatus === "disconnected" || socketStatus === "error") && (
              <button
                onClick={() => {
                  if (socketRef.current) {
                    socketRef.current.disconnect();
                    socketRef.current.connect();
                    setSocketStatus("connecting");
                  } else {
                    // If socket reference is missing, set up a new one
                    const setupSocketConnection = async () => {
                      try {
                        setSocketStatus("connecting");
                        const API_URL =
                          process.env.NEXT_PUBLIC_API_URL ||
                          "https://dbms-o3mb.onrender.com";

                        const { io } = await import("socket.io-client");

                        const socket = io(API_URL, {
                          transports: ["websocket", "polling"],
                          withCredentials: true,
                          reconnectionAttempts: 10,
                          reconnectionDelay: 1000,
                          timeout: 20000,
                          forceNew: true,
                        });

                        socketRef.current = socket;

                        // Re-attach all event handlers
                        socket.on("connect", () => {
                          console.log("Socket reconnected!");
                          setSocketStatus("connected");
                        });

                        // Re-attach other handlers...
                      } catch (err) {
                        console.error("Error reconnecting socket:", err);
                        setSocketStatus("error");
                      }
                    };

                    setupSocketConnection();
                  }
                }}
                className="ml-2 px-2 py-1 text-xs bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
              >
                Reconnect
              </button>
            )}
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

        {/* Date Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">
                Filter by Date Range
              </h3>
            </div>
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
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
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {startDate === endDate
                      ? `On ${new Date(startDate).toLocaleDateString()}`
                      : `From ${new Date(
                          startDate
                        ).toLocaleDateString()} to ${new Date(
                          endDate
                        ).toLocaleDateString()}`}
                  </p>
                  <div className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
                    {dashboardData.activeTrips
                      ? `${dashboardData.activeTrips} active now`
                      : "0 active"}
                  </div>
                </div>
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
                  {metrics.activeDrivers}/{metrics.totalDrivers}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(
                    (metrics.activeDrivers /
                      Math.max(metrics.totalDrivers, 1)) *
                      100
                  )}
                  % drivers currently assigned
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                  <div
                    className="h-2 rounded-full bg-primary-500"
                    style={{
                      width: `${
                        (metrics.activeDrivers /
                          Math.max(metrics.totalDrivers, 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Two Column Layout for Alerts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Safety Alerts */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-primary-500 mr-2" />
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Safety Violations
                      </h2>
                    </div>
                    <button
                      onClick={handleViewAllIncidents}
                      className="flex items-center text-primary-500 hover:text-primary-600 text-sm font-medium"
                    >
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  <div className="p-6">
                    {dashboardData.alerts && dashboardData.alerts.length > 0 ? (
                      <div
                        className="space-y-4 max-h-[400px] overflow-y-auto pr-2"
                        style={{
                          scrollbarWidth: "thin",
                          scrollbarColor: "#CBD5E0 #EDF2F7",
                        }}
                      >
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
                                {getAlertIcon(alert.incident_no)}
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
                                    Vehicle: {alert.vehicleNumber}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end mt-3 space-x-2">
                              <button
                                onClick={() =>
                                  handleViewDriverDetails(alert.driverName)
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
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-primary-500 mr-2" />
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Recent Activity
                      </h2>
                    </div>
                  </div>
                  <div className="relative p-6">
                    <div className="absolute left-11 top-6 h-[calc(100%-48px)] w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                    <div
                      className="space-y-6 max-h-[400px] overflow-y-auto pr-2"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#CBD5E0 #EDF2F7",
                      }}
                    >
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
                                  : activity.type === "trip_start"
                                  ? "bg-blue-100 dark:bg-blue-900"
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
                                <span>
                                  {activity.displayTime ||
                                    (activity.timestamp &&
                                      new Date(
                                        activity.timestamp
                                      ).toLocaleTimeString()) ||
                                    "Unknown time"}
                                </span>
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
