// client/src/components/Analytic.js

import React from "react";
import Layout from "./layout/Layout";

const Analytic = () => {
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

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-primary mb-6">Driver Analytics</h2>
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Vehicle & Driver Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Vehicle Number</th>
                <th className="p-3">Driver Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Incidents</th>
              </tr>
            </thead>
            <tbody>
              {vehicleData.map((vehicle, index) => (
                <tr
                  key={vehicle.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="p-3">{vehicle.id}</td>
                  <td className="p-3">{vehicle.vehicleNumber}</td>
                  <td className="p-3">{vehicle.driverName}</td>
                  <td className="p-3">{vehicle.status}</td>
                  <td className="p-3">{vehicle.incidents}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Analytic;
