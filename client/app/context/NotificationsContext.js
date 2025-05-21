/* eslint-disable react-hooks/exhaustive-deps */
// app/context/NotificationsContext.js

"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import { getLatestIncident } from "../utils/api";
import { INCIDENT_TYPES, getIncidentInfo } from "../utils/incidentUtils";

// Create the notifications context
export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState(null); // Renamed from alertIncident to handle both incidents and trips
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    desktop: true,
    sound: true,
    inApp: true,
    autoHide: true,
    autoHideDelay: 10000,
    desktopClickAction: "focus",
    highPriorityOnly: false,
    groupBySeverity: true,
    showTripNotifications: true, // Added to control trip notifications
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [socketStatus, setSocketStatus] = useState("disconnected");
  const [loadingInitial, setLoadingInitial] = useState(true);

  const socketRef = useRef(null);
  const audioRef = useRef(null);
  const highAlertAudioRef = useRef(null);
  const mediumAlertAudioRef = useRef(null);
  const lowAlertAudioRef = useRef(null);
  const tripAudioRef = useRef(null); // New audio for trip notifications

  // Fetch latest incident to display on load
  const fetchLatestIncident = async () => {
    try {
      const latestIncident = await getLatestIncident();
      if (latestIncident && latestIncident.id) {
        // Process this incident as if it just arrived
        processNewIncident(latestIncident);
      }
    } catch (error) {
      console.error("Error fetching latest incident:", error);
    }
  };

  // Group notifications by type or severity
  const getGroupedNotifications = () => {
    if (!notificationSettings.groupBySeverity || !notificationHistory.length) {
      return notificationHistory;
    }

    // Group by severity
    const groups = {
      high: [],
      medium: [],
      low: [],
      trip: [],
    };

    // Sort notifications into groups
    notificationHistory.forEach((notification) => {
      if (notification.alertType === "trip") {
        groups.trip.push(notification);
      } else if (notification.severity === "high") {
        groups.high.push(notification);
      } else if (notification.severity === "medium") {
        groups.medium.push(notification);
      } else {
        groups.low.push(notification);
      }
    });

    // Flatten groups in priority order
    return [...groups.high, ...groups.medium, ...groups.low, ...groups.trip];
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotificationHistory((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // Mark a specific notification as read
  const markAsRead = (notificationId) => {
    setNotificationHistory((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotificationHistory([]);
    setUnreadCount(0);
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    setNotificationsEnabled(permission === "granted");
    return permission === "granted";
  };

  // Update notification settings
  const updateNotificationSettings = (newSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  // Trigger a test notification
  const triggerTestNotification = () => {
    const testIncident = {
      id: `test-${Date.now()}`,
      driverId: 1,
      driverName: "Test Driver",
      vehicleId: 1,
      vehicleNumber: "TEST-001",
      incidentNo: Math.floor(Math.random() * 4) + 1,
      timestamp: new Date().toISOString(),
    };

    processNewIncident(testIncident);
  };

  // Set up socket connection for real-time notifications
  const setupSocketConnection = async () => {
    try {
      // Only import socket.io-client on client side
      if (typeof window === "undefined") return;

      setSocketStatus("connecting");
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://dbms-o3mb.onrender.com";

      // Dynamically import socket.io-client
      const { io } = await import("socket.io-client");

      const socket = io(API_URL, {
        transports: ["websocket", "polling"], // Add polling as fallback
        withCredentials: true,
        reconnectionAttempts: 10, // Increased attempts
        reconnectionDelay: 1000,
        timeout: 20000, // Increased timeout
        forceNew: true, // Force a new connection on each attempt
      });

      socketRef.current = socket;

      // Setup event listeners
      socket.on("connect", () => {
        console.log("Socket connected for notifications!");
        setSocketStatus("connected");

        // Send a ping to keep the connection alive
        const pingInterval = setInterval(() => {
          if (socket.connected) {
            socket.emit("ping", { timestamp: new Date().toISOString() });
          } else {
            clearInterval(pingInterval);
          }
        }, 30000);

        // Clear interval on disconnect
        socket.on("disconnect", () => {
          clearInterval(pingInterval);
        });
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected!");
        setSocketStatus("disconnected");

        // Auto-reconnect after a delay
        setTimeout(() => {
          if (socketRef.current && !socketRef.current.connected) {
            console.log("Auto-reconnecting socket...");
            socketRef.current.connect();
          }
        }, 5000);
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

      // Listen for new incidents with enhanced error handling
      socket.on("newIncident", (incident) => {
        try {
          console.log("Received new incident notification:", incident);

          // Validate data and normalize field names
          if (!incident) {
            console.error("Invalid incident data received: empty incident");
            return;
          }
          
          // Normalize the incident number field
          const incidentNo = incident.incidentNo || incident.incident_no;
          
          if (!incidentNo) {
            console.error("Invalid incident data: no incident number found", incident);
            return;
          }
          
          // Create normalized incident object to ensure consistent field names
          const normalizedIncident = {
            id: incident.id || Date.now(),
            driverId: incident.driverId || incident.driver_id,
            driverName: incident.driverName || incident.driver_name || "Unknown Driver",
            vehicleId: incident.vehicleId || incident.vehicle_id,
            vehicleNumber: incident.vehicleNumber || incident.vehicle_number || "Unknown Vehicle",
            incidentNo: incidentNo,
            timestamp: incident.timestamp || incident.created_at || incident.incident_date || new Date().toISOString(),
          };

          console.log("Normalized incoming incident:", normalizedIncident);

          // Check if we should process this incident
          if (notificationSettings.highPriorityOnly) {
            const incidentInfo = getIncidentInfo(normalizedIncident.incidentNo);
            if (incidentInfo?.severity !== "high") {
              console.log(
                "Ignoring non-high priority incident due to settings"
              );
              return;
            }
          }

          processNewIncident(normalizedIncident);
        } catch (error) {
          console.error("Error processing incident notification:", error);
        }
      });

      // Listen for trip updates
      socket.on("tripUpdate", (tripEvent) => {
        try {
          console.log("Received trip update notification:", tripEvent);

          // Validate data
          if (!tripEvent || !tripEvent.type) {
            console.error("Invalid trip data received:", tripEvent);
            return;
          }

          // Only process if trip notifications are enabled
          if (notificationSettings.showTripNotifications) {
            processTripUpdate(tripEvent);
          } else {
            console.log("Trip notifications disabled in settings");
          }
        } catch (error) {
          console.error("Error processing trip notification:", error);
        }
      });

      // Server pong response handler
      socket.on("pong", (data) => {
        console.log("Received pong from server");
      });

      console.log("Socket connection setup completed with enhanced config");
    } catch (error) {
      console.error("Failed to setup socket connection:", error);
      setSocketStatus("error");
    }
  };

  // Process newly received incidents
  const processNewIncident = (incident) => {
    if (!incident) return;

    console.log("Processing new incident:", incident);

    // Normalize field names to ensure consistency
    const normalizedIncident = {
      id: incident.id || Date.now(),
      driverId: incident.driverId || incident.driver_id,
      driverName:
        incident.driverName || incident.driver_name || "Unknown Driver",
      vehicleId: incident.vehicleId || incident.vehicle_id,
      vehicleNumber:
        incident.vehicleNumber || incident.vehicle_number || "Unknown Vehicle",
      incidentNo: incident.incidentNo || incident.incident_no,
      timestamp:
        incident.timestamp ||
        incident.created_at ||
        incident.incident_date ||
        new Date().toISOString(),
    };

    console.log("Normalized incident data:", normalizedIncident);

    // Store incident for display
    setAlertData({
      ...normalizedIncident,
      alertType: "incident",
      alertTitle: "SAFETY ALERT",
    });
    setShowAlert(true);

    // Get incident info for additional details
    const incidentInfo = getIncidentInfo(normalizedIncident.incidentNo);
    if (!incidentInfo) {
      console.error(
        `No incident info found for incident number: ${normalizedIncident.incidentNo}`
      );
    } else {
      console.log("Found incident info:", incidentInfo);
    }

    // Select appropriate sound based on severity
    if (notificationSettings.sound) {
      if (incidentInfo?.severity === "high") {
        audioRef.current = highAlertAudioRef.current;
      } else if (incidentInfo?.severity === "medium") {
        audioRef.current = mediumAlertAudioRef.current;
      } else {
        audioRef.current = lowAlertAudioRef.current;
      }

      // Play the sound immediately
      if (audioRef.current) {
        audioRef.current
          .play()
          .catch((err) => console.log("Error playing sound:", err));
      }
    }

    // Add to notification history
    const newNotification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      incident: normalizedIncident,
      read: false,
      timestamp: new Date(normalizedIncident.timestamp).toISOString(),
      type: incidentInfo?.type || "UNKNOWN",
      severity: incidentInfo?.severity || "medium",
      alertType: "incident",
      message: `${normalizedIncident.driverName}: ${
        incidentInfo?.message || "Safety incident detected"
      }`,
    };

    console.log("Adding notification to history:", newNotification);

    setNotificationHistory((prev) => [newNotification, ...prev].slice(0, 100)); // Keep last 100
    setUnreadCount((prev) => prev + 1);

    // Show desktop notification
    showDesktopNotification({
      title: "SAFETY ALERT!",
      body: `${normalizedIncident.driverName}: ${
        incidentInfo?.message || "Safety incident detected"
      }`,
      tag: `incident-${normalizedIncident.id}`,
      requireInteraction: true,
      icon: "/favicon.ico",
    });

    // Auto-hide alert after delay if enabled
    if (notificationSettings.autoHide) {
      setTimeout(() => {
        setShowAlert(false);
      }, notificationSettings.autoHideDelay);
    }
  };

  // Process trip updates
  const processTripUpdate = (tripEvent) => {
    if (!tripEvent) return;

    const isStart = tripEvent.type === "trip_started";
    const message = isStart
      ? `${tripEvent.driver_name || "Driver"} started a trip with ${
          tripEvent.vehicle_number || "vehicle"
        }`
      : `${tripEvent.driver_name || "Driver"} completed a trip with ${
          tripEvent.vehicle_number || "vehicle"
        }${tripEvent.distance ? ` (${tripEvent.distance}km)` : ""}`;

    // Store trip data for display
    setAlertData({
      ...tripEvent,
      alertType: "trip",
      alertTitle: isStart ? "TRIP STARTED" : "TRIP COMPLETED",
      message: message,
    });
    setShowAlert(true);

    // Use trip audio notification
    if (notificationSettings.sound && tripAudioRef.current) {
      tripAudioRef.current
        .play()
        .catch((err) => console.log("Error playing sound:", err));
    }

    // Add to notification history
    const newNotification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      trip: tripEvent,
      read: false,
      timestamp: new Date().toISOString(),
      type: isStart ? "TRIP_START" : "TRIP_END",
      severity: "low",
      alertType: "trip",
      message: message,
    };

    setNotificationHistory((prev) => [newNotification, ...prev].slice(0, 100));
    setUnreadCount((prev) => prev + 1);

    // Show desktop notification
    showDesktopNotification({
      title: isStart ? "Trip Started" : "Trip Completed",
      body: message,
      tag: `trip-${tripEvent.trip_id || Date.now()}`,
      requireInteraction: false,
      icon: "/favicon.ico",
    });

    // Auto-hide after a shorter delay for trip notifications
    if (notificationSettings.autoHide) {
      setTimeout(() => {
        setShowAlert(false);
      }, 6000); // Shorter time for trip notifications
    }
  };

  // Show desktop notification with enhanced reliability
  const showDesktopNotification = (options) => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notifications");
      return;
    }

    if (Notification.permission === "granted") {
      try {
        // Use setTimeout to ensure notification is shown even when tab is inactive
        setTimeout(() => {
          const notification = new Notification(options.title, {
            body: options.body,
            icon: options.icon || "/favicon.ico",
            tag: options.tag,
            requireInteraction: options.requireInteraction || false,
            silent: false, // Use browser's sound instead of our custom one
            vibrate: [200, 100, 200], // Vibration pattern for mobile devices
          });

          notification.onclick = () => {
            window.focus();
            notification.close();

            // If the user clicked the notification, close the in-app alert too
            setShowAlert(false);
          };
        }, 0);
      } catch (err) {
        console.error("Failed to show desktop notification:", err);
      }
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          showDesktopNotification(options);
        }
      });
    }
  };

  // Initialize notification system
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Load notification history from localStorage
    try {
      const storedHistory = localStorage.getItem("notificationHistory");
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        setNotificationHistory(parsedHistory);
        setUnreadCount(parsedHistory.filter((n) => !n.read).length);
      }
    } catch (error) {
      console.error("Failed to load notification history:", error);
    }

    // Setup audio for notification sounds with preloading
    highAlertAudioRef.current = new Audio("/sounds/alert-high.mp3");
    mediumAlertAudioRef.current = new Audio("/sounds/alert-medium.mp3");
    lowAlertAudioRef.current = new Audio("/sounds/alert-low.mp3");
    tripAudioRef.current = new Audio("/sounds/notification.mp3");

    // Preload sounds
    highAlertAudioRef.current.load();
    mediumAlertAudioRef.current.load();
    lowAlertAudioRef.current.load();
    tripAudioRef.current.load();

    // Set volumes
    highAlertAudioRef.current.volume = 1.0;
    mediumAlertAudioRef.current.volume = 0.8;
    lowAlertAudioRef.current.volume = 0.6;
    tripAudioRef.current.volume = 0.7;

    // Default to high alert sound
    audioRef.current = highAlertAudioRef.current;

    // Check for stored settings
    try {
      const storedSettings = localStorage.getItem("notificationSettings");
      if (storedSettings) {
        setNotificationSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error("Failed to load notification settings:", error);
    }

    // Check notification permission
    const checkPermission = async () => {
      if (!("Notification" in window)) {
        console.log("This browser does not support desktop notifications");
        return false;
      }

      if (Notification.permission === "granted") {
        setNotificationsEnabled(true);
        return true;
      }

      return false;
    };

    checkPermission();

    // Request notification permission immediately if not yet granted
    if (
      "Notification" in window &&
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setNotificationsEnabled(true);
        }
      });
    }

    // Fetch latest incident to show any recent alerts
    fetchLatestIncident().finally(() => {
      setLoadingInitial(false);
    });

    // Setup socket connection
    setupSocketConnection();

    return () => {
      // Cleanup socket connection on unmount
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Save notification history when it changes
  useEffect(() => {
    if (typeof window !== "undefined" && notificationHistory.length > 0) {
      try {
        localStorage.setItem(
          "notificationHistory",
          JSON.stringify(notificationHistory.slice(0, 100))
        );
      } catch (error) {
        console.error("Failed to save notification history:", error);
      }
    }
  }, [notificationHistory]);

  // Save settings when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "notificationSettings",
          JSON.stringify(notificationSettings)
        );
      } catch (error) {
        console.error("Failed to save notification settings:", error);
      }
    }
  }, [notificationSettings]);

  // Value to be provided by the context
  const contextValue = {
    showAlert,
    alertData, // Renamed from alertIncident to handle both types
    notificationsEnabled,
    notificationSettings,
    notificationHistory,
    unreadCount,
    socketStatus,
    loadingInitial,
    getIncidentInfo,
    getGroupedNotifications,
    requestNotificationPermission,
    updateNotificationSettings,
    closeCurrentAlert: () => setShowAlert(false),
    markAllAsRead,
    markAsRead,
    clearAllNotifications,
    reconnectSocket: setupSocketConnection,
    triggerTestNotification,
  };

  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook for using the notifications context
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};
