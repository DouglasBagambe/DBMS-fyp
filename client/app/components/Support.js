"use client";
import React, { useState } from "react";
import Header from "./Header";
import {
  Headphones,
  Mail,
  Phone,
  HelpCircle,
  Book,
  Wrench,
} from "lucide-react";

const Support = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "How do I install the camera system?",
      answer:
        "Mount the camera securely with a clear view of the driver, connect it to the Arduino board, and power it via the vehicle's supply. Follow the detailed installation guide in the user manual (SRS 2.6), ensuring proper alignment for optimal video capture. Test the setup with the onboard processing unit before use. Contact support@dbms.com for hardware issues.",
    },
    {
      question: "What should I do if alerts don’t trigger?",
      answer:
        "Verify the camera feed quality, ensure the Arduino is powered, check internet connectivity (SRS 3.4), and restart the system. Inspect for obstructions (SRS 2.7) or low battery. If unresolved, submit a ticket to support@dbms.com with error logs or call +256 123 456 789 (SRS 6.4).",
    },
    {
      question: "How do I access driver logs?",
      answer:
        "Log into the web interface (SRS 3.1) using your fleet manager credentials, navigate to the dashboard, and access real-time logs or generate detailed reports under analytics (SRS 4.2, REQ-8). Ensure your device has internet access for synchronization.",
    },
    {
      question: "What distractions does the system detect?",
      answer:
        "The system identifies drowsiness (eyes closed >3s), phone usage (hand gestures), eating (hand-to-mouth), and talking to passengers (>5s head turn) using Viola-Jones and AlexNet models with 85%+ accuracy (SRS 4.1, REQ-2, REQ-3). Future updates may include additional behaviors.",
    },
    {
      question: "How is driver data stored and secured?",
      answer:
        "Data is logged in a local MySQL database (SRS REQ-6), synced to a central server with AES-256 encryption (SRS 5.3, REQ-7), and retained for one year (SRS REQ-9) to comply with Ugandan safety regulations. Access is restricted to authorized personnel.",
    },
    {
      question: "Can I customize alert thresholds?",
      answer:
        "Current thresholds (e.g., 3s for drowsiness) are fixed but may be adjustable in future releases (SRS Appendix C, TBD-1). Contact support@dbms.com to request updates or provide feedback on desired thresholds.",
    },
    {
      question: "What hardware is required?",
      answer:
        "You need a high-resolution camera, Arduino board, buzzer, and an onboard processing unit with GPU support (SRS 3.2, 2.4). Ensure compatibility with Windows, Linux, or macOS (SRS 2.4) and follow the installation manual for setup.",
    },
    {
      question: "How do I report a system failure?",
      answer:
        "Email support@dbms.com or call +256 123 456 789 (9 AM - 5 PM EAT) with details including vehicle ID, error description, and logs (SRS 6.4). For urgent issues, request on-site support via the ticket system.",
    },
    {
      question: "Why is the system slow?",
      answer:
        "Slowness may result from low GPU resources, poor internet (SRS 3.4), or large datasets (SRS 2.5). Ensure your processing unit meets 8GB RAM minimum (SRS 2.5) and clear cached data. Contact support for optimization.",
    },
    {
      question: "How do I update the software?",
      answer:
        "Download the latest version from the official DBMS portal, install Node.js (SRS 2.5), and follow the update guide. Back up data before proceeding. Support can assist if updates fail.",
    },
    {
      question: "What if the camera feed is blurry?",
      answer:
        "Check for obstructions, clean the lens, adjust the camera angle (SRS 2.7), and ensure proper lighting. Replace the camera if hardware damage is suspected, and contact support for a replacement.",
    },
  ];

  const contactInfo = {
    email: "support@dbms.com",
    phone: "+256 123 456 789",
    hours: "Mon-Fri, 9 AM - 5 PM (EAT)",
    supportPortal: "https://dbms-support-portal.com",
  };

  const troubleshootingGuides = [
    {
      title: "Camera Setup Issues",
      steps:
        "1. Verify power connection. 2. Adjust camera angle. 3. Test with a different port. 4. Contact support if unresolved.",
    },
    {
      title: "Alert System Failures",
      steps:
        "1. Check buzzer functionality. 2. Ensure internet sync (SRS 3.4). 3. Restart the unit. 4. Submit a ticket.",
    },
    {
      title: "Data Sync Problems",
      steps:
        "1. Confirm internet availability. 2. Check local database integrity (SRS REQ-6). 3. Resync at shift end (SRS REQ-7). 4. Seek support.",
    },
  ];

  const handleFAQToggle = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Support Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive assistance for the Driver Behavior Monitoring System
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FAQs */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <HelpCircle className="w-5 h-5 mr-2 text-primary-500" />{" "}
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <button
                    onClick={() => handleFAQToggle(index)}
                    className="w-full text-left py-3 text-lg font-medium text-gray-900 dark:text-gray-200 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    {faq.question}
                    <span>{openFAQ === index ? "−" : "+"}</span>
                  </button>
                  {openFAQ === index && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2 mb-4">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <Headphones className="w-5 h-5 mr-2 text-primary-500" /> Contact
              Us
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-primary-500 mr-2" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-primary-500 mr-2" />
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <HelpCircle className="w-5 h-5 text-primary-500 mr-2" />
                <span>{contactInfo.hours}</span>
              </div>
              <div className="flex items-center">
                <Book className="w-5 h-5 text-primary-500 mr-2" />
                <a
                  href={contactInfo.supportPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Support Portal
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting Guides */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
            <Wrench className="w-5 h-5 mr-2 text-primary-500" /> Troubleshooting
            Guides
          </h2>
          <div className="space-y-4">
            {troubleshootingGuides.map((guide, index) => (
              <div
                key={index}
                className="border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                  {guide.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {guide.steps}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-6 bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Additional Resources
          </h2>
          <p className="text-white/90 mb-4">
            Access the{" "}
            <a
              href="https://dbms-user-manual.com"
              className="underline hover:text-white/70"
            >
              User Manual
            </a>{" "}
            for installation and usage, the{" "}
            <a
              href="https://dbms-tech-docs.com"
              className="underline hover:text-white/70"
            >
              Technical Documentation
            </a>{" "}
            for developers, or join our{" "}
            <a
              href="https://dbms-community.com"
              className="underline hover:text-white/70"
            >
              Community Forum
            </a>{" "}
            for peer support.
          </p>
          <button className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-md hover:bg-opacity-30 transition-colors">
            Request On-Site Support
          </button>
        </div>
      </main>
    </div>
  );
};

export default Support;
