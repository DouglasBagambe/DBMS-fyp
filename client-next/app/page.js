/* eslint-disable react/no-unescaped-entities */

// app/page.js

"use client";

import React from "react";
import { motion } from "framer-motion";
import Hero from "./components/Hero";
import FeatureCard from "./components/FeatureCard";
import Button from "./components/Button";
import Link from "next/link";
import { FiShield, FiAlertTriangle, FiBarChart } from "react-icons/fi";

export default function Home() {
  const features = [
    {
      title: "Real-Time Detection",
      description: "Instantly spot distractions with AI precision.",
      icon: <FiShield size={32} />,
    },
    {
      title: "Smart Alerts",
      description: "Neon-fast notifications to prevent incidents.",
      icon: <FiAlertTriangle size={32} />,
    },
    {
      title: "Data Insights",
      description: "Futuristic analytics for fleet mastery.",
      icon: <FiBarChart size={32} />,
    },
  ];

  return (
    <div className="relative">
      <Hero />
      <section className="section">
        <div className="container-custom">
          <motion.h2
            className="text-5xl font-bold text-center text-neon mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Core Systems
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} delay={i * 0.2} />
            ))}
          </div>
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/dashboard">
              <Button>Launch Dashboard</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
