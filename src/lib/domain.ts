// Domaine principal de Drawiful (landing, tableau de bord, galeries <slug>.drawiful.art).
// NEXT_PUBLIC_* est figé au moment du build Vercel : changer la variable demande un redéploiement.
export const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "drawiful.art").toLowerCase();

// Anciens domaines, redirigés en 308 vers ROOT_DOMAIN (voir next.config.js).
export const LEGACY_DOMAINS = ["drawiful.app"];

export function galleryUrl(slug: string) {
  return `https://${slug}.${ROOT_DOMAIN}`;
}

// "erwan.drawiful.art" ou "erwan.drawiful.app" -> "erwan" ; sinon null
export function gallerySlugFromHost(host: string): string | null {
  const h = host.toLowerCase();
  for (const d of [ROOT_DOMAIN, ...LEGACY_DOMAINS]) {
    if (h.endsWith(`.${d}`)) {
      const sub = h.slice(0, -(d.length + 1));
      return sub && !sub.includes(".") && sub !== "www" && sub !== "dashboard" ? sub : null;
    }
  }
  return null;
}
