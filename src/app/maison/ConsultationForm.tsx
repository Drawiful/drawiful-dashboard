"use client";

import { FormEvent, useState } from "react";
import s from "./maison.module.css";

const ACTIVITES = [
  "Architecte d'intérieur",
  "Décorateur de luxe",
  "Conseiller en art",
  "Promoteur ou hôtellerie",
  "Autre",
];

// Fourchettes indicatives : ajustez-les à vos projets.
const BUDGETS = [
  "Moins de 3 000 €",
  "De 3 000 à 10 000 €",
  "De 10 000 à 30 000 €",
  "Plus de 30 000 €",
  "À définir ensemble",
];

type Etat = "repos" | "envoi" | "envoye" | "erreur";

export default function ConsultationForm({ delai }: { delai: string }) {
  const [etat, setEtat] = useState<Etat>("repos");
  const [erreur, setErreur] = useState("");

  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (etat === "envoi") return;
    const formulaire = e.currentTarget;
    const donnees = Object.fromEntries(new FormData(formulaire).entries());

    setEtat("envoi");
    setErreur("");
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donnees),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Votre demande n'a pas pu être envoyée. Réessayez dans un instant.");
      formulaire.reset();
      setEtat("envoye");
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Votre demande n'a pas pu être envoyée. Réessayez dans un instant.");
      setEtat("erreur");
    }
  }

  if (etat === "envoye") {
    return (
      <div className={s.sent} role="status">
        <p className={s.sentTitle}>Votre demande est bien arrivée.</p>
        <p className={s.sentText}>Je vous réponds personnellement sous {delai}. Un e-mail de confirmation vous a été envoyé.</p>
      </div>
    );
  }

  return (
    <form className={s.form} onSubmit={envoyer} noValidate={false}>
      <label className={s.label}>
        Nom
        <input className={s.field} type="text" name="name" autoComplete="name" required maxLength={120} />
      </label>

      <label className={s.label}>
        Adresse e-mail
        <input className={s.field} type="email" name="email" autoComplete="email" required maxLength={200} />
      </label>

      <label className={s.label}>
        Activité
        <select className={s.field} name="activity" defaultValue="" required>
          <option value="" disabled>
            Choisir
          </option>
          {ACTIVITES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>

      <label className={s.label}>
        Budget indicatif
        <select className={s.field} name="budget" defaultValue="">
          <option value="">Non précisé</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </label>

      <label className={`${s.label} ${s.full}`}>
        Échéance
        <input
          className={s.field}
          type="text"
          name="deadline"
          placeholder="Par exemple : livraison en mars"
          maxLength={200}
        />
      </label>

      <label className={`${s.label} ${s.full}`}>
        Lieu, dimensions du mur et style
        <textarea className={`${s.field} ${s.area}`} name="message" maxLength={3000} />
      </label>

      {/* Champ piège pour les robots : invisible, ne pas remplir. */}
      <div className={s.hp} aria-hidden="true">
        <label>
          Ne pas remplir
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {etat === "erreur" && (
        <p className={`${s.error} ${s.full}`} role="alert">
          {erreur}
        </p>
      )}

      <div className={s.full}>
        <button type="submit" className={s.btn} disabled={etat === "envoi"}>
          {etat === "envoi" ? "Envoi en cours" : "Envoyer ma demande"}
        </button>
      </div>

      <p className={`${s.privacy} ${s.full}`}>
        Vos informations servent uniquement à répondre à votre demande.
      </p>
    </form>
  );
}
