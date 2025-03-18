// app/page.js

"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Hero from "./components/Hero";
import FeatureCard from "./components/FeatureCard";
import Link from "next/link";
import Button from "./components/Button";
import Image from "next/image";

export default function Home() {
  // Animations for scrolling sections
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Intersection observer hooks for each section
  const [featuresRef, featuresInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const featuresControls = useAnimation();

  const [statsRef, statsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const statsControls = useAnimation();

  const [ctaRef, ctaInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const ctaControls = useAnimation();

  // Start animations when sections come into view
  useEffect(() => {
    if (featuresInView) featuresControls.start("visible");
    if (statsInView) statsControls.start("visible");
    if (ctaInView) ctaControls.start("visible");
  }, [
    featuresInView,
    statsInView,
    ctaInView,
    featuresControls,
    statsControls,
    ctaControls,
  ]);

  return (
    <div className="overflow-hidden">
      <Hero />

      {/* Features Section */}
      <section className="section bg-neutral-50 dark:bg-neutral-900">
        <div className="container-custom">
          <motion.div
            ref={featuresRef}
            animate={featuresControls}
            initial="hidden"
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="gradient-text mb-4">
              Comprehensive Road Safety Solutions
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto"
            >
              Our integrated platform provides real-time monitoring and advanced
              analytics to improve driver behavior and reduce accidents on
              Uganda's roads.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={featuresControls}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <FeatureCard
              icon="chart-bar"
              title="Real-time Analytics"
              description="Monitor driver performance metrics and safety indicators in real-time with our advanced dashboard."
            />
            <FeatureCard
              icon="shield-check"
              title="Risk Assessment"
              description="Identify high-risk behaviors and receive proactive recommendations to improve safety."
            />
            <FeatureCard
              icon="document-report"
              title="Customizable Reports"
              description="Generate comprehensive reports with actionable insights tailored to your specific needs."
            />
            <FeatureCard
              icon="bell"
              title="Instant Alerts"
              description="Receive immediate notifications for critical safety events and policy violations."
            />
            <FeatureCard
              icon="chart-pie"
              title="Performance Trends"
              description="Track long-term safety improvements and identify areas requiring additional attention."
            />
            <FeatureCard
              icon="device-mobile"
              title="Mobile Integration"
              description="Access your safety data anytime, anywhere with our fully responsive mobile interface."
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container-custom">
          <motion.div
            ref={statsRef}
            animate={statsControls}
            initial="hidden"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
          >
            <motion.div variants={fadeInUp} className="p-6">
              <h3 className="text-4xl font-bold mb-2">35%</h3>
              <p className="text-primary-100">Reduction in Accidents</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="p-6">
              <h3 className="text-4xl font-bold mb-2">28K+</h3>
              <p className="text-primary-100">Drivers Monitored</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="p-6">
              <h3 className="text-4xl font-bold mb-2">5.2M</h3>
              <p className="text-primary-100">Kilometers Tracked</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="p-6">
              <h3 className="text-4xl font-bold mb-2">97%</h3>
              <p className="text-primary-100">Client Satisfaction</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-white dark:bg-neutral-800">
        <div className="container-custom">
          <motion.div
            ref={ctaRef}
            animate={ctaControls}
            initial="hidden"
            variants={staggerContainer}
            className="flex flex-col items-center text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to Transform Road Safety in Uganda?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-neutral-600 dark:text-neutral-300 max-w-2xl mb-8"
            >
              Join organizations across Uganda that are using SafeDrive DBMS to
              create safer roads through data-driven insights and real-time
              monitoring.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/dashboard">
                <Button size="lg">Explore Dashboard</Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg">
                  Start Free Trial
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
