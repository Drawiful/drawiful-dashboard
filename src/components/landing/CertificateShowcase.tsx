"use client";
import { useState } from "react";

// Exemples fictifs, présentés comme tels : ce que reçoit un collectionneur.
const SAMPLES = [
  {
    key: "peinture",
    label: "Peinture",
    hint: "Huile sur toile, pièce unique",
    artwork: "Marée haute",
    artist: "Camille Aubry",
    technique: "Huile sur toile, 80 × 100 cm",
    edition: "Pièce unique",
    serial: "DRW-2026-000412",
    date: "28 septembre 2026",
  },
  {
    key: "illustration",
    label: "Illustration",
    hint: "Tirage giclée, édition limitée",
    artwork: "Le jardin d'hiver",
    artist: "Inès Morel",
    technique: "Tirage giclée sur papier coton, 40 × 50 cm",
    edition: "Édition limitée, 12 / 30",
    serial: "DRW-2026-000538",
    date: "3 octobre 2026",
  },
  {
    key: "photo",
    label: "Photographie",
    hint: "Tirage pigmentaire, édition numérotée",
    artwork: "Lisière, aube",
    artist: "Hugo Lenoir",
    technique: "Tirage pigmentaire, 60 × 90 cm",
    edition: "Édition numérotée, 3 / 10",
    serial: "DRW-2026-000601",
    date: "6 octobre 2026",
  },
];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3 border-b border-[#1C1A17]/10">
      <p className="text-[11px] tracking-wide text-[#77706A]">{label}</p>
      <p className="font-display-lp text-lg text-[#1C1A17] mt-0.5">{value}</p>
    </div>
  );
}

export default function CertificateShowcase() {
  const [i, setI] = useState(0);
  const s = SAMPLES[i];

  return (
    <div className="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-16 items-start">
      <div>
        <h2 className="font-display-lp text-4xl sm:text-5xl leading-[1.05] text-[#1C1A17]">
          Un certificat pour chaque œuvre.
        </h2>
        <p className="mt-5 text-[#4A4540] leading-relaxed max-w-md">
          Un collectionneur achète plus sereinement quand l'authenticité est prouvée. Chaque œuvre vendue reçoit un
          certificat numéroté, signé de votre main, consultable en ligne à tout moment.
        </p>
        <div className="mt-8 flex flex-col gap-3 max-w-md" role="tablist" aria-label="Exemples de certificat">
          {SAMPLES.map((x, k) => (
            <button
              key={x.key}
              role="tab"
              aria-selected={k === i}
              onClick={() => setI(k)}
              className={`text-left rounded-[4px] px-5 py-4 border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8912F] ${
                k === i ? "border-[#2B1E2F] bg-[#2B1E2F] text-[#F7F5F0]" : "border-[#1C1A17]/15 hover:border-[#1C1A17]/40"
              }`}
            >
              <span className="block font-semibold">{x.label}</span>
              <span className={`block text-sm ${k === i ? "text-[#F7F5F0]/70" : "text-[#77706A]"}`}>{x.hint}</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-[#77706A]">Certificats illimités avec les plans Artiste et Gallery.</p>
      </div>

      <figure className="relative">
        <div className="bg-white p-3 shadow-[0_30px_60px_-25px_rgba(43,30,47,0.35)]">
          <div className="border border-[#B8912F]/60 p-7 sm:p-9">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm text-[#77706A]">Drawiful</p>
                <p className="font-display-lp text-2xl sm:text-3xl text-[#1C1A17] mt-1">Certificat d'authenticité</p>
              </div>
              <span
                aria-hidden="true"
                className="grid place-items-center h-14 w-14 shrink-0 rounded-full bg-[#7A2E2B] text-[#F7F5F0] ring-4 ring-[#7A2E2B]/15"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
            </div>
            <div className="mt-6 border-t border-[#B8912F]/50">
              <Row label="Œuvre" value={s.artwork} />
              <Row label="Artiste" value={s.artist} />
              <Row label="Technique" value={s.technique} />
              <Row label="Édition" value={s.edition} />
              <div className="grid grid-cols-2 gap-6">
                <Row label="Certificat n°" value={s.serial} />
                <Row label="Émis le" value={s.date} />
              </div>
            </div>
            <p className="mt-6 font-display-lp italic text-xl text-[#2B1E2F]/80">{s.artist}</p>
          </div>
        </div>
        <figcaption className="mt-3 text-xs text-[#77706A]">Exemple de certificat, données fictives.</figcaption>
      </figure>
    </div>
  );
}
