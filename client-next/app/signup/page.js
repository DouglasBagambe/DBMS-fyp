// app/signup/page.js

"use client";

import React from "react";
import { motion } from "framer-motion";
import Button from "../components/Button";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <motion.div
        className="card p-8 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-neon mb-6 text-center">
          Join SafeDrive
        </h2>
        <input className="input-field mb-4" placeholder="Name" />
        <input className="input-field mb-4" placeholder="Email" />
        <input
          className="input-field mb-6"
          type="password"
          placeholder="Password"
        />
        <Button className="w-full">Sign Up</Button>
      </motion.div>
    </div>
  );
}
