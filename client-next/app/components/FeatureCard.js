"use client";

import React from "react";
import { motion } from "framer-motion";

const FeatureCard = ({ title, description, icon, delay = 0 }) => {
  return (
    <motion.div
      className="card group hover:border-primary-500 border-2 border-transparent"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="flex flex-col items-center text-center p-2">
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors duration-300">
          <div className="text-primary-600">{icon}</div>
        </div>
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
