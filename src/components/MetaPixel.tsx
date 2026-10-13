"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/*
  Pixel Meta (publicités Instagram / Facebook).

  - Chargé uniquement sur les pages Drawiful destinées aux futurs artistes
    (page d'accueil et inscription sur drawiful.app). Jamais dans le dashboard
    ni sur les galeries des artistes : leurs visiteurs ne sont pas suivis.
  - Chargé uniquement après accord du visiteur (bandeau cookies), comme
    l'exige le RGPD pour un traceur publicitaire.
*/

export const META_PIXEL_ID = "2820169321731713";
const CONSENT_KEY = "drawiful_cookie_consent";
const MARKETING_HOSTS = ["drawiful.app", "www.drawiful.app", "localhost"];
const MARKETING_PATHS = ["/", "/decouvrir", "/inscription"];

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

function isMarketingPage(pathname: string | null) {
  if (typeof window === "undefined" || !pathname) return false;
  return MARKETING_HOSTS.includes(window.location.hostname) && MARKETING_PATHS.includes(pathname);
}

function loadPixel() {
  if (window.fbq) return;
  const fbq: any = function (...args: any[]) {
    fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args);
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", META_PIXEL_ID);
}

// Envoie un événement au pixel s'il est chargé (visiteur d'accord).
// Renvoie true si l'événement est parti.
export function trackMeta(event: string, params?: Record<string, unknown>) {
  try {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", event, params);
      return true;
    }
  } catch {
    /* le suivi ne doit jamais bloquer le site */
  }
  return false;
}

export default function MetaPixel() {
  const pathname = usePathname();
  // undefined = pas encore lu ; null = pas encore choisi
  const [consent, setConsent] = useState<"granted" | "denied" | null | undefined>(undefined);
  const [eligible, setEligible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(CONSENT_KEY);
    } catch {
      /* stockage indisponible : on redemandera */
    }
    setConsent(stored === "granted" || stored === "denied" ? stored : null);
  }, []);

  useEffect(() => {
    const ok = isMarketingPage(pathname);
    setEligible(ok);
    if (ok && consent === "granted") {
      loadPixel();
      window.fbq?.("track", "PageView");
    }
  }, [pathname, consent]);

  function choose(value: "granted" | "denied") {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* on garde le choix pour cette visite seulement */
    }
    setConsent(value);
  }

  if (!eligible || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookies"
      style={{
        position: "fixed",
        left: "50%",
        bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
        transform: "translateX(-50%)",
        zIndex: 1000,
        width: "min(560px, calc(100vw - 32px))",
        boxSizing: "border-box",
        padding: "16px 18px",
        borderRadius: 14,
        background: "#2B1E2F",
        color: "#F7F5F0",
        boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
        fontSize: 14,
        lineHeight: 1.5,
      }}
    >
      <p style={{ margin: 0 }}>
        Drawiful utilise un cookie de mesure Meta pour savoir quelles publicités vous ont amené ici. Rien n'est
        déposé sans votre accord.
      </p>
      <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => choose("denied")}
          style={{
            padding: "9px 16px",
            borderRadius: 999,
            border: "1px solid rgba(247,245,240,0.4)",
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Refuser
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          style={{
            padding: "9px 16px",
            borderRadius: 999,
            border: 0,
            background: "#F7F5F0",
            color: "#2B1E2F",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Accepter
        </button>
      </div>
    </div>
  );
}
