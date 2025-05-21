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
  const mobileMenuButtonRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }

      // Fix for mobile menu, excluding clicks on the menu button itself
      if (
        showMobileMenu &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMobileMenu]);

  // Toggle menus
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Close mobile menu explicitly
  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    setShowMobileMenu(false);
    console.log("User logged out");
  };

  // Check if the current path matches a nav item
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full sticky top-0 z-50 px-3 md:px-5 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between backdrop-blur-md bg-theme-background bg-opacity-75 border border-blue-500 rounded-full px-4 py-2 md:px-6 shadow-lg transition-all duration-300 hover:shadow-xl">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center text-theme-foreground no-underline"
          >
            <img
              src="/dbms-logo1.svg"
              alt="DBMS Logo"
              className="w-8 h-8 md:w-10 md:h-10 mr-2"
            />
            <h1 className="m-0 text-lg md:text-2xl font-bold">
              <span className="text-blue-500 transition-colors duration-300">
                DB
              </span>
              <span className="text-theme-foreground">MS</span>
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-4 flex-grow justify-center">
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className={`font-medium text-base ${
                  isActive("/dashboard")
                    ? "text-blue-600 border-b-2 border-blue-500"
                    : "text-theme-foreground"
                } px-3 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200`}
              >
                Dashboard
              </Link>
              <Link
                to="/analytics"
                className={`font-medium text-base ${
                  isActive("/analytics")
                    ? "text-blue-600 border-b-2 border-blue-500"
                    : "text-theme-foreground"
                } px-3 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200`}
              >
                Analytics
              </Link>
            </>
          )}
          <Link
            to="/about"
            className={`font-medium text-base ${
              isActive("/about")
                ? "text-blue-600 border-b-2 border-blue-500"
                : "text-theme-foreground"
            } px-3 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200`}
          >
            About
          </Link>
          <Link
            to="/support"
            className={`font-medium text-base ${
              isActive("/support")
                ? "text-blue-600 border-b-2 border-blue-500"
                : "text-theme-foreground"
            } px-3 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200`}
          >
            Support
          </Link>
        </nav>

        {/* Right side: Login/Profile button and Mobile Menu */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            // Login Button
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full font-medium text-sm hover:from-blue-700 hover:to-blue-500 hover:shadow-lg hover:shadow-blue-300/30 transition-all duration-300 transform hover:scale-105"
            >
              <span>Login</span>
              <div className="flex items-center justify-center w-4 h-4 md:w-5 md:h-5 bg-white rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-2.5 w-2.5 md:h-3 md:w-3 text-blue-600"
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
                className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-full font-medium text-sm hover:shadow-lg hover:shadow-blue-300/30 transition-all duration-300 transform hover:scale-105"
                aria-label="Toggle profile menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-5 md:w-5"
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
                <div className="absolute top-11 md:top-12 right-0 w-48 md:w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-in-down z-50">
                  <div className="py-2 px-3 bg-blue-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Welcome back!
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    User Profile
                  </Link>
                  <Link
                    to="/incidents"
                    className="flex items-center px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    Notifications
                    <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      3
                    </span>
                  </Link>
                  <button
                    className="flex items-center w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 transition-colors"
                    onClick={handleLogout}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button - Moved to after login/profile button */}
          <button
            ref={mobileMenuButtonRef}
            className="md:hidden flex items-center justify-center w-8 h-8 text-theme-foreground bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
        </div>
      </div>

      {/* Mobile Navigation Menu - Enhanced Design */}
      {showMobileMenu && (
        <div
          ref={mobileMenuRef}
          className="fixed top-16 left-0 right-0 bottom-0 z-40 bg-black bg-opacity-50"
          onClick={closeMobileMenu}
        >
          <div
            className="absolute top-0 right-0 w-3/4 max-w-xs h-full bg-white dark:bg-gray-800 shadow-xl overflow-y-auto transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Menu
              </h3>
              <button
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={closeMobileMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <nav className="py-2">
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center px-4 py-3 ${
                      isActive("/dashboard")
                        ? "bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 text-blue-600 dark:text-blue-300 border-l-4 border-blue-500"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    Dashboard
                  </Link>
                  <Link
                    to="/analytics"
                    className={`flex items-center px-4 py-3 ${
                      isActive("/analytics")
                        ? "bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 text-blue-600 dark:text-blue-300 border-l-4 border-blue-500"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    Analytics
                  </Link>
                </>
              )}
              <Link
                to="/about"
                className={`flex items-center px-4 py-3 ${
                  isActive("/about")
                    ? "bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 text-blue-600 dark:text-blue-300 border-l-4 border-blue-500"
                    : "text-gray-800 dark:text-gray-200"
                }`}
                onClick={closeMobileMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                About
              </Link>
              <Link
                to="/support"
                className={`flex items-center px-4 py-3 ${
                  isActive("/support")
                    ? "bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 text-blue-600 dark:text-blue-300 border-l-4 border-blue-500"
                    : "text-gray-800 dark:text-gray-200"
                }`}
                onClick={closeMobileMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Support
              </Link>

              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  <Link
                    to="/profile"
                    className={`flex items-center px-4 py-3 ${
                      isActive("/profile")
                        ? "bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 text-blue-600 dark:text-blue-300 border-l-4 border-blue-500"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    User Profile
                  </Link>
                  <Link
                    to="/notifications"
                    className={`flex items-center px-4 py-3 ${
                      isActive("/notifications")
                        ? "bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 text-blue-600 dark:text-blue-300 border-l-4 border-blue-500"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    Notifications
                    <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      3
                    </span>
                  </Link>
                  <button
                    className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20"
                    onClick={handleLogout}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
