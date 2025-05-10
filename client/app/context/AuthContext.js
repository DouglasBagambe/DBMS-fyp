// app/context/AuthContext.js

"use client";
import React, { createContext, useState, useEffect } from "react";
import { getUserProfile } from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          try {
            // Fetch fresh user data from API
            const { user: userData } = await getUserProfile();
            if (userData) {
              setUser(userData);
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            // Token might be invalid or expired, try to use cached data
            const cachedUserData = localStorage.getItem("userData");
            if (cachedUserData) {
              setUser(JSON.parse(cachedUserData));
              setIsAuthenticated(true);
            } else {
              // If no cached data, logout
              logout();
            }
          }
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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

  const updateUserData = (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData };
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Update user data error:", error);
    }
  };

  // Format user data fields properly
  const getUserSalutation = () => {
    if (!user) return "";

    // Use gender from database to determine salutation
    if (user.gender === "male") {
      return "Mr.";
    } else if (user.gender === "female") {
      return "Ms.";
    }
    return "";
  };

  const getUserFullName = () => {
    if (!user) return "";
    return `${user.first_name || ""} ${user.last_name || ""}`.trim();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        updateUserData,
        getUserSalutation,
        getUserFullName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
