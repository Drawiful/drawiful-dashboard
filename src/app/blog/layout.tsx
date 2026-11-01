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
    <div className={`${display.variable} ${body.variable} lp-root min-h-screen bg-[#F7F3EC] text-[#1A1714] antialiased`}>
      <style>{`
        .lp-root { font-family: var(--font-lp-body), system-ui, sans-serif; }
        .font-display-lp { font-family: var(--font-lp-display), Georgia, serif; font-optical-sizing: auto; }
        .lp-root ::selection { background: #D9B75C; color: #1A1714; }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-[#F4EFE6]/10 bg-[#0E0C0A]/95 text-[#F4EFE6] backdrop-blur">
        <nav className="mx-auto flex h-16 sm:h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-baseline gap-4">
            <Link href="/" className="font-display-lp text-[26px] tracking-tight" aria-label="Drawiful, accueil">
              Drawiful
            </Link>
            <Link href="/blog" className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#D9B75C] hover:text-[#E6C877]">
              Le journal
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-2 sm:px-3 py-2 text-[13px] sm:text-sm text-[#F4EFE6]/75 hover:text-[#F4EFE6]">
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="hidden sm:inline-flex rounded-full bg-[#D9B75C] px-5 py-2.5 text-sm font-semibold text-[#0E0C0A] hover:bg-[#E6C877] transition-colors"
            >
              Accès privé, 14 jours offerts
            </Link>
          </div>
        </nav>
      </header>

      {children}

      <footer className="bg-[#0E0C0A] text-[#F4EFE6]/60">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-5 py-12 sm:flex-row sm:px-8">
          <div>
            <p className="font-display-lp text-2xl text-[#F4EFE6]">Drawiful</p>
            <p className="mt-2 text-sm">L'écrin des artistes contemporains.</p>
            <SocialLinks className="mt-4 -ml-2.5" />
          </div>
          <div className="flex flex-col gap-2 text-sm sm:items-end">
            <Link href="/" className="hover:text-[#F4EFE6]">
              Découvrir Drawiful
            </Link>
            <Link href="/blog" className="hover:text-[#F4EFE6]">
              Blog
            </Link>
            <a href="mailto:clients@drawiful.app" className="hover:text-[#F4EFE6]">
              clients@drawiful.app
            </a>
            <p>© {new Date().getFullYear()} Drawiful</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
