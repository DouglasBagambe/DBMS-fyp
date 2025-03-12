/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
// client/src/components/Home.js

// src/components/Home.js
import React from "react";
import { Link } from "react-router-dom";
// import heroImage from "../assets/hero-image.svg"; // You'll need to add this image to your assets folder

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <svg
              className="h-8 w-8 text-primary-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="ml-2 text-xl font-bold text-gray-800">
              SafeDrive
            </span>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-primary-600">
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
              Enhance Driver Safety with AI-Powered Monitoring
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Our Driver Distraction Recognition system helps fleet managers
              improve safety, reduce accidents, and save lives by detecting
              distracted driving behaviors in real-time.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/signup"
                className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 font-medium transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-8">
            <img
              src="/api/placeholder/600/400"
              alt="Driver monitoring system"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time Monitoring",
                description:
                  "Detect distracted driving behaviors as they happen with our advanced AI system.",
                icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
              },
              {
                title: "Comprehensive Analytics",
                description:
                  "Gain insights into driver behavior patterns with detailed reports and analytics.",
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              },
              {
                title: "Instant Alerts",
                description:
                  "Receive immediate notifications when risky driving behaviors are detected.",
                icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-4">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={feature.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <svg
                  className="h-8 w-8 text-primary-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="ml-2 text-xl font-bold">SafeDrive</span>
              </div>
              <p className="mt-2 text-gray-400">
                Enhancing road safety through technology
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Product
                </h3>
                <div className="mt-4 space-y-2">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary-400 block"
                  >
                    Features
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary-400 block"
                  >
                    Pricing
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary-400 block"
                  >
                    FAQ
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Company
                </h3>
                <div className="mt-4 space-y-2">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary-400 block"
                  >
                    About
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary-400 block"
                  >
                    Blog
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary-400 block"
                  >
                    Contact
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Legal
                </h3>
                <div className="mt-4 space-y-2">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary-400 block"
                  >
                    Privacy
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary-400 block"
                  >
                    Terms
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} SafeDrive. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
