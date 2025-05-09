/* eslint-disable react/jsx-no-undef */
// src/components/UserProfile.js

"use client";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import { Eye, XCircle } from "lucide-react";

const UserProfile = () => {
  const [profileForm, setProfileForm] = useState({
    name: "Simon Barisigara",
    email: "simonbarisigara@gmail.com",
    phone: "0783221677",
    company: "Kira Motors Corporation",
  });

  const [vehicles, setVehicles] = useState([
    {
      vehicleNumber: "UG1234A",
      type: "Bus",
      driver: "John Doe",
      status: "Active",
      lastTrip: "2025-03-18 14:32",
    },
    {
      vehicleNumber: "UG5678B",
      type: "Taxi",
      driver: "Jane Smith",
      status: "Inactive",
      lastTrip: "2025-03-17 09:15",
    },
    {
      vehicleNumber: "UG9012C",
      type: "Lorry",
      driver: "Unassigned",
      status: "Maintenance",
      lastTrip: "2025-03-16 11:45",
    },
  ]);

  const [drivers, setDrivers] = useState([
    {
      name: "John Doe",
      id: "D001",
      vehicle: "UG1234A",
      incidents: 2,
      score: 85,
    },
    {
      name: "Jane Smith",
      id: "D002",
      vehicle: "UG5678B",
      incidents: 1,
      score: 90,
    },
    {
      name: "Michael Brown",
      id: "D003",
      vehicle: "None",
      incidents: 0,
      score: 95,
    },
  ]);

  const [metrics, setMetrics] = useState({
    totalVehicles: 5,
    activeDrivers: 3,
    incidents: 4,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [currentDriver, setCurrentDriver] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [vehicleForm, setVehicleForm] = useState({
    vehicleNumber: "",
    type: "Bus",
    driver: "Unassigned",
    status: "Active",
  });

  const [driverForm, setDriverForm] = useState({
    name: "",
    id: "",
    vehicle: "None",
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleProfileChange = (e) =>
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) =>
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  const handleVehicleChange = (e) =>
    setVehicleForm({ ...vehicleForm, [e.target.name]: e.target.value });
  const handleDriverChange = (e) =>
    setDriverForm({ ...driverForm, [e.target.name]: e.target.value });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSuccessMessage("Profile updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setLoading(false);
    }, 1000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords don't match");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccessMessage("Password updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setLoading(false);
    }, 1000);
  };

  const handleVehicleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (currentVehicle) {
        setVehicles(
          vehicles.map((v) =>
            v.vehicleNumber === currentVehicle.vehicleNumber
              ? { ...vehicleForm, lastTrip: currentVehicle.lastTrip }
              : v
          )
        );
      } else {
        setVehicles([...vehicles, { ...vehicleForm, lastTrip: "Never" }]);
        setMetrics({ ...metrics, totalVehicles: metrics.totalVehicles + 1 });
      }
      setShowVehicleModal(false);
      setVehicleForm({
        vehicleNumber: "",
        type: "Bus",
        driver: "Unassigned",
        status: "Active",
      });
      setCurrentVehicle(null);
      setSuccessMessage(
        `Vehicle ${currentVehicle ? "updated" : "added"} successfully`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
      setLoading(false);
    }, 1000);
  };

  const handleDriverSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (currentDriver) {
        setDrivers(
          drivers.map((d) =>
            d.id === currentDriver.id
              ? {
                  ...driverForm,
                  incidents: currentDriver.incidents,
                  score: currentDriver.score,
                }
              : d
          )
        );
      } else {
        setDrivers([...drivers, { ...driverForm, incidents: 0, score: 100 }]);
        setMetrics({ ...metrics, activeDrivers: metrics.activeDrivers + 1 });
      }
      setShowDriverModal(false);
      setDriverForm({ name: "", id: "", vehicle: "None" });
      setCurrentDriver(null);
      setSuccessMessage(
        `Driver ${currentDriver ? "updated" : "added"} successfully`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
      setLoading(false);
    }, 1000);
  };

  const handleEditVehicle = (vehicle) => {
    setCurrentVehicle(vehicle);
    setVehicleForm({
      vehicleNumber: vehicle.vehicleNumber,
      type: vehicle.type,
      driver: vehicle.driver,
      status: vehicle.status,
    });
    setShowVehicleModal(true);
  };

  const handleRemoveVehicle = (vehicleNumber) => {
    if (!window.confirm("Are you sure you want to remove this vehicle?"))
      return;
    setLoading(true);
    setTimeout(() => {
      setVehicles(vehicles.filter((v) => v.vehicleNumber !== vehicleNumber));
      setMetrics({ ...metrics, totalVehicles: metrics.totalVehicles - 1 });
      setSuccessMessage("Vehicle removed successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setLoading(false);
    }, 1000);
  };

  const handleEditDriver = (driver) => {
    setCurrentDriver(driver);
    setDriverForm({
      name: driver.name,
      id: driver.id,
      vehicle: driver.vehicle,
    });
    setShowDriverModal(true);
  };

  const handleRemoveDriver = (driverId) => {
    if (!window.confirm("Are you sure you want to remove this driver?")) return;
    setLoading(true);
    setTimeout(() => {
      setDrivers(drivers.filter((d) => d.id !== driverId));
      setMetrics({ ...metrics, activeDrivers: metrics.activeDrivers - 1 });
      setSuccessMessage("Driver removed successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setLoading(false);
    }, 1000);
  };

  const getScoreColor = (score) =>
    score >= 90 ? "#2e7d32" : score >= 70 ? "#f9a825" : "#d9534f";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Fleet Manager Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your account and fleet operations
            </p>
          </div>
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 font-medium">
            <span>Welcome, {profileForm.name}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last Login: March 18, 2025, 09:15 AM
            </span>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-primary-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 mb-6 rounded-md">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-700 dark:text-green-400">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Details */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Account Details
            </h2>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
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
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company/Fleet Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={profileForm.company}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Change Password
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

          {/* Fleet Overview */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Fleet Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Total Vehicles
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {metrics.totalVehicles}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Registered in system
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Active Drivers
                </h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {metrics.activeDrivers}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Currently assigned
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Incidents This Week
                </h3>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {metrics.incidents}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Safety violations
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Vehicles Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Vehicles
              </h2>
              <button
                onClick={() => {
                  setCurrentVehicle(null);
                  setVehicleForm({
                    vehicleNumber: "",
                    type: "Bus",
                    driver: "Unassigned",
                    status: "Active",
                  });
                  setShowVehicleModal(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Add Vehicle
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Vehicle Number
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Driver Assigned
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Trip
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {vehicles.length > 0 ? (
                    vehicles.map((vehicle) => (
                      <tr
                        key={vehicle.vehicleNumber}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">
                          {vehicle.vehicleNumber}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {vehicle.type}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {vehicle.driver}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              vehicle.status === "Active"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                : vehicle.status === "Inactive"
                                ? "bg-gray-100 dark:bg-gray-800/30 text-gray-800 dark:text-gray-400"
                                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                            }`}
                          >
                            {vehicle.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {vehicle.lastTrip}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => handleEditVehicle(vehicle)}
                            className="px-2 py-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleRemoveVehicle(vehicle.vehicleNumber)
                            }
                            className="px-2 py-1 text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        No vehicles found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Drivers Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Drivers
              </h2>
              <button
                onClick={() => {
                  setCurrentDriver(null);
                  setDriverForm({ name: "", id: "", vehicle: "None" });
                  setShowDriverModal(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Add Driver
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Driver ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Vehicle Assigned
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Incidents
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Safety Score
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {drivers.length > 0 ? (
                    drivers.map((driver) => (
                      <tr
                        key={driver.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">
                          {driver.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {driver.id}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {driver.vehicle}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {driver.incidents}
                        </td>
                        <td
                          className="px-4 py-2 text-sm font-medium"
                          style={{ color: getScoreColor(driver.score) }}
                        >
                          {driver.score}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => handleEditDriver(driver)}
                            className="px-2 py-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleRemoveDriver(driver.id)}
                            className="px-2 py-1 text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        No drivers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Change Password
                </h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XCircle size={20} />
                </button>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                    disabled={loading}
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Vehicle Modal */}
        {showVehicleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentVehicle ? "Edit Vehicle" : "Add Vehicle"}
                </h3>
                <button
                  onClick={() => setShowVehicleModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XCircle size={20} />
                </button>
              </div>
              <form onSubmit={handleVehicleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={vehicleForm.vehicleNumber}
                    onChange={handleVehicleChange}
                    required
                    disabled={currentVehicle}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    name="type"
                    value={vehicleForm.type}
                    onChange={handleVehicleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="Bus">Bus</option>
                    <option value="Taxi">Taxi</option>
                    <option value="Lorry">Lorry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Driver Assigned
                  </label>
                  <select
                    name="driver"
                    value={vehicleForm.driver}
                    onChange={handleVehicleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="Unassigned">Unassigned</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.name}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={vehicleForm.status}
                    onChange={handleVehicleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowVehicleModal(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                    disabled={loading}
                  >
                    {currentVehicle ? "Update Vehicle" : "Add Vehicle"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Driver Modal */}
        {showDriverModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentDriver ? "Edit Driver" : "Add Driver"}
                </h3>
                <button
                  onClick={() => setShowDriverModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XCircle size={20} />
                </button>
              </div>
              <form onSubmit={handleDriverSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Driver Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={driverForm.name}
                    onChange={handleDriverChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Driver ID
                  </label>
                  <input
                    type="text"
                    name="id"
                    value={driverForm.id}
                    onChange={handleDriverChange}
                    required
                    disabled={currentDriver}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vehicle Assigned
                  </label>
                  <select
                    name="vehicle"
                    value={driverForm.vehicle}
                    onChange={handleDriverChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="None">None</option>
                    {vehicles.map((vehicle) => (
                      <option
                        key={vehicle.vehicleNumber}
                        value={vehicle.vehicleNumber}
                      >
                        {vehicle.vehicleNumber} ({vehicle.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowDriverModal(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                    disabled={loading}
                  >
                    {currentDriver ? "Update Driver" : "Add Driver"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
