"use client";
import { useEffect, useState } from "react";
import { Copy, ExternalLink, X } from "lucide-react";
import { galleryUrl as galleryUrlFor } from "@/lib/domain";

/*
  Premiers pas : guide l'artiste de l'inscription à une galerie prête à vendre.
  Chaque étape se coche toute seule d'après son profil. Une fois tout fait,
  un message de félicitations s'affiche jusqu'à ce que l'artiste le ferme.
*/

const DISMISS_KEY = "drawiful_onboarding_done_seen";

type Step = { key: string; title: string; text: string; href: string; cta: string; done: boolean };

export function onboardingSteps(profile: any): Step[] {
  if (!profile) return [];
  const artworks: any[] = profile.artworks ?? [];
  const galleryName: string = profile.galleryName ?? "";
  return [
    {
      key: "identity",
      title: "Donnez un nom et une bio à votre galerie",
      text: "C'est ce que vos visiteurs lisent en premier.",
      href: "/gallery",
      cta: "Personnaliser",
      done: !!profile.bio?.trim() && !galleryName.startsWith("Galerie de "),
    },
    {
      key: "avatar",
      title: "Ajoutez votre photo ou votre logo",
      text: "Il apparaît sur votre galerie et sur la page de paiement.",
      href: "/gallery",
      cta: "Ajouter",
      done: !!profile.avatarUrl,
    },
    {
      key: "artwork",
      title: "Accrochez votre première œuvre",
      text: "Une photo, un titre, un prix : votre galerie prend vie.",
      href: "/artworks",
      cta: "Accrocher",
      done: artworks.some((a) => a.status === "PUBLISHED" || a.status === "SOLD"),
    },
    {
      key: "payments",
      title: "Activez les paiements",
      text: "5 minutes avec Stripe pour recevoir l'argent de vos ventes, sans commission Drawiful. Vous pouvez vendre dès l'essai.",
      href: "/settings",
      cta: "Activer",
      done: !!profile.stripeOnboardingDone,
    },
    // Formule sans boutique (Aspirant) : pas d'étape paiements
  ].filter((s) => s.key !== "payments" || !profile.limits || profile.limits.shop);
}

// Les premiers pas, dans la langue de la maison, pour la carte « Votre prochain geste »
const NEXT_STEP_COPY: Record<string, { title: string; text: string; cta: string }> = {
  identity: { title: "Donnez un nom et une voix à votre galerie.", text: "Son nom et quelques mots sur vous : c'est ce que vos visiteurs lisent en premier.", cta: "Présenter ma galerie" },
  avatar: { title: "Ajoutez votre portrait.", text: "Votre visage ou votre logo accueille vos visiteurs et signe la page de paiement.", cta: "Ajouter mon portrait" },
  artwork: { title: "Accrochez votre première œuvre.", text: "Une photo, un titre, un prix : votre galerie prend vie.", cta: "Accrocher une œuvre" },
  payments: { title: "Ouvrez la vente de vos œuvres.", text: "Cinq minutes avec Stripe pour recevoir le produit de vos ventes, sans commission Drawiful.", cta: "Ouvrir mes ventes" },
};

export function nextOnboardingStep(profile: any): { key: string; href: string; title: string; text: string; cta: string } | null {
  const next = onboardingSteps(profile).find((s) => !s.done);
  if (!next) return null;
  return { key: next.key, href: next.href, ...NEXT_STEP_COPY[next.key] };
}

export function onboardingComplete(profile: any) {
  const steps = onboardingSteps(profile);
  return steps.length > 0 && steps.every((s) => s.done);
}

export default function GettingStarted({ profile }: { profile: any }) {
  const [celebrationSeen, setCelebrationSeen] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      setCelebrationSeen(window.localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setCelebrationSeen(false);
    }
  }, []);

  if (!profile) return null;
  const steps = onboardingSteps(profile);
  const doneCount = steps.filter((s) => s.done).length;
  const galleryUrl = galleryUrlFor(profile.slug);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(galleryUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* copie impossible : le lien reste affiché */
    }
  }

  function dismiss() {
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* fermé pour cette visite seulement */
    }
    setCelebrationSeen(true);
  }

  // Tout est fait : félicitations, une seule fois
  if (doneCount === steps.length) {
    if (celebrationSeen) return null;
    return (
      <section className="rounded-xl bg-nuit text-ivoire p-8 relative">
        <button onClick={dismiss} aria-label="Fermer" className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center text-ivoire/60 hover:text-ivoire">
          <X size={18} />
        </button>
        <p className="text-[11px] uppercase tracking-[0.2em] text-champagne">Vernissage</p>
        <h3 className="font-display font-normal text-[30px] leading-snug mt-2">Votre galerie est ouverte. Que le monde entre.</h3>
        <p className="text-[15px] text-lilas mt-2 max-w-xl">
          Faites-la connaître : glissez le lien dans votre bio Instagram et TikTok, et partagez-le à vos proches.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-5">
          <span className="text-sm bg-ivoire/10 rounded-md px-3 py-2 break-all">{galleryUrl}</span>
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-2 text-sm min-h-[44px] px-5 rounded-full bg-champagne text-nuit font-semibold"
          >
            <Copy size={14} /> {copied ? "Lien copié" : "Copier le lien"}
          </button>
          <a
            href={galleryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm min-h-[44px] px-5 rounded-full border border-ivoire/40"
          >
            Visiter votre galerie <ExternalLink size={14} />
          </a>
        </div>
      </section>
    );
  }

  // Galerie pas encore prête : plus de liste à cocher. Le prochain geste est
  // proposé, seul, dans la carte « Votre prochain geste » de l'accueil.
  return null;
}
