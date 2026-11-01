"use client";
import { useEffect, useState } from "react";

/*
  Lien « Ne plus recevoir ses invitations » des e-mails du Cercle.
  Page publique, sans compte : le jeton unique suffit.
*/

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type State = { status: "loading" } | { status: "done"; galleryName: string } | { status: "error"; message: string };

export default function LeaveCirclePage() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setState({ status: "error", message: "Ce lien de désinscription est incomplet." });
      return;
    }
    fetch(`${API_BASE_URL}/api/circle/unsubscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data?.message || "Ce lien de désinscription n'est plus valide.");
        setState({ status: "done", galleryName: data.galleryName });
      })
      .catch((e) => setState({ status: "error", message: e?.message || "La désinscription n'a pas abouti." }));
  }, []);

  return (
    <main className="min-h-screen bg-nuit text-ivoire flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full text-center flex flex-col items-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon.png" alt="" className="w-12 h-12 rounded-full" />
        <p className="font-display text-sm tracking-[0.32em]">DRAWIFUL</p>
        <div className="w-16 h-px bg-champagne/70 my-2" />
        {state.status === "loading" && <p className="font-display text-2xl text-ivoire/80">Un instant…</p>}
        {state.status === "done" && (
          <>
            <h1 className="font-display font-normal text-[34px] leading-tight">C'est noté.</h1>
            <p className="text-[15px] leading-relaxed text-lilas">
              Vous ne recevrez plus les invitations de <span className="text-ivoire">{state.galleryName}</span>. Merci d'avoir suivi son
              travail.
            </p>
          </>
        )}
        {state.status === "error" && (
          <>
            <h1 className="font-display font-normal text-[30px] leading-tight">Lien non reconnu</h1>
            <p className="text-[15px] leading-relaxed text-lilas">{state.message}</p>
            <p className="text-sm text-lilas">
              Vous pouvez aussi répondre directement à l'invitation reçue pour demander votre désinscription.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
