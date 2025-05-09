/* eslint-disable no-unused-vars */
// src/App.js

import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AnalyticsPage from "./components/Analytic";
import UserProfile from "./components/UserProfile";
import { AuthContext } from "./context/AuthContext";
import "./App.css";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/analytic"
          element={
            isAuthenticated ? <AnalyticsPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/userprofile"
          element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
