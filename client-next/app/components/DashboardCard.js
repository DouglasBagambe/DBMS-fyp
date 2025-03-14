"use client";

import React from "react";
import { motion } from "framer-motion";

const DashboardCard = ({
  title,
  value,
  icon,
  trend = null,
  color = "primary",
}) => {
  const colorClasses = {
    primary: {
      bgLight: "bg-primary-50",
      iconBg: "bg-primary-100",
      iconColor: "text-primary-600",
      valueColor: "text-primary-700",
    },
    blue: {
      bgLight: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      valueColor: "text-blue-700",
    },
    red: {
      bgLight: "bg-red-50",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      valueColor: "text-red-700",
    },
    amber: {
      bgLight: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      valueColor: "text-amber-700",
    },
    emerald: {
      bgLight: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-700",
    },
  };

  return (
    <motion.div
      className={`card ${colorClasses[color].bgLight} border border-white hover:border-gray-200`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 font-medium mb-1">{title}</p>
          <h3
            className={`text-3xl font-bold ${colorClasses[color].valueColor}`}
          >
            {value}
          </h3>

          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm ${
                  trend.direction === "up" ? "text-emerald-600" : "text-red-600"
                } font-medium flex items-center`}
              >
                {trend.direction === "up" ? (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    ></path>
                  </svg>
                )}
                {trend.value}
              </span>
              <span className="text-xs text-gray-500 ml-1">{trend.period}</span>
            </div>
          )}
        </div>
        <div className={`${colorClasses[color].iconBg} p-3 rounded-lg`}>
          <div className={colorClasses[color].iconColor}>{icon}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
