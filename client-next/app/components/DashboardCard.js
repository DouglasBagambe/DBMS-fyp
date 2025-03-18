// app/components/DashboardCard.js

"use client";

import React from "react";
import { motion } from "framer-motion";

const DashboardCard = ({ title, value, icon }) => {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-neon bg-opacity-20 rounded-full">{icon}</div>
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h3 className="text-3xl font-bold text-neon">{value}</h3>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
