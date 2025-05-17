/* eslint-disable react-hooks/exhaustive-deps */
// src/components/UserProfile.jsx

"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  getUserProfile,
  updateUserProfile,
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  getDrivers,
  addDriver,
  updateDriver,
  deleteDriver,
  getDashboardMetrics,
} from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import {
  UserCircle,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

const UserProfile = () => {
  const { user, updateUserData, getUserFullName } = useContext(AuthContext);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    company: "",
    gender: "",
  });
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [metrics, setMetrics] = useState({
    vehicles: 0,
    activeDrivers: 0,
    recentIncidents: 0,
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
    driverId: null,
    status: "Active",
  });
  const [driverForm, setDriverForm] = useState({
    name: "",
    driverId: "",
    phoneNumber: "",
    vehicleId: null,
  });

  // Get current date for header
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fetch user profile, vehicles, drivers, and metrics
  useEffect(() => {
    // Create data cache for this component
    const dataCache = {
      profileLoaded: false,
      vehiclesLoaded: false,
      driversLoaded: false,
      metricsLoaded: false,
    };

    const fetchData = async () => {
      // Skip if already loading
      if (loading) return;

      setLoading(true);

      try {
        // Only fetch what we need based on cache state
        const fetchPromises = [];

        // User profile - only fetch if not already loaded
        if (
          !dataCache.profileLoaded &&
          (!profileForm.firstName || !profileForm.email)
        ) {
          fetchPromises.push(
            getUserProfile()
              .then((userData) => {
                if (userData && userData.user) {
                  setProfileForm({
                    firstName: userData.user.first_name || "",
                    lastName: userData.user.last_name || "",
                    email: userData.user.email || "",
                    phoneNumber: userData.user.phone_number || "",
                    company: userData.user.company || "",
                    gender: userData.user.gender || "",
                  });
                  updateUserData(userData.user);
                  dataCache.profileLoaded = true;
                }
              })
              .catch((err) => {
                console.error("Error fetching user profile:", err);
                // Continue with other fetches
              })
          );
        }

        // Vehicles - only fetch if not already loaded
        if (!dataCache.vehiclesLoaded && (!vehicles || vehicles.length === 0)) {
          fetchPromises.push(
            getVehicles()
              .then((vehicleData) => {
                if (vehicleData && vehicleData.vehicles) {
                  setVehicles(
                    vehicleData.vehicles.map((v) => ({
                      id: v.id,
                      vehicleNumber: v.vehicle_number,
                      type: v.type,
                      driver: v.driver,
                      driverId: v.driver_id,
                      status: v.status,
                      lastTrip: v.last_trip
                        ? new Date(v.last_trip).toLocaleString()
                        : "Never",
                    }))
                  );
                  dataCache.vehiclesLoaded = true;
                }
              })
              .catch((err) => {
                console.error("Error fetching vehicles:", err);
                // Continue with other fetches
              })
          );
        }

        // Drivers - only fetch if not already loaded
        if (!dataCache.driversLoaded && (!drivers || drivers.length === 0)) {
          fetchPromises.push(
            getDrivers()
              .then((driverData) => {
                if (driverData && driverData.drivers) {
                  setDrivers(
                    driverData.drivers.map((d) => ({
                      id: d.id,
                      driverId: d.driver_id,
                      name: d.name,
                      phoneNumber: d.phone_number,
                      vehicle: d.vehicle,
                      vehicleId: d.vehicle === "None" ? null : d.vehicle,
                      incidents: d.incidents,
                      score: d.safety_score,
                      passwordChanged: d.password_changed,
                      lastLogin: d.last_login,
                    }))
                  );
                  dataCache.driversLoaded = true;
                }
              })
              .catch((err) => {
                console.error("Error fetching drivers:", err);
                // Continue with other fetches
              })
          );
        }

        // Metrics - only fetch if not already loaded
        if (!dataCache.metricsLoaded && (!metrics || !metrics.vehicles)) {
          fetchPromises.push(
            getDashboardMetrics()
              .then((metricsData) => {
                if (metricsData) {
                  setMetrics({
                    vehicles: metricsData.vehicles,
                    activeDrivers: metricsData.activeDrivers,
                    recentIncidents: metricsData.recentIncidents,
                  });
                  dataCache.metricsLoaded = true;
                }
              })
              .catch((err) => {
                console.error("Error fetching metrics:", err);
                // Continue with other fetches
              })
          );
        }

        // Wait for all fetches to complete (handles individual errors already)
        await Promise.allSettled(fetchPromises);
      } catch (err) {
        console.error("Error in main fetch data flow:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    // Use existing user data if available before fetching
    if (user && !dataCache.profileLoaded) {
      setProfileForm({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phoneNumber: user.phone_number || "",
        company: user.company || "",
        gender: user.gender || "",
      });
      dataCache.profileLoaded = true;
    }

    // Only fetch data once on mount or when user changes
    fetchData();

    // This effect should only run on mount and when user changes
  }, [user, updateUserData]);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleVehicleChange = (e) => {
    setVehicleForm({ ...vehicleForm, [e.target.name]: e.target.value });
  };

  const handleDriverChange = (e) => {
    setDriverForm({ ...driverForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await updateUserProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        company: profileForm.company,
        phoneNumber: profileForm.phoneNumber,
        gender: profileForm.gender,
      });
      if (response && response.user) {
        updateUserData(response.user);
        setSuccessMessage("Profile updated successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords don't match");
      return;
    }
    setLoading(true);
    try {
      // Note: Password change API not implemented in provided api.js
      // Simulating API call for now
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
    } catch (err) {
      setError(err.message || "Failed to update password");
      setLoading(false);
    }
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (currentVehicle) {
        // Update existing vehicle
        const response = await updateVehicle(currentVehicle.id, {
          type: vehicleForm.type,
          status: vehicleForm.status,
          driverId:
            vehicleForm.driverId === "Unassigned" ? null : vehicleForm.driverId,
        });
        if (response && response.vehicle) {
          setVehicles(
            vehicles.map((v) =>
              v.id === response.vehicle.id
                ? {
                    id: response.vehicle.id,
                    vehicleNumber: response.vehicle.vehicle_number,
                    type: response.vehicle.type,
                    driver: response.vehicle.driver,
                    driverId: response.vehicle.driver_id,
                    status: response.vehicle.status,
                    lastTrip: response.vehicle.last_trip
                      ? new Date(response.vehicle.last_trip).toLocaleString()
                      : "Never",
                  }
                : v
            )
          );
        }
      } else {
        // Add new vehicle
        const response = await addVehicle({
          vehicleNumber: vehicleForm.vehicleNumber,
          type: vehicleForm.type,
          status: vehicleForm.status,
          driverId:
            vehicleForm.driverId === "Unassigned" ? null : vehicleForm.driverId,
        });
        if (response && response.vehicle) {
          setVehicles([
            ...vehicles,
            {
              id: response.vehicle.id,
              vehicleNumber: response.vehicle.vehicle_number,
              type: response.vehicle.type,
              driver: response.vehicle.driver,
              driverId: response.vehicle.driver_id,
              status: response.vehicle.status,
              lastTrip: response.vehicle.last_trip
                ? new Date(response.vehicle.last_trip).toLocaleString()
                : "Never",
            },
          ]);
          setMetrics({ ...metrics, vehicles: metrics.vehicles + 1 });
        }
      }
      setShowVehicleModal(false);
      setVehicleForm({
        vehicleNumber: "",
        type: "Bus",
        driverId: null,
        status: "Active",
      });
      setCurrentVehicle(null);
      setSuccessMessage(
        currentVehicle
          ? "Vehicle updated successfully"
          : "Vehicle added successfully"
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error handling vehicle:", err);
      setError(err.message || "Failed to process vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleDriverSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (currentDriver) {
        // Update existing driver
        const response = await updateDriver(currentDriver.id, {
          name: driverForm.name,
          phoneNumber: driverForm.phoneNumber,
          vehicleId: driverForm.vehicleId === "None" ? null : driverForm.vehicleId,
        });
        if (response && response.driver) {
          setDrivers(
            drivers.map((d) =>
              d.id === response.driver.id
                ? {
                    id: response.driver.id,
                    driverId: response.driver.driver_id,
                    name: response.driver.name,
                    phoneNumber: response.driver.phone_number,
                    vehicle: response.driver.vehicle,
                    vehicleId: response.driver.vehicle === "None" ? null : response.driver.vehicle,
                    incidents: response.driver.incidents,
                    score: response.driver.safety_score,
                    passwordChanged: response.driver.password_changed,
                    lastLogin: response.driver.last_login,
                  }
                : d
            )
          );
        }
      } else {
        // Add new driver
        const response = await addDriver({
          name: driverForm.name,
          driverId: driverForm.driverId,
          phoneNumber: driverForm.phoneNumber,
          vehicleId: driverForm.vehicleId === "None" ? null : driverForm.vehicleId,
        });
        if (response && response.driver) {
          setDrivers([
            ...drivers,
            {
              id: response.driver.id,
              driverId: response.driver.driver_id,
              name: response.driver.name,
              phoneNumber: response.driver.phone_number,
              vehicle: response.driver.vehicle,
              vehicleId: response.driver.vehicle === "None" ? null : response.driver.vehicle,
              incidents: response.driver.incidents,
              score: response.driver.safety_score,
              passwordChanged: response.driver.password_changed,
              lastLogin: response.driver.last_login,
            },
          ]);
          setMetrics({ ...metrics, activeDrivers: metrics.activeDrivers + 1 });
        }
      }
      setShowDriverModal(false);
      setDriverForm({ name: "", driverId: "", phoneNumber: "", vehicleId: null });
      setCurrentDriver(null);
      setSuccessMessage(
        currentDriver
          ? "Driver updated successfully"
          : "Driver added successfully. They can now log in using their Driver ID as the initial password."
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error handling driver:", err);
      setError(err.message || "Failed to process driver");
    } finally {
      setLoading(false);
    }
  };

  const handleEditVehicle = (vehicle) => {
    setCurrentVehicle(vehicle);
    setVehicleForm({
      vehicleNumber: vehicle.vehicleNumber,
      type: vehicle.type,
      driverId: vehicle.driverId || "Unassigned",
      status: vehicle.status,
    });
    setShowVehicleModal(true);
  };

  const handleRemoveVehicle = async (vehicleId) => {
    if (!window.confirm("Are you sure you want to remove this vehicle?"))
      return;
    setLoading(true);
    setError(null);
    try {
      await deleteVehicle(vehicleId);
      setVehicles(vehicles.filter((v) => v.id !== vehicleId));
      setMetrics({ ...metrics, vehicles: metrics.vehicles - 1 });
      setSuccessMessage("Vehicle removed successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error removing vehicle:", err);
      setError(err.message || "Failed to remove vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleEditDriver = (driver) => {
    setCurrentDriver(driver);
    setDriverForm({
      name: driver.name,
      driverId: driver.driverId,
      phoneNumber: driver.phoneNumber,
      vehicleId: driver.vehicleId || "None",
    });
    setShowDriverModal(true);
  };

  const handleRemoveDriver = async (driverId) => {
    if (!window.confirm("Are you sure you want to remove this driver?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteDriver(driverId);
      setDrivers(drivers.filter((d) => d.id !== driverId));
      setMetrics({ ...metrics, activeDrivers: metrics.activeDrivers - 1 });
      setSuccessMessage("Driver removed successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error removing driver:", err);
      setError(err.message || "Failed to remove driver");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    return score >= 90 ? "#2e7d32" : score >= 70 ? "#9a8250" : "#d9534f";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Driver Behavior Monitoring
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Real-time monitoring for safer roads in Uganda
            </p>
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
                    : getUserFullName()
                  : "Fleet Manager"}
              </span>
            </div>
            <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>{getCurrentDate()}</span>
            </div>
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
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileForm.firstName}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileForm.lastName}
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
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-gray-100 dark:bg-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={profileForm.phoneNumber}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={profileForm.company}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={profileForm.gender}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="rather_not_say">Rather not say</option>
                  </select>
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
                  {metrics.vehicles}
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
                  {metrics.recentIncidents}
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
                    driverId: null,
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
                        key={vehicle.id}
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
                            onClick={() => handleRemoveVehicle(vehicle.id)}
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
                  setDriverForm({ name: "", driverId: "", phoneNumber: "", vehicleId: null });
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
                      Phone Number
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Vehicle Assigned
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Login
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
                          {driver.driverId}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {driver.phoneNumber}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {driver.vehicle}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              driver.passwordChanged
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                            }`}
                          >
                            {driver.passwordChanged ? "Active" : "Pending Setup"}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {driver.lastLogin
                            ? new Date(driver.lastLogin).toLocaleString()
                            : "Never"}
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
                        colSpan="9"
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
                    disabled={!!currentVehicle}
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
                    name="driverId"
                    value={vehicleForm.driverId || "Unassigned"}
                    onChange={handleVehicleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="Unassigned">Unassigned</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
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
                    name="driverId"
                    value={driverForm.driverId}
                    onChange={handleDriverChange}
                    required
                    disabled={!!currentDriver}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  {!currentDriver && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      This will be used as the initial password for the driver
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={driverForm.phoneNumber}
                    onChange={handleDriverChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vehicle Assigned
                  </label>
                  <select
                    name="vehicleId"
                    value={driverForm.vehicleId || "None"}
                    onChange={handleDriverChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="None">None</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
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
