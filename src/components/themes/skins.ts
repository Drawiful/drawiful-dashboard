// Réglages de chaque thème de galerie publique.
//
// Un thème = une "skin". Les composants Themed* (liste, fiche œuvre, panier,
// pages légales) lisent ces valeurs : ajouter un thème revient à ajouter
// une entrée ci-dessous, sans toucher à la logique d'achat ni au panier.

export type ThemeLayout = "bento" | "capsule" | "arch" | "swiss" | "soft" | "salon";

export type Skin = {
  id: string;
  label: string;
  description: string;
  swatch: [string, string, string];
  layout: ThemeLayout;
  // Ambiance de la galerie 3D associée à ce thème (étape suivante).
  ambiance3d: "sombre" | "blanche" | "haussmann";
  fontsHref: string;
  display: string; // police des titres (valeur CSS font-family)
  displayWeight: number;
  displayItalic: boolean;
  body: string; // police du texte
  bodyWeight: number;
  mono: string; // police des petits détails
  bg: string; // fond de page
  surface: string; // fond des cartes et bandeaux
  media: string; // fond derrière les œuvres
  border: string;
  ink: string; // texte principal
  muted: string; // texte secondaire
  accent: string; // fond des boutons principaux
  onAccent: string; // texte sur les boutons principaux
  link: string; // accent utilisé pour du texte
  decor: string; // filets et ornements
  radius: number; // arrondi des cartes (px)
  pill: boolean; // boutons en pilule
  upper: boolean; // boutons et navigation en capitales espacées
};

export function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const GF = "https://fonts.googleapis.com/css2?family=";

