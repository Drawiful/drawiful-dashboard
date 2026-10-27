import Link from "next/link";
import type { ReactNode } from "react";

/* Petits éléments réutilisés dans les articles du blog. */

// Encadré « à retenir »
export function KeyPoints({ title = "À retenir", children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="my-8 rounded-2xl border border-[#B8912F]/40 bg-[#B8912F]/[0.07] px-5 py-5 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A2E2B]">{title}</p>
      <div className="mt-3 space-y-2 text-[15px] leading-relaxed text-[#1C1A17] [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1">
        {children}
      </div>
    </aside>
  );
}

// Note discrète (sources, précautions)
export function Note({ children }: { children: ReactNode }) {
  return <p className="!text-sm !leading-relaxed !text-[#77706A]">{children}</p>;
}

// Appel à l'action Drawiful en fin d'article
export function DrawifulCta({ title, text }: { title: string; text: string }) {
  return (
    <aside className="my-12 overflow-hidden rounded-2xl bg-[#2B1E2F] px-6 py-8 text-[#F7F5F0] sm:px-10 sm:py-10">
      <p className="font-display-lp text-2xl leading-tight sm:text-3xl">{title}</p>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#F7F5F0]/75">{text}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/inscription?plan=artiste"
          className="inline-flex items-center justify-center rounded-full bg-[#B8912F] px-7 py-3.5 text-[15px] font-semibold text-[#1C1A17] hover:bg-[#C9A24A]"
        >
          Essayer 14 jours gratuits
        </Link>
        <a
          href="https://erwan.drawiful.art"
          className="text-center text-sm text-[#E3C77A] underline underline-offset-4 sm:text-left"
        >
          Voir une galerie Drawiful
        </a>
      </div>
    </aside>
  );
}

// Tableau lisible sur téléphone (défilement horizontal si besoin)
export function Table({ head, rows, caption }: { head: string[]; rows: ReactNode[][]; caption?: string }) {
  return (
    <figure className="my-8">
      <div className="overflow-x-auto rounded-xl border border-[#1C1A17]/10 bg-white">
        <table className="w-full min-w-[520px] border-collapse text-left text-[14px] leading-snug">
          <thead>
            <tr className="bg-[#2B1E2F] text-[#F7F5F0]">
              {head.map((h) => (
                <th key={h} scope="col" className="px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-[#1C1A17]/10 odd:bg-[#F7F5F0]/60">
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
      {caption && <figcaption className="mt-2 text-[13px] leading-relaxed text-[#77706A]">{caption}</figcaption>}
    </figure>
  );
}
