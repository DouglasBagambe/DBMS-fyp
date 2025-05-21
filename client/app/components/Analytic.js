// src/components/Analytic.js

"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Bell,
  AlertTriangle,
  Car,
  Clock,
  Eye,
  XCircle,
  Phone,
  Moon,
  Calendar,
  Filter,
  BarChart2,
  Download,
  Info,
  UserCircle,
  ArrowRight,
  Wifi,
  RefreshCw,
  WifiOff,
} from "lucide-react";
import {
  getVehicles,
  getDrivers,
  getDashboardMetrics,
  getIncidents,
  getLatestIncident,
  getAllTrips,
  getTripCounts,
} from "../utils/api";
import {
  calculateSafetyScore,
  getScoreColorScheme,
} from "../utils/safetyScore";
import { useRouter } from "next/navigation";

// Import Chart.js modules
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
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
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Map incident numbers to their respective types and messages
const incidentTypeMap = {
  1: {
    type: "PHONE_USAGE",
    message: "Phone usage detected",
    severity: "high",
    displayName: "Phone Usage",
  },
  2: {
    type: "CIGARETTE",
    message: "Cigarette usage detected",
    severity: "medium",
    displayName: "Cigarette Usage",
  },
  3: {
    type: "SEATBELT",
    message: "Seatbelt violation detected",
    severity: "medium",
    displayName: "Seatbelt Violation",
  },
  4: {
    type: "DROWSINESS",
    message: "Driver drowsiness detected",
    severity: "high",
    displayName: "Drowsiness",
  },
};

// Helper function to get incident type info based on incident_no
const getIncidentTypeInfo = (incidentNo) => {
  return incidentTypeMap[incidentNo] || null;
};

// Helper function to get incident message based on incident number
const getIncidentMessage = (incidentNo) => {
  const info = getIncidentTypeInfo(incidentNo);
  return info ? info.message : "Safety violation detected";
};

// Helper function to get incident severity based on incident number
const getIncidentSeverity = (incidentNo) => {
  const info = getIncidentTypeInfo(incidentNo);
  return info ? info.severity : "low";
};