export const SKINS: Record<string, Skin> = {
  "maison-haussmann": {
    id: "maison-haussmann",
    label: "Maison Haussmann",
    description: "Classique et chaleureux — crème, bronze, cadres de salon.",
    swatch: ["#F6F1E3", "#2B2013", "#B9862F"],
    layout: "salon",
    ambiance3d: "haussmann",
    fontsHref: `${GF}Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Hanken+Grotesk:wght@400;500;600&display=swap`,
    display: "'Cormorant Garamond', serif",
    displayWeight: 500,
    displayItalic: false,
    body: "'Hanken Grotesk', sans-serif",
    bodyWeight: 400,
    mono: "'Hanken Grotesk', sans-serif",
    bg: "#F6F1E3",
    surface: "#EFE7D2",
    media: "#FBF8EF",
    border: "#D9CBA8",
    ink: "#2B2013",
    muted: "#6B5A44",
    accent: "#2B2013",
    onAccent: "#F6F1E3",
    link: "#8A6120",
    decor: "#B9862F",
    radius: 0,
    pill: false,
    upper: true,
  },
  "blanc-pur": {
    id: "blanc-pur",
    label: "Blanc Pur",
    description: "Minimal, noir sur blanc — mise en page suisse.",
    swatch: ["#FFFFFF", "#111111", "#6B6B6B"],
    layout: "swiss",
    ambiance3d: "blanche",
    fontsHref: `${GF}Archivo:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap`,
    display: "'Archivo', sans-serif",
    displayWeight: 300,
    displayItalic: false,
    body: "'Archivo', sans-serif",
    bodyWeight: 400,
    mono: "'IBM Plex Mono', monospace",
    bg: "#FFFFFF",
    surface: "#FFFFFF",
    media: "#FFFFFF",
    border: "#E6E6E6",
    ink: "#111111",
    muted: "#6B6B6B",
    accent: "#111111",
    onAccent: "#FFFFFF",
    link: "#111111",
    decor: "#111111",
    radius: 0,
    pill: false,
    upper: false,
  },
  "terre-argile": {
    id: "terre-argile",
    label: "Terre & Argile",
    description: "Tons chauds, terracotta — formes en arche.",
    swatch: ["#F3E9DD", "#9E4A30", "#C68B3E"],
    layout: "arch",
    ambiance3d: "blanche",
    fontsHref: `${GF}Work+Sans:wght@400;500;600&family=Young+Serif&display=swap`,
    display: "'Young Serif', serif",
    displayWeight: 400,
    displayItalic: false,
    body: "'Work Sans', sans-serif",
    bodyWeight: 400,
    mono: "'Work Sans', sans-serif",
    bg: "#F3E9DD",
    surface: "#EBDCC9",
    media: "#F3E9DD",
    border: "#DCC9B0",
    ink: "#3B2A20",
    muted: "#6F5A4B",
    accent: "#9E4A30",
    onAccent: "#FBF5EC",
    link: "#9E4A30",
    decor: "#C68B3E",
    radius: 28,
    pill: true,
    upper: false,
  },
  "sauge-botanique": {
    id: "sauge-botanique",
    label: "Sauge Botanique",
    description: "Verts doux, formes arrondies — naturel et apaisant.",
    swatch: ["#EEF1E8", "#3E5A46", "#6F8F72"],
    layout: "soft",
    ambiance3d: "blanche",
    fontsHref: `${GF}Newsreader:ital,wght@0,400;0,500;1,400;1,500&family=Nunito+Sans:wght@400;600;700&display=swap`,
    display: "'Newsreader', serif",
    displayWeight: 400,
    displayItalic: false,
    body: "'Nunito Sans', sans-serif",
    bodyWeight: 400,
    mono: "'Nunito Sans', sans-serif",
    bg: "#EEF1E8",
    surface: "#F8FAF4",
    media: "#E1E7D6",
    border: "#CBD5BE",
    ink: "#26302A",
    muted: "#55635A",
    accent: "#3E5A46",
    onAccent: "#FFFFFF",
    link: "#3E5A46",
    decor: "#6F8F72",
    radius: 28,
    pill: true,
    upper: false,
  },
  "atelier-sombre": {
    id: "atelier-sombre",
    label: "Atelier Sombre",
    description: "Anthracite, bleu cobalt et doré — grille en tuiles arrondies.",
    swatch: ["#181B1E", "#3B66E6", "#C68E4E"],
    layout: "bento",
    ambiance3d: "sombre",
    fontsHref: `${GF}Bricolage+Grotesque:wght@500;700;800&family=Manrope:wght@400;500;700&display=swap`,
    display: "'Bricolage Grotesque', sans-serif",
    displayWeight: 800,
    displayItalic: false,
    body: "'Manrope', sans-serif",
    bodyWeight: 400,
    mono: "'Manrope', sans-serif",
    bg: "#181B1E",
    surface: "#20252A",
    media: "#14171A",
    border: "#2D3338",
    ink: "#E9E7E2",
    muted: "#9AA1A8",
    accent: "#3B66E6",
    onAccent: "#FFFFFF",
    link: "#7FA0FF",
    decor: "#C68E4E",
    radius: 28,
    pill: true,
    upper: false,
  },
  "noir-or": {
    id: "noir-or",
    label: "Noir & Or",
    description: "Noir profond et doré — cadres en capsule.",
    swatch: ["#0B0A09", "#C9A24B", "#F1EADB"],
    layout: "capsule",
    ambiance3d: "sombre",
    fontsHref: `${GF}Gloock&family=Outfit:wght@300;400;500;600&display=swap`,
    display: "'Gloock', serif",
    displayWeight: 400,
    displayItalic: false,
    body: "'Outfit', sans-serif",
    bodyWeight: 300,
    mono: "'Outfit', sans-serif",
    bg: "#0B0A09",
    surface: "#14120F",
    media: "#14120F",
    border: "rgba(201,162,75,0.35)",
    ink: "#F1EADB",
    muted: "#A59C88",
    accent: "#C9A24B",
    onAccent: "#0B0A09",
    link: "#E3C77A",
    decor: "#C9A24B",
    radius: 20,
    pill: true,
    upper: false,
  },
};

// Ordre d'affichage dans le sélecteur du dashboard.
const THEME_ORDER = [
  "maison-haussmann",
  "blanc-pur",
  "terre-argile",
  "sauge-botanique",
  "atelier-sombre",
  "noir-or",
];

// Même forme que l'ancien tableau THEMES du dashboard.
export const THEME_OPTIONS = THEME_ORDER.map((id) => ({
  value: id,
  label: SKINS[id].label,
  description: SKINS[id].description,
  swatch: SKINS[id].swatch,
  available: true,
}));

// Renvoie la skin du thème, ou null pour un ancien thème (ex. "galerie-blanche")
// qui reste géré par ses composants d'origine.
export function getSkin(theme?: string | null): Skin | null {
  return theme && SKINS[theme] ? SKINS[theme] : null;
}
