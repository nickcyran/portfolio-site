/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#050816",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        'menu-text': '#99e5ab',
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "tile-pattern": "url('/portfolio-site/bayer4x4.png')",
      },
    },
  },
  plugins: [],
};