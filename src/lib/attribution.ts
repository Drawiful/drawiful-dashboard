import { gallerySlugFromHost } from "@/lib/domain";
/*
  Provenance des visiteurs : on retient d'où vient la première visite
  (paramètres utm des liens de bio et des pubs, ou site d'origine) pour
  l'enregistrer au moment de l'inscription. Stocké uniquement dans le
  navigateur du visiteur, jamais partagé avec un tiers.
*/

const KEY = "drawiful_attribution";
const MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000; // 60 jours

export type Attribution = {
  signupSource?: string;
  signupMedium?: string;
  signupCampaign?: string;
};

type Stored = Attribution & { at: number };

// Sites connus : la visite arrive sans utm, on devine la source à partir du site d'origine.
const KNOWN_REFERRERS: [RegExp, string][] = [
  [/instagram\.com$/, "instagram"],
  [/(^|\.)facebook\.com$|fb\.com$/, "facebook"],
  [/tiktok\.com$/, "tiktok"],
  [/youtube\.com$|youtu\.be$/, "youtube"],
  [/pinterest\./, "pinterest"],
  [/google\./, "google"],
  [/bing\.com$/, "bing"],
];

function read(): Stored | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Stored;
    if (!data?.at || Date.now() - data.at > MAX_AGE_MS) return null;
    return data;
  } catch {
    return null;
  }
}

// À appeler à chaque arrivée sur une page : garde la première provenance connue.
export function captureAttribution() {
  if (typeof window === "undefined") return;
  if (read()) return;

  const params = new URLSearchParams(window.location.search);
  let data: Attribution | null = null;

  const source = params.get("utm_source");
  if (source) {
    data = {
      signupSource: source,
      signupMedium: params.get("utm_medium") || undefined,
      signupCampaign: params.get("utm_campaign") || undefined,
    };
  } else if (params.get("fbclid")) {
    data = { signupSource: "meta", signupMedium: "paid" };
  } else if (document.referrer) {
    try {
      const host = new URL(document.referrer).hostname.replace(/^www\./, "");
      const own = window.location.hostname.replace(/^www\./, "");
      if (host && host !== own) {
        const known = KNOWN_REFERRERS.find(([re]) => re.test(host));
        // Arrivé depuis la galerie d'un artiste Drawiful (lien « Créé avec Drawiful »…)
        const gallerySlug = gallerySlugFromHost(host);
        const fromGallery = !!gallerySlug;
        data = {
          signupSource: fromGallery ? "galerie-artiste" : known ? known[1] : host,
          signupMedium: "referral",
          signupCampaign: gallerySlug || undefined,
        };
      }
    } catch {
      /* référent illisible : on ignore */
    }
  }

  if (!data) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...data, at: Date.now() }));
  } catch {
    /* stockage indisponible : la provenance sera "direct" */
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const data = read();
  if (!data) return {};
  return {
    signupSource: data.signupSource,
    signupMedium: data.signupMedium,
    signupCampaign: data.signupCampaign,
  };
}
