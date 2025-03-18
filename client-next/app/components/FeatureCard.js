// app/components/FeatureCard.js

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass-card group hover:bg-white/90 dark:hover:bg-dark-800/90 h-full flex flex-col">
      <div className="relative mb-5 w-12 h-12">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <Image
            src={`/${icon}`}
            alt={title}
            width={24}
            height={24}
            className="w-6 h-6 text-primary-600 dark:text-primary-400"
          />
        </div>
      </div>

      <h3 className="text-xl font-bold mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
        {title}
      </h3>

      <p className="text-gray-700 dark:text-gray-300 flex-grow">
        {description}
      </p>

      <div className="mt-6 flex items-center text-primary-600 dark:text-primary-400 font-medium">
        <span className="mr-2">Learn more</span>
        <svg
          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </div>
    </div>
  );
}
