/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f4fdf4",
          600: "#2e7d32",
          700: "#27632a",
        },
        alert: "#d9534f", // Red for safety alerts
        safe: "#4CAF50", // Green for safety
      },
      boxShadow: {
        glow: "0 0 15px rgba(46, 125, 50, 0.5)",
      },
    },
  },
  plugins: [],
};
