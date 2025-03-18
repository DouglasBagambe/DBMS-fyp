// app/components/FeatureCard.js

"use client";

import React from "react";
import { motion } from "framer-motion";

const FeatureCard = ({ title, description, icon, delay }) => {
  return (
    <motion.div
      className="card text-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="mb-6 text-neon">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
