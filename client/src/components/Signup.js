/* eslint-disable no-unused-vars */
// src/components/Signup.js

import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/auth/signup", {
        name,
        email,
        password,
      });
      setMessage("Signup successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Signup failed. Please check your details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="logo">
              <span>DB</span>MS
            </Link>
            <h2>Create Account</h2>
            <p>Sign up to access the driver monitoring dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-control"
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary btn-block ${
                isLoading ? "btn-loading" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>

            {message && <div className="auth-message">{message}</div>}
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
