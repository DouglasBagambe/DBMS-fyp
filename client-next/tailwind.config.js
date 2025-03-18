/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4fdf4',  // Restored your original light green
          600: '#2e7d32', // Medium green from Home.js
          700: '#27632a', // Dark green from Home.js
        },
      },
    },
  },
  plugins: [],
}
