"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Copy, ExternalLink, X } from "lucide-react";
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

  const next = steps.find((s) => !s.done);

  return (
    <section className="rounded-xl bg-papier border border-bordure p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-laiton">Avant le vernissage</p>
          <h3 className="font-display font-normal text-[28px] text-encre mt-2">Préparez l'ouverture de votre galerie</h3>
          <p className="text-sm text-pierre mt-1">
            {doneCount} sur {steps.length} terminée{doneCount > 1 ? "s" : ""}
          </p>
        </div>
        <a
          href={galleryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-laiton underline underline-offset-4"
        >
          Visiter votre galerie <ExternalLink size={13} />
        </a>
      </div>

      <div className="h-1 rounded-full bg-bordure mt-5 overflow-hidden">
        <div
          className="h-full bg-champagne rounded-full transition-all"
          style={{ width: `${(doneCount / steps.length) * 100}%` }}
        />
      </div>

      <ol className="mt-5 divide-y divide-bordure">
        {steps.map((s, i) => {
          const isNext = s.key === next?.key;
          return (
            <li key={s.key} className="flex items-center gap-4 py-3.5">
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 text-xs font-semibold ${
                  s.done ? "bg-champagne text-nuit" : isNext ? "bg-nuit text-ivoire" : "border border-bordure text-pierre"
                }`}
              >
                {s.done ? <Check size={14} /> : i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${s.done ? "text-encre/45 line-through" : "text-encre"}`}>{s.title}</p>
                {!s.done && <p className="text-xs text-encre/60 mt-0.5">{s.text}</p>}
              </div>
              {!s.done && (
                <Link
                  href={s.href}
                  className={`inline-flex items-center gap-1.5 text-sm min-h-[44px] px-4 rounded-full shrink-0 ${
                    isNext ? "bg-nuit text-ivoire font-medium" : "border border-bordure text-encre/70"
                  }`}
                >
                  {s.cta} {isNext && <ArrowRight size={14} />}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
