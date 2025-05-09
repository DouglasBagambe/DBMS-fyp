"use client";
import React, { useState } from "react";
import Header from "./Header";
import { Bell, AlertTriangle, Eye, XCircle } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Drowsiness detected for UG1234A at 14:32",
      timestamp: "Today, 14:32",
      severity: "high",
      read: false,
    },
    {
      id: 2,
      message: "Phone usage detected for UG5678B at 13:45",
      timestamp: "Today, 13:45",
      severity: "medium",
      read: true,
    },
    {
      id: 3,
      message: "Talking detected for UG9012C at 12:10",
      timestamp: "Today, 12:10",
      severity: "low",
      read: false,
    },
  ]);

  const getSeverityStyle = (severity) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-l-4 border-red-500";
      case "medium":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-l-4 border-amber-500";
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-l-4 border-green-500";
      default:
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
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

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage driver behavior alerts
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg p-4 ${getSeverityStyle(
                  notification.severity
                )} ${notification.read ? "opacity-70" : ""}`}
              >
                <div className="flex items-start">
                  <div
                    className={`p-2 rounded-lg ${
                      notification.severity === "high"
                        ? "bg-red-200 dark:bg-red-800/50"
                        : notification.severity === "medium"
                        ? "bg-amber-200 dark:bg-amber-800/50"
                        : "bg-green-200 dark:bg-green-800/50"
                    } mr-4`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-gray-200">
                        {notification.message}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {notification.timestamp}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center">
                      <span
                        className={`w-2 h-2 rounded-full ${getSeverityDot(
                          notification.severity
                        )} mr-1`}
                      ></span>
                      <span className="text-xs font-medium">
                        {notification.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                {!notification.read && (
                  <div className="flex justify-end mt-3 space-x-2">
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="flex items-center px-3 py-1 text-xs font-medium rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                    >
                      <XCircle className="w-3 h-3 mr-1" /> Dismiss
                    </button>
                    <button className="flex items-center px-3 py-1 text-xs font-medium rounded-md bg-primary-500 text-white hover:bg-primary-600">
                      <Eye className="w-3 h-3 mr-1" /> View Details
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
