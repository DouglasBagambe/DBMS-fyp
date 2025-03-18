// app/components/Analytics.js

"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const vehicleData = [
    {
      id: 1,
      vehicleNumber: "UG1234A",
      driverName: "John Doe",
      status: "Active",
      incidents: 2,
    },
    {
      id: 2,
      vehicleNumber: "UG5678B",
      driverName: "Jane Smith",
      status: "Inactive",
      incidents: 1,
    },
    {
      id: 3,
      vehicleNumber: "UG9012C",
      driverName: "Michael Brown",
      status: "Active",
      incidents: 0,
    },
  ];

  const chartData = {
    labels: vehicleData.map((v) => v.vehicleNumber),
    datasets: [
      {
        label: "Incidents",
        data: vehicleData.map((v) => v.incidents),
        backgroundColor: "rgba(46, 125, 50, 0.7)",
        borderColor: "#2e7d32",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen p-6 bg-primary-50">
      <header className="bg-primary-600 text-white p-4 rounded-lg mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      </header>
      <section className="card mb-6">
        <h2 className="text-2xl font-bold text-primary-700 mb-4">
          Vehicle & Driver Details
        </h2>
        <table className="w-full">
          <thead className="bg-primary-600 text-white">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Vehicle Number</th>
              <th className="p-3 text-left">Driver Name</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Incidents</th>
            </tr>
          </thead>
          <tbody>
            {vehicleData.map((v, i) => (
              <tr
                key={v.id}
                className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="p-3">{v.id}</td>
                <td className="p-3">{v.vehicleNumber}</td>
                <td className="p-3">{v.driverName}</td>
                <td className="p-3">{v.status}</td>
                <td className="p-3">{v.incidents}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="card">
        <h2 className="text-2xl font-bold text-primary-700 mb-4">
          Incident Trends
        </h2>
        <Bar data={chartData} options={{ responsive: true }} />
      </section>
    </div>
  );
};

export default Analytics;
