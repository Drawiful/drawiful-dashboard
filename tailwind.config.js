/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Direction « expérience » (oct. 2026) : nuit, ivoire et champagne.
        // Les anciens noms sont conservés et pointent vers la nouvelle palette.
        aubergine: "#16130F", // nuit
        ocre: "#B8933A", // or sur fond sombre
        argile: "#9B3B2A", // alertes et erreurs
        platre: "#F7F3EC", // papier
        encre: "#1A1714",
        sauge: "#4F6B4A", // confirmations
        lilas: "#C9C2B6", // texte clair sur fond sombre
        bordure: "#E2DACB",
        nuit: "#16130F",
        ivoire: "#F4EFE6",
        champagne: "#D9B75C",
        laiton: "#7A5F1F", // or lisible sur fond clair
        pierre: "#6B655B", // texte secondaire sur fond clair
        papier: "#FFFDF9", // cartes
      },
      fontFamily: {
        display: ["'Bodoni Moda'", "Georgia", "serif"],
        sans: ["'Manrope'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
