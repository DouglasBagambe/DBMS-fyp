/* eslint-disable no-unused-vars */
// src/App.js

import logo from "./logo.svg";
import React from "react";
//import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AnalyticsPage from "./components/Analytic";
import UserProfile from "./components/UserProfile";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Analytic" element={<AnalyticsPage />} />
        <Route path="/userprofile" element={<UserProfile />} />
      </Routes>
    </div>
  );
}

export default App;
