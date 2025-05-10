// src/context/AuthContext.js

"use client";
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on component mount
  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (token) {
        setIsAuthenticated(true);
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    try {
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
