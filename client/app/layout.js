// app/layout.js

import "./globals.css";

export const metadata = {
  title: "DBMS - Driver Behavior Monitoring System",
  description:
    "Monitor and analyze driver behavior with our comprehensive system",
  icons: {
    icon: "/dbms-logo1.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
