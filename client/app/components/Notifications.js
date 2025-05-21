// app/components/Notifications.js

"use client";
import React, { useState, useEffect } from "react";
import { useNotifications } from "../context/NotificationsContext";
import {
  X,
  Bell,
  Settings,
  Check,
  CheckCircle,
  AlertTriangle,
  Moon,
  Phone,
  Cigarette,
  Shield,
  Clock,
  Car,
  UserCircle,
  Eye,
  BarChart3,
  Wifi,
  WifiOff,
  RefreshCw,
  Trash2,
  Volume2,
  VolumeX,
  Zap,
  Filter,
  List,
  Ban,
  Info,
} from "lucide-react";

const Notifications = () => {
  const {
    showAlert,
    alertIncident,
    notificationsEnabled,
    notificationHistory,
    notificationSettings,
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
    triggerTestNotification,
  } = useNotifications();

  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showTestOptions, setShowTestOptions] = useState(false);
  const [bellAnimation, setBellAnimation] = useState(false);

  // For animation effects
  const [animateSettings, setAnimateSettings] = useState(false);
  const [animateNotificationBell, setAnimateNotificationBell] = useState(false);

  // Bell animation for new notifications
  useEffect(() => {
    if (unreadCount > 0) {
      setBellAnimation(true);
      const timer = setTimeout(() => setBellAnimation(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  // Toggle notification panel
  const toggleNotificationPanel = () => {
    setShowNotificationPanel(!showNotificationPanel);
    if (!showNotificationPanel && unreadCount > 0) {
      markAllAsRead();
    }
    setShowSettings(false);

    // Animation effect
    setAnimateNotificationBell(true);
    setTimeout(() => setAnimateNotificationBell(false), 500);
  };

  // Toggle settings panel
  const toggleSettings = (e) => {
    e.stopPropagation();
    setShowSettings(!showSettings);

    // Animation effect
    setAnimateSettings(true);
    setTimeout(() => setAnimateSettings(false), 500);
  };

  // Toggle sound settings
  const toggleSound = () => {
    updateNotificationSettings({ sound: !notificationSettings.sound });
  };

  // Toggle auto-hide settings
  const toggleAutoHide = () => {
    updateNotificationSettings({ autoHide: !notificationSettings.autoHide });
  };

  // Toggle high priority only filter
  const toggleHighPriorityOnly = () => {
    updateNotificationSettings({
      highPriorityOnly: !notificationSettings.highPriorityOnly,
    });
  };

  // Toggle grouping by severity
  const toggleGroupBySeverity = () => {
    updateNotificationSettings({
      groupBySeverity: !notificationSettings.groupBySeverity,
    });
    setActiveTab("all"); // Reset to all tab
  };

  // Get severity style for notifications
  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-l-4 border-red-500";
      case "medium":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-l-4 border-amber-500";
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-l-4 border-green-500";
      default:
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-l-4 border-blue-500";
    }
  };

  // Get severity badge style
  const getSeverityBadgeStyle = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200";
      case "medium":
        return "bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200";
      case "low":
        return "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200";
      default:
        return "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200";
    }
  };

  // Get socket status style
  const getSocketStatusStyle = () => {
    switch (socketStatus) {
      case "connected":
        return "text-green-500 dark:text-green-400";
      case "connecting":
        return "text-amber-500 dark:text-amber-400 animate-pulse";
      case "disconnected":
      case "error":
        return "text-red-500 dark:text-red-400";
      default:
        return "text-gray-500 dark:text-gray-400";
    }
  };

  // Get socket status icon
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
        return <Info className="w-4 h-4" />;
    }
  };

  // Get alert icon based on incident type
  const getAlertIcon = (incidentNo) => {
    switch (Number(incidentNo)) {
      case 1: // Phone usage
        return <Phone className="w-5 h-5" />;
      case 4: // Drowsiness
        return <Moon className="w-5 h-5" />;
      case 2: // Cigarette
        return <Cigarette className="w-5 h-5" />;
      case 3: // Seatbelt
        return <Shield className="w-5 h-5" />;
      case 5: // Distraction
        return <Eye className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  // Render notifications based on active tab
  const renderNotifications = () => {
    const groupedNotifications = getGroupedNotifications();

    let notificationsToShow = [];

    if (notificationSettings.groupBySeverity) {
      if (activeTab === "all") {
        notificationsToShow = notificationHistory;
      } else {
        notificationsToShow = groupedNotifications[activeTab] || [];
      }
    } else {
      notificationsToShow = notificationHistory;
    }

    if (notificationsToShow.length === 0) {
      return (
        <div className="py-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 dark:text-green-400 mx-auto mb-4 opacity-75" />
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            No notifications
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            {activeTab !== "all"
              ? `No ${activeTab} priority alerts to display`
              : "You're all caught up!"}
          </p>
          {process.env.NODE_ENV === "development" && (
            <button
              onClick={() => setShowTestOptions(true)}
              className="mt-4 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
            >
              Generate Test Alert
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {notificationsToShow.map((notification) => {
          const incidentInfo = getIncidentInfo(
            notification.incident?.incidentNo
          );

          return (
            <div
              key={notification.id}
              className={`p-3 rounded-lg ${getSeverityStyle(
                incidentInfo?.severity || "medium"
              )} 
              ${notification.read ? "opacity-80" : ""} 
              transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    incidentInfo?.severity === "high"
                      ? "bg-red-200 dark:bg-red-800/50"
                      : incidentInfo?.severity === "medium"
                      ? "bg-amber-200 dark:bg-amber-800/50"
                      : "bg-green-200 dark:bg-green-800/50"
                  }`}
                >
                  {getAlertIcon(notification.incident?.incidentNo)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium">
                      {notification.incident?.driverName}:{" "}
                      {incidentInfo?.message || "Safety alert"}
                    </h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getSeverityBadgeStyle(
                        incidentInfo?.severity
                      )}`}
                    >
                      {incidentInfo?.severity}
                    </span>
                  </div>
                  <div className="mt-1 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400 space-x-2">
                      <Car className="w-3.5 h-3.5" />
                      <span>
                        Vehicle: {notification.incident?.vehicleNumber}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    <p>{incidentInfo?.description}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimestamp(notification.timestamp)}
                    </span>
                    <div className="flex space-x-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() =>
                          (window.location.href = `/driver-details?driverId=${notification.incident?.driverId}`)
                        }
                        className="text-xs px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors flex items-center"
                      >
                        <UserCircle className="w-3 h-3 mr-1" />
                        View Driver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render test notification options
  const renderTestOptions = () => {
    if (!showTestOptions) return null;

    return (
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Test Notifications
          </h4>
          <button
            onClick={() => setShowTestOptions(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => triggerTestNotification(1)}
            className="flex items-center justify-center p-2 text-xs rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
          >
            <Phone className="w-4 h-4 mr-1" />
            Phone Usage
          </button>
          <button
            onClick={() => triggerTestNotification(2)}
            className="flex items-center justify-center p-2 text-xs rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
          >
            <Cigarette className="w-4 h-4 mr-1" />
            Cigarette
          </button>
          <button
            onClick={() => triggerTestNotification(3)}
            className="flex items-center justify-center p-2 text-xs rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
          >
            <Shield className="w-4 h-4 mr-1" />
            Seatbelt
          </button>
          <button
            onClick={() => triggerTestNotification(4)}
            className="flex items-center justify-center p-2 text-xs rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
          >
            <Moon className="w-4 h-4 mr-1" />
            Drowsiness
          </button>
          <button
            onClick={() => triggerTestNotification(5)}
            className="flex items-center justify-center p-2 text-xs col-span-2 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
          >
            <Eye className="w-4 h-4 mr-1" />
            Distraction
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Notification Button with Badge */}
      <div className="relative">
        <button
          onClick={toggleNotificationPanel}
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative ${
            animateNotificationBell ? "animate-pulse" : ""
          }`}
          aria-label="Notifications"
        >
          <Bell
            className={`w-6 h-6 text-gray-700 dark:text-gray-300 ${
              bellAnimation ? "animate-wiggle" : ""
            }`}
          />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full transform translate-x-1/4 -translate-y-1/4">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Panel */}
        {showNotificationPanel && (
          <div className="absolute top-full right-0 mt-2 w-96 max-w-[calc(100vw-24px)] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-fade-in">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              <div className="flex items-center space-x-1">
                <button
                  onClick={toggleSettings}
                  className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    animateSettings ? "animate-spin-once" : ""
                  }`}
                  title="Settings"
                >
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => clearAllNotifications()}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Clear all"
                >
                  <Trash2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => markAllAsRead()}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Mark all as read"
                >
                  <Check className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setShowNotificationPanel(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Socket Status Indicator */}
            <div
              className={`px-4 py-1 text-xs flex items-center justify-end ${getSocketStatusStyle()} border-b border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-center">
                {getSocketStatusIcon()}
                <span className="ml-1">
                  {socketStatus === "connected"
                    ? "Connected"
                    : socketStatus === "connecting"
                    ? "Connecting..."
                    : "Disconnected"}
                </span>
                {(socketStatus === "disconnected" ||
                  socketStatus === "error") && (
                  <button
                    onClick={reconnectSocket}
                    className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Reconnect"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Notification Settings
                </h4>
                {!notificationsEnabled && (
                  <button
                    onClick={requestNotificationPermission}
                    className="flex items-center w-full px-4 py-2 mb-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Enable Desktop Notifications
                  </button>
                )}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                      <Volume2 className="w-4 h-4 mr-2" />
                      Play sound
                    </label>
                    <button
                      onClick={toggleSound}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                        notificationSettings.sound
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          notificationSettings.sound
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      Auto-hide alerts
                    </label>
                    <button
                      onClick={toggleAutoHide}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                        notificationSettings.autoHide
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          notificationSettings.autoHide
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                      <Filter className="w-4 h-4 mr-2" />
                      High priority only
                    </label>
                    <button
                      onClick={toggleHighPriorityOnly}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                        notificationSettings.highPriorityOnly
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          notificationSettings.highPriorityOnly
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                      <List className="w-4 h-4 mr-2" />
                      Group by severity
                    </label>
                    <button
                      onClick={toggleGroupBySeverity}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                        notificationSettings.groupBySeverity
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          notificationSettings.groupBySeverity
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Navigation for filtering notifications */}
            {notificationSettings.groupBySeverity &&
              notificationHistory.length > 0 && (
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      activeTab === "all"
                        ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab("high")}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      activeTab === "high"
                        ? "text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    }`}
                  >
                    High
                  </button>
                  <button
                    onClick={() => setActiveTab("medium")}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      activeTab === "medium"
                        ? "text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400"
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setActiveTab("low")}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      activeTab === "low"
                        ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                    }`}
                  >
                    Low
                  </button>
                </div>
              )}

            {/* Main Notification List */}
            <div
              className="max-h-96 overflow-y-auto p-4 relative"
              style={{ scrollbarWidth: "thin" }}
            >
              {loadingInitial ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                </div>
              ) : (
                renderNotifications()
              )}
            </div>

            {/* Test Notification Options */}
            {renderTestOptions()}
          </div>
        )}
      </div>
      {/* Real-time Alert */}
      {showAlert && alertIncident && (
        <div className="fixed top-4 right-4 max-w-md w-full z-50 animate-fade-in-slide">
          <div
            className={`rounded-lg p-4 shadow-lg border ${getSeverityStyle(
              getIncidentInfo(alertIncident.incidentNo)?.severity || "medium"
            )}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div
                  className={`p-2 rounded-lg ${
                    getIncidentInfo(alertIncident.incidentNo)?.severity ===
                    "high"
                      ? "bg-red-200 dark:bg-red-800/50"
                      : getIncidentInfo(alertIncident.incidentNo)?.severity ===
                        "medium"
                      ? "bg-amber-200 dark:bg-amber-800/50"
                      : "bg-green-200 dark:bg-green-800/50"
                  } mr-4`}
                >
                  {getAlertIcon(alertIncident.incidentNo)}
                </div>
                <div>
                  <div className="flex items-center">
                    <h4 className="font-semibold text-base">
                      {getIncidentInfo(alertIncident.incidentNo)?.title ||
                        "Safety Alert"}
                    </h4>
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${getSeverityBadgeStyle(
                        getIncidentInfo(alertIncident.incidentNo)?.severity
                      )}`}
                    >
                      {getIncidentInfo(alertIncident.incidentNo)?.severity ||
                        "medium"}
                    </span>
                  </div>
                  <div className="mt-1">
                    <p className="font-medium">
                      {alertIncident.driverName}:{" "}
                      {getIncidentInfo(alertIncident.incidentNo)?.message ||
                        "Safety violation detected"}
                    </p>
                  </div>
                  <div className="text-sm mt-2">
                    <div className="flex items-center text-gray-600 dark:text-gray-400 space-x-2">
                      <Car className="w-3.5 h-3.5" />
                      <span>Vehicle: {alertIncident.vehicleNumber}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>
                      {getIncidentInfo(alertIncident.incidentNo)?.description}
                    </p>
                  </div>
                  <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                    <p>
                      <strong>Recommended action:</strong>{" "}
                      {getIncidentInfo(alertIncident.incidentNo)?.action}
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={closeCurrentAlert}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={closeCurrentAlert}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={() =>
                  (window.location.href = `/driver-details?driverId=${alertIncident.driverId}`)
                }
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800/40 text-blue-700 dark:text-blue-300 transition-colors flex items-center"
              >
                <UserCircle className="w-3.5 h-3.5 mr-1" />
                View Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Notifications;
