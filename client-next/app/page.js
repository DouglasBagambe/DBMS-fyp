/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { motion } from "framer-motion";
import Hero from "./components/Hero";
import FeatureCard from "./components/FeatureCard";
import Button from "./components/Button";
import Link from "next/link";
import {
  FiActivity,
  FiAlertCircle,
  FiBarChart2,
  FiClock,
  FiUsers,
  FiSettings,
  FiHelpCircle,
  FiShield,
  FiTruck,
  FiCloudRain,
} from "react-icons/fi";

export default function Home() {
  const features = [
    {
      title: "Real-Time Monitoring",
      description:
        "Monitor driver attention and detect distraction events as they happen with our advanced machine learning algorithms.",
      icon: <FiActivity size={28} />,
    },
    {
      title: "Instant Alerts",
      description:
        "Receive immediate notifications when distracted driving is detected to prevent potential accidents.",
      icon: <FiAlertCircle size={28} />,
    },
    {
      title: "Comprehensive Analytics",
      description:
        "Access detailed insights and reports to track driver safety metrics and identify patterns over time.",
      icon: <FiBarChart2 size={28} />,
    },
  ];

  const benefits = [
    {
      title: "Reduce Accidents",
      description:
        "Prevent potential accidents by detecting and alerting distracted driving behaviors before they lead to incidents.",
      icon: <FiShield size={24} />,
    },
    {
      title: "Improve Driver Behavior",
      description:
        "Help drivers develop better habits with personalized feedback and regular safety reports.",
      icon: <FiUsers size={24} />,
    },
    {
      title: "Save Time & Resources",
      description:
        "Minimize accident-related downtime and reduce insurance premiums with improved safety records.",
      icon: <FiClock size={24} />,
    },
  ];

  return (
    <>
      <Hero />

      {/* Features Section */}
      <section id="features" className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Powerful Features for{" "}
              <span className="text-primary-600">Maximum Safety</span>
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              SafeDrive combines powerful technology with an intuitive interface
              to keep your drivers safe on the road.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              How <span className="text-primary-600">SafeDrive</span> Works
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Our AI-powered system makes driver safety monitoring simple and
              effective
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start">
                  <div className="bg-primary-600 text-white text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center shrink-0 mr-4">
                    {step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {step === 1
                        ? "Install the System"
                        : step === 2
                        ? "AI Monitors the Driver"
                        : "Get Safety Insights"}
                    </h3>
                    <p className="text-gray-600">
                      {step === 1
                        ? "Quick and easy installation in any vehicle with minimal setup required."
                        : step === 2
                        ? "Our AI continuously analyzes driver behavior and detects distraction in real-time."
                        : "Access detailed reports and analytics to improve overall fleet safety."}
                    </p>
                  </div>
                </div>

                {index < 2 && (
                  <div className="hidden lg:block absolute top-6 left-6 w-full h-0.5 bg-gray-200 z-0"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="section bg-primary-600 text-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Benefits of Using SafeDrive
            </motion.h2>
            <motion.p
              className="text-xl text-primary-100 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Protect your drivers, reduce costs, and improve fleet management
              with our comprehensive solution
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-6">
                  <div className="text-white">{benefit.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-primary-100">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Industries We Serve
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              SafeDrive is designed to work across various industries that rely
              on driver safety
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Logistics & Delivery", icon: <FiTruck size={32} /> },
              { name: "Public Transportation", icon: <FiUsers size={32} /> },
              { name: "Fleet Management", icon: <FiSettings size={32} /> },
              { name: "Ride Sharing", icon: <FiUsers size={32} /> },
              { name: "Emergency Services", icon: <FiAlertCircle size={32} /> },
              { name: "Weather Monitoring", icon: <FiCloudRain size={32} /> },
            ].map((industry, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-primary-600 flex justify-center mb-4">
                  {industry.icon}
                </div>
                <h3 className="text-xl font-bold">{industry.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="bg-primary-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Ready to Enhance Your Fleet's Safety?
            </motion.h2>
            <motion.p
              className="text-xl mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join thousands of fleet managers who have improved driver safety
              and reduced accidents with SafeDrive.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Button variant="white">Get Started</Button>
              <Link
                href="/contact"
                className="inline-block ml-4 px-6 py-3 rounded-lg bg-transparent border border-white text-white font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-300"
              >
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Find answers to common questions about SafeDrive's driver
              monitoring system
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "How does SafeDrive detect distracted driving?",
                answer:
                  "SafeDrive uses AI-powered computer vision to analyze driver behavior in real-time, detecting signs of distraction such as looking away from the road, phone usage, or drowsiness.",
              },
              {
                question: "Is SafeDrive compatible with all vehicles?",
                answer:
                  "Yes, our system can be installed in any vehicle type, from passenger cars to commercial trucks, with a simple setup process.",
              },
              {
                question:
                  "How quickly are alerts sent when distraction is detected?",
                answer:
                  "Alerts are sent in real-time, typically within 1-2 seconds of detecting distracted behavior, allowing for immediate intervention.",
              },
              {
                question: "What kind of reports does SafeDrive provide?",
                answer:
                  "Our system generates comprehensive safety reports including distraction events, driver safety scores, trend analysis, and actionable insights for improvement.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="border-b border-gray-200 pb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/support"
              className="text-primary-600 font-semibold hover:text-primary-700 flex items-center justify-center"
            >
              View all FAQs <FiHelpCircle className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              What Our Customers Say
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Hear from fleet managers who have transformed their safety
              operations with SafeDrive
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Since implementing SafeDrive, we've seen a 60% reduction in distracted driving incidents and a significant decrease in accidents.",
                author: "Sarah Johnson",
                company: "FleetTech Logistics",
              },
              {
                quote:
                  "The real-time alerts have been a game changer for our delivery drivers. We can address safety concerns immediately before they become problems.",
                author: "Michael Chen",
                company: "Express Delivery Co.",
              },
              {
                quote:
                  "The analytics dashboard gives us clear insights into driver behavior patterns, helping us develop targeted training programs that work.",
                author: "David Rodriguez",
                company: "Metro Transit Authority",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-primary-600 mb-4 text-5xl">"</div>
                <p className="text-gray-700 mb-6">{testimonial.quote}</p>
                <div>
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="section bg-primary-600 text-white">
        <div className="container-custom text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Start Protecting Your Drivers Today
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button variant="white" className="mx-2">
              Request Demo
            </Button>
            <Button
              variant="outline"
              className="mx-2 bg-transparent border border-white hover:bg-white hover:text-primary-600"
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
