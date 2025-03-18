// app/components/Navbar.js

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Button from "./Button";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-primary-600 text-white p-4 z-50">
      <div className="container-custom flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          SafeDrive DBMS
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-primary-50">
            Home
          </Link>
          <Link href="/dashboard" className="hover:text-primary-50">
            Dashboard
          </Link>
          <Link href="/analytics" className="hover:text-primary-50">
            Analytics
          </Link>
          <Link href="/reports" className="hover:text-primary-50">
            Reports
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
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-primary-600 p-4">
          <Link href="/" className="block py-2 hover:text-primary-50">
            Home
          </Link>
          <Link href="/dashboard" className="block py-2 hover:text-primary-50">
            Dashboard
          </Link>
          <Link href="/analytics" className="block py-2 hover:text-primary-50">
            Analytics
          </Link>
          <Link href="/reports" className="block py-2 hover:text-primary-50">
            Reports
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
