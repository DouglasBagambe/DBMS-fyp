/* eslint-disable react/no-unescaped-entities */
// src/components/Login.js

import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const { user, token } = await login({ email, password });
      authLogin(user, token);
      setMessage("Login successful!");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (error) {
      setMessage(
        error.message || "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-theme-background p-5">
      <div className="w-full max-w-md animate-fade-in-down">
        <div className="bg-theme-background rounded-lg shadow-lg overflow-hidden p-10 border border-gray-200 dark:border-gray-800">
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-block text-2xl font-bold mb-5 text-theme-foreground"
            >
              <span className="text-blue-500">DB</span>MS
            </Link>
            <h2 className="text-2xl mb-2 text-theme-foreground">
              Welcome Back
            </h2>
            <p className="text-theme-foreground opacity-80 text-base">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mb-5">
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2 font-medium text-theme-foreground"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-md text-base bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="password"
                className="block mb-2 font-medium text-theme-foreground"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-md text-base bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition"
              />
              <Link
                to="/forgot-password"
                className="block text-right text-sm text-blue-500 mt-2"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 px-4 text-base font-medium text-white bg-blue-500 rounded-md hover:bg-blue-700 transition mt-8 ${
                isLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            {message && (
              <div className="mt-4 p-2.5 rounded-md text-sm text-center text-red-600 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 dark:text-red-300">
                {message}
              </div>
            )}
          </form>

          <div className="text-center mt-5">
            <p className="text-sm text-theme-foreground opacity-80">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
