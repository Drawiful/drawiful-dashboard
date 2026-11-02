import Link from "next/link";
import type { ReactNode } from "react";

/* Petits éléments réutilisés dans les articles du blog. */

// Encadré « à retenir »
export function KeyPoints({ title = "À retenir", children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="my-8 rounded-none border border-[#9A7B2F]/40 bg-[#9A7B2F]/[0.06] px-5 py-5 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A5F1F]">{title}</p>
      <div className="mt-3 space-y-2 text-[15px] leading-relaxed text-[#1A1714] [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1">
        {children}
      </div>
    </aside>
  );
}

// Note discrète (sources, précautions)
export function Note({ children }: { children: ReactNode }) {
  return <p className="!text-sm !leading-relaxed !text-[#6B655B]">{children}</p>;
}

// Appel à l'action Drawiful en fin d'article
export function DrawifulCta({ title, text }: { title: string; text: string }) {
  return (
    <aside className="my-12 overflow-hidden rounded-none bg-[#16130F] px-6 py-8 text-[#F4EFE6] sm:px-10 sm:py-10">
      <p className="font-display-lp text-2xl leading-tight sm:text-3xl">{title}</p>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#F4EFE6]/75">{text}</p>
      <p className="mt-2 text-[13px] text-[#F4EFE6]/55">14 jours offerts, sans carte bancaire.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/inscription"
          className="inline-flex items-center justify-center rounded-full bg-[#D9B75C] px-7 py-3.5 text-[15px] font-semibold text-[#0E0C0A] hover:bg-[#E6C877]"
        >
          Entrer dans votre galerie
        </Link>
        <a
          href="https://erwan.drawiful.art"
          className="text-center text-sm text-[#D9B75C] underline underline-offset-4 sm:text-left"
        >
          Visiter la galerie d'un artiste
        </a>
      </div>
    </aside>
  );
}

// Tableau lisible sur téléphone (défilement horizontal si besoin)
export function Table({ head, rows, caption }: { head: string[]; rows: ReactNode[][]; caption?: string }) {
  return (
    <figure className="my-8">
      <div className="overflow-x-auto rounded-xl border border-[#1A1714]/10 bg-white">
        <table className={`w-full border-collapse text-left text-[14px] leading-snug ${head.length > 2 ? "min-w-[520px]" : ""}`}>
          <thead>
            <tr className="bg-[#16130F] text-[#F4EFE6]">
              {head.map((h) => (
                <th key={h} scope="col" className="px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-[#1A1714]/10 odd:bg-[#F7F3EC]/60">
                {r.map((c, j) => (
                  <td key={j} className={`px-4 py-3 align-top ${j === 0 ? "font-medium" : ""}`}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <figcaption className="mt-2 text-[13px] leading-relaxed text-[#6B655B]">{caption}</figcaption>}
    </figure>
  );
}
