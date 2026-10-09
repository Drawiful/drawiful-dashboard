import { NextRequest, NextResponse } from "next/server";

/*
  Aiguillage des adresses de galerie :
  - sagalerie.drawiful.app/...      -> /g/sagalerie/...
  - www.sagalerie.com/... (vérifié) -> /g/<slug de la galerie>/...
  - drawiful-dashboard.vercel.app   -> tableau de bord, inchangé
  Les fichiers statiques (/_next, /visite-3d/*.html, images…) ne passent pas ici.
*/

const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "drawiful.app").toLowerCase();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Sous-domaines qui ne sont jamais des galeries
const RESERVED = new Set([
  "www", "app", "api", "admin", "dashboard", "mail", "email", "envoi", "img", "r",
  "static", "cdn", "assets", "help", "aide", "support", "blog", "status", "docs",
]);

// Domaines personnalisés déjà résolus (cache de l'instance, 5 min)
const domainCache = new Map<string, { slug: string | null; at: number }>();
const CACHE_MS = 5 * 60 * 1000;

async function slugForCustomDomain(host: string): Promise<string | null> {
  const hit = domainCache.get(host);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.slug;
  let slug: string | null = null;
  try {
    const res = await fetch(`${API_BASE_URL}/api/artists/resolve-domain/${encodeURIComponent(host)}`, {
      headers: { accept: "application/json" },
    });
    if (res.ok) slug = ((await res.json()) as { slug?: string }).slug ?? null;
  } catch {
    slug = null;
  }
  domainCache.set(host, { slug, at: Date.now() });
  return slug;
}

function isAppHost(host: string) {
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".vercel.app") ||
    host === ROOT_DOMAIN
  );
}

function rewriteToGallery(req: NextRequest, slug: string) {
  const url = req.nextUrl.clone();
  const path = url.pathname;
  // Les liens internes de la boutique (/g/<slug>/...) restent valables tels quels.
  if (path === `/g/${slug}` || path.startsWith(`/g/${slug}/`)) return NextResponse.next();
  url.pathname = `/g/${slug}${path === "/" ? "" : path}`;
  return NextResponse.rewrite(url);
}

export async function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0];
  if (!host || isAppHost(host)) return NextResponse.next();

  // 1) Adresse par défaut : <slug>.drawiful.app
  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    const sub = host.slice(0, -(ROOT_DOMAIN.length + 1));
    if (!sub || sub.includes(".") || RESERVED.has(sub)) return NextResponse.next();
    return rewriteToGallery(req, sub);
  }

  // 2) Domaine personnalisé de l'artiste
  const slug = await slugForCustomDomain(host);
  if (slug) return rewriteToGallery(req, slug);
  return NextResponse.next();
}

export const config = {
  // Tout sauf les fichiers internes de Next et les fichiers statiques (avec extension)
  matcher: ["/((?!_next/|api/|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.[a-zA-Z0-9]+$).*)"],
};
