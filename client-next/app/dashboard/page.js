"use client";

import React from "react";
import { motion } from "framer-motion";
import DashboardCard from "../components/DashboardCard";
import { FiShield, FiAlertTriangle, FiBarChart } from "react-icons/fi";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-dark pt-24 pb-12">
      <div className="container-custom">
        <motion.h1
          className="text-5xl font-bold text-neon mb-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Command Center
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <DashboardCard
            title="Drivers Monitored"
            value="142"
            icon={<FiShield size={32} />}
          />
          <DashboardCard
            title="Alerts Today"
            value="8"
            icon={<FiAlertTriangle size={32} />}
          />
          <DashboardCard
            title="Safety Score"
            value="92%"
            icon={<FiBarChart size={32} />}
          />
        </div>
      </div>
    </div>
  );
}
