// app/layout.js

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { NotificationsProvider } from './context/NotificationsContext';

// Import dynamic config
import { dynamic, dynamicParams } from "./config";

// Export dynamic config
export { dynamic, dynamicParams };

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DBMS - Driver Behavior Monitoring System",
  description: "Real-time Driver Behavior Monitoring System for safer roads in Uganda",
  icons: {
    icon: "/dbms-logo1.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <NotificationsProvider>
            {children}
          </NotificationsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
