// app/components/Login.js

"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Button from "./Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");
      window.location.href = "/dashboard";
    } catch (error) {
      setMessage("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50 p-6">
      <form onSubmit={handleSubmit} className="card w-full max-w-md">
        <h2 className="text-3xl font-bold text-primary-700 mb-6 text-center">
          Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field mb-6"
          required
        />
        <Button type="submit" className="w-full">
          Login
        </Button>
        {message && <p className="text-red-600 text-center mt-4">{message}</p>}
        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-primary-600">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
