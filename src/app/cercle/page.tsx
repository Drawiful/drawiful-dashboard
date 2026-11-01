"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Download, Loader2, X } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import { api } from "@/lib/api";
import { galleryUrl } from "@/lib/domain";

/*
  « Votre Cercle » : le livre d'or de la galerie. Les visiteurs qui ont demandé
  à être prévenus des prochaines œuvres, et les cartons de vernissage privé
  que l'artiste leur envoie (un par semaine au plus).
*/

function longDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function plural(n: number, one: string, many: string) {
  return n > 1 ? many : one;
}

// Le Cercle appartient à l'artiste : il peut l'emporter à tout moment.
// Fichier CSV lisible par Excel (point-virgule, encodage UTF-8 avec BOM).
function exportCircle(members: any[], galleryName?: string) {
  const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [
    ["Prénom", "E-mail", "Arrivé devant", "Membre depuis"],
    ...members.map((m) => [m.firstName || "", m.email, m.artworkTitle || "Votre galerie", new Date(m.createdAt).toLocaleDateString("fr-FR")]),
  ];
  const csv = "\ufeff" + rows.map((r) => r.map(cell).join(";")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  const slug = (galleryName || "drawiful").toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  a.href = URL.createObjectURL(blob);
  a.download = `cercle-${slug || "drawiful"}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export default function CirclePage() {
  const [profile, setProfile] = useState<any>(null);
  const [circle, setCircle] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Carton de vernissage
  const [artworkId, setArtworkId] = useState<string | null>(null);
  const [eventDate, setEventDate] = useState("");
  const [message, setMessage] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<number | null>(null);

  const [removing, setRemoving] = useState<string | null>(null);

  function load() {
    api
      .getMyCircle()
      .then((c) => {
        setCircle(c);
        setLoadError(null);
      })
      .catch((e) => setLoadError(e?.message || "Votre Cercle n'a pas pu être chargé."));
  }

  useEffect(load, []);

  const onWalls: any[] = (profile?.artworks ?? []).filter((a: any) => a.status === "PUBLISHED");
  const selected = onWalls.find((a) => a.id === artworkId) ?? null;
  const total: number = circle?.total ?? 0;
  const nextAt: string | null = circle?.nextInvitationAt ?? null;
  const url = profile?.slug ? galleryUrl(profile.slug) : "";

  async function send() {
    if (!selected) return;
    setSending(true);
    setSendError(null);
    try {
      const res = await api.sendCircleInvitation({
        artworkId: selected.id,
        eventDate: eventDate.trim() || undefined,
        message: message.trim() || undefined,
      });
      setSentTo(res?.recipients ?? total);
      setConfirming(false);
      setArtworkId(null);
      setEventDate("");
      setMessage("");
      load();
    } catch (e: any) {
      setSendError(e?.message || "Le carton n'a pas pu partir. Réessayez dans un instant.");
      setConfirming(false);
    } finally {
      setSending(false);
    }
  }

  async function remove(id: string, label: string) {
    if (!confirm(`Retirer ${label} de votre Cercle ? Cette personne ne recevra plus vos invitations.`)) return;
    setRemoving(id);
    try {
      await api.removeCircleMember(id);
      load();
    } finally {
      setRemoving(null);
    }
  }

  return (
    <DashboardShell onProfileLoaded={setProfile}>
      <PageHeader
        kicker="Votre livre d'or"
        title="Votre Cercle"
        intro="Les visiteurs qui ont demandé à être prévenus de vos prochaines œuvres. Ils vous appartiennent : Drawiful ne les sollicite jamais pour d'autres artistes."
        action={
          url ? (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 min-h-[44px] px-5 rounded-full border border-encre text-encre text-sm font-medium"
            >
              Voir l'invitation dans ma galerie <ArrowUpRight size={15} strokeWidth={1.6} />
            </a>
          ) : null
        }
      />

      {loadError && <p role="alert" className="mb-8 text-sm text-argile">{loadError}</p>}

      {/* Les chiffres du Cercle */}
      <section className="grid grid-cols-1 sm:grid-cols-3 border-y border-bordure mb-12">
        <div className="py-6 sm:pr-6 flex flex-col gap-1.5">
          <span className="font-display text-[44px] leading-none text-encre">{circle ? total : "—"}</span>
          <span className="text-sm text-encre/70">{plural(total, "collectionneur dans votre Cercle", "collectionneurs dans votre Cercle")}</span>
        </div>
        <div className="py-6 sm:px-6 flex flex-col gap-1.5 border-t sm:border-t-0 sm:border-l border-bordure">
          <span className="font-display text-[44px] leading-none text-laiton">{circle ? circle.newThisMonth : "—"}</span>
          <span className="text-sm text-encre/70">{plural(circle?.newThisMonth ?? 0, "nouveau ce mois-ci", "nouveaux ce mois-ci")}</span>
        </div>
        <div className="py-6 sm:pl-6 flex flex-col gap-1.5 border-t sm:border-t-0 sm:border-l border-bordure">
          <span className="font-display text-[44px] leading-none text-encre">{circle ? circle.invitationsSent : "—"}</span>
          <span className="text-sm text-encre/70">{plural(circle?.invitationsSent ?? 0, "carton de vernissage envoyé", "cartons de vernissage envoyés")}</span>
        </div>
      </section>

      {/* Le carton de vernissage privé */}
      <section className="rounded-xl bg-nuit text-ivoire p-8 sm:p-10 mb-12">
        <p className="text-[11px] uppercase tracking-[0.2em] text-champagne">Vernissage privé</p>
        <h2 className="font-display font-normal text-[30px] sm:text-[34px] leading-tight mt-2">Invitez votre Cercle à découvrir une œuvre.</h2>
        <p className="text-[15px] text-lilas leading-relaxed mt-2 max-w-2xl">
          Chaque membre reçoit un carton d'invitation à votre nom, avec l'œuvre, la date de votre vernissage et quelques mots de
          vous. Un carton par semaine au plus : c'est ce qui en fait un événement.
        </p>

        {sentTo !== null && (
          <div role="status" className="mt-6 rounded-lg border border-champagne/40 px-5 py-4 flex items-start gap-3">
            <Check size={18} strokeWidth={2} className="text-champagne mt-0.5 shrink-0" />
            <p className="text-sm">
              Votre carton part vers {sentTo} {plural(sentTo, "collectionneur", "collectionneurs")}. Les réponses arriveront directement dans votre
              boîte e-mail.
            </p>
          </div>
        )}

        {!circle ? (
          <p className="mt-8 font-display text-lg text-lilas">Un instant…</p>
        ) : total === 0 ? (
          <p className="mt-8 text-[15px] text-lilas max-w-xl">
            Votre Cercle attend ses premières signatures. Chaque visiteur peut le rejoindre depuis votre galerie et depuis la fiche de
            chacune de vos œuvres : partagez votre lien, ils viendront.
          </p>
        ) : nextAt ? (
          <p className="mt-8 text-[15px] text-lilas max-w-xl">
            Votre dernier carton est parti récemment. Le prochain pourra partir le{" "}
            <strong className="text-ivoire font-medium">{longDate(nextAt)}</strong>.
          </p>
        ) : onWalls.length === 0 ? (
          <p className="mt-8 text-[15px] text-lilas max-w-xl">
            Accrochez une œuvre dans votre galerie pour pouvoir y inviter votre Cercle.{" "}
            <Link href="/artworks" className="text-champagne underline underline-offset-4">Accrocher une œuvre</Link>
          </p>
        ) : (
          <div className="mt-8 flex flex-col gap-7">
            <div>
              <p className="text-sm font-medium mb-3">L'œuvre à dévoiler</p>
              <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(130px,1fr))]">
                {onWalls.map((a) => {
                  const on = a.id === artworkId;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setArtworkId(on ? null : a.id)}
                      aria-pressed={on}
                      className={`text-left rounded-lg overflow-hidden transition-shadow ${on ? "ring-2 ring-champagne" : "ring-1 ring-ivoire/15 hover:ring-ivoire/40"}`}
                    >
                      <span className="relative block aspect-[4/5] bg-black/30">
                        {a.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={a.imageUrl} alt="" className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] object-contain" />
                        )}
                        {on && (
                          <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-champagne text-nuit flex items-center justify-center">
                            <Check size={13} strokeWidth={2.4} />
                          </span>
                        )}
                      </span>
                      <span className="block px-3 py-2.5 font-display text-[15px] leading-snug truncate">{a.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="c-date" className="block text-sm font-medium mb-2">
                  Date du vernissage <span className="font-normal text-lilas">(facultatif)</span>
                </label>
                <input
                  id="c-date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  maxLength={80}
                  placeholder="jeudi 14 novembre, 19 h"
                  className="w-full px-4 py-3 rounded-lg border border-ivoire/20 bg-white/5 text-[15px] text-ivoire placeholder:text-ivoire/35 focus:outline-none focus:border-champagne"
                />
              </div>
              <div className="md:row-span-2">
                <label htmlFor="c-msg" className="block text-sm font-medium mb-2">
                  Quelques mots de vous <span className="font-normal text-lilas">(facultatif)</span>
                </label>
                <textarea
                  id="c-msg"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={600}
                  rows={5}
                  placeholder="L'histoire de cette œuvre, ce qu'elle représente pour vous…"
                  className="w-full px-4 py-3 rounded-lg border border-ivoire/20 bg-white/5 text-[15px] text-ivoire placeholder:text-ivoire/35 focus:outline-none focus:border-champagne"
                />
                <p className="text-xs text-lilas mt-1.5 text-right">{message.length}/600</p>
              </div>
            </div>

            {sendError && <p role="alert" className="text-sm text-[#E8A598]">{sendError}</p>}

            <div className="flex flex-wrap items-center gap-4">
              {confirming ? (
                <>
                  <span className="text-sm">
                    Envoyer le carton « {selected?.title} » à {total} {plural(total, "collectionneur", "collectionneurs")} ?
                  </span>
                  <button
                    type="button"
                    onClick={send}
                    disabled={sending}
                    className="inline-flex items-center gap-2 min-h-[48px] px-6 rounded-full bg-champagne text-nuit text-sm font-semibold disabled:opacity-60"
                  >
                    {sending && <Loader2 size={15} className="animate-spin" />}
                    {sending ? "Envoi…" : "Confirmer l'envoi"}
                  </button>
                  <button type="button" onClick={() => setConfirming(false)} disabled={sending} className="min-h-[44px] px-3 text-sm text-lilas">
                    Annuler
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSentTo(null);
                    setConfirming(true);
                  }}
                  disabled={!selected}
                  className="inline-flex items-center min-h-[48px] px-6 rounded-full bg-champagne text-nuit text-sm font-semibold disabled:opacity-40"
                >
                  {selected
                    ? `Envoyer le carton à ${total} ${plural(total, "collectionneur", "collectionneurs")}`
                    : "Choisissez d'abord une œuvre"}
                </button>
              )}
            </div>
            <p className="text-xs text-lilas">
              Les réponses de vos collectionneurs arriveront sur{" "}
              <span className="text-ivoire">{profile?.circleReplyEmail || "votre adresse de connexion"}</span>.{" "}
              <Link href="/settings" className="text-champagne underline underline-offset-4">Changer d'adresse</Link>
            </p>
          </div>
        )}
      </section>

      {/* Les signatures du livre d'or */}
      <section className="mb-12">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <h2 className="font-display font-normal text-[28px] text-encre">Les membres de votre Cercle</h2>
          {total > 0 && (
            <button
              type="button"
              onClick={() => exportCircle(circle.members, profile?.galleryName)}
              className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full border border-encre text-encre text-sm"
            >
              <Download size={15} strokeWidth={1.6} />
              Exporter mon Cercle
            </button>
          )}
        </div>
        {total > 0 && (
          <p className="text-[13px] text-pierre mb-4 max-w-2xl">
            Votre Cercle vous appartient : emportez-le quand vous le souhaitez. Vos collectionneurs ont accepté de recevoir vos invitations,
            à vous seul : cette liste ne se partage ni ne se cède.
          </p>
        )}
        {!circle ? (
          <p className="font-display text-lg text-pierre">Ouverture du livre d'or…</p>
        ) : total === 0 ? (
          <div className="rounded-xl border border-dashed border-laiton/50 p-10 text-center flex flex-col items-center gap-2">
            <p className="font-display text-2xl text-encre">Le livre d'or attend ses premières signatures.</p>
            <p className="text-sm text-encre/70 max-w-md">
              L'invitation à rejoindre votre Cercle apparaît sur votre galerie et sous chacune de vos œuvres.
            </p>
          </div>
        ) : (
          <div className="relative overflow-x-auto rounded-xl bg-papier border border-bordure">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.16em] text-pierre">
                  <th scope="col" className="px-6 py-4 font-medium">Collectionneur</th>
                  <th scope="col" className="px-6 py-4 font-medium">Arrivé devant</th>
                  <th scope="col" className="px-6 py-4 font-medium">Depuis le</th>
                  <th scope="col" className="px-6 py-4 font-medium"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {circle.members.map((m: any) => (
                  <tr key={m.id} className="border-t border-bordure align-top">
                    <td className="px-6 py-4">
                      {m.firstName && <span className="block font-display text-[17px] text-encre">{m.firstName}</span>}
                      <span className={m.firstName ? "text-[13px] text-pierre" : "text-encre"}>{m.email}</span>
                    </td>
                    <td className="px-6 py-4 font-display text-[16px] text-encre">{m.artworkTitle || <span className="font-sans text-sm text-pierre">Votre galerie</span>}</td>
                    <td className="px-6 py-4 text-encre/70 whitespace-nowrap">{shortDate(m.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => remove(m.id, m.firstName || m.email)}
                        disabled={removing === m.id}
                        aria-label={`Retirer ${m.firstName || m.email} du Cercle`}
                        className="w-10 h-10 inline-flex items-center justify-center text-pierre hover:text-argile disabled:opacity-40"
                      >
                        <X size={16} strokeWidth={1.6} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Historique des cartons */}
      {circle?.invitations?.length > 0 && (
        <section>
          <h2 className="font-display font-normal text-[28px] text-encre mb-4">Vos cartons de vernissage</h2>
          <ul className="flex flex-col">
            {circle.invitations.map((inv: any) => (
              <li key={inv.id} className="flex flex-wrap items-baseline justify-between gap-3 py-4 border-b border-bordure">
                <span className="font-display text-[18px] text-encre">{inv.artworkTitle}</span>
                <span className="text-sm text-pierre">
                  {shortDate(inv.createdAt)}
                  {inv.eventDate ? ` · vernissage ${inv.eventDate}` : ""} · {inv.recipients}{" "}
                  {plural(inv.recipients, "invité", "invités")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </DashboardShell>
  );
}
