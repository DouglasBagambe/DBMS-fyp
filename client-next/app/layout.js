// app/layout.js

import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "SafeDrive DBMS - Uganda Road Safety",
  description:
    "Real-time driver behavior monitoring and analytics for safer roads in Uganda.",
  keywords: "road safety, driver monitoring, Uganda, DBMS, SafeDrive",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col antialiased">
        <div className="fixed inset-0 bg-gradient-to-br from-primary-50/20 to-secondary-50/20 dark:from-primary-900/10 dark:to-secondary-900/10 -z-10"></div>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
