/* eslint-disable react-hooks/exhaustive-deps */
// app/context/NotificationsContext.js

"use client";
import React, { createContext, useState, useEffect, useRef, useContext } from "react";
import { getLatestIncident } from "../utils/api";

// Mapping for incident types and their details with enhanced information
const INCIDENT_TYPES = {
  1: {
    type: "PHONE_USAGE",
    message: "Phone usage detected",
    severity: "high",
    title: "Phone Usage Alert",
    icon: "📱",
    sound: "alert-high.mp3",
    description: "Driver is using phone while driving",
    action: "Immediately contact driver to stop phone usage",
    riskFactor: 0.85,
    recommendations: [
      "Immediate contact required",
      "Schedule safety training",
      "Review company policy"
    ]
  },
  2: {
    type: "CIGARETTE",
    message: "Cigarette usage detected",
    severity: "medium",
    title: "Smoking Alert",
    icon: "🚬",
    sound: "alert-medium.mp3",
    description: "Driver is smoking while driving",
    action: "Remind driver of company no-smoking policy",
    riskFactor: 0.65,
    recommendations: [
      "Issue verbal warning",
      "Document incident",
      "Review smoking policy"
    ]
  },
  3: {
    type: "SEATBELT",
    message: "Seatbelt violation detected",
    severity: "medium",
    title: "Seatbelt Alert",
    icon: "⚠️",
    sound: "alert-medium.mp3",
    description: "Driver is not wearing seatbelt",
    action: "Remind driver to secure seatbelt immediately",
    riskFactor: 0.75,
    recommendations: [
      "Immediate reminder to driver",
      "Document incident",
      "Review safety protocol"
    ]
  },
  4: {
    type: "DROWSINESS",
    message: "Driver drowsiness detected",
    severity: "high",
    title: "Drowsiness Alert",
    icon: "😴",
    sound: "alert-high.mp3", 
    description: "Driver appears to be drowsy",
    action: "Direct driver to pull over safely and rest",
    riskFactor: 0.9,
    recommendations: [
      "Emergency contact protocol",
      "Request immediate rest stop",
      "Schedule shift adjustment"
    ]
  },
  5: {
    type: "DISTRACTION",
    message: "Driver distraction detected",
    severity: "medium",
    title: "Distraction Alert",
    icon: "👀",
    sound: "alert-medium.mp3",
    description: "Driver is distracted from the road",
    action: "Contact driver to regain focus on driving",
    riskFactor: 0.7,
    recommendations: [
      "Immediate attention alert",
      "Review distraction sources",
      "Consider cabin modifications"
    ]
  }
};

