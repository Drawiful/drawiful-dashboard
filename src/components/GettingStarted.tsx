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
      title: "Publiez votre première œuvre",
      text: "Une photo, un titre, un prix : votre galerie prend vie.",
      href: "/artworks",
      cta: "Publier",
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
      <section className="mb-8 rounded-md bg-aubergine text-platre p-6 relative">
        <button onClick={dismiss} aria-label="Fermer" className="absolute top-4 right-4 text-platre/60 hover:text-platre">
          <X size={18} />
        </button>
        <p className="text-xs uppercase tracking-widest text-ocre">Galerie prête</p>
        <h3 className="font-display text-2xl mt-2">Bravo, votre galerie est ouverte à la vente.</h3>
        <p className="text-sm text-platre/75 mt-2 max-w-xl">
          Prochaine étape : la faire connaître. Mettez le lien dans votre bio Instagram et TikTok, et partagez-le à vos proches.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-5">
          <span className="text-sm bg-platre/10 rounded-md px-3 py-2 break-all">{galleryUrl}</span>
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md bg-platre text-aubergine font-medium"
          >
            <Copy size={14} /> {copied ? "Lien copié" : "Copier le lien"}
          </button>
          <a
            href={galleryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md border border-platre/30"
          >
            Voir ma galerie <ExternalLink size={14} />
          </a>
        </div>
      </section>
    );
  }

  const next = steps.find((s) => !s.done);

  return (
    <section className="mb-8 rounded-md bg-white border border-bordure p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl text-encre">Ouvrez votre galerie en 4 étapes</h3>
          <p className="text-sm text-encre/60 mt-1">
            {doneCount} sur {steps.length} terminée{doneCount > 1 ? "s" : ""}
          </p>
        </div>
        <a
          href={galleryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-aubergine hover:underline"
        >
          Voir ma galerie <ExternalLink size={13} />
        </a>
      </div>

      <div className="h-1.5 rounded-full bg-bordure mt-4 overflow-hidden">
        <div
          className="h-full bg-ocre rounded-full transition-all"
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
                  s.done ? "bg-sauge text-white" : isNext ? "bg-aubergine text-platre" : "border border-bordure text-encre/50"
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
                  className={`inline-flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-md shrink-0 ${
                    isNext ? "bg-aubergine text-platre font-medium" : "border border-bordure text-encre/70"
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
