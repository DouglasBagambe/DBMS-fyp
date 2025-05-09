// src/components/Home.js

"use client";

import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

// Import icons from heroicons (assuming they're installed)
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
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: "Real-time Analytics",
      description:
        "Monitor driver behavior patterns with advanced analytics tools.",
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      icon: <BellAlertIcon className="w-8 h-8" />,
      title: "Incident Alerts",
      description:
        "Receive immediate notifications for unsafe driving behaviors.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: <DocumentChartBarIcon className="w-8 h-8" />,
      title: "Comprehensive Reports",
      description: "Generate detailed reports to track improvements over time.",
      gradient: "from-green-400 to-emerald-500",
    },
    {
      icon: <BoltIcon className="w-8 h-8" />,
      title: "AI-Powered Insights",
      description: "Leverage machine learning to predict potential risks.",
      gradient: "from-orange-400 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-theme-background">
      {/* Hero Section */}
      <header
        ref={heroRef}
        className="relative py-20 md:py-32 overflow-hidden opacity-0 transition-all duration-1000 translate-y-8"
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-96 -top-96 w-[800px] h-[800px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -left-96 -bottom-96 w-[800px] h-[800px] rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-theme-foreground">
                Driver Behavior{" "}
                <span className="text-blue-500">Monitoring</span> System
              </h1>
              <p className="text-xl text-theme-foreground/80 leading-relaxed">
                Advanced analytics and insights to improve driver safety and
                efficiency with real-time monitoring and AI-powered
                recommendations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-600 transition-all transform hover:-translate-y-1 hover:shadow-lg group"
                >
                  Get Started
                  <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Hero Image/Dashboard Preview */}
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm">
                {/* Dashboard mockup */}
                <div className="aspect-[16/9] bg-gradient-to-br from-slate-900 to-slate-800 p-2">
                  {/* Dashboard header */}
                  <div className="flex justify-between items-center mb-3 px-3 py-2 bg-slate-800 rounded-md">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-20 h-2 bg-slate-700 rounded"></div>
                      <div className="w-16 h-2 bg-slate-700 rounded"></div>
                      <div className="w-24 h-2 bg-slate-700 rounded"></div>
                    </div>
                  </div>

                  {/* Dashboard content */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-slate-800 rounded-md p-2">
                      <div className="w-full h-1.5 bg-blue-500 rounded mb-2"></div>
                      <div className="w-16 h-2 bg-slate-700 rounded mb-1"></div>
                      <div className="w-10 h-4 bg-slate-700 rounded"></div>
                    </div>
                    <div className="bg-slate-800 rounded-md p-2">
                      <div className="w-full h-1.5 bg-purple-500 rounded mb-2"></div>
                      <div className="w-16 h-2 bg-slate-700 rounded mb-1"></div>
                      <div className="w-10 h-4 bg-slate-700 rounded"></div>
                    </div>
                    <div className="bg-slate-800 rounded-md p-2">
                      <div className="w-full h-1.5 bg-green-500 rounded mb-2"></div>
                      <div className="w-16 h-2 bg-slate-700 rounded mb-1"></div>
                      <div className="w-10 h-4 bg-slate-700 rounded"></div>
                    </div>
                  </div>

                  {/* Chart area */}
                  <div className="bg-slate-800 rounded-md p-3 mb-3">
                    <div className="flex justify-between mb-2">
                      <div className="w-20 h-2 bg-slate-700 rounded"></div>
                      <div className="flex space-x-1">
                        <div className="w-6 h-2 bg-slate-700 rounded"></div>
                        <div className="w-6 h-2 bg-slate-700 rounded"></div>
                        <div className="w-6 h-2 bg-slate-700 rounded"></div>
                      </div>
                    </div>
                    <div className="h-20 flex items-end space-x-1">
                      <div className="w-1/12 bg-blue-500 h-4/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500 h-3/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500 h-5/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500 h-2/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500 h-4/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500 h-6/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500 h-3/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500 h-2/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500 h-5/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500 h-3/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500 h-4/6 rounded-t"></div>
                      <div className="w-1/12 bg-blue-500 h-1/6 rounded-t"></div>
                    </div>
                  </div>

                  {/* Bottom section */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800 rounded-md p-2">
                      <div className="flex justify-between mb-2">
                        <div className="w-12 h-2 bg-slate-700 rounded"></div>
                        <div className="w-8 h-2 bg-slate-700 rounded"></div>
                      </div>
                      <div className="flex space-x-1 mb-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div className="w-12 h-2 bg-slate-700 rounded"></div>
                      </div>
                      <div className="flex space-x-1 mb-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="w-16 h-2 bg-slate-700 rounded"></div>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="w-8 h-2 bg-slate-700 rounded"></div>
                      </div>
                    </div>
                    <div className="bg-slate-800 rounded-md p-2 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-blue-500/30 animate-spin"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500 rounded-full blur-2xl opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-500 rounded-full blur-2xl opacity-20"></div>
            </div>
          </div>

          {/* Trusted by logos - optional */}
          <div className="mt-20 text-center">
            <p className="text-theme-foreground/60 mb-6">
              Trusted by industry leaders
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
              <div className="h-8 w-24 bg-theme-foreground/30 rounded"></div>
              <div className="h-8 w-32 bg-theme-foreground/30 rounded"></div>
              <div className="h-8 w-28 bg-theme-foreground/30 rounded"></div>
              <div className="h-8 w-20 bg-theme-foreground/30 rounded"></div>
              <div className="h-8 w-24 bg-theme-foreground/30 rounded"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-theme-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-theme-foreground/70 max-w-3xl mx-auto">
              Our comprehensive suite of tools helps you monitor, analyze, and
              improve driver behavior
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                ref={(el) => (featureRefs.current[index] = el)}
                className={`group relative bg-white/5 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-lg 
                           opacity-0 transition-all duration-700 translate-y-12`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 
                              bg-gradient-to-br ${feature.gradient} blur-xl transition-opacity`}
                />
                <div
                  className={`flex items-center justify-center w-16 h-16 mb-6 rounded-xl 
                                 bg-gradient-to-br ${feature.gradient} text-white p-3`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-theme-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-theme-foreground/70">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-3xl"></div>
          <div className="absolute -left-1/4 -bottom-1/4 w-1/2 h-1/2 bg-blue-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-theme-foreground mb-6">
              Ready to Transform Your Fleet Management?
            </h2>
            <p className="text-xl text-theme-foreground/70 mb-10 max-w-2xl mx-auto">
              Join thousands of companies improving safety and efficiency with
              our driver monitoring system.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/signup"
                className="px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-600 transition-all transform hover:-translate-y-1 hover:shadow-lg"
              >
                Get Started Today
              </Link>
              {/* <Link
                to="/contact"
                className="px-8 py-4 border border-blue-500 text-blue-500 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
              >
                Contact Sales
              </Link> */}
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