// Create the notifications context
export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertIncident, setAlertIncident] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    desktop: true,
    sound: true,
    inApp: true,
    autoHide: true,
    autoHideDelay: 10000,
    desktopClickAction: 'focus',
    highPriorityOnly: false,
    groupBySeverity: true
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [socketStatus, setSocketStatus] = useState('disconnected');
  const [loadingInitial, setLoadingInitial] = useState(true);
  
  const socketRef = useRef(null);
  const audioRef = useRef(null);
  const highAlertAudioRef = useRef(null);
  const mediumAlertAudioRef = useRef(null);
  const lowAlertAudioRef = useRef(null);

  // Notification permission and setup
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Load notification history from localStorage
    try {
      const storedHistory = localStorage.getItem('notificationHistory');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        setNotificationHistory(parsedHistory);
        setUnreadCount(parsedHistory.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error("Failed to load notification history:", error);
    }
    
    // Setup audio for notification sounds with preloading
    highAlertAudioRef.current = new Audio("/sounds/alert-high.mp3");
    mediumAlertAudioRef.current = new Audio("/sounds/alert-medium.mp3");
    lowAlertAudioRef.current = new Audio("/sounds/alert-low.mp3");
    
    // Preload sounds
    highAlertAudioRef.current.load();
    mediumAlertAudioRef.current.load();
    lowAlertAudioRef.current.load();
    
    // Default to high alert sound
    audioRef.current = highAlertAudioRef.current;
    
    // Check for stored settings
    try {
      const storedSettings = localStorage.getItem('notificationSettings');
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
    
    // Fetch latest incident to show any recent alerts
    fetchLatestIncident()
      .finally(() => {
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
    if (typeof window !== 'undefined' && notificationHistory.length > 0) {
      try {
        localStorage.setItem('notificationHistory', JSON.stringify(notificationHistory.slice(0, 100)));
      } catch (error) {
        console.error("Failed to save notification history:", error);
      }
    }
  }, [notificationHistory]);

  // Save settings when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      } catch (error) {
        console.error("Failed to save notification settings:", error);
      }
    }
  }, [notificationSettings]);

  // Set up socket connection for real-time notifications
  const setupSocketConnection = async () => {
    try {
      // Only import socket.io-client on client side
      if (typeof window === 'undefined') return;
      
      setSocketStatus('connecting');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://dbms-o3mb.onrender.com";
      
      // Dynamically import socket.io-client
      const { io } = await import('socket.io-client');
      
      const socket = io(API_URL, {
        transports: ["websocket"],
        withCredentials: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000
      });
      
      socketRef.current = socket;
      
      // Setup event listeners
      socket.on("connect", () => {
        console.log("Socket connected!");
        setSocketStatus('connected');
      });
      
      socket.on("disconnect", () => {
        console.log("Socket disconnected!");
        setSocketStatus('disconnected');
      });
      
      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
        setSocketStatus('error');
      });
      
      // Listen for new incidents
      socket.on("newIncident", (incident) => {
        console.log("Received new incident:", incident);
        
        // Check if we should process this incident
        if (notificationSettings.highPriorityOnly) {
          const incidentInfo = getIncidentInfo(incident.incidentNo);
          if (incidentInfo?.severity !== "high") {
            console.log("Ignoring non-high priority incident due to settings");
            return;
          }
        }
        
        processNewIncident(incident);
      });
      
      console.log("Socket connection setup completed");
    } catch (error) {
      console.error("Failed to setup socket connection:", error);
      setSocketStatus('error');
    }
  };

  // Attempt to reconnect socket if disconnected
  const reconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    setupSocketConnection();
  };

  // Process newly received incidents
  const processNewIncident = (incident) => {
    if (!incident) return;
    
    // Store incident for display
    setAlertIncident(incident);
    setShowAlert(true);
    
    // Get incident info for additional details
    const incidentInfo = getIncidentInfo(incident.incidentNo);
    
    // Select appropriate sound based on severity
    if (notificationSettings.sound) {
      if (incidentInfo?.severity === "high") {
        audioRef.current = highAlertAudioRef.current;
      } else if (incidentInfo?.severity === "medium") {
        audioRef.current = mediumAlertAudioRef.current;
      } else {
        audioRef.current = lowAlertAudioRef.current;
      }
    }
    
    // Add to notification history
    const newNotification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      incident: incident,
      read: false,
      timestamp: new Date().toISOString(),
      type: incidentInfo?.type || "UNKNOWN",
      severity: incidentInfo?.severity || "medium",
    };
    
    setNotificationHistory(prev => [newNotification, ...prev].slice(0, 100)); // Keep last 100
    setUnreadCount(prev => prev + 1);
    
    // Show desktop notification if enabled
    if (notificationsEnabled && notificationSettings.desktop) {
      showDesktopNotification(incident);
    }
    
    // Play sound if enabled
    if (notificationSettings.sound && audioRef.current) {
      audioRef.current.play().catch(err => console.log("Error playing sound:", err));
    }
    
    // Auto-hide alert after delay if enabled
    if (notificationSettings.autoHide) {
      setTimeout(() => {
        setShowAlert(false);
      }, notificationSettings.autoHideDelay);
    }
  };

  // Fetch the latest incident on initial load
  const fetchLatestIncident = async () => {
    try {
      const response = await getLatestIncident();
      if (response && response.incident) {
        const incidentTime = new Date(response.incident.timestamp);
        const now = new Date();
        const timeDiff = (now - incidentTime) / 1000 / 60; // in minutes
        
        if (timeDiff < 5) { // Show if less than 5 minutes old
          setAlertIncident(response.incident);
          setShowAlert(true);
          
          // Auto-hide after delay if enabled
          if (notificationSettings.autoHide) {
            setTimeout(() => {
              setShowAlert(false);
            }, notificationSettings.autoHideDelay);
          }
        }
      }
      return response;
    } catch (error) {
      console.error("Error fetching latest incident:", error);
      throw error;
    }
  };

  // Show a browser notification
  const showDesktopNotification = (incident) => {
    if (!("Notification" in window)) return;
    
    const incidentInfo = getIncidentInfo(incident.incidentNo);
    
    try {
      const notification = new Notification(incidentInfo?.title || "Safety Alert", {
        body: `${incident.driverName}: ${incidentInfo?.message || "Safety violation detected"}`,
        icon: "/logo.png",
        tag: `safety-alert-${Date.now()}`,
        vibrate: [200, 100, 200],
        badge: "/icon-badge.png",
        requireInteraction: incidentInfo?.severity === "high",
        // Add actions for quick responses
        actions: [
          { action: 'view', title: 'View Details' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
      });
      
      // Handle notification click
      notification.onclick = () => {
        switch (notificationSettings.desktopClickAction) {
          case 'focus':
            window.focus();
            break;
          case 'driverDetails':
            window.location.href = `/driver-details?driverId=${incident.driverId}`;
            break;
          default:
            window.focus();
        }
        notification.close();
      };
      
      // Auto close after delay for non-critical alerts
      if (incidentInfo?.severity !== "high") {
        setTimeout(() => notification.close(), 10000);
      }
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  };

  // Request notification permissions
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notifications");
      return false;
    }
    
    if (Notification.permission === "granted") {
      setNotificationsEnabled(true);
      return true;
    }
    
    if (Notification.permission !== "denied") {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setNotificationsEnabled(true);
          return true;
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    }
    
    return false;
  };

  // Update notification settings
  const updateNotificationSettings = (newSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  // Close the current alert
  const closeCurrentAlert = () => {
    setShowAlert(false);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotificationHistory(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // Mark a specific notification as read
  const markAsRead = (notificationId) => {
    setNotificationHistory(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
    updateUnreadCount();
  };

  // Update the unread count based on current notifications
  const updateUnreadCount = () => {
    const count = notificationHistory.filter(notification => !notification.read).length;
    setUnreadCount(count);
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotificationHistory([]);
    setUnreadCount(0);
    
    // Also clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('notificationHistory');
    }
  };

  // Group notifications by severity
  const getGroupedNotifications = () => {
    if (!notificationSettings.groupBySeverity) {
      return { all: notificationHistory };
    }
    
    return notificationHistory.reduce((groups, notification) => {
      const severity = notification.severity || 'medium';
      if (!groups[severity]) {
        groups[severity] = [];
      }
      groups[severity].push(notification);
      return groups;
    }, { high: [], medium: [], low: [] });
  };

  // Get incident type info based on incident number
  const getIncidentInfo = (incidentNo) => {
    return INCIDENT_TYPES[incidentNo] || null;
  };

  // Simulate a test notification for development
  const triggerTestNotification = (incidentType = 1) => {
    const testIncident = {
      incidentNo: incidentType,
      driverName: "Test Driver",
      driverId: "test-driver-123",
      vehicleNumber: "TEST-1234",
      timestamp: new Date().toISOString(),
      location: "Test Location",
      status: "ACTIVE"
    };
    
    processNewIncident(testIncident);
  };

  // Value to be provided by the context
  const contextValue = {
    showAlert,
    alertIncident,
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
    closeCurrentAlert,
    markAllAsRead,
    markAsRead,
    clearAllNotifications,
    reconnectSocket,
    triggerTestNotification
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
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};