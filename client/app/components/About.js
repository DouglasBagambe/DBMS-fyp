"use client";
import React from "react";
import Header from "./Header";
import { Users, Shield, BarChart, Code, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            About Driver Behavior Monitoring System
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Discover our journey to transform road safety in Uganda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mission and Vision */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary-500" /> Our Mission &
              Vision
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              The Driver Behavior Monitoring System (DBMS) is a pioneering
              final-year project by Group BSE 25-15 at Makehere University’s
              College of Computing and Information Sciences. Our mission is to
              enhance road safety by monitoring and mitigating distracted
              driving in public transport vehicles like buses, taxis, and
              lorries (SRS 1.1.1, 1.4). We aim to reduce accidents by 30%
              through real-time detection of behaviors such as drowsiness, phone
              usage, eating, and talking (SRS 1.1.4).
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Our vision extends beyond Uganda, aspiring to create a scalable,
              AI-driven solution integrable with fleet management systems
              worldwide (SRS 2.1, 5.4). We prioritize driver accountability,
              passenger safety, and compliance with local regulations (SRS 5.5,
              6.1), ensuring a future where roads are safer for all.
            </p>
          </div>

          {/* Team and Development */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary-500" /> Our Team
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              DBMS was developed by a dedicated group of students under the
              supervision of our project advisors:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-400 space-y-2">
              <li>
                <strong>Barisigara Simon (21/U/12624/PS)</strong> - Led hardware
                integration and testing.
              </li>
              <li>
                <strong>Shema Collins (21/X/20205/PS)</strong> - Focused on
                backend development with Express.js.
              </li>
              <li>
                <strong>Namayanja Patricia Linda (21/U/11024/PS)</strong> -
                Managed frontend design with React.
              </li>
              <li>
                <strong>Ainamaani Douglas Bagambe (21/U/3792)</strong> -
                Specialized in machine learning with TensorFlow.
              </li>
            </ul>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-4">
              Supervisors
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Prof. Jane Doe and Dr. John Smith, who provided invaluable
              guidance.
            </p>
          </div>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
            <Code className="w-5 h-5 mr-2 text-primary-500" /> Technology &
            Development
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            DBMS leverages cutting-edge technology, including React for the
            frontend, Express.js and Node.js for the backend, and TensorFlow for
            deep learning models like AlexNet and Viola-Jones (SRS 2.5, REQ-2,
            REQ-3). The system operates on Windows, Linux, and macOS (SRS 2.4),
            with a web interface for fleet managers (SRS 3.1) and real-time
            alerts via buzzers (SRS 3.2). Approved on October 20, 2024 (Version
            1.1), it adheres to IEEE standards and Ugandan safety laws.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Our development process involved dataset preparation, model training
            on GPU resources (SRS 2.5), and rigorous testing to meet 90%
            accuracy and 5s processing goals (SRS 5.1). The modular design
            ensures maintainability (SRS 5.4).
          </p>
        </div>

        <div className="mt-6 bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <BarChart className="w-5 h-5 mr-2" /> Impact, Future, &
            Acknowledgments
          </h2>
          <p className="text-white/90 mb-4">
            DBMS has already shown potential to reduce road accidents by 30%
            through early detection (SRS 1.1.4). Future plans include scaling to
            hundreds of vehicles (SRS 5.4), integrating advanced AI for new
            distractions (SRS Appendix C), and exploring mobile apps for
            managers. We aim to collaborate with Ugandan transport authorities
            for broader adoption.
          </p>
          <p className="text-white/90 mb-4">
            We extend gratitude to Makehere University, our supervisors, and
            peers for their support. Special thanks to Nankya P.L. (2011) for
            road safety insights (SRS 7) and the IEEE community for technical
            guidance.
          </p>
          <button className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-md hover:bg-opacity-30 transition-colors">
            Join Our Community
          </button>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-primary-500" /> Global
            Perspective
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Inspired by global efforts to improve road safety (SRS 2.1), DBMS
            addresses challenges highlighted in Uganda’s transport sector (SRS
            7). Our solution aligns with international standards, offering a
            model for other developing nations to adapt, with potential
            partnerships in East Africa.
          </p>
        </div>
      </main>
    </div>
  );
};

export default About;
