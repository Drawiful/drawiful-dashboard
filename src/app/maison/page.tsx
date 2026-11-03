"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import { Section, field, btnPrimary } from "@/components/FormSection";
import { api, getMaisonVisit, startMaisonVisit } from "@/lib/api";

/*
  La conciergerie (réservée à la maison) : retrouver la galerie d'un artiste et
  y entrer sans son mot de passe, pour accrocher ses œuvres à sa place.
  Chaque accès dure 2 h et est consigné dans le journal.
*/

type Gallery = {
  id: string;
  galleryName: string;
  email: string;
  galleryUrl: string;
  createdAt: string;
  trialEndsAt: string | null;
  plan: string | null;
  subscriptionStatus: string | null;
  published: number;
};

type Visit = { id: string; maisonEmail: string; galleryName: string; createdAt: string };

const dateFr = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", timeZone: "Europe/Paris" });
const dateHeureFr = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

function accessLabel(g: Gallery) {
  if (g.subscriptionStatus === "ACTIVE" || g.subscriptionStatus === "TRIALING") return `Formule ${g.plan ?? ""}`.trim();
  if (g.trialEndsAt) {
    return new Date(g.trialEndsAt) > new Date() ? `Accès privé jusqu'au ${dateFr(g.trialEndsAt)}` : "Accès privé terminé";
  }
  return "Sans formule";
}

export default function MaisonPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [inVisit, setInVisit] = useState(false);
  const [q, setQ] = useState("");
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [journal, setJournal] = useState<Visit[]>([]);
  const [searching, setSearching] = useState(false);
  const [entering, setEntering] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getMaisonVisit()) {
      setInVisit(true);
      setAllowed(false);
      return;
    }
    api
      .maisonAccess()
      .then(() => {
        setAllowed(true);
        search("");
        api.maisonJournal().then(setJournal).catch(() => {});
      })
      .catch(() => setAllowed(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function search(term: string) {
    setSearching(true);
    setError(null);
    try {
      setGalleries(await api.maisonSearch(term));
    } catch (e: any) {
      setError(e?.message || "La recherche n'a pas abouti.");
    } finally {
      setSearching(false);
    }
  }

  async function enter(g: Gallery) {
    setEntering(g.id);
    setError(null);
    try {
      const { accessToken, galleryName } = await api.maisonEnter(g.id);
      startMaisonVisit(accessToken, galleryName);
      window.location.href = "/artworks";
    } catch (e: any) {
      setError(e?.message || "L'accès n'a pas pu s'ouvrir.");
      setEntering(null);
    }
  }

  return (
    <DashboardShell>
      <PageHeader
        kicker="La maison"
        title="La conciergerie"
        intro="Entrez dans la galerie d'un artiste pour accrocher ses œuvres à sa place. Chaque accès dure deux heures et reste consigné dans le journal."
      />

      {allowed === null && <p className="text-pierre">Un instant…</p>}

      {allowed === false && (
        <p className="text-[15px] text-encre/75">
          {inVisit
            ? "Vous êtes dans la galerie d'un artiste. Revenez d'abord à la maison avec le bandeau en haut de l'écran."
            : "Cette pièce est réservée à la maison Drawiful."}
        </p>
      )}

      {allowed && (
        <>
          <Section num="I" title="Retrouver une galerie" intro="Par le nom de la galerie, son adresse ou l'e-mail de l'artiste. Sans recherche, les dernières inscriptions.">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                search(q);
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-2xl"
            >
              <label htmlFor="m-q" className="sr-only">
                Rechercher une galerie
              </label>
              <input
                id="m-q"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="claire-morel, Atelier Morel, claire@…"
                className={field}
              />
              <button type="submit" disabled={searching} className={`${btnPrimary} shrink-0`}>
                {searching ? "Recherche…" : "Rechercher"}
              </button>
            </form>

            {error && <p className="mt-4 text-sm text-[#9B3B2E]">{error}</p>}

            <ul className="mt-8 divide-y divide-bordure border-y border-bordure">
              {galleries.map((g) => (
                <li key={g.id} className="py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-display text-[22px] leading-tight text-encre truncate">{g.galleryName}</p>
                    <p className="mt-1 text-[13px] text-pierre break-all">{g.email}</p>
                    <p className="mt-1.5 text-[13px] text-encre/70">
                      Inscrit le {dateFr(g.createdAt)} · {g.published} œuvre{g.published > 1 ? "s" : ""} aux murs · {accessLabel(g)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <a
                      href={g.galleryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13px] text-laiton underline underline-offset-4"
                    >
                      Visiter <ArrowUpRight size={14} strokeWidth={1.6} />
                    </a>
                    <button type="button" onClick={() => enter(g)} disabled={entering !== null} className={btnPrimary}>
                      {entering === g.id ? "Ouverture…" : "Entrer dans la galerie"}
                    </button>
                  </div>
                </li>
              ))}
              {!searching && galleries.length === 0 && <li className="py-6 text-[15px] text-pierre">Aucune galerie trouvée.</li>}
            </ul>
          </Section>

          <Section num="II" title="Le journal" intro="Les derniers accès maison, du plus récent au plus ancien.">
            {journal.length === 0 ? (
              <p className="text-[15px] text-pierre">Aucun accès pour l'instant.</p>
            ) : (
              <ul className="flex flex-col gap-2 text-[14px] text-encre/80">
                {journal.slice(0, 15).map((v) => (
                  <li key={v.id}>
                    <span className="text-pierre">{dateHeureFr(v.createdAt)}</span> · {v.maisonEmail} est entré dans{" "}
                    <strong className="font-semibold text-encre">{v.galleryName}</strong>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </>
      )}
    </DashboardShell>
  );
}
