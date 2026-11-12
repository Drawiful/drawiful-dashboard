import { NextResponse } from "next/server";
import { DELAI_REPONSE } from "@/app/selection/config";

export const runtime = "nodejs";

/*
  Demande de consultation : trois envois via Brevo.
  1) E-mail de notification pour vous (répondre = répondre au visiteur).
  2) E-mail de confirmation au visiteur, au vouvoiement.
  3) Ajout du contact dans Brevo (liste facultative).

  Variables d'environnement à ajouter sur Vercel (côté serveur, sans NEXT_PUBLIC) :
  - BREVO_API_KEY            clé API Brevo
  - BREVO_SENDER_EMAIL       expéditeur validé dans Brevo (ex. une adresse @drawiful.app)
  - CONSULTATION_TO_EMAIL    l'adresse qui reçoit les demandes
  - BREVO_LIST_ID            (facultatif) numéro de la liste Brevo des contacts
*/

const BREVO = "https://api.brevo.com/v3";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(valeur: unknown, max: number): string {
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

function esc(texte: string): string {
  return texte.replace(/[&<>"']/g, (c) => {
    const m: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return m[c];
  });
}

function brevo(chemin: string, corps: unknown) {
  return fetch(`${BREVO}${chemin}`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY as string,
    },
    body: JSON.stringify(corps),
  });
}

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Demande illisible. Rechargez la page et réessayez." }, { status: 400 });
  }

  // Champ piège rempli : on répond comme si tout allait bien, sans rien envoyer.
  if (clean(data.website, 200)) return NextResponse.json({ ok: true });

  const name = clean(data.name, 120).replace(/[\r\n]+/g, " ");
  const email = clean(data.email, 200);
  const activity = clean(data.activity, 200);
  const budget = clean(data.budget, 200);
  const deadline = clean(data.deadline, 200);
  const message = clean(data.message, 3000);

  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Vérifiez votre nom et votre adresse e-mail." }, { status: 400 });
  }

  const { BREVO_API_KEY, BREVO_SENDER_EMAIL, CONSULTATION_TO_EMAIL, BREVO_LIST_ID } = process.env;
  if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL || !CONSULTATION_TO_EMAIL) {
    console.error("[consultation] variables d'environnement manquantes");
    return NextResponse.json({ error: "Le service est momentanément indisponible. Réessayez plus tard." }, { status: 500 });
  }

  const sender = { name: "La maison Drawiful", email: BREVO_SENDER_EMAIL };

  // 1) Notification pour vous : indispensable, sinon on signale l'échec.
  const ligne = (titre: string, valeur: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#6b655b">${titre}</td><td>${esc(valeur) || "-"}</td></tr>`;
  const notif = await brevo("/smtp/email", {
    sender,
    to: [{ email: CONSULTATION_TO_EMAIL }],
    replyTo: { email, name },
    subject: `Nouvelle demande de dossier d'acquisition : ${name}`,
    htmlContent:
      `<table style="font-family:Arial,sans-serif;font-size:14px">` +
      ligne("Nom", name) +
      ligne("E-mail", email) +
      ligne("Activité", activity) +
      ligne("Budget", budget) +
      ligne("Échéance", deadline) +
      ligne("Projet", message).replace("<td>", `<td style="white-space:pre-wrap">`) +
      `</table>`,
  }).catch(() => null);

  if (!notif || !notif.ok) {
    console.error("[consultation] échec de la notification", notif?.status);
    return NextResponse.json({ error: "Votre demande n'a pas pu être envoyée. Réessayez dans un instant." }, { status: 502 });
  }

  // 2) Confirmation au visiteur : au mieux, sans bloquer.
  await brevo("/smtp/email", {
    sender,
    to: [{ email, name }],
    subject: "La maison Drawiful a bien reçu votre demande",
    htmlContent:
      `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.6;color:#16130f">` +
      `<p>Bonjour ${esc(name)},</p>` +
      `<p>Votre demande de dossier d'acquisition est bien arrivée. Je vous réponds personnellement sous ${esc(DELAI_REPONSE)}.</p>` +
      `<p><em>La maison Drawiful</em></p></div>`,
  }).catch((e) => console.error("[consultation] confirmation non envoyée", e));

  // 3) Contact Brevo : au mieux, sans bloquer.
  const listId = Number(BREVO_LIST_ID);
  await brevo("/contacts", {
    email,
    updateEnabled: true,
    ...(Number.isInteger(listId) && listId > 0 ? { listIds: [listId] } : {}),
  }).catch((e) => console.error("[consultation] contact non ajouté", e));

  return NextResponse.json({ ok: true });
}
