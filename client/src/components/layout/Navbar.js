// src/components/layout/Navbar.js
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ isAuthenticated }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Function to determine if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        DBMS
      </div>

      <div className={`navbar-links ${mobileMenuOpen ? "open" : ""}`}>
        <Link to="/" className={isActive("/") ? "active" : ""}>
          Home
        </Link>

        {!isAuthenticated ? (
          <>
            <Link to="/login" className={isActive("/login") ? "active" : ""}>
              Login
            </Link>
            <Link
              to="/signup"
              className={`button ${isActive("/signup") ? "active" : ""}`}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/dashboard"
              className={isActive("/dashboard") ? "active" : ""}
            >
              Dashboard
            </Link>
            <Link
              to="/analytic"
              className={isActive("/analytic") ? "active" : ""}
            >
              Analytics
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("authToken");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>

      <div
        className="mobile-menu-button"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 12H21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 6H21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 18H21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </nav>
  );
};

export default Navbar;
