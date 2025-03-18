// app/components/Hero.js

"use client";

import React from "react";
import { motion } from "framer-motion";
import Button from "./Button";
import Link from "next/link";
import {
  FiArrowRight,
  FiShield,
  FiAlertTriangle,
  FiActivity,
} from "react-icons/fi";

const Hero = () => {
  return (
    <div className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-gradient-to-b from-primary-50 to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary-600"
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.4,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left content */}
          <motion.div
            className="w-full lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-block mb-4 px-4 py-1 rounded-full bg-primary-100 text-primary-600 font-medium text-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              AI-Powered Safety Solution
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Enhance Driver Safety with{" "}
              <span className="text-primary-600">AI-Powered</span> Monitoring
            </motion.h1>

            <motion.p
              className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              SafeDrive uses cutting-edge AI technology to detect driver
              distractions in real-time, helping prevent accidents and save
              lives on the road.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="/signup">
                <Button variant="primary" className="group">
                  Get Started{" "}
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary">Sign In</Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right content - Illustration */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative mx-auto max-w-md lg:max-w-full">
              {/* Main illustration */}
              <div className="relative z-10 bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
                  {/* This would be an actual image in production */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="relative w-5/6 h-3/4 rounded-xl bg-gray-800 overflow-hidden shadow-inner">
                        {/* Car dashboard representation */}
                        <div className="absolute inset-0 flex flex-col">
                          <div className="h-1/4 bg-gray-900"></div>
                          <div className="flex-1 grid grid-cols-3 gap-2 p-3">
                            <div className="col-span-2 bg-black rounded-lg flex items-center justify-center">
                              <div className="w-full h-full relative p-2">
                                {/* Driver detection box */}
                                <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-green-400 rounded-md border-dashed flex items-center justify-center">
                                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                                    <FiShield className="text-white" />
                                  </div>
                                </div>
                                {/* Alert indicator */}
                                <div className="absolute top-2 right-2 text-xs px-2 py-1 bg-red-500 text-white rounded-full flex items-center">
                                  <FiAlertTriangle className="mr-1" size={12} />
                                  Alert
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex-1 bg-gray-700 rounded-lg flex items-center justify-center">
                                <FiActivity
                                  className="text-primary-400"
                                  size={24}
                                />
                              </div>
                              <div className="flex-1 bg-gray-700 rounded-lg"></div>
                              <div className="flex-1 bg-gray-700 rounded-lg"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4">
                  <div className="h-2 w-1/3 bg-primary-600 rounded-full mb-2"></div>
                  <div className="h-2 w-1/2 bg-gray-200 rounded-full"></div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-primary-100 rounded-full opacity-70 z-0"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full opacity-50 z-0"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
