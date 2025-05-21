// app/layout.js

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

// Import dynamic config
import { dynamic, dynamicParams } from "./config";

// Export dynamic config
export { dynamic, dynamicParams };

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DBMS Project",
  description: "Database Management System Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
