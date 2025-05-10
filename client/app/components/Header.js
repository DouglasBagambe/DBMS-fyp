/* eslint-disable @next/next/no-img-element */
// app/components/Header.js

"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
    };
    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, []);

  // Toggle menus
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    console.log("User logged out");
  };

  return (
    <header className="w-full sticky top-0 z-50 px-3 md:px-5 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between backdrop-blur-md bg-theme-background bg-opacity-75 border border-blue-500 rounded-full px-4 py-2 md:px-6 shadow-lg transition-all duration-300 hover:shadow-xl">
        {/* Logo Section */}
        <div className="flex items-center justify-center">
          <Link
            to="/"
            className="flex items-center text-theme-foreground no-underline"
          >
            <img
              src="/dbms-logo1.svg"
              alt="DBMS Logo"
              className="w-10 h-10 mr-2"
            />
            <h1 className="m-0 text-xl md:text-2xl font-bold">
              <span className="text-blue-500 transition-colors duration-300">
                DB
              </span>
              <span className="text-theme-foreground">MS</span>
            </h1>
          </Link>
        </div>
        <button
          className="md:hidden flex items-center justify-center mr-auto ml-4 text-theme-foreground"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {showMobileMenu ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="font-medium text-base text-theme-foreground px-4 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/analytic"
                className="font-medium text-base text-theme-foreground px-4 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Analytics
              </Link>
            </>
          )}
          <Link
            to="/about"
            className="font-medium text-base text-theme-foreground px-4 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            About
          </Link>
          <Link
            to="/support"
            className="font-medium text-base text-theme-foreground px-4 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Support
          </Link>
        </nav>

        {/* Right side: Login button or Profile */}
        <div className="flex items-center">
          {!isAuthenticated ? (
            // Login Button
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-full font-medium text-sm hover:from-blue-700 hover:to-blue-500 hover:shadow-lg hover:shadow-blue-300/30 transition-all duration-300 transform hover:scale-105"
            >
              <span>Login</span>
              <div className="flex items-center justify-center w-5 h-5 bg-white rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Link>
          ) : (
            // Profile Button
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={toggleProfileMenu}
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-full font-medium text-sm hover:shadow-lg hover:shadow-blue-300/30 transition-all duration-300 transform hover:scale-105"
                aria-label="Toggle profile menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Profile dropdown menu */}
              {showProfileMenu && (
                <div className="absolute top-12 right-0 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-in-down">
                  <Link
                    to="/userprofile"
                    className="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    User Profile
                  </Link>
                  <Link
                    to="/notifications"
                    className="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Notifications
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      3
                    </span>
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 transition-colors"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div
          ref={mobileMenuRef}
          className="absolute top-16 left-4 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 border border-gray-200 dark:border-gray-700 animate-fade-in-down"
        >
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/analytics"
                className="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Analytics
              </Link>
            </>
          )}
          <Link
            to="/about"
            className="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setShowMobileMenu(false)}
          >
            About
          </Link>
          <Link
            to="/support"
            className="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setShowMobileMenu(false)}
          >
            Support
          </Link>
          {isAuthenticated && (
            <>
              <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
              <Link
                to="/userprofile"
                className="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                User Profile
              </Link>
              <button
                className="block w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 transition-colors"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
