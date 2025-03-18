/* eslint-disable react/no-unescaped-entities */

// app/page.js

"use client";

import React from "react";
import { motion } from "framer-motion";
import Hero from "./components/Hero";
import Link from "next/link";
import Button from "./components/Button";

export default function Home() {
  return (
    <div>
      <Hero />
      <section className="section bg-primary-50">
        <div className="container-custom text-center">
          <motion.h2
            className="text-4xl font-bold text-primary-700 mb-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Take Control of Road Safety
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/dashboard">
              <Button>Launch Dashboard</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="ml-4">
                Join Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
