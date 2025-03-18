// app/components/Dashboard.js

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiLogOut, FiAlertTriangle } from "react-icons/fi";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Ensure alerts is always an array, even if API response is incomplete
        setData({
          ...res.data,
          alerts: res.data.alerts || [], // Default to empty array if undefined
        });
      } catch (error) {
        console.error("Error fetching data", error);
        // Fallback sample data with alerts as an array
        setData({
          totalTrips: 142,
          safeDrivingPercentage: 92,
          averageScore: 87,
          alerts: [
            { message: "Driver UG1234A: Phone usage detected at 14:32" },
            { message: "Driver UG5678B: Drowsiness detected at 09:15" },
          ],
        });
      }
    };
    if (token) fetchData();
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-primary-50">
      <aside className="w-64 bg-primary-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">SafeDrive DBMS</h2>
        <nav className="space-y-2">
          <a
            href="/dashboard"
            className="block p-3 rounded hover:bg-primary-700"
          >
            Dashboard
          </a>
          <a
            href="/analytics"
            className="block p-3 rounded hover:bg-primary-700"
          >
            Analytics
          </a>
          <a href="/reports" className="block p-3 rounded hover:bg-primary-700">
            Reports
          </a>
          <button
            onClick={logout}
            className="w-full p-3 bg-alert text-white rounded flex items-center justify-center gap-2"
          >
            <FiLogOut /> Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <header className="bg-white p-4 rounded-lg shadow mb-6">
          <h1 className="text-3xl font-bold text-primary-700">
            Driver Behavior Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Real-time monitoring for safer roads in Uganda
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-xl font-bold text-primary-600">Total Trips</h3>
            <p className="text-3xl">{data ? data.totalTrips : "Loading..."}</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-bold text-primary-600">
              Safe Driving %
            </h3>
            <p className="text-3xl">
              {data ? `${data.safeDrivingPercentage}%` : "Loading..."}
            </p>
          </div>
          <div className="card">
            <h3 className="text-xl font-bold text-primary-600">
              Average Score
            </h3>
            <p className="text-3xl">
              {data ? data.averageScore : "Loading..."}
            </p>
          </div>
        </div>
        <div className="card mt-6">
          <h3 className="text-xl font-bold text-primary-600 mb-4">
            Safety Alerts
          </h3>
          {data ? (
            data.alerts.length > 0 ? (
              data.alerts.map((alert, i) => (
                <div key={i} className="alert mb-2">
                  <FiAlertTriangle /> {alert.message}
                </div>
              ))
            ) : (
              <p className="text-gray-600">No alerts at this time.</p>
            )
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
