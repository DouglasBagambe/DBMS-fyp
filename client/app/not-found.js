// app/not-found.js

"use client";

import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow-sm"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
