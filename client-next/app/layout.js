// app/layout.js

import "./globals.css";
import { Inter, Montserrat } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "SafeDrive DBMS - Uganda Road Safety",
  description: "Real-time driver behavior monitoring for safer roads in Uganda",
  keywords:
    "road safety, driver monitoring, Uganda, DBMS, safe driving, analytics",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-grid dark:bg-dark-900">
        <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-primary-600/10 to-secondary-600/5 pointer-events-none"></div>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
