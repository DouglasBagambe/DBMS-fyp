// app/components/Signup.js

"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Button from "./Button";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });
      setMessage("Signup successful! You can now log in.");
      window.location.href = "/dashboard";
    } catch (error) {
      setMessage("Signup failed. Check your details.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50 p-6">
      <form onSubmit={handleSubmit} className="card w-full max-w-md">
        <h2 className="text-3xl font-bold text-primary-700 mb-6 text-center">
          Sign Up
        </h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field mb-4"
          required
        />
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
          Sign Up
        </Button>
        {message && <p className="text-red-600 text-center mt-4">{message}</p>}
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
