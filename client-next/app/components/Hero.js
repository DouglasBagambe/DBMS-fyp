// app/components/Hero.js

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "./Button";
import ParticleBG from "./ParticleBG";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-24 overflow-hidden">
      {/* Animated background */}
      <ParticleBG />

      {/* Decorative circles */}
      <div className="absolute top-20 right-1/4 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-secondary-600/20 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold text-sm mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Transforming Road Safety in Uganda
            </motion.span>

            <motion.h1
              className="heading-xl mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Intelligent <span className="text-gradient">Driver Behavior</span>{" "}
              Monitoring System
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Real-time monitoring and analytics to reduce accidents, save
              lives, and create safer roads across Uganda.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link href="/signup">
                <Button size="lg">
                  Get Started
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

              <Link href="/analytics">
                <Button variant="outline" size="lg">
                  View Analytics
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="mt-8 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full bg-primary-${
                      (i + 5) * 100
                    } flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-dark-800`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="ml-4 text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">500+ companies</span> trust
                SafeDrive for their fleet
              </p>
            </motion.div>
          </motion.div>

          {/* Right column - Dashboard preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              {/* Dashboard mockup */}
              <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Header bar */}
                <div className="bg-gray-100 dark:bg-dark-900 p-3 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mx-auto text-xs font-medium text-gray-500 dark:text-gray-400">
                    SafeDrive Dashboard
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-primary-50 dark:bg-dark-900 p-3 rounded-lg border border-primary-100 dark:border-primary-900">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Active Drivers
                      </div>
                      <div className="text-xl font-bold text-primary-700 dark:text-primary-400">
                        247
                      </div>
                      <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded">
                        <div className="h-1 bg-primary-600 rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Risk Alerts
                      </div>
                      <div className="text-xl font-bold text-red-600 dark:text-red-400">
                        12
                      </div>
                      <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded">
                        <div className="h-1 bg-red-600 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3 mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs font-medium">
                        Safety Score Trend
                      </div>
                      <div className="text-xs text-primary-600 dark:text-primary-400">
                        Weekly
                      </div>
                    </div>
                    <div className="h-12 flex items-end space-x-1">
                      {[40, 60, 52, 75, 65, 88, 92].map((h, i) => (
                        <div key={i} className="flex-1">
                          <div
                            className={`rounded-t ${
                              h > 70
                                ? "bg-green-500"
                                : h > 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ height: `${h}%` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-1">
                      <div className="text-xs text-gray-400">Mon</div>
                      <div className="text-xs text-gray-400">Sun</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs">Real-time data</div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <div className="text-xs">Live</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl blur opacity-30 -z-10"></div>
            </div>

            {/* Floating notification */}
            <motion.div
              className="absolute -right-4 top-1/3 bg-white dark:bg-dark-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-48"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium">Speed Alert</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Driver TB204
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating stats card */}
            <motion.div
              className="absolute -left-4 bottom-10 bg-white dark:bg-dark-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-48"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              <div className="text-xs font-medium mb-2">Monthly Comparison</div>
              <div className="flex items-center text-green-500 mb-1">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs">24% improvement</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Reduced incidents
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 0.5,
          }}
        >
          <svg
            className="w-6 h-6 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
