// Réglages de chaque thème de galerie publique.
//
// Un thème = une "skin". Les composants Themed* (liste, fiche œuvre, panier,
// pages légales) lisent ces valeurs : la logique d'achat et le panier ne
// dépendent jamais du thème.
//
// Depuis octobre 2026, Drawiful propose 3 thèmes, chacun associé à l'une des
// 3 salles 3D : Blanc Pur (salle blanche), Noir & Or (salle noire) et
// Maison Haussmann (salon haussmannien). Les anciens thèmes sont redirigés
// vers le plus proche (voir THEME_ALIASES).

export type ThemeLayout = "swiss" | "capsule" | "salon";

export type Skin = {
  id: string;
  label: string;
  description: string;
  swatch: [string, string, string];
  layout: ThemeLayout;
  // Salle de la visite 3D associée à ce thème.
  ambiance3d: "sombre" | "blanche" | "haussmann";
  // Vue de la salle 3D affichée dans la boutique (bloc « Visite 3D »).
  roomImage: string;
  fontsHref: string;
  display: string; // police des titres (valeur CSS font-family)
  displayWeight: number;
  displayItalic: boolean;
  body: string; // police du texte
  bodyWeight: number;
  mono: string; // police des petits détails
  caps: string; // police des petites capitales (menu, étiquettes, boutons)
  capsSpacing: string; // interlettrage des petites capitales
  bg: string; // fond de page
  surface: string; // fond des bandeaux secondaires
  media: string; // fond derrière les œuvres
  band: string; // fond du bandeau « Visite 3D »
  bandInk: string; // texte sur ce bandeau
  border: string;
  hairline: string; // filets fins
  ink: string; // texte principal
  muted: string; // texte secondaire
  accent: string; // fond des boutons principaux
  onAccent: string; // texte sur les boutons principaux
  link: string; // accent utilisé pour du texte
  decor: string; // filets et ornements
  mat: string; // passe-partout autour des œuvres
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
  "blanc-pur": {
    id: "blanc-pur",
    label: "Blanc Pur",
    description: "White cube de musée : blanc, encre noire et cartels sobres.",
    swatch: ["#FAFAF8", "#141211", "#F3F2EE"],
    layout: "swiss",
    ambiance3d: "blanche",
    roomImage: "/themes/salle-blanche.jpg",
    fontsHref: `${GF}Instrument+Serif:ital@0;1&family=Jost:wght@300;400;500&display=swap`,
    display: "'Instrument Serif', Georgia, serif",
    displayWeight: 400,
    displayItalic: false,
    body: "'Jost', system-ui, sans-serif",
    bodyWeight: 300,
    mono: "'Jost', system-ui, sans-serif",
    caps: "'Jost', system-ui, sans-serif",
    capsSpacing: "0.24em",
    bg: "#FAFAF8",
    surface: "#F3F2EE",
    media: "#F3F2EE",
    band: "#F3F2EE",
    bandInk: "#141211",
    border: "#E3DFD8",
    hairline: "#141211",
    ink: "#141211",
    muted: "#6B6560",
    accent: "#141211",
    onAccent: "#FAFAF8",
    link: "#141211",
    decor: "#141211",
    mat: "#FFFFFF",
    radius: 0,
    pill: false,
    upper: true,
  },
  "noir-or": {
    id: "noir-or",
    label: "Noir & Or",
    description: "Soir de vernissage : noir velours, champagne et bordeaux profond.",
    swatch: ["#0B0909", "#C8AE7D", "#1A080C"],
    layout: "capsule",
    ambiance3d: "sombre",
    roomImage: "/themes/salle-sombre.jpg",
    fontsHref: `${GF}Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Jost:wght@300;400;500&display=swap`,
    display: "'Cormorant Garamond', Georgia, serif",
    displayWeight: 400,
    displayItalic: false,
    body: "'Jost', system-ui, sans-serif",
    bodyWeight: 300,
    mono: "'Jost', system-ui, sans-serif",
    caps: "'Jost', system-ui, sans-serif",
    capsSpacing: "0.3em",
    bg: "#0B0909",
    surface: "#141011",
    media: "#141011",
    band: "#1A080C",
    bandInk: "#F2EBDD",
    border: "rgba(200,174,125,0.25)",
    hairline: "rgba(200,174,125,0.6)",
    ink: "#F2EBDD",
    muted: "#BDB2A1",
    accent: "#C8AE7D",
    onAccent: "#1A080C",
    link: "#C8AE7D",
    decor: "#C8AE7D",
    mat: "#EFE7D8",
    radius: 0,
    pill: false,
    upper: true,
  },
  "maison-haussmann": {
    id: "maison-haussmann",
    label: "Maison Haussmann",
    description: "Salon parisien : moulures, cadres dorés et plâtre crème.",
    swatch: ["#EFE8DC", "#230307", "#C9A65E"],
    layout: "salon",
    ambiance3d: "haussmann",
    roomImage: "/themes/salle-haussmann.jpg",
    fontsHref: `${GF}Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Marcellus+SC&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap`,
    display: "'Playfair Display', Georgia, serif",
    displayWeight: 400,
    displayItalic: false,
    body: "'EB Garamond', Georgia, serif",
    bodyWeight: 400,
    mono: "'EB Garamond', Georgia, serif",
    caps: "'Marcellus SC', Georgia, serif",
    capsSpacing: "0.18em",
    bg: "#EFE8DC",
    surface: "#E7DDCB",
    media: "#FBF8F2",
    band: "#24090E",
    bandInk: "#F3ECDF",
    border: "#C9B9A0",
    hairline: "#A8874A",
    ink: "#2A211B",
    muted: "#5E5146",
    accent: "#230307",
    onAccent: "#F6F0E6",
    link: "#7A5A22",
    decor: "#A8874A",
    mat: "#FBF8F2",
    radius: 0,
    pill: false,
    upper: false,
  },
};

// Anciens thèmes retirés en octobre 2026 : leurs galeries passent
// automatiquement sur le thème le plus proche, sans action de l'artiste.
const THEME_ALIASES: Record<string, string> = {
  "atelier-sombre": "noir-or",
  "terre-argile": "maison-haussmann",
  "sauge-botanique": "blanc-pur",
  "galerie-blanche": "blanc-pur",
};

export const DEFAULT_THEME = "blanc-pur";

// Identifiant du thème réellement utilisé (ancien thème -> thème actuel).
export function normalizeThemeId(theme?: string | null): string {
  if (theme && SKINS[theme]) return theme;
  if (theme && THEME_ALIASES[theme]) return THEME_ALIASES[theme];
  return DEFAULT_THEME;
}

// Ordre d'affichage dans le sélecteur du dashboard.
const THEME_ORDER = ["blanc-pur", "noir-or", "maison-haussmann"];

// Même forme que l'ancien tableau THEMES du dashboard.
export const THEME_OPTIONS = THEME_ORDER.map((id) => ({
  value: id,
  label: SKINS[id].label,
  description: SKINS[id].description,
  swatch: SKINS[id].swatch,
  available: true,
}));

// Renvoie toujours une skin : les anciens thèmes (et une galerie sans thème)
// sont redirigés vers l'un des 3 thèmes actuels.
export function getSkin(theme?: string | null): Skin {
  return SKINS[normalizeThemeId(theme)];
}
