// src/components/layout/DashboardLayout.js
import React, { useState } from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-layout">
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>

      <div className={`main-content ${!sidebarOpen ? "full-width" : ""}`}>
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 12H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 18H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
