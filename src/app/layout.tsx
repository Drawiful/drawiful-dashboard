import "./globals.css";

export const metadata = {
  title: "Drawiful — Dashboard artiste",
  description: "Gère ta galerie, tes œuvres et ton abonnement",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
