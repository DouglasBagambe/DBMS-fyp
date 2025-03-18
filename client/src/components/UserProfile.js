// src/components/UserProfile.js

/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/UserProfile.css";
import Header from "../components/Header";

const UserProfile = () => {
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "Simon Barisigara",
    email: "simonbarisigara@gmail.com",
    phone: "0783221677",
    company: "Kira Motors Corporation",
  });

  // Tables data
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

  // Overview metrics
  const [metrics, setMetrics] = useState({
    totalVehicles: 5,
    activeDrivers: 3,
    incidents: 4,
  });

  // Component state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Modals state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [currentDriver, setCurrentDriver] = useState(null);

  // Form states for modals
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
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        // const response = await axios.get("/api/user/profile");
        // setProfileForm(response.data);

        // Replace with your actual API endpoint
        // const fleetResponse = await axios.get("/api/fleet");
        // setVehicles(fleetResponse.data.vehicles);
        // setDrivers(fleetResponse.data.drivers);
        // setMetrics({
        //   totalVehicles: fleetResponse.data.vehicles.length,
        //   activeDrivers: fleetResponse.data.drivers.filter(d => d.vehicle !== "None").length,
        //   incidents: fleetResponse.data.weeklyIncidents || 4
        // });

        setError(null);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data. Using sample data instead.");
        // Keep using the sample data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Form handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicleForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDriverChange = (e) => {
    const { name, value } = e.target;
    setDriverForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Action handlers
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Replace with your actual API endpoint
      // await axios.patch("/api/user/profile", profileForm);

      // Just for demo purposes
      setTimeout(() => {
        setSuccessMessage("Profile updated successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
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
      // Replace with your actual API endpoint
      // await axios.patch("/api/user/password", passwordForm);

      // Just for demo purposes
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
      console.error("Error updating password:", err);
      setError("Failed to update password");
      setLoading(false);
    }
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentVehicle) {
        // Edit existing vehicle
        // await axios.patch(`/api/fleet/vehicles/${currentVehicle.vehicleNumber}`, vehicleForm);

        // Update local state for demo
        setVehicles((prev) =>
          prev.map((v) =>
            v.vehicleNumber === currentVehicle.vehicleNumber
              ? { ...vehicleForm, lastTrip: currentVehicle.lastTrip }
              : v
          )
        );
      } else {
        // Add new vehicle
        // const response = await axios.post("/api/fleet/vehicles", vehicleForm);

        // Update local state for demo
        const newVehicle = {
          ...vehicleForm,
          lastTrip: "Never",
        };
        setVehicles((prev) => [...prev, newVehicle]);
        setMetrics((prev) => ({
          ...prev,
          totalVehicles: prev.totalVehicles + 1,
        }));
      }

      // Reset form and close modal
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
    } catch (err) {
      console.error("Error with vehicle operation:", err);
      setError(`Failed to ${currentVehicle ? "update" : "add"} vehicle`);
    } finally {
      setLoading(false);
    }
  };

  const handleDriverSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentDriver) {
        // Edit existing driver
        // await axios.patch(`/api/fleet/drivers/${currentDriver.id}`, driverForm);

        // Update local state for demo
        setDrivers((prev) =>
          prev.map((d) =>
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
        // Add new driver
        // const response = await axios.post("/api/fleet/drivers", driverForm);

        // Update local state for demo
        const newDriver = {
          ...driverForm,
          incidents: 0,
          score: 100,
        };
        setDrivers((prev) => [...prev, newDriver]);
        setMetrics((prev) => ({
          ...prev,
          activeDrivers: prev.activeDrivers + 1,
        }));
      }

      // Reset form and close modal
      setShowDriverModal(false);
      setDriverForm({
        name: "",
        id: "",
        vehicle: "None",
      });
      setCurrentDriver(null);
      setSuccessMessage(
        `Driver ${currentDriver ? "updated" : "added"} successfully`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error with driver operation:", err);
      setError(`Failed to ${currentDriver ? "update" : "add"} driver`);
    } finally {
      setLoading(false);
    }
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

  const handleRemoveVehicle = async (vehicleNumber) => {
    if (!window.confirm("Are you sure you want to remove this vehicle?"))
      return;

    setLoading(true);
    try {
      // Replace with your actual API endpoint
      // await axios.delete(`/api/fleet/vehicles/${vehicleNumber}`);

      // Update local state for demo
      setVehicles((prev) =>
        prev.filter((v) => v.vehicleNumber !== vehicleNumber)
      );
      setMetrics((prev) => ({
        ...prev,
        totalVehicles: prev.totalVehicles - 1,
      }));
      setSuccessMessage("Vehicle removed successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error removing vehicle:", err);
      setError("Failed to remove vehicle");
    } finally {
      setLoading(false);
    }
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

  const handleRemoveDriver = async (driverId) => {
    if (!window.confirm("Are you sure you want to remove this driver?")) return;

    setLoading(true);
    try {
      // Replace with actual API endpoint when I configure it
      // await axios.delete(`/api/fleet/drivers/${driverId}`);

      // Update local state for demo
      setDrivers((prev) => prev.filter((d) => d.id !== driverId));
      setMetrics((prev) => ({
        ...prev,
        activeDrivers: prev.activeDrivers - 1,
      }));
      setSuccessMessage("Driver removed successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error removing driver:", err);
      setError("Failed to remove driver");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getScoreColor = (score) => {
    if (score >= 90) return "#2e7d32"; // Green
    if (score >= 70) return "#f9a825"; // Amber
    return "#d9534f"; // Red
  };

  return (
    <div className="profile-container">
      <Header />

      {/* <div className="back-button-container">
        <Link to="/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>
      </div> */}

      <header className="profile-header">
        <div className="profile-title">
          <h1>Fleet Manager Profile</h1>
          <p>Manage your account and fleet operations</p>
        </div>
        <div className="profile-meta">
          <div className="user-info">Welcome, {profileForm.name}</div>
          <div className="last-login">Last Login: March 18, 2025, 09:15 AM</div>
        </div>
      </header>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className="profile-content">
        <section className="account-section">
          <h2>Account Details</h2>
          <form className="account-form" onSubmit={handleProfileSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="company">Company/Fleet Name</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={profileForm.company}
                  onChange={handleProfileChange}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn-password"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>
              <button type="submit" className="btn-save" disabled={loading}>
                Save Changes
              </button>
            </div>
          </form>
        </section>

        <section className="fleet-overview">
          <h2>Fleet Overview</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Total Vehicles</h3>
              <div className="metric-value">{metrics.totalVehicles}</div>
              <p>Registered in system</p>
            </div>
            <div className="metric-card">
              <h3>Active Drivers</h3>
              <div className="metric-value good">{metrics.activeDrivers}</div>
              <p>Currently assigned</p>
            </div>
            <div className="metric-card">
              <h3>Incidents This Week</h3>
              <div className="metric-value poor">{metrics.incidents}</div>
              <p>Safety violations</p>
            </div>
          </div>
        </section>

        <div className="tables-container">
          <section className="vehicles-section">
            <div className="section-header">
              <h2>Vehicles</h2>
              <button
                className="btn-add"
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
              >
                Add Vehicle
              </button>
            </div>
            <div className="table-wrapper">
              <table className="data-table vehicles-table">
                <thead>
                  <tr>
                    <th>Vehicle Number</th>
                    <th>Type</th>
                    <th>Driver Assigned</th>
                    <th>Status</th>
                    <th>Last Trip</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.length > 0 ? (
                    vehicles.map((vehicle) => (
                      <tr key={vehicle.vehicleNumber}>
                        <td>{vehicle.vehicleNumber}</td>
                        <td>{vehicle.type}</td>
                        <td>{vehicle.driver}</td>
                        <td>
                          <span
                            className={`status-badge ${vehicle.status.toLowerCase()}`}
                          >
                            {vehicle.status}
                          </span>
                        </td>
                        <td>{vehicle.lastTrip}</td>
                        <td className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => handleEditVehicle(vehicle)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-remove"
                            onClick={() =>
                              handleRemoveVehicle(vehicle.vehicleNumber)
                            }
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-data">
                        No vehicles found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="drivers-section">
            <div className="section-header">
              <h2>Drivers</h2>
              <button
                className="btn-add"
                onClick={() => {
                  setCurrentDriver(null);
                  setDriverForm({
                    name: "",
                    id: "",
                    vehicle: "None",
                  });
                  setShowDriverModal(true);
                }}
              >
                Add Driver
              </button>
            </div>
            <div className="table-wrapper">
              <table className="data-table drivers-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Driver ID</th>
                    <th>Vehicle Assigned</th>
                    <th>Incidents</th>
                    <th>Safety Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.length > 0 ? (
                    drivers.map((driver) => (
                      <tr key={driver.id}>
                        <td>{driver.name}</td>
                        <td>{driver.id}</td>
                        <td>{driver.vehicle}</td>
                        <td>{driver.incidents}</td>
                        <td>
                          <span
                            className="score"
                            style={{ color: getScoreColor(driver.score) }}
                          >
                            {driver.score}
                          </span>
                        </td>
                        <td className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => handleEditDriver(driver)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-remove"
                            onClick={() => handleRemoveDriver(driver.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-data">
                        No drivers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button
                className="btn-close"
                onClick={() => setShowPasswordModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save" disabled={loading}>
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vehicle Modal */}
      {showVehicleModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{currentVehicle ? "Edit Vehicle" : "Add Vehicle"}</h3>
              <button
                className="btn-close"
                onClick={() => setShowVehicleModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleVehicleSubmit}>
              <div className="form-group">
                <label htmlFor="vehicleNumber">Vehicle Number</label>
                <input
                  type="text"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={vehicleForm.vehicleNumber}
                  onChange={handleVehicleChange}
                  required
                  disabled={currentVehicle}
                />
              </div>
              <div className="form-group">
                <label htmlFor="type">Vehicle Type</label>
                <select
                  id="type"
                  name="type"
                  value={vehicleForm.type}
                  onChange={handleVehicleChange}
                  required
                >
                  <option value="Bus">Bus</option>
                  <option value="Taxi">Taxi</option>
                  <option value="Lorry">Lorry</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="driver">Driver Assigned</label>
                <select
                  id="driver"
                  name="driver"
                  value={vehicleForm.driver}
                  onChange={handleVehicleChange}
                >
                  <option value="Unassigned">Unassigned</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.name}>
                      {driver.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={vehicleForm.status}
                  onChange={handleVehicleChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowVehicleModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save" disabled={loading}>
                  {currentVehicle ? "Update Vehicle" : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Driver Modal */}
      {showDriverModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{currentDriver ? "Edit Driver" : "Add Driver"}</h3>
              <button
                className="btn-close"
                onClick={() => setShowDriverModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleDriverSubmit}>
              <div className="form-group">
                <label htmlFor="driverName">Driver Name</label>
                <input
                  type="text"
                  id="driverName"
                  name="name"
                  value={driverForm.name}
                  onChange={handleDriverChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="driverId">Driver ID</label>
                <input
                  type="text"
                  id="driverId"
                  name="id"
                  value={driverForm.id}
                  onChange={handleDriverChange}
                  required
                  disabled={currentDriver}
                />
              </div>
              <div className="form-group">
                <label htmlFor="driverVehicle">Vehicle Assigned</label>
                <select
                  id="driverVehicle"
                  name="vehicle"
                  value={driverForm.vehicle}
                  onChange={handleDriverChange}
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
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowDriverModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save" disabled={loading}>
                  {currentDriver ? "Update Driver" : "Add Driver"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
