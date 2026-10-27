import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { SITE_URL } from "@/lib/blog";
import SocialLinks from "@/components/SocialLinks";

// Mêmes polices et couleurs que la landing (src/app/decouvrir/page.tsx)
const display = Bodoni_Moda({ subsets: ["latin"], variable: "--font-lp-display", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-lp-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${display.variable} ${body.variable} lp-root min-h-screen bg-[#F7F5F0] text-[#1C1A17] antialiased`}>
      <style>{`
        .lp-root { font-family: var(--font-lp-body), system-ui, sans-serif; }
        .font-display-lp { font-family: var(--font-lp-display), Georgia, serif; font-optical-sizing: auto; }
        .lp-root ::selection { background: #B8912F; color: #1C1A17; }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#2B1E2F]/95 text-[#F7F5F0] backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-baseline gap-4">
            <Link href="/" className="font-display-lp text-2xl tracking-tight" aria-label="Drawiful, accueil">
              Drawiful
            </Link>
            <Link href="/blog" className="text-sm text-[#F7F5F0]/70 hover:text-[#F7F5F0]">
              Blog
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden px-3 py-2 text-sm text-[#F7F5F0]/80 hover:text-[#F7F5F0] sm:block">
              Se connecter
            </Link>
            <Link
              href="/inscription?plan=artiste"
              className="rounded-full bg-[#B8912F] px-4 py-2 text-sm font-semibold text-[#1C1A17] hover:bg-[#C9A24A]"
            >
              Essayer 14 jours
            </Link>
          </div>
        </nav>
      </header>

      {children}

      <footer className="bg-[#1C1A17] text-[#F7F5F0]/60">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-5 py-12 sm:flex-row sm:px-8">
          <div>
            <p className="font-display-lp text-2xl text-[#F7F5F0]">Drawiful</p>
            <p className="mt-2 text-sm">La galerie en ligne des artistes indépendants.</p>
            <SocialLinks className="mt-4 -ml-2.5" />
          </div>
          <div className="flex flex-col gap-2 text-sm sm:items-end">
            <Link href="/" className="hover:text-[#F7F5F0]">
              Découvrir Drawiful
            </Link>
            <Link href="/blog" className="hover:text-[#F7F5F0]">
              Blog
            </Link>
            <a href="mailto:clients@drawiful.app" className="hover:text-[#F7F5F0]">
              clients@drawiful.app
            </a>
            <p>© {new Date().getFullYear()} Drawiful</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
