// app/components/Navbar.js

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Button from "./Button";
import { FiMenu, FiX, FiShield, FiUser } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-primary-600">
              <FiShield size={28} className="stroke-2" />
            </div>
            <span
              className={`font-bold text-xl ${
                scrolled ? "text-primary-700" : "text-primary-600"
              }`}
            >
              SafeDrive
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="#features"
              className="font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="#contact"
              className="font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login">
              <Button variant="outline" className="py-2 px-4">
                <span className="flex items-center">
                  <FiUser className="mr-1" />
                  Login
                </span>
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" className="py-2 px-4">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-gray-700"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden glass-effect mt-2 rounded-lg p-4 shadow-lg animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="font-medium text-gray-700 hover:text-primary-600 transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#features"
                className="font-medium text-gray-700 hover:text-primary-600 transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#about"
                className="font-medium text-gray-700 hover:text-primary-600 transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="#contact"
                className="font-medium text-gray-700 hover:text-primary-600 transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" fullWidth>
                    <FiUser className="mr-2" /> Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" fullWidth>
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
