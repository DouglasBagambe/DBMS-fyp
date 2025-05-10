// src/components/Home.js

"use client";

import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

// Import icons from heroicons
import {
  ChartBarIcon,
  BellAlertIcon,
  DocumentChartBarIcon,
  BoltIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  // Refs for animation elements
  const heroRef = useRef(null);
  const featureRefs = useRef([]);

  // Intersection Observer setup for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe hero section
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    // Observe feature cards
    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Features data
  const features = [
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: "Real-time Analytics",
      description:
        "Monitor driver behavior patterns with advanced analytics tools.",
      color: "text-blue-400",
      borderColor: "border-blue-400/20",
    },
    {
      icon: <BellAlertIcon className="w-6 h-6" />,
      title: "Incident Alerts",
      description:
        "Receive immediate notifications for unsafe driving behaviors.",
      color: "text-indigo-400",
      borderColor: "border-indigo-400/20",
    },
    {
      icon: <DocumentChartBarIcon className="w-6 h-6" />,
      title: "Comprehensive Reports",
      description: "Generate detailed reports to track improvements over time.",
      color: "text-emerald-400",
      borderColor: "border-emerald-400/20",
    },
    {
      icon: <BoltIcon className="w-6 h-6" />,
      title: "AI-Powered Insights",
      description: "Leverage machine learning to predict potential risks.",
      color: "text-amber-400",
      borderColor: "border-amber-400/20",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <header
        ref={heroRef}
        className="relative py-24 md:py-32 overflow-hidden opacity-0 transition-all duration-1000 translate-y-8"
      >
        {/* Subtle background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-96 -top-96 w-[800px] h-[800px] rounded-full bg-blue-950/30 blur-3xl" />
          <div className="absolute -left-96 -bottom-96 w-[800px] h-[800px] rounded-full bg-indigo-950/30 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Driver Behavior{" "}
                <span className="text-blue-400">Monitoring</span> System
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Advanced analytics and insights to improve driver safety and
                efficiency with real-time monitoring and AI-powered
                recommendations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-blue-500 transition-all shadow-md shadow-blue-900/20 group"
                >
                  Get Started
                  <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Improved Dashboard Preview */}
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
                {/* Dashboard mockup */}
                <div className="aspect-[16/9] bg-gradient-to-br from-gray-900 to-gray-800 p-3">
                  {/* Dashboard header */}
                  <div className="flex justify-between items-center mb-4 px-3 py-2 bg-gray-800/70 rounded-lg backdrop-blur-sm border border-gray-700/30">
                    <div className="flex space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/70"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70"></div>
                    </div>
                    <div className="flex space-x-3">
                      <div className="w-20 h-1.5 bg-gray-700/80 rounded-full"></div>
                      <div className="w-16 h-1.5 bg-gray-700/80 rounded-full"></div>
                      <div className="w-24 h-1.5 bg-gray-700/80 rounded-full"></div>
                    </div>
                  </div>

                  {/* Dashboard metrics */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30">
                      <div className="h-1 w-1/3 bg-blue-400/70 rounded-full mb-2.5"></div>
                      <div className="w-12 h-1.5 bg-gray-600/70 rounded-full mb-2"></div>
                      <div className="w-16 h-3 bg-gray-600/70 rounded-full"></div>
                    </div>
                    <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30">
                      <div className="h-1 w-2/3 bg-indigo-400/70 rounded-full mb-2.5"></div>
                      <div className="w-12 h-1.5 bg-gray-600/70 rounded-full mb-2"></div>
                      <div className="w-16 h-3 bg-gray-600/70 rounded-full"></div>
                    </div>
                    <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30">
                      <div className="h-1 w-1/2 bg-emerald-400/70 rounded-full mb-2.5"></div>
                      <div className="w-12 h-1.5 bg-gray-600/70 rounded-full mb-2"></div>
                      <div className="w-16 h-3 bg-gray-600/70 rounded-full"></div>
                    </div>
                  </div>

                  {/* Chart area */}
                  <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 mb-4 border border-gray-700/30">
                    <div className="flex justify-between mb-3">
                      <div className="w-24 h-1.5 bg-gray-600/70 rounded-full"></div>
                      <div className="flex space-x-2">
                        <div className="w-6 h-1.5 bg-gray-600/70 rounded-full"></div>
                        <div className="w-6 h-1.5 bg-gray-600/70 rounded-full"></div>
                        <div className="w-6 h-1.5 bg-gray-600/70 rounded-full"></div>
                      </div>
                    </div>
                    <div className="h-24 flex items-end space-x-1">
                      <div className="w-1/12 bg-blue-500/60 h-4/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500/60 h-3/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500/60 h-5/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500/60 h-2/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500/60 h-4/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500/60 h-6/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500/60 h-3/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500/60 h-2/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500/60 h-5/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500/60 h-3/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500/60 h-4/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500/60 h-1/6 rounded-t"></div>
                    </div>
                  </div>

                  {/* Bottom section */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30">
                      <div className="flex justify-between mb-3">
                        <div className="w-14 h-1.5 bg-gray-600/70 rounded-full"></div>
                        <div className="w-8 h-1.5 bg-gray-600/70 rounded-full"></div>
                      </div>
                      <div className="flex space-x-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70"></div>
                        <div className="w-16 h-1.5 bg-gray-600/70 rounded-full"></div>
                      </div>
                      <div className="flex space-x-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400/70"></div>
                        <div className="w-20 h-1.5 bg-gray-600/70 rounded-full"></div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400/70"></div>
                        <div className="w-12 h-1.5 bg-gray-600/70 rounded-full"></div>
                      </div>
                    </div>
                    <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border-2 border-t-blue-400/80 border-blue-400/20 animate-spin"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
              <div className="absolute -top-6 -left-6 w-28 h-28 bg-indigo-500/10 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Trusted by logos - with more subtle design */}
          <div className="mt-20 text-center">
            <p className="text-gray-400 mb-6 text-sm uppercase tracking-wider">
              Trusted by industry leaders
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              <div className="h-6 w-20 bg-gray-700/30 rounded-full"></div>
              <div className="h-6 w-28 bg-gray-700/30 rounded-full"></div>
              <div className="h-6 w-24 bg-gray-700/30 rounded-full"></div>
              <div className="h-6 w-18 bg-gray-700/30 rounded-full"></div>
              <div className="h-6 w-20 bg-gray-700/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section - with sleeker, cleaner hover effects */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Our comprehensive suite of tools helps you monitor, analyze, and
              improve driver behavior
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                ref={(el) => (featureRefs.current[index] = el)}
                className={`group relative bg-gray-800/30 rounded-lg p-6 border ${feature.borderColor}
                           opacity-0 transition-all duration-700 translate-y-12 hover:translate-y-0 hover:shadow-lg`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Subtle background glow on hover */}
                <div className="absolute inset-0 -z-10 rounded-lg opacity-0 group-hover:opacity-10 bg-gradient-to-b from-white to-transparent transition-opacity duration-300" />

                {/* Feature icon with subtle colored border */}
                <div
                  className={`flex items-center justify-center w-12 h-12 mb-5 rounded-lg 
                              bg-gray-800/60 ${feature.color} border ${feature.borderColor} p-2.5`}
                >
                  {feature.icon}
                </div>

                <h3
                  className={`text-lg font-semibold mb-2 group-hover:${feature.color} transition-colors duration-300`}
                >
                  {feature.title}
                </h3>

                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - with more subtle design */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gray-800/80"></div>
          <div className="absolute -left-1/4 -bottom-1/4 w-1/2 h-1/2 bg-blue-950/30 rounded-full blur-3xl"></div>
          <div className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 bg-indigo-950/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Fleet Management?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of companies improving safety and efficiency with
              our driver monitoring system.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/signup"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-blue-500 transition-all shadow-md shadow-blue-900/30"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Custom styles for animations */}
      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
};

export default Home;