// Helper function to map incident number to display name
const getIncidentDisplayName = (incidentNo) => {
  const info = getIncidentTypeInfo(incidentNo);
  return info ? info.displayName : "Unknown Violation";
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

const Analytics = () => {
  const router = useRouter();
  const [selectedDateRange, setSelectedDateRange] = useState("7days");
  const [selectedVehicle, setSelectedVehicle] = useState("all");
  const [selectedDriver, setSelectedDriver] = useState("all");
  const [isNotValid, setInNotValid] = useState(false);
  const [analytics, setAnalytics] = useState({
    vehicles: [],
    drivers: [],
    incidents: {
      drowsiness: 0,
      cigarette: 0,
      seatbelt: 0,
      phoneUsage: 0,
    },
    incidentTimeline: [],
    incidentsByVehicle: [],
    incidentsByDriver: [],
    safetyScore: 0,
    safetyRating: "Unknown",
    chartData: [],
    safetyDetails: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    vehicleCount: 0,
    activeDriverCount: 0,
    incidentCount: 0,
    totalTripsCount: 0,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertIncident, setAlertIncident] = useState(null);
  const [socketStatus, setSocketStatus] = useState("disconnected");
  const socketRef = useRef(null);
  const [mostCommonViolation, setMostCommonViolation] = useState({
    type: "None",
    count: 0,
    incidentNo: 3,
  });
  const [mostCommonPercentage, setMostCommonPercentage] = useState(0);
  const [totalIncidents, setTotalIncidents] = useState(0);

  // Connect to Socket.io server
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Get API URL from environment or default to production URL
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "https://dbms-o3mb.onrender.com";

    const setupSocketConnection = async () => {
      try {
        setSocketStatus("connecting");

        // Dynamically import socket.io-client only on the client side
        const { io } = await import("socket.io-client");

        const socket = io(API_URL, {
          transports: ["websocket"],
          withCredentials: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          console.log("Socket connected for Analytics!");
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
          console.log("Received new incident in Analytics:", incident);

          // Set the alert data
          setAlertIncident(incident);
          setShowAlert(true);

          // Update the incident timeline with the new incident
          setAnalytics((prevAnalytics) => {
            // Format the incident for display
            const formattedIncident = {
              id: incident.id || `incident-${Date.now()}`,
              driverId: incident.driverId || incident.driver_id,
              driverName:
                incident.driverName || incident.driver_name || "Unknown Driver",
              vehicleNumber:
                incident.vehicleNumber ||
                incident.vehicle_number ||
                "Unknown Vehicle",
              incidentNo: incident.incidentNo || incident.incident_no,
              type:
                getIncidentTypeInfo(incident.incidentNo || incident.incident_no)
                  ?.type || "UNKNOWN",
              timestamp:
                incident.timestamp ||
                incident.created_at ||
                new Date().toISOString(),
              formattedTime: new Date(
                incident.timestamp || incident.created_at || new Date()
              ).toLocaleString(),
              severity: getIncidentSeverity(
                incident.incidentNo || incident.incident_no
              ),
              message: `${
                incident.driverName || incident.driver_name
              }: ${getIncidentMessage(
                incident.incidentNo || incident.incident_no
              )}`,
            };

            // Add to timeline and keep only the most recent ones
            const updatedTimeline = [
              formattedIncident,
              ...prevAnalytics.incidentTimeline.slice(0, 9),
            ];

            // Update incident counts
            const updatedIncidents = { ...prevAnalytics.incidents };
            switch (Number(incident.incidentNo || incident.incident_no)) {
              case 1: // Phone usage
                updatedIncidents.phoneUsage++;
                break;
              case 2: // Cigarette
                updatedIncidents.cigarette++;
                break;
              case 3: // Seatbelt
                updatedIncidents.seatbelt++;
                break;
              case 4: // Drowsiness
                updatedIncidents.drowsiness++;
                break;
            }

            return {
              ...prevAnalytics,
              incidents: updatedIncidents,
              incidentTimeline: updatedTimeline,
            };
          });

          // Update metrics count
          setMetrics((prevMetrics) => ({
            ...prevMetrics,
            incidentCount: prevMetrics.incidentCount + 1,
          }));

          // Auto-hide the alert after 10 seconds
          setTimeout(() => {
            setShowAlert(false);
          }, 10000);
        });

        // Listen for trip updates
        socket.on("tripUpdate", (tripEvent) => {
          console.log("Received trip update in Analytics:", tripEvent);

          // Format the trip event for display
          const formattedEvent = {
            id: `trip-${tripEvent.trip_id || Date.now()}`,
            driverId: tripEvent.driver_id,
            driverName: tripEvent.driver_name || "Unknown Driver",
            vehicleNumber: tripEvent.vehicle_number || "Unknown Vehicle",
            type: tripEvent.type, // 'trip_started' or 'trip_ended'
            timestamp: tripEvent.timestamp || new Date().toISOString(),
            formattedTime: new Date(
              tripEvent.timestamp || new Date()
            ).toLocaleString(),
            severity: "low", // trips are not violations
            message:
              tripEvent.type === "trip_started"
                ? `${tripEvent.driver_name} started a trip with vehicle ${tripEvent.vehicle_number}`
                : `${tripEvent.driver_name} completed a trip with vehicle ${
                    tripEvent.vehicle_number
                  }${tripEvent.distance ? ` (${tripEvent.distance} km)` : ""}${
                    tripEvent.duration_minutes
                      ? ` in ${tripEvent.duration_minutes} min`
                      : ""
                  }`,
          };

          // Add to timeline and keep only the most recent ones
          setAnalytics((prevAnalytics) => {
            const updatedTimeline = [
              formattedEvent,
              ...prevAnalytics.incidentTimeline.slice(0, 9),
            ];

            return {
              ...prevAnalytics,
              incidentTimeline: updatedTimeline,
            };
          });

          // Update trip metrics when a trip is completed
          if (tripEvent.type === "trip_ended") {
            setMetrics((prevMetrics) => ({
              ...prevMetrics,
              totalTripsCount: prevMetrics.totalTripsCount + 1,
            }));
          }
        });
      } catch (err) {
        console.error("Failed to load socket.io client:", err);
        setSocketStatus("error");
      }
    };

    setupSocketConnection();

    // Fetch latest incident on initial load to display any recent alerts
    const fetchLatestIncident = async () => {
      try {
        const response = await getLatestIncident();
        if (response && response.incident) {
          // Only show alert if incident is less than 1 minute old
          const incidentTime = new Date(response.incident.timestamp);
          const now = new Date();
          const timeDiff = (now - incidentTime) / 1000 / 60; // in minutes

          if (timeDiff < 1) {
            setAlertIncident(response.incident);
            setShowAlert(true);

            // Auto-hide after 10 seconds
            setTimeout(() => {
              setShowAlert(false);
            }, 10000);
          }
        }
      } catch (error) {
        console.error("Error fetching latest incident:", error);
      }
    };

    fetchLatestIncident();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Close alert manually
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

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
        return 7;
    }
  };

  // Fetch and process analytics data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch dashboard metrics, vehicles, drivers, incidents and trips data
        const [
          metricsData,
          vehiclesResponse,
          driversResponse,
          incidentsResponse,
          tripsResponse,
          tripCountsResponse,
        ] = await Promise.all([
          getDashboardMetrics(),
          getVehicles(),
          getDrivers(),
          getIncidents(),
          getAllTrips(),
          getTripCounts(),
        ]);

        // Log what we're filtering by
        console.log(
          `Filtering by - Driver: ${selectedDriver}, Vehicle: ${selectedVehicle}`
        );

        // Update metrics state based on filters
        if (selectedDriver !== "all" || selectedVehicle !== "all") {
          // We'll calculate custom metrics based on selections
          const customMetrics = {
            vehicleCount:
              selectedVehicle !== "all" ? 1 : metricsData.vehicleCount || 0,
            activeDriverCount:
              selectedDriver !== "all" ? 1 : metricsData.activeDriverCount || 0,
            incidentCount: 0, // Will be updated after filtering incidents
            totalTrips: 0, // Will be updated after filtering trips
            activeTrips:
              selectedDriver !== "all" || selectedVehicle !== "all"
                ? 0 // Start with 0 for filtered view
                : tripCountsResponse.active_trips || 0,
          };
          setMetrics(customMetrics);
        } else {
          // Use default metrics when no filters are applied
          setMetrics({
            vehicleCount: metricsData.vehicleCount || 0,
            activeDriverCount: metricsData.activeDriverCount || 0,
            incidentCount: metricsData.incidentCount || 0,
            totalTrips: tripCountsResponse.total_trips || 0,
            activeTrips: tripCountsResponse.active_trips || 0,
          });
        }

        if (!vehiclesResponse.vehicles || !driversResponse.drivers) {
          throw new Error("Failed to load vehicles or drivers data");
        }

        const vehiclesData = vehiclesResponse.vehicles || [];
        const driversData = driversResponse.drivers || [];

        // Debugging - log raw data to understand what's coming from the API
        console.log("Raw vehicles data:", vehiclesData);
        console.log("Raw drivers data:", driversData);

        // Process vehicles data with assigned drivers
        const processedVehicles = vehiclesData.map((vehicle) => {
          const assignedDriver = driversData.find(
            (d) => d.vehicle === vehicle.vehicle_number
          );

          return {
            id: vehicle.id,
            vehicleNumber: vehicle.vehicle_number,
            type: vehicle.type,
            status: vehicle.status,
            driverName: assignedDriver?.name || "Unassigned",
            driverId: assignedDriver?.driver_id || null,
            incidents: assignedDriver?.incidents || 0,
          };
        });

        // Filter vehicles based on selected vehicle (if not "all")
        const filteredVehicles =
          selectedVehicle === "all"
            ? processedVehicles
            : processedVehicles.filter(
                (v) => v.vehicleNumber === selectedVehicle
              );

        // Process drivers data with their assigned vehicles
        const processedDrivers = driversData.map((driver) => {
          const assignedVehicle = vehiclesData.find(
            (v) => v.vehicle_number === driver.vehicle
          );

          return {
            id: driver.id,
            driverId: driver.driver_id,
            name: driver.name,
            vehicleType: assignedVehicle?.type || null,
            vehicleStatus: assignedVehicle?.status || null,
            incidents: driver.incidents || 0,
            vehicle: driver.vehicle || "None",
            lastLogin: driver.last_login,
          };
        });

        // Filter drivers based on selected driver (if not "all")
        const filteredDrivers =
          selectedDriver === "all"
            ? processedDrivers
            : processedDrivers.filter((d) => d.driverId === selectedDriver);

        console.log(`Filtered drivers: ${filteredDrivers.length}`);
        console.log("Selected driver:", selectedDriver);
        console.log("First filtered driver:", filteredDrivers[0]);

        // Initialize incident counters
        const incidentCounts = {
          drowsiness: 0,
          cigarette: 0,
          seatbelt: 0,
          phoneUsage: 0,
        };

        // Process incidents from API response
        let allIncidents = [];
        // Initialize filteredIncidents here to avoid undefined error
        let filteredIncidents = [];

        console.log("DEBUGGING: Processing incidents from API");

        if (incidentsResponse && Array.isArray(incidentsResponse)) {
          // Filter incidents based on selected driver/vehicle if needed
          filteredIncidents = incidentsResponse;

          // Apply driver filter
          if (selectedDriver !== "all") {
            console.log(
              "Sample incidents before filtering:",
              incidentsResponse.slice(0, 3)
            );

            filteredIncidents = filteredIncidents.filter((incident) => {
              if (!incident.driver_id) return false;

              // Convert both to strings for safer comparison
              const incidentDriverId = String(incident.driver_id).trim();
              const selectedDriverId = String(selectedDriver).trim();

              // Log some comparisons for debugging
              if (Math.random() < 0.1) {
                console.log(
                  `Comparing ${incidentDriverId} with ${selectedDriverId}`,
                  incidentDriverId === selectedDriverId
                );
              }

              return incidentDriverId === selectedDriverId;
            });

            console.log(
              `Filtered incidents by driver ${selectedDriver}:`,
              filteredIncidents.length
            );
          }

          // Apply vehicle filter
          if (selectedVehicle !== "all") {
            // Find the vehicle ID corresponding to the selected vehicle number
            const selectedVehicleObj = vehiclesData.find(
              (v) => v.vehicle_number === selectedVehicle
            );

            if (selectedVehicleObj) {
              filteredIncidents = filteredIncidents.filter(
                (incident) => incident.vehicle_id === selectedVehicleObj.id
              );
              console.log(
                `Filtered incidents by vehicle ${selectedVehicle}:`,
                filteredIncidents.length
              );
            }
          }

          console.log(
            `Processing ${filteredIncidents.length} incidents from API`
          );

          // Process each incident
          filteredIncidents.forEach((incident) => {
            // Use the incident_no to determine type
            const incidentNo = Number(incident.incident_no);
            console.log(`Processing incident with incident_no: ${incidentNo}`);

            if (incidentNo) {
              // Count incidents by type
              switch (incidentNo) {
                case 4: // Drowsiness
                  incidentCounts.drowsiness++;
                  break;
                case 2: // Cigarette
                  incidentCounts.cigarette++;
                  break;
                case 3: // Seatbelt
                  incidentCounts.seatbelt++;
                  break;
                case 1: // Phone usage
                  incidentCounts.phoneUsage++;
                  break;
              }

              // Find driver name based on driver_id from filtered drivers
              let driverName = `Driver ${incident.driver_name}`;
              const driver = filteredDrivers.find(
                (d) => String(d.driverId) === String(incident.driver_id)
              );
              if (driver && driver.name) {
                driverName = driver.name;
              }

              // Find vehicle number based on vehicle_id from filtered vehicles
              let vehicleNumber = incident.vehicle_id;
              const vehicle = filteredVehicles.find(
                (v) => v.id === incident.vehicle_id
              );
              if (vehicle) {
                vehicleNumber = vehicle.vehicleNumber;
              }

              // Format the incident for readable display
              const formattedTime = new Date(
                incident.created_at
              ).toLocaleString();

              // Incident message including driver and message
              const incidentMessage = `${driverName}: ${getIncidentMessage(
                incident.incident_no
              )}`;

              allIncidents.push({
                ...incident,
                formattedTime,
                message: incidentMessage,
                severity: getIncidentSeverity(incident.incident_no),
              });
            }
          });

          // If we filtered by driver but found no incidents, create synthetic ones
          if (
            selectedDriver !== "all" &&
            filteredIncidents.length === 0 &&
            filteredDrivers.length > 0
          ) {
            console.log("No incidents found for the selected driver");
            // No synthetic incidents - show actual data only
          }
        } else {
          console.log(
            "No incidents data available from API, showing empty charts"
          );
        }

        // Output incident counts for debugging
        console.log("Processed incident counts:", incidentCounts);

        // Update the incidentTimeline with the filtered incidents
        allIncidents.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        const incidentTimeline = allIncidents.slice(0, 10); // Just take the 10 most recent

        // Convert to percentages for chart
        const calculatedTotalIncidents =
          (incidentCounts.drowsiness || 0) +
          (incidentCounts.cigarette || 0) +
          (incidentCounts.seatbelt || 0) +
          (incidentCounts.phoneUsage || 0);

        // Update the state with the total incident count
        setTotalIncidents(calculatedTotalIncidents);

        // Process and filter trips
        let filteredTrips = [];
        if (tripsResponse && tripsResponse.trips) {
          filteredTrips = tripsResponse.trips;

          // Apply driver filter
          if (selectedDriver !== "all") {
            filteredTrips = filteredTrips.filter(
              (trip) =>
                String(trip.driver_id).trim() === String(selectedDriver).trim()
            );
          }

          // Apply vehicle filter
          if (selectedVehicle !== "all") {
            // Find the vehicle ID corresponding to the selected vehicle number
            const selectedVehicleObj = vehiclesData.find(
              (v) => v.vehicle_number === selectedVehicle
            );

            if (selectedVehicleObj) {
              filteredTrips = filteredTrips.filter(
                (trip) => trip.vehicle_id === selectedVehicleObj.id
              );
            }
          }

          // Update trip count in metrics regardless of filters
          setMetrics((prevMetrics) => ({
            ...prevMetrics,
            totalTripsCount: filteredTrips.filter(
              (trip) => trip.status === "completed"
            ).length,
            activeTrips: filteredTrips.filter(
              (trip) => trip.status === "active"
            ).length,
          }));
        }

        // Use safety score calculation utility
        const safetyScoreData = calculateSafetyScore(
          filteredIncidents,
          filteredTrips,
          {
            timeWindow: getDaysFromRange(selectedDateRange),
            timeDecay: true,
          }
        );

        console.log("Safety score calculation result:", safetyScoreData);

        // Update chart data with percentages
        let chartData = [
          {
            id: "Drowsiness",
            value:
              calculatedTotalIncidents > 0
                ? Math.round(
                    (incidentCounts.drowsiness / calculatedTotalIncidents) * 100
                  )
                : 0,
            color: "hsl(10, 70%, 50%)",
            count: incidentCounts.drowsiness,
            weight: safetyScoreData.incidentBreakdown?.[4]?.penalty || 0,
          },
          {
            id: "Cigarette",
            value:
              calculatedTotalIncidents > 0
                ? Math.round(
                    (incidentCounts.cigarette / calculatedTotalIncidents) * 100
                  )
                : 0,
            color: "hsl(54, 70%, 50%)",
            count: incidentCounts.cigarette,
            weight: safetyScoreData.incidentBreakdown?.[2]?.penalty || 0,
          },
          {
            id: "Seatbelt",
            value:
              calculatedTotalIncidents > 0
                ? Math.round(
                    (incidentCounts.seatbelt / calculatedTotalIncidents) * 100
                  )
                : 0,
            color: "hsl(103, 70%, 50%)",
            count: incidentCounts.seatbelt,
            weight: safetyScoreData.incidentBreakdown?.[3]?.penalty || 0,
          },
          {
            id: "Phone Usage",
            value:
              calculatedTotalIncidents > 0
                ? Math.round(
                    (incidentCounts.phoneUsage / calculatedTotalIncidents) * 100
                  )
                : 0,
            color: "hsl(176, 70%, 50%)",
            count: incidentCounts.phoneUsage,
            weight: safetyScoreData.incidentBreakdown?.[1]?.penalty || 0,
          },
        ];

        // Sort chart data by count (high to low)
        chartData.sort((a, b) => b.count - a.count);

        // Determine most common violation
        let mostCommonViolationType = { type: "None", count: 0, incidentNo: 3 };
        let percentage = 0;

        if (chartData[0] && chartData[0].count > 0) {
          // Find which incident number corresponds to this type
          let incidentNo = 3; // Default to seatbelt
          if (chartData[0].id === "Phone Usage") incidentNo = 1;
          else if (chartData[0].id === "Cigarette Usage") incidentNo = 2;
          else if (chartData[0].id === "Drowsiness") incidentNo = 4;

          mostCommonViolationType = {
            type: chartData[0].id,
            count: chartData[0].count,
            incidentNo: incidentNo,
          };

          // Calculate percentage
          percentage =
            calculatedTotalIncidents > 0
              ? Math.round(
                  (chartData[0].count / calculatedTotalIncidents) * 100
                )
              : 0;
        }

        // Update analytics state with processed data
        setAnalytics({
          vehicles: filteredVehicles,
          drivers: filteredDrivers,
          incidents: incidentCounts,
          incidentTimeline,
          chartData,
          safetyScore: safetyScoreData.score || 0,
          safetyRating: safetyScoreData.rating || "Unknown",
          safetyDetails: safetyScoreData,
        });

        // Update the most common violation state for use in UI
        setMostCommonViolation(mostCommonViolationType);
        setMostCommonPercentage(percentage);

        // Update the incident count in metrics
        if (selectedDriver !== "all" || selectedVehicle !== "all") {
          setMetrics((prevMetrics) => ({
            ...prevMetrics,
            incidentCount: calculatedTotalIncidents,
          }));
        }

        // Group incidents by vehicle
        const incidentsByVehicle = [];
        filteredVehicles.forEach((vehicle) => {
          const vehicleIncidents = incidentTimeline.filter(
            (i) => i.vehicleNumber === vehicle.vehicleNumber
          );

          incidentsByVehicle.push({
            vehicleNumber: vehicle.vehicleNumber,
            incidents: vehicleIncidents.length,
          });
        });

        // Group incidents by driver
        const incidentsByDriver = [];
        filteredDrivers.forEach((driver) => {
          const driverIncidents = incidentTimeline.filter(
            (i) => String(i.driverId) === String(driver.driverId)
          );

          incidentsByDriver.push({
            driverId: driver.driverId,
            driverName: driver.name,
            incidents: driverIncidents.length,
          });
        });

        // Update analytics state - merge with previous state but include the new properties
        setAnalytics((prevState) => ({
          ...prevState,
          vehicles: filteredVehicles,
          drivers: filteredDrivers,
          incidents: incidentCounts,
          incidentTimeline,
          incidentsByVehicle: incidentsByVehicle,
          incidentsByDriver: incidentsByDriver,
          // Keep the other properties we set earlier
          chartData,
          safetyScore: safetyScoreData.score || 0,
          safetyRating: safetyScoreData.rating || "Unknown",
          safetyDetails: safetyScoreData,
        }));
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError(err.message || "Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDateRange, selectedVehicle, selectedDriver]);

  // Get CSS classes for incident severity
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

  // Get colored dot for severity level
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

  // Get icon for incident type
  const getIncidentIcon = (incidentNo) => {
    switch (Number(incidentNo)) {
      case 1: // Phone usage
        return <Phone className="w-5 h-5" />;
      case 4: // Drowsiness
        return <Moon className="w-5 h-5" />;
      case 2: // Cigarette
        return <AlertTriangle className="w-5 h-5" />;
      case 3: // Seatbelt
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  // Get current date in formatted string
  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Navigate to driver details page
  const handleViewDriverDetails = (driverId) => {
    if (!driverId) {
      console.warn("No driver ID provided");
      return;
    }
    router.push(`/driver-details?driverId=${driverId}`);
  };

  // Data for bar chart - incidents by vehicle
  const barChartData = {
    labels: analytics.incidentsByVehicle.map((item) => item.vehicleNumber),
    datasets: [
      {
        label: "Incidents",
        data: analytics.incidentsByVehicle.map((item) => item.incidents),
        backgroundColor: "rgba(59, 130, 246, 0.8)", // Blue
        borderColor: "rgb(37, 99, 235)",
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: "rgba(59, 130, 246, 1)",
      },
    ],
  };

  // Data for pie chart - incident type breakdown
  const pieChartData = {
    labels: [
      getIncidentDisplayName(4), // Drowsiness
      getIncidentDisplayName(2), // Cigarette Usage
      getIncidentDisplayName(3), // Seatbelt Violation
      getIncidentDisplayName(1), // Phone Usage
    ],
    datasets: [
      {
        data: analytics.incidents
          ? [
              analytics.incidents.drowsiness,
              analytics.incidents.cigarette,
              analytics.incidents.seatbelt,
              analytics.incidents.phoneUsage,
            ]
          : [0, 0, 0, 0],
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

  // Options for bar chart
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Incidents by Vehicle",
        font: { size: 16, weight: "bold" },
        color: "#374151",
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#6B7280", font: { size: 12 } },
        grid: { color: "rgba(156, 163, 175, 0.1)", drawBorder: false },
        border: { display: false },
      },
      x: {
        ticks: { color: "#6B7280", font: { size: 12 } },
        grid: { display: false },
        border: { display: false },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  // Options for pie chart
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#374151",
          font: { size: 12 },
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
        align: "center",
      },
      title: {
        display: true,
        text: "Behavior Breakdown",
        font: { size: 16, weight: "bold" },
        color: "#374151",
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
    cutout: "50%",
    layout: {
      padding: 10,
    },
  };

  // Find vehicles with highest and lowest incidents
  const vehicleWithMostIncidents =
    analytics.incidentsByVehicle && analytics.incidentsByVehicle.length > 0
      ? analytics.incidentsByVehicle.reduce(
          (max, vehicle) => (vehicle.incidents > max.incidents ? vehicle : max),
          { incidents: -1, vehicleNumber: "N/A" }
        )
      : { incidents: 0, vehicleNumber: "N/A" };

  const vehicleWithLeastIncidents =
    analytics.incidentsByVehicle && analytics.incidentsByVehicle.length > 0
      ? analytics.incidentsByVehicle.reduce(
          (min, vehicle) => (vehicle.incidents < min.incidents ? vehicle : min),
          { incidents: Infinity, vehicleNumber: "N/A" }
        )
      : { incidents: 0, vehicleNumber: "N/A" };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time incident alert */}
        {showAlert && alertIncident && (
          <div className="fixed top-4 right-4 max-w-md w-full z-50 animate-slide-in-right">
            <div
              className={`rounded-lg p-4 shadow-lg border ${getSeverityStyle(
                getIncidentSeverity(alertIncident.incidentNo)
              )}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div
                    className={`p-2 rounded-lg ${
                      getIncidentSeverity(alertIncident.incidentNo) === "high"
                        ? "bg-red-200 dark:bg-red-800/50"
                        : getIncidentSeverity(alertIncident.incidentNo) ===
                          "medium"
                        ? "bg-amber-200 dark:bg-amber-800/50"
                        : "bg-green-200 dark:bg-green-800/50"
                    } mr-4`}
                  >
                    {getIncidentIcon(alertIncident.incidentNo)}
                  </div>
                  <div>
                    <p className="font-bold text-red-600 dark:text-red-400">
                      LIVE ALERT
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {alertIncident.driverName}:{" "}
                      {getIncidentMessage(alertIncident.incidentNo)}
                    </h3>
                    <div className="mt-1 flex items-center">
                      <Car className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Vehicle: {alertIncident.vehicleNumber}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(alertIncident.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseAlert}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() =>
                    handleViewDriverDetails(alertIncident.driverId)
                  }
                  className="flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-primary-500 text-white hover:bg-primary-600"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Driver Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Safety Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor driver behavior and safety violations
            </p>
          </div>

          {/* Socket Status Indicator */}
          <div className="flex items-center">
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
              <span className="text-sm">
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
                    socketRef.current.connect();
                    setSocketStatus("connecting");
                  }
                }}
                className="ml-2 px-2 py-1 text-xs bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
              >
                Reconnect
              </button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Range
              </label>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
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
                {analytics.vehicles.map((vehicle) => (
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-8">
              <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg text-center">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Most Common Violation
                </h3>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                  {mostCommonViolation.type}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {mostCommonPercentage}% of all violations
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg text-center">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Total Violations
                </h3>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                  {totalIncidents}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  In selected period
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg text-center">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Trips Completed
                </h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {metrics.totalTripsCount || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  In selected period
                </p>
              </div>
              {selectedVehicle !== "all" ? (
                // Show assigned driver for selected vehicle
                <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">
                    Assigned Driver
                  </h3>
                  <div className="text-center py-1">
                    {analytics.vehicles && analytics.vehicles.length > 0 ? (
                      <>
                        <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                          {analytics.vehicles[0]?.driverName || "Unassigned"}
                        </p>
                        <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded mt-1">
                          <Car className="w-4 h-4 text-blue-500 mr-1" />
                          <span className="text-xs text-blue-700 dark:text-blue-400">
                            {selectedVehicle}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No driver assigned
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                // Show driver safety metrics when all vehicles selected
                <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">
                    Driver Safety
                  </h3>
                  <div className="flex justify-between">
                    <div className="text-center flex-1 border-r border-gray-200 dark:border-gray-700 pr-2">
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">
                        Safest Driver
                      </p>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                        {analytics.drivers && analytics.drivers.length > 0
                          ? analytics.drivers
                              .filter(
                                (driver) =>
                                  driver.name && driver.incidents === 0
                              )
                              .map(
                                (driver) => driver.name?.split(" ")[0] || ""
                              )[0] ||
                            analytics.drivers
                              .sort(
                                (a, b) =>
                                  (a.incidents || 0) - (b.incidents || 0)
                              )
                              .filter((d) => d.name)[0]
                              ?.name?.split(" ")[0] ||
                            "N/A"
                          : "N/A"}
                      </p>
                      <div className="inline-flex items-center bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                        <span className="text-xs text-green-700 dark:text-green-400">
                          {analytics.drivers && analytics.drivers.length > 0
                            ? Math.min(
                                ...analytics.drivers.map(
                                  (d) => d.incidents || 0
                                )
                              )
                            : 0}{" "}
                          incidents
                        </span>
                      </div>
                    </div>
                    <div className="text-center flex-1 pl-2">
                      <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">
                        Needs Attention
                      </p>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                        {analytics.drivers && analytics.drivers.length > 0
                          ? analytics.drivers
                              .filter((d) => d.name)
                              .sort(
                                (a, b) =>
                                  (b.incidents || 0) - (a.incidents || 0)
                              )[0]
                              ?.name?.split(" ")[0] || "N/A"
                          : "N/A"}
                      </p>
                      <div className="inline-flex items-center bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded mt-1">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                        <span className="text-xs text-red-700 dark:text-red-400">
                          {analytics.drivers && analytics.drivers.length > 0
                            ? Math.max(
                                ...analytics.drivers.map(
                                  (d) => d.incidents || 0
                                )
                              )
                            : 0}{" "}
                          incidents
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg text-center">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Safety Score
                </h3>
                <p
                  className={`text-3xl font-bold mb-1 ${
                    analytics.safetyScore >= 70
                      ? "text-green-600 dark:text-green-400"
                      : analytics.safetyScore >= 50
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {analytics.safetyScore}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {analytics.safetyRating} rating
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      analytics.safetyScore >= 70
                        ? "bg-green-500"
                        : analytics.safetyScore >= 50
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${analytics.safetyScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Bar Chart */}
              <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-80">
                {analytics.incidentsByVehicle.length > 0 ? (
                  <Bar data={barChartData} options={barChartOptions} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No incident data available
                    </p>
                  </div>
                )}
              </div>

              {/* Pie Chart */}
              <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-80">
                {totalIncidents > 0 ? (
                  <Pie data={pieChartData} options={pieChartOptions} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No incident type data available
                    </p>
                  </div>
                )}
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
                <div className="p-6">
                  {analytics.vehicles.length > 0 ? (
                    <div
                      className="overflow-x-auto overflow-y-auto max-h-[400px]"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#CBD5E0 #EDF2F7",
                      }}
                    >
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-700">
                            <th className="sticky top-0 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
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
                          {analytics.vehicles.map((vehicle) => (
                            <tr
                              key={vehicle.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
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
                  ) : (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                      No vehicle data available
                    </div>
                  )}
                </div>
              </div>

              {/* Incident Timeline */}
              <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-primary-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Incident Timeline
                    </h2>
                  </div>
                  <button
                    onClick={() => router.push("/incidents")}
                    className="flex items-center text-primary-500 hover:text-primary-600 text-sm font-medium"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                <div className="p-6">
                  <div
                    className="space-y-4 max-h-[400px] overflow-y-auto"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#CBD5E0 #EDF2F7",
                    }}
                  >
                    {analytics.incidentTimeline.length > 0 ? (
                      analytics.incidentTimeline.map((incident) => (
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
                              {getIncidentIcon(incident.incidentNo)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900 dark:text-gray-200">
                                  {incident.message}
                                </h4>
                                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                                  <Clock className="w-4 h-4" />
                                  <span>{incident.formattedTime}</span>
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
                            {incident.driverId && (
                              <button
                                onClick={() =>
                                  handleViewDriverDetails(incident.driverId)
                                }
                                className="flex items-center px-3 py-1 text-xs font-medium rounded-md bg-primary-500 text-white hover:bg-primary-600"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Driver Details
                              </button>
                            )}
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
            </div>

            {/* Safety Recommendations */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-6 shadow-sm text-white mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Safety Recommendations
              </h2>
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 bg-opacity-10 rounded-lg p-4 backdrop-blur-sm text-white">
                  <h3 className="font-medium mb-2 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    {mostCommonViolation.incidentNo === 4
                      ? "Implement Rest Break Policy"
                      : mostCommonViolation.incidentNo === 2
                      ? "Enforce No Smoking Policy"
                      : mostCommonViolation.incidentNo === 3
                      ? "Strengthen Seatbelt Enforcement"
                      : mostCommonViolation.incidentNo === 1
                      ? "Address Phone Usage"
                      : "Strengthen Safety Protocols"}
                  </h3>
                  <p className="text-sm text-white/90">
                    {mostCommonViolation.incidentNo === 4
                      ? "Multiple drowsiness incidents detected. Consider implementing mandatory rest breaks for drivers on shifts longer than 4 hours."
                      : mostCommonViolation.incidentNo === 2
                      ? "Cigarette usage violations detected. Implement strict no-smoking policy and provide smoking cessation support."
                      : mostCommonViolation.incidentNo === 3
                      ? "Seatbelt violations detected. Conduct regular safety checks and implement automatic seatbelt reminder system."
                      : mostCommonViolation.incidentNo === 1
                      ? "Phone usage violations detected. Install phone blocking technology and conduct distraction-free driving training."
                      : "Review and reinforce current safety protocols with all drivers. Consider implementing more frequent safety training."}
                  </p>
                </div>

                {/* Additional Safety Tips */}
                <div className="bg-white dark:bg-gray-800 bg-opacity-10 rounded-lg p-4 backdrop-blur-sm text-white">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Driver Training Program
                  </h3>
                  <p className="text-sm text-white/90">
                    Implement comprehensive safety training focusing on{" "}
                    {getIncidentDisplayName(
                      mostCommonViolation.incidentNo
                    ).toLowerCase()}{" "}
                    prevention. Schedule regular refresher courses to reinforce
                    safety protocols.
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
