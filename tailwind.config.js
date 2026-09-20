/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        aubergine: "#2E1F35",
        ocre: "#C98A3E",
        argile: "#B5533C",
        platre: "#F7F2EA",
        encre: "#1A1410",
        sauge: "#7A8B69",
        lilas: "#D8CDD9",
        bordure: "#E4D9C8",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Manrope'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
