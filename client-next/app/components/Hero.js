// app/components/Hero.js

"use client";

import React from "react";
import { motion } from "framer-motion";
import Button from "./Button";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative pt-24 pb-16 bg-gradient-to-b from-dark to-black">
      <div className="container-custom text-center">
        <motion.h1
          className="text-6xl md:text-8xl font-bold text-neon mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          SafeDrive: <span className="text-accent">Future of Safety</span>
        </motion.h1>
        <motion.p
          className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          AI-powered driver monitoring reimagined with cutting-edge tech.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Link href="/signup">
            <Button>Get Onboard</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="ml-4">
              Access Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
