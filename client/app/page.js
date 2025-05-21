// app/page.js

"use client";

import { useEffect, useState } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./AppRoutes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";

// Set static rendering for Netlify compatibility
export const dynamic = "force-static";

// Custom layout component that conditionally renders header and footer
const AppLayout = () => {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Check if current path is login or signup
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main
        className={`flex-grow ${
          isAuthPage ? "flex items-center justify-center" : ""
        }`}
      >
        <AppRoutes />
      </main>

      {!isAuthPage && (
        <>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-white text-xl font-bold z-50"
            style={{ animation: "pulse 2s infinite" }}
          >
            💬
          </button>
          <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          <Footer />
        </>
      )}
    </div>
  );
};

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a minimal loading state that doesn't use any browser APIs
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold text-blue-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}
