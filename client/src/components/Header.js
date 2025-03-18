// src/components/Header.js

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Check if user is on homepage
  const isHomepage = location.pathname === "/";

  // Simulating authentication check - replace with your actual auth logic
  useEffect(() => {
    // Example: If not on homepage, consider user logged in
    // In a real app, you'd check auth state from context/redux/localStorage
    setIsLoggedIn(!isHomepage);
  }, [isHomepage]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle profile menu
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <nav className="header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo-link" aria-label="Logo">
            <div
              className="logo-heading"
              style={{ display: "flex", alignItems: "center" }}
            >
              <span>DB</span>MS
            </div>
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/dashboard" className="nav-item">
            Dashboard
          </Link>
          <Link to="/analytic" className="nav-item">
            Analytics
          </Link>
          <Link to="/support" className="nav-item">
            Support
          </Link>
        </div>

        <div className="action-button-container">
          {!isLoggedIn ? (
            // Show login button when not logged in (homepage)
            <Link to="/login" className="action-button">
              <div className="button-text">Login</div>
              <div className="button-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </Link>
          ) : (
            // Show profile icon when logged in (other pages)
            <div className="profile-container" ref={profileMenuRef}>
              <button
                className="profile-button"
                onClick={toggleProfileMenu}
                aria-label="Profile menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>

              {/* Profile dropdown menu */}
              {showProfileMenu && (
                <div className="profile-menu">
                  <Link to="/profile" className="profile-menu-item">
                    User Profile
                  </Link>
                  <Link to="/settings" className="profile-menu-item">
                    Settings
                  </Link>
                  <Link to="/notifications" className="profile-menu-item">
                    Notifications
                  </Link>
                  <hr className="menu-divider" />
                  <Link to="/" className="profile-menu-item logout">
                    Logout
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
