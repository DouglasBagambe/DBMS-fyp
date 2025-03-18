// app/components/Navbar.js

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Button from "./Button";
import { FiShield, FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-dark bg-opacity-90 backdrop-blur-md z-50 py-4">
      <div className="container-custom flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <FiShield className="text-neon" size={28} />
          <span className="text-2xl font-bold text-white">SafeDrive</span>
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-300 hover:text-neon">
            Home
          </Link>
          <Link href="#features" className="text-gray-300 hover:text-neon">
            Features
          </Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-neon">
            Dashboard
          </Link>
        </div>
        <div className="hidden md:flex space-x-4">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
        <button
          className="md:hidden text-neon"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-dark p-4">
          <Link href="/" className="block text-gray-300 hover:text-neon py-2">
            Home
          </Link>
          <Link
            href="#features"
            className="block text-gray-300 hover:text-neon py-2"
          >
            Features
          </Link>
          <Link
            href="/dashboard"
            className="block text-gray-300 hover:text-neon py-2"
          >
            Dashboard
          </Link>
          <Link href="/login">
            <Button variant="outline" className="w-full mt-2">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="w-full mt-2">Sign Up</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
