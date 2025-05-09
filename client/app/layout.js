// app/layout.js

"use client";

import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";
import { BrowserRouter as Router } from "react-router-dom";
import Chatbot from "./components/Chatbot";
import { useState } from "react";

export default function RootLayout({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>DBMS</title>
        <meta name="description" content="Driver Behavior Monitoring System" />
        <link rel="icon" href="/dbms-logo1.svg" />
      </head>
      <body>
        <Router>
          <AuthProvider>
            <div className="flex flex-col min-h-screen relative">
              <Header />
              <main className="flex-grow">{children}</main>
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-white text-xl font-bold animate-pulse-slow z-50"
                style={{ animation: "pulse 2s infinite" }}
              >
                💬
              </button>
              <Chatbot
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
              />
              <Footer />
            </div>
          </AuthProvider>
        </Router>
        <style jsx>{`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(79, 70, 229, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
            }
          }
          .animate-pulse-slow {
            animation: pulse 2s infinite;
          }
        `}</style>
      </body>
    </html>
  );
}
