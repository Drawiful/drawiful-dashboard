"use client";
import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import { Section, field, btnPrimary, btnOutline, hint } from "@/components/FormSection";
import { api } from "@/lib/api";

type DnsRecord = { type: string; name: string; value: string; reason?: string };
type DomainStatus = {
  slug: string;
  rootDomain: string;
  defaultUrl: string;
  customDomain: string | null;
  verified: boolean;
  records: DnsRecord[];
};

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])$/;

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="ml-2 text-xs font-sans text-laiton underline underline-offset-2"
    >
      {done ? "Copié" : "Copier"}
    </button>
  );
}

export default function DomainPage() {
  const [status, setStatus] = useState<DomainStatus | null>(null);
  const [slug, setSlug] = useState("");
  const [domain, setDomain] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function load() {
    const s: DomainStatus = await api.getMyDomain();
    setStatus(s);
    setSlug(s.slug);
    setDomain(s.customDomain ?? "");
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function run(key: string, fn: () => Promise<unknown>, ok?: string) {
    setBusy(key);
    setError(null);
    setNotice(null);
    try {
      await fn();
      await load();
      if (ok) setNotice(ok);
    } catch (e: any) {
      setError(e?.message || "Une erreur est survenue");
    } finally {
      setBusy(null);
    }
  }

  function saveSlug(e: React.FormEvent) {
    e.preventDefault();
    const value = slug.trim().toLowerCase();
    if (!SLUG_RE.test(value)) {
      setError("2 à 63 caractères : lettres minuscules, chiffres et tirets (pas de tiret au début ni à la fin).");
      return;
    }
    run("slug", () => api.updateMyProfile({ slug: value }), "Votre nouvelle adresse est en ligne.");
  }

  function saveDomain(e: React.FormEvent) {
    e.preventDefault();
    if (!domain.trim()) return;
    run("domain", () => api.setMyDomain(domain.trim()), "Domaine enregistré. Il ne reste qu’à créer les lignes DNS ci-dessous.");
  }

  if (!status) {
    return (
      <DashboardShell>
        <p className={error ? "text-sm text-argile" : "font-display text-lg text-pierre"}>{error ?? "Un instant…"}</p>
      </DashboardShell>
    );
  }

  const slugChanged = slug.trim().toLowerCase() !== status.slug;

  return (
    <DashboardShell>
      <PageHeader
        kicker="Votre adresse"
        title="Où l'on vous trouve"
        intro="Votre galerie a toujours une adresse Drawiful. Vous pouvez aussi lui donner votre propre nom de domaine."
      />

      {error && <p role="alert" className="mb-8 text-sm text-argile">{error}</p>}
      {notice && <p role="status" className="mb-8 text-sm text-sauge">{notice}</p>}

      <Section
        num="I"
        title="Votre adresse Drawiful"
        intro={
          <>
            En ligne maintenant :{" "}
            <a href={status.defaultUrl} target="_blank" rel="noreferrer" className="text-laiton underline underline-offset-4 break-all">
              {status.defaultUrl.replace("https://", "")}
            </a>
          </>
        }
      >
        <form onSubmit={saveSlug} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-1 items-center rounded-lg border border-bordure bg-papier focus-within:border-laiton">
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                maxLength={63}
                className="flex-1 min-w-0 px-4 py-3 bg-transparent text-[15px] text-encre focus:outline-none"
                aria-label="Nom de la galerie dans l'adresse"
              />
              <span className="px-4 text-[15px] text-pierre whitespace-nowrap">.{status.rootDomain}</span>
            </div>
            <button type="submit" disabled={!slugChanged || busy === "slug"} className={btnPrimary}>
              {busy === "slug" ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
          {slugChanged && (
            <p className="text-[13px] text-argile">
              Attention : l'ancienne adresse ne fonctionnera plus. Pensez à mettre à jour vos liens (Instagram, cartes de
              visite…).
            </p>
          )}
        </form>
      </Section>

      <Section
        num="II"
        title="Votre propre domaine"
        intro="Par exemple www.sagalerie.com. Achetez-le chez le registraire de votre choix (OVH, Namecheap, Gandi…), puis saisissez-le ici."
      >
        {status.customDomain && (
          <div className={`rounded-xl p-6 ${status.verified ? "bg-nuit text-ivoire" : "bg-papier border border-bordure"}`}>
            <p className={`text-[11px] uppercase tracking-[0.2em] ${status.verified ? "text-champagne" : "text-laiton"}`}>
              {status.verified ? "Actif" : "En attente de configuration"}
            </p>
            <p className="font-display text-[26px] leading-tight mt-1.5 break-all">{status.customDomain}</p>
            {status.verified && (
              <a
                href={`https://${status.customDomain}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 text-sm text-champagne underline underline-offset-4"
              >
                Votre galerie est en ligne à cette adresse
              </a>
            )}
          </div>
        )}

        <form onSubmit={saveDomain} className="flex flex-col sm:flex-row gap-3">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="www.sagalerie.com"
            className={`${field} sm:flex-1`}
            aria-label="Domaine personnalisé"
          />
          <button
            type="submit"
            disabled={busy === "domain" || !domain.trim() || domain.trim().toLowerCase() === status.customDomain}
            className={btnPrimary}
          >
            {busy === "domain" ? "Connexion…" : status.customDomain ? "Changer" : "Connecter"}
          </button>
        </form>

        {status.customDomain && !status.verified && (
          <div>
            <p className="text-[15px] text-encre mb-3">
              Chez votre registraire, créez {status.records.length > 1 ? "ces lignes" : "cette ligne"} dans la zone DNS de{" "}
              <strong className="font-semibold">{status.customDomain}</strong> :
            </p>
            <div className="overflow-x-auto rounded-xl border border-bordure bg-papier">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-[0.16em] text-pierre">
                    <th scope="col" className="px-4 py-3 font-medium">Type</th>
                    <th scope="col" className="px-4 py-3 font-medium">Nom / Hôte</th>
                    <th scope="col" className="px-4 py-3 font-medium">Valeur</th>
                  </tr>
                </thead>
                <tbody>
                  {status.records.map((r, i) => (
                    <tr key={i} className="border-t border-bordure align-top">
                      <td className="px-4 py-3 font-mono">{r.type}</td>
                      <td className="px-4 py-3 font-mono">
                        {r.name}
                        <CopyButton text={r.name} />
                      </td>
                      <td className="px-4 py-3 font-mono break-all">
                        {r.value}
                        <CopyButton text={r.value} />
                        {r.reason && <div className="text-xs text-pierre font-sans mt-1">{r.reason}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={`${hint} mt-3`}>
              La prise en compte prend en général de 10 minutes à quelques heures. Le certificat HTTPS est créé
              automatiquement.
            </p>
          </div>
        )}

        {status.customDomain && (
          <div className="flex flex-wrap items-center gap-3">
            {!status.verified && (
              <button
                type="button"
                onClick={() =>
                  run(
                    "verify",
                    async () => {
                      const s: DomainStatus = await api.verifyMyDomain();
                      if (!s.verified) {
                        throw new Error(
                          "Pas encore détecté. Vérifiez les lignes DNS ; la propagation peut prendre jusqu'à quelques heures.",
                        );
                      }
                    },
                    "Domaine vérifié : votre galerie est en ligne à votre adresse.",
                  )
                }
                disabled={busy === "verify"}
                className={btnOutline}
              >
                {busy === "verify" ? "Vérification…" : "Vérifier maintenant"}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Déconnecter ${status.customDomain} de votre galerie ?`)) {
                  run("remove", () => api.removeMyDomain(), "Domaine déconnecté.");
                }
              }}
              disabled={busy === "remove"}
              className="min-h-[44px] px-3 text-sm text-argile disabled:opacity-50"
            >
              Déconnecter le domaine
            </button>
          </div>
        )}
      </Section>
    </DashboardShell>
  );
}
