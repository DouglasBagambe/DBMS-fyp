"use client";

import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import AppRoutes from "./AppRoutes";

export default function Page() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen relative">
          <Header />
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-white text-xl font-bold z-50"
            style={{ animation: "pulse 2s infinite" }}
          >
            💬
          </button>
          <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          <Footer />
        </div>
      </AuthProvider>

      <style jsx="true">{`
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
    </Router>
  );
}
