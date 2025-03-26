/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: "#f5f0e6",
          dark: "#e0d5c0",
          darker: "#d0c5b0",
        },
        ink: {
          DEFAULT: "#3a3226",
          light: "#5a5246",
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "serif"],
        fugaz: ["var(--font-fugaz)", "sans-serif"],
        alumni: ["var(--font-alumni)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
