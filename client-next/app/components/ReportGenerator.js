// app/components/ReportGenerator.js

"use client";

import React from "react";

const ReportGenerator = () => {
  const sampleReport = {
    driver: "John Doe",
    vehicle: "UG1234A",
    trips: 15,
    incidents: 2,
    dateRange: "March 1 - March 18, 2025",
  };

  return (
    <div className="min-h-screen p-6 bg-primary-50">
      <header className="bg-primary-600 text-white p-4 rounded-lg mb-6">
        <h1 className="text-3xl font-bold">Generate Driver Report</h1>
      </header>
      <section className="card">
        <h2 className="text-2xl font-bold text-primary-700 mb-4">
          Sample Report
        </h2>
        <p>
          <strong>Driver:</strong> {sampleReport.driver}
        </p>
        <p>
          <strong>Vehicle:</strong> {sampleReport.vehicle}
        </p>
        <p>
          <strong>Total Trips:</strong> {sampleReport.trips}
        </p>
        <p>
          <strong>Incidents:</strong> {sampleReport.incidents}
        </p>
        <p>
          <strong>Date Range:</strong> {sampleReport.dateRange}
        </p>
        <button className="btn mt-4">Download PDF</button>
      </section>
    </div>
  );
};

export default ReportGenerator;
