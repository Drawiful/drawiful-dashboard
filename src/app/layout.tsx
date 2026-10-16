import Script from "next/script";
import "./globals.css";
import MetaPixel from "@/components/MetaPixel";
import AttributionCapture from "@/components/AttributionCapture";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Drawiful — Dashboard artiste",
  description: "Gère ta galerie, tes œuvres et ton abonnement",
  // Vérification du domaine drawiful.app dans Meta Business Suite
  other: {
    "facebook-domain-verification": "iq2ccolroyqrk60lttmac4mw6ez72d",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <MetaPixel />
        <AttributionCapture />
        {/* Statistiques de visites Vercel (sans cookies) : pages vues par adresse */}
        <Analytics />
        {/* Web component Google pour prévisualiser les fichiers .glb (rotation, zoom) */}
        <Script
          type="module"
          src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
