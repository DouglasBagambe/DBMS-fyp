/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-50": "#f4fdf4",
        "primary-100": "#e6fae6",
        "primary-200": "#c8f5c8",
        "primary-300": "#97e897",
        "primary-400": "#56d256",
        "primary-500": "#2e9d32",
        "primary-600": "#2e7d32",
        "primary-700": "#27632a",
        "primary-800": "#235023",
        "primary-900": "#1e431e",
        "primary-950": "#0c240c",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 15px rgba(46, 125, 50, 0.5)",
      },
    },
  },
  plugins: [],
};
