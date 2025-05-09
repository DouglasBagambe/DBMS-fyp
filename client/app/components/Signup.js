// src/components/Signup.js

import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formProgress, setFormProgress] = useState(0);
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    // Length check
    if (password.length >= 8) strength += 25;
    // Contains number
    if (/\d/.test(password)) strength += 25;
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25;
    // Contains uppercase or special char
    if (/[A-Z]/.test(password) || /[^a-zA-Z0-9]/.test(password)) strength += 25;

    setPasswordStrength(strength);
  }, [password]);

  // Calculate form completion progress
  useEffect(() => {
    let progress = 0;
    if (name) progress += 25;
    if (email) progress += 25;
    if (password) progress += 25;
    if (confirmPassword && confirmPassword === password) progress += 25;
    setFormProgress(progress);
  }, [name, email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { user, token } = await signup({ name, email, password });
      authLogin(user, token);
      setMessage("Signup successful! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      setMessage(error.message || "Signup failed. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthClass = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-yellow-500";
    if (passwordStrength <= 75) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-theme-background p-5 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-500 rounded-full blur-3xl -translate-y-1/2 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="w-full max-w-md animate-fade-in-down relative z-10">
        {/* Progress bar */}
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${formProgress}%` }}
          ></div>
        </div>

        <div className="bg-theme-background rounded-lg shadow-lg overflow-hidden p-10 border border-gray-200 dark:border-gray-800 backdrop-blur-sm bg-white/30 dark:bg-black/30">
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-block text-2xl font-bold mb-5 text-theme-foreground relative"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                DB
              </span>
              <span>MS</span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            </Link>
            <h2 className="text-2xl mb-2 text-theme-foreground font-bold">
              Create Account
            </h2>
            <p className="text-theme-foreground opacity-80 text-base">
              Join the next generation of driver monitoring
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mb-5 space-y-6">
            <div className="group">
              <label
                htmlFor="name"
                className="block mb-2 font-medium text-theme-foreground transition-all duration-300 group-focus-within:text-blue-500"
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 pl-10 border border-gray-200 dark:border-gray-700 rounded-md text-base bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition-all duration-300"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {name && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div className="group">
              <label
                htmlFor="email"
                className="block mb-2 font-medium text-theme-foreground transition-all duration-300 group-focus-within:text-blue-500"
              >
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 pl-10 border border-gray-200 dark:border-gray-700 rounded-md text-base bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition-all duration-300"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div className="group">
              <label
                htmlFor="password"
                className="block mb-2 font-medium text-theme-foreground transition-all duration-300 group-focus-within:text-blue-500"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pl-10 border border-gray-200 dark:border-gray-700 rounded-md text-base bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition-all duration-300"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-theme-foreground opacity-70">
                      Password strength
                    </span>
                    <span
                      className={`font-medium ${
                        passwordStrength <= 25
                          ? "text-red-500"
                          : passwordStrength <= 50
                          ? "text-yellow-500"
                          : passwordStrength <= 75
                          ? "text-blue-500"
                          : "text-green-500"
                      }`}
                    >
                      {passwordStrength <= 25
                        ? "Weak"
                        : passwordStrength <= 50
                        ? "Fair"
                        : passwordStrength <= 75
                        ? "Good"
                        : "Strong"}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPasswordStrengthClass()} transition-all duration-500 ease-out`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="group">
              <label
                htmlFor="confirmPassword"
                className="block mb-2 font-medium text-theme-foreground transition-all duration-300 group-focus-within:text-blue-500"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pl-10 border border-gray-200 dark:border-gray-700 rounded-md text-base bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition-all duration-300"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                {confirmPassword && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {confirmPassword === password ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 px-4 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                isLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                "Sign Up"
              )}
            </button>

            {message && (
              <div
                className={`p-3 rounded-md text-sm text-center ${
                  message.includes("successful")
                    ? "text-green-600 bg-green-50 dark:bg-green-900 dark:bg-opacity-20 dark:text-green-300"
                    : "text-red-600 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 dark:text-red-300"
                }`}
              >
                {message}
              </div>
            )}
          </form>

          <div className="text-center mt-5">
            <p className="text-sm text-theme-foreground opacity-80">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-500 font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
