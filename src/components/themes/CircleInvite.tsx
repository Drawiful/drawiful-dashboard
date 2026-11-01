"use client";
import { useId, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import type { Skin } from "./skins";
import { wrap, capsStyle, Eyebrow, btnStyle } from "./ThemedChrome";

/*
  Le Cercle : le livre d'or de la galerie. Le visiteur demande à être prévenu
  des prochaines œuvres de l'artiste ; il recevra ses cartons de vernissage privé.
  Deux présentations : « section » (accueil de la galerie) et « compact » (fiche œuvre).
  L'habillage suit le thème de l'artiste.
*/

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Status = "idle" | "sending" | "done" | "error";

export default function CircleInvite({
  skin,
  slug,
  galleryName,
  artworkId,
  variant = "section",
}: {
  skin: Skin;
  slug: string;
  galleryName: string;
  artworkId?: string;
  variant?: "section" | "compact";
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // champ piège pour les robots
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const dark = skin.layout === "capsule";
  const compact = variant === "compact";

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!consent) {
      setError("Merci de cocher la case pour recevoir les invitations.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(`${API_BASE_URL}/api/circle/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, email: email.trim(), firstName: firstName.trim() || undefined, artworkId, consent: true, website }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = Array.isArray(data?.message) ? data.message[0] : data?.message;
        throw new Error(msg || "L'inscription n'a pas abouti.");
      }
      setStatus("done");
    } catch (err: any) {
      setError(err?.message || "L'inscription n'a pas abouti. Réessayez dans un instant.");
      setStatus("error");
    }
  }

  const field: CSSProperties = {
    width: "100%",
    minHeight: 52,
    padding: "0 16px",
    boxSizing: "border-box",
    border: `1px solid ${skin.border}`,
    borderRadius: skin.pill ? 999 : Math.min(skin.radius, 8),
    background: dark ? "rgba(255,255,255,0.03)" : skin.bg,
    color: skin.ink,
    fontFamily: skin.body,
    fontSize: 16,
    outline: "none",
  };
  const label: CSSProperties = { ...capsStyle(skin, 10), color: skin.muted, display: "block", marginBottom: 8 };

  const title = compact ? "Être prévenu des prochaines œuvres" : `Rejoindre le Cercle de ${galleryName}`;
  const intro = compact
    ? `Recevez en avant-première les invitations de ${galleryName} à ses vernissages privés.`
    : "Les membres du Cercle découvrent les nouvelles œuvres en avant-première, lors de vernissages privés, avant leur présentation au public.";

  const done = (
    <div role="status" style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: compact ? "flex-start" : "center" }}>
      <p style={{ margin: 0, fontFamily: skin.display, fontWeight: skin.displayWeight, fontSize: compact ? 24 : 32, lineHeight: 1.2, color: skin.ink }}>
        Bienvenue dans le Cercle.
      </p>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: skin.muted, maxWidth: 520 }}>
        Vous serez parmi les premiers invités à découvrir les prochaines œuvres de {galleryName}. Un e-mail de confirmation vient de vous être envoyé.
      </p>
    </div>
  );

  const form = (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: compact ? 460 : 560, textAlign: "left" }}>
      <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: 14 }}>
        <div>
          <label htmlFor={`${id}-name`} style={label}>Prénom (facultatif)</label>
          <input id={`${id}-name`} value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" maxLength={60} style={field} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} style={label}>E-mail</label>
          <input
            id={`${id}-email`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            maxLength={200}
            style={field}
          />
        </div>
      </div>
      {/* Champ invisible : seuls les robots le remplissent */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <label style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 13, lineHeight: 1.6, color: skin.muted, cursor: "pointer" }}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 3, width: 18, height: 18, flex: "none", accentColor: skin.accent }} />
        <span>
          J'accepte de recevoir les invitations de {galleryName}. Mon adresse n'est partagée avec personne d'autre, et je peux me désinscrire à tout
          moment depuis chaque e-mail.
        </span>
      </label>
      {error && <p role="alert" style={{ margin: 0, fontSize: 14, color: dark ? "#E8A598" : "#9B3B2A" }}>{error}</p>}
      <button type="submit" disabled={status === "sending"} style={{ ...btnStyle(skin, "primary"), width: compact ? "100%" : "auto", alignSelf: compact ? "stretch" : "flex-start", opacity: status === "sending" ? 0.6 : 1 }}>
        {status === "sending" ? "Un instant…" : "Rejoindre le Cercle"}
      </button>
    </form>
  );

  // ----- Fiche œuvre : bloc discret sous l'achat -----
  if (compact) {
    return (
      <div style={{ maxWidth: 460, padding: "22px 22px 24px", boxSizing: "border-box", border: `1px solid ${skin.border}`, background: skin.surface, display: "flex", flexDirection: "column", gap: 14 }}>
        {status === "done" ? (
          done
        ) : (
          <>
            <Eyebrow skin={skin}>Le Cercle</Eyebrow>
            <p style={{ margin: 0, fontFamily: skin.display, fontWeight: skin.displayWeight, fontSize: 24, lineHeight: 1.2, color: skin.ink }}>{title}</p>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: skin.muted }}>{intro}</p>
            {form}
          </>
        )}
      </div>
    );
  }

  // ----- Accueil de la galerie : grande invitation -----
  return (
    <section style={{ borderTop: `1px solid ${skin.border}`, background: skin.surface }}>
      <div style={wrap({ maxWidth: 860, paddingTop: 110, paddingBottom: 110, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, textAlign: "center" })}>
        {status === "done" ? (
          done
        ) : (
          <>
            <Eyebrow skin={skin}>Le Cercle</Eyebrow>
            <h2 style={{ margin: 0, fontFamily: skin.display, fontWeight: skin.displayWeight, fontSize: "clamp(32px,4.4vw,52px)", lineHeight: 1.08, color: skin.ink }}>
              {title}
            </h2>
            <p style={{ margin: 0, fontSize: skin.layout === "salon" ? 19 : 16, lineHeight: 1.75, color: skin.muted, maxWidth: 560 }}>{intro}</p>
            <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 10 }}>{form}</div>
          </>
        )}
      </div>
    </section>
  );
}
