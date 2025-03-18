// app/components/Footer.js

import React from "react";
import Link from "next/link";
import { FiShield, FiTwitter, FiLinkedin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-dark py-12 border-t border-neon border-opacity-20">
      <div className="container-custom flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-6 md:mb-0">
          <FiShield className="text-neon" size={28} />
          <span className="text-2xl font-bold text-white">SafeDrive</span>
        </div>
        <div className="flex space-x-6">
          <Link href="#" className="text-neon hover:text-accent">
            <FiTwitter size={24} />
          </Link>
          <Link href="#" className="text-neon hover:text-accent">
            <FiLinkedin size={24} />
          </Link>
        </div>
      </div>
      <p className="text-center text-gray-400 mt-6">
        © {new Date().getFullYear()} SafeDrive. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
