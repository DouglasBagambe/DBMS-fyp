// app/page.js

"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import Hero from "./components/Hero";
import Button from "./components/Button";
import FeatureCard from "./components/FeatureCard";

// Animation variants for features
const featureVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  }),
};

// Features data
const features = [
  {
    icon: "globe.svg",
    title: "Nationwide Coverage",
    description:
      "Monitor driver safety across all regions of Uganda with comprehensive data collection and analysis.",
  },
  {
    icon: "window.svg",
    title: "Real-time Monitoring",
    description:
      "Get immediate alerts and notifications about potentially dangerous driving behaviors as they happen.",
  },
  {
    icon: "file.svg",
    title: "Detailed Analytics",
    description:
      "Access in-depth reports and visualizations showing patterns, trends, and areas for improvement.",
  },
];

// Statistics data
const stats = [
  { value: "57%", label: "Reduction in accidents" },
  { value: "12K+", label: "Drivers monitored" },
  { value: "87%", label: "User satisfaction" },
  { value: "250+", label: "Road safety workshops" },
];

export default function Home() {
  // For animated sections
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <>
      <Hero />

      {/* Call to action */}
      <section className="section bg-primary-50 dark:bg-dark-800">
        <div className="container-custom text-center">
          <motion.h2
            className="heading-lg text-gradient mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Take Control of Road Safety Today
          </motion.h2>

          <motion.p
            className="text-lg mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of transportation companies in Uganda who trust
            SafeDrive to keep their drivers safe and operations efficient.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link href="/dashboard">
              <Button>
                Launch Dashboard
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  ></path>
                </svg>
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline">Create Account</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features section */}
      <section className="section">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-lg mb-4">
              <span className="text-gradient">Powerful Features</span> for Safer
              Roads
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
              Our comprehensive suite of tools helps you monitor, analyze, and
              improve driver behavior across your fleet.
            </p>
          </motion.div>

          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={featureVariants} custom={i}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Statistics */}
      <section className="section bg-gradient">
        <div className="container-custom py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="glass-card bg-white/30 dark:bg-dark-800/30 text-white p-6 rounded-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-4xl font-display font-bold mb-2">
                  {stat.value}
                </p>
                <p className="text-sm uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial section */}
      <section className="section">
        <div className="container-custom">
          <motion.div
            className="glass-card max-w-4xl mx-auto text-center py-16 px-8"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <div className="flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
            <blockquote className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200 mb-6">
              "SafeDrive has transformed how we manage our transportation fleet.
              The real-time alerts have helped us identify risky driving
              behavior before it leads to accidents."
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                JN
              </div>
              <div className="ml-4 text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  John Nuwagaba
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Operations Director, Kampala Transit
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section bg-primary-50 dark:bg-dark-800">
        <div className="container-custom text-center">
          <motion.h2
            className="heading-lg mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to <span className="text-gradient">Make Roads Safer</span>?
          </motion.h2>
          <motion.p
            className="text-lg mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join our community of safety-focused organizations committed to
            saving lives on Uganda's roads.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link href="/signup">
              <Button>Get Started Now</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
