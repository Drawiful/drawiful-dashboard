import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "Drawiful — Dashboard artiste",
  description: "Gère ta galerie, tes œuvres et ton abonnement",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
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
