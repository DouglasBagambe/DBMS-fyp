// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e3f2fd",
          100: "#bbdefb",
          200: "#90caf9",
          300: "#64b5f6",
          400: "#42a5f5",
          500: "#1e88e5", // Main primary color
          600: "#1976d2",
          700: "#0d47a1",
          800: "#0d47a1",
          900: "#0d47a1",
        },
        theme: {
          background: "var(--background)",
          foreground: "var(--foreground)",
        },
      },
      transitionProperty: {
        all: "all",
        height: "height",
        width: "width",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
      boxShadow: {
        card: "0 2px 10px rgba(0, 0, 0, 0.1)",
        hover: "0 5px 15px rgba(0, 0, 0, 0.15)",
      },
      animation: {
        "fade-in-down": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        "geist-sans": [
          "var(--font-geist-sans)",
          "Arial",
          "Helvetica",
          "sans-serif",
        ],
        "geist-mono": ["var(--font-geist-mono)", "monospace"],
        mono: [
          "source-code-pro",
          "Menlo",
          "Monaco",
          "Consolas",
          "Courier New",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
