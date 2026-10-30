"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Copy } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import PrintsInterestCard from "@/components/PrintsInterestCard";
import PaymentsSetupBanner from "@/components/PaymentsSetupBanner";
import GettingStarted, { onboardingComplete } from "@/components/GettingStarted";
import { api } from "@/lib/api";
import { galleryUrl as galleryUrlFor } from "@/lib/domain";

/*
  « Votre galerie » : l'accueil de l'artiste. On raconte ce qui s'est passé
  dans sa galerie (visiteurs, regards qui s'attardent, acquisitions) au lieu
  d'aligner des statistiques.
*/

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function greeting(now: Date) {
  const h = now.getHours();
  return h >= 18 || h < 5 ? "Bonsoir" : "Bonjour";
}

// « Erwan Gallery » -> « Erwan », « Galerie de Marie » -> « Marie ».
// Si le nom ne s'y prête pas, on salue sans prénom.
function firstNameFrom(galleryName?: string): string | null {
  if (!galleryName) return null;
  const stripped = galleryName
    .replace(/^(la\s+)?(galerie|gallery|atelier|studio)\s+(de\s+|d['’]\s*)?/i, "")
    .replace(/\s+(galerie|gallery|art|arts|studio|atelier)$/i, "")
    .trim();
  if (!stripped || stripped === galleryName.trim() || stripped.length > 24) return null;
  return stripped;
}

function todayLabel(now: Date) {
  const s = now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function plural(n: number, one: string, many: string) {
  return n > 1 ? many : one;
}

function Moment({ value, children, accent = false }: { value: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div className="flex items-baseline gap-6 py-5 border-b border-bordure last:border-b-0">
      <span className={`font-display text-[48px] leading-none min-w-[96px] ${accent ? "text-laiton" : "text-encre"}`}>
        {value}
      </span>
      <span className="text-base leading-relaxed text-encre/75">{children}</span>
    </div>
  );
}

export default function OverviewPage() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [statsReady, setStatsReady] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [welcome, setWelcome] = useState(false);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    api
      .getMyStats(7)
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setStatsReady(true));
    api.getOrders().then(setOrders).catch(() => {});
    // Arrivée juste après l'inscription (/overview?bienvenue=1)
    if (new URLSearchParams(window.location.search).get("bienvenue") === "1") setWelcome(true);
  }, []);

  const artworks: any[] = profile?.artworks ?? [];
  const onWalls = artworks.filter((a) => a.status === "PUBLISHED");
  const limits = profile?.limits;
  const url = profile?.slug ? galleryUrlFor(profile.slug) : "";

  // L'œuvre à l'affiche : celle qui a retenu le plus de regards, sinon la dernière accrochée
  const featured = useMemo(() => {
    const top = stats?.topArtwork && onWalls.find((a) => a.id === stats.topArtwork.id);
    return top || onWalls[0] || null;
  }, [stats, onWalls]);

  const acquiredThisWeek = orders.filter(
    (o) => (o.status === "PAID" || o.status === "SHIPPED") && Date.now() - new Date(o.createdAt).getTime() < WEEK_MS
  ).length;
  // La plus ancienne acquisition pas encore expédiée
  const toShip = [...orders].reverse().find((o) => o.status === "PAID");
  const toShipCity = toShip?.shippingAddress?.city;
  const toShipTitle = toShip?.items?.[0]?.titleSnapshot;

  const wallsLeft =
    typeof limits?.maxArtworks === "number" ? Math.max(0, limits.maxArtworks - artworks.length) : null;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* le lien reste affiché */
    }
  }

  const name = firstNameFrom(profile?.galleryName);
  const visitors: number | null = stats ? stats.visitors : null;
  const lingerers: number | null = stats ? stats.lingerers : null;

  return (
    <DashboardShell onProfileLoaded={setProfile}>
      <div className="flex flex-col gap-11">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.18em] text-pierre">{now ? todayLabel(now) : " "}</p>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 min-h-[44px] px-5 rounded-full border border-encre text-encre text-sm font-medium hover:bg-encre hover:text-ivoire transition-colors"
            >
              Visiter votre galerie <ArrowUpRight size={15} strokeWidth={1.6} />
            </a>
          )}
        </div>

        <header className="flex flex-col gap-3.5">
          <h1 className="font-display font-normal text-[44px] sm:text-[60px] leading-[1.05] tracking-[-0.01em] text-encre">
            {now ? greeting(now) : "Bonjour"}
            {name ? `, ${name}` : ""}.
          </h1>
          <p className="text-[17px] leading-relaxed text-encre/75 max-w-xl">
            {welcome
              ? "Votre galerie ouvre ses portes. Quelques gestes, et elle sera prête à recevoir vos premiers visiteurs."
              : onWalls.length
                ? "Votre galerie est ouverte. Voici ce qui s'y est passé cette semaine."
                : "Votre galerie vous attend. Accrochez votre première œuvre pour l'ouvrir au public."}
          </p>
        </header>

        {/* Premiers pas tant que la galerie n'est pas prête (inclut l'activation
            des paiements) ; ensuite, le bandeau paiements reste en filet de sécurité. */}
        {profile && (
          <div>
            <GettingStarted profile={profile} />
            {(onboardingComplete(profile) || profile.stripeOnboardingDone) && <PaymentsSetupBanner profile={profile} />}
          </div>
        )}

        <section className="grid gap-7 lg:grid-cols-2">
          {/* À l'affiche */}
          {featured ? (
            <div className="relative min-h-[540px] rounded-xl overflow-hidden bg-nuit flex flex-col justify-end">
              {featured.imageUrl && (
                <div className="absolute inset-x-0 top-0 bottom-[300px] sm:bottom-[210px] flex items-center justify-center px-10 pt-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="max-h-full max-w-full object-contain shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
                  />
                </div>
              )}
              <div className="relative p-8 flex flex-col gap-3 bg-gradient-to-t from-nuit via-nuit/90 to-transparent pt-16">
                <p className="text-[11px] uppercase tracking-[0.2em] text-champagne">À l'affiche</p>
                <h2 className="font-display font-normal text-[36px] leading-tight text-ivoire">{featured.title}</h2>
                {stats?.topArtwork?.id === featured.id && stats.topArtwork.lingerers > 0 && (
                  <p className="text-sm text-lilas">
                    L'œuvre qui a retenu le plus de regards cette semaine.
                  </p>
                )}
                <div className="flex flex-wrap gap-3 mt-2">
                  {url && (
                    <a
                      href={`${url}/${featured.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center min-h-[44px] px-5 rounded-full bg-champagne text-nuit text-sm font-semibold"
                    >
                      La voir dans votre galerie
                    </a>
                  )}
                  {url && limits?.tour3d && (
                    <a
                      href={`${url}/visite-3d`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center min-h-[44px] px-5 rounded-full border border-ivoire/50 text-ivoire text-sm"
                    >
                      Entrer dans la salle
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/artworks"
              className="min-h-[440px] rounded-xl border border-dashed border-laiton/60 flex flex-col items-center justify-center gap-4 p-10 text-center hover:bg-papier transition-colors"
            >
              <span className="text-[11px] uppercase tracking-[0.2em] text-laiton">Votre premier mur</span>
              <span className="font-display text-[34px] leading-tight text-encre">Un mur vous attend.</span>
              <span className="text-sm text-encre/70 max-w-xs">
                Une photo, un titre, un prix : accrochez votre première œuvre et votre galerie prend vie.
              </span>
              <span className="mt-2 inline-flex items-center min-h-[44px] px-6 rounded-full bg-nuit text-ivoire text-sm font-medium">
                Accrocher une œuvre
              </span>
            </Link>
          )}

          {/* Cette semaine */}
          <div className="flex flex-col justify-center px-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-laiton mb-2">Cette semaine</p>
            {statsReady && stats === null ? (
              <p className="py-5 text-base text-encre/70">
                La fréquentation de votre galerie apparaîtra ici dans quelques instants.
              </p>
            ) : (
              <>
                <Moment value={visitors === null ? "—" : String(visitors)}>
                  {visitors === 0
                    ? "visiteur pour l'instant. Partagez votre lien : les premiers arriveront vite."
                    : `${plural(visitors ?? 0, "visiteur a traversé", "visiteurs ont traversé")} votre galerie.`}
                </Moment>
                <Moment value={lingerers === null ? "—" : String(lingerers)}>
                  {plural(lingerers ?? 0, "s'est attardé", "se sont attardés")} devant{" "}
                  {stats?.topArtwork && lingerers === stats.topArtwork.lingerers ? (
                    <em className="font-display not-italic text-lg text-encre">{stats.topArtwork.title}</em>
                  ) : (
                    "vos œuvres"
                  )}
                  .
                </Moment>
                {acquiredThisWeek > 0 ? (
                  <Moment value={String(acquiredThisWeek)} accent>
                    {plural(acquiredThisWeek, "œuvre a trouvé son collectionneur.", "œuvres ont trouvé leur collectionneur.")}{" "}
                    <Link href="/orders" className="text-laiton underline underline-offset-4">
                      Voir {plural(acquiredThisWeek, "l'acquisition", "les acquisitions")}
                    </Link>
                  </Moment>
                ) : (
                  <Moment value={String(onWalls.length)}>
                    {plural(onWalls.length, "œuvre accrochée", "œuvres accrochées")} à vos murs.
                  </Moment>
                )}
              </>
            )}
          </div>
        </section>

        <section className="grid gap-7 md:grid-cols-2">
          {toShip ? (
            <div className="rounded-xl bg-papier border border-bordure p-8 flex flex-col gap-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-laiton">Une acquisition attend votre attention</p>
              <h3 className="font-display font-normal text-[28px] leading-snug text-encre">
                {toShipTitle ? <em>{toShipTitle}</em> : "Une de vos œuvres"} rejoint une collection
                {toShipCity ? ` à ${toShipCity}` : ""}.
              </h3>
              <p className="text-[15px] leading-relaxed text-encre/75">
                Préparez l'envoi avec soin, puis indiquez ici qu'elle est en route.
              </p>
              <div className="mt-2">
                <Link
                  href="/orders"
                  className="inline-flex items-center min-h-[44px] px-5 rounded-full bg-nuit text-ivoire text-sm font-medium"
                >
                  Préparer l'envoi
                </Link>
              </div>
            </div>
          ) : (
            url && (
              <div className="rounded-xl bg-papier border border-bordure p-8 flex flex-col gap-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-laiton">Faites venir vos visiteurs</p>
                <h3 className="font-display font-normal text-[28px] leading-snug text-encre">
                  Votre galerie se partage d'un lien.
                </h3>
                <p className="text-[15px] leading-relaxed text-encre/75">
                  Dans votre bio Instagram ou TikTok, en story, ou à vos proches : chaque partage ouvre vos portes.
                </p>
                <p className="text-sm text-encre/80 bg-platre rounded-md px-3 py-2 break-all">{url}</p>
                <div className="mt-1">
                  <button
                    type="button"
                    onClick={copyLink}
                    className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full bg-nuit text-ivoire text-sm font-medium"
                  >
                    <Copy size={15} strokeWidth={1.6} /> {copied ? "Lien copié" : "Copier le lien"}
                  </button>
                </div>
              </div>
            )
          )}

          <div className="rounded-xl bg-papier border border-bordure p-8 flex flex-col gap-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-laiton">Votre prochain geste</p>
            <h3 className="font-display font-normal text-[28px] leading-snug text-encre">
              {onWalls.length ? "Accrochez une nouvelle œuvre." : "Accrochez votre première œuvre."}
            </h3>
            <p className="text-[15px] leading-relaxed text-encre/75">
              Une galerie qui se renouvelle attire de nouveaux regards.
              {wallsLeft !== null && wallsLeft > 0
                ? ` Il vous reste ${wallsLeft} ${plural(wallsLeft, "place", "places")} sur vos murs.`
                : ""}
            </p>
            <div className="mt-2">
              <Link
                href="/artworks"
                className="inline-flex items-center min-h-[44px] px-5 rounded-full bg-nuit text-ivoire text-sm font-medium"
              >
                Accrocher une œuvre
              </Link>
            </div>
          </div>
        </section>

        <PrintsInterestCard />
      </div>
    </DashboardShell>
  );
}
