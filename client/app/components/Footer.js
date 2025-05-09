// src/components/Footer.js

"use client";

import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-theme-foreground/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link
              to="/"
              className="flex items-center text-xl font-bold text-theme-foreground"
            >
              <span className="text-blue-500">DB</span>
              <span>MS</span>
            </Link>
            <p className="text-theme-foreground/60 mt-2">
              © 2025 Driver Behavior Monitoring System
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            <div>
              <h4 className="font-medium text-theme-foreground mb-4">
                Product
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/features"
                    className="text-theme-foreground/70 hover:text-blue-500"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-theme-foreground/70 hover:text-blue-500"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/roadmap"
                    className="text-theme-foreground/70 hover:text-blue-500"
                  >
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-theme-foreground mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/blog"
                    className="text-theme-foreground/70 hover:text-blue-500"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/documentation"
                    className="text-theme-foreground/70 hover:text-blue-500"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/support"
                    className="text-theme-foreground/70 hover:text-blue-500"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-theme-foreground mb-4">
                Company
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-theme-foreground/70 hover:text-blue-500"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="text-theme-foreground/70 hover:text-blue-500"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-theme-foreground/70 hover:text-blue-500"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
