"use client";
import React, { useState } from "react";
import Header from "./Header";
import { Lock, Shield, Bell, User } from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    dataRetention: 12,
    darkMode: true,
    privacyConsent: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Customize your Driver Behavior Monitoring System experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-500" /> Account
              Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dark Mode
                </label>
                <input
                  type="checkbox"
                  name="darkMode"
                  checked={settings.darkMode}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-500 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Privacy Consent
                </label>
                <input
                  type="checkbox"
                  name="privacyConsent"
                  checked={settings.privacyConsent}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-500 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  I consent to data monitoring for safety purposes.
                </p>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary-500" /> System
              Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notifications
                </label>
                <input
                  type="checkbox"
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-500 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data Retention (Months)
                </label>
                <select
                  name="dataRetention"
                  value={settings.dataRetention}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
