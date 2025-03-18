// app/components/Hero.js

"use client";

import React from "react";
import { motion } from "framer-motion";
import Button from "./Button";
import Link from "next/link";

const Hero = () => (
  <div className="relative bg-primary-600 text-white py-20">
    <div className="container-custom text-center">
      <motion.h1
        className="text-5xl md:text-6xl font-bold mb-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        SafeDrive: Driver Behavior Monitoring
      </motion.h1>
      <motion.p
        className="text-xl mb-8 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Real-time detection of distractions to save lives on Uganda’s roads.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Link href="/login">
          <Button>Login</Button>
        </Link>
        <Link href="/signup">
          <Button variant="outline" className="ml-4">
            Sign Up
          </Button>
        </Link>
      </motion.div>
    </div>
  </div>
);

export default Hero;
