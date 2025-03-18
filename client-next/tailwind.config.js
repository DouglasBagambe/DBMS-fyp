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
        neon: "#00ffcc", // Neon cyan
        dark: "#0d1b2a", // Deep navy
        accent: "#ff007a", // Hot pink
      },
      boxShadow: {
        neon: "0 0 15px rgba(0, 255, 204, 0.8)",
      },
    },
  },
  plugins: [],
};
