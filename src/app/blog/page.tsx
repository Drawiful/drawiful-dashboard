import type { Metadata } from "next";
import Link from "next/link";
import { POSTS, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog Drawiful — Vendre ses œuvres d'art en ligne",
  description:
    "Conseils concrets pour les artistes : vendre ses œuvres sans commission, fixer ses prix, rédiger un certificat d'authenticité.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog Drawiful — Vendre ses œuvres d'art en ligne",
    description: "Conseils concrets pour les artistes qui veulent vendre leurs œuvres.",
    type: "website",
    locale: "fr_FR",
    url: "/blog",
  },
};

export default function BlogIndex() {
  return (
    <main>
      <section className="bg-[#16130F] text-[#F4EFE6] border-b border-[#D9B75C]/15">
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#D9B75C]">Le journal de la maison</p>
          <h1 className="font-display-lp mt-3 max-w-3xl text-4xl leading-[1.05] sm:text-6xl">
            Vendre son art, sans y laisser la moitié.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#F4EFE6]/75 sm:text-lg">
            Prix, certificats, commissions, présentation : des guides concrets, écrits par un artiste pour les artistes.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex h-full flex-col border border-[#1A1714]/10 bg-[#FFFDF9] p-7 transition-shadow hover:shadow-[0_18px_40px_rgba(26,23,20,0.10)]"
              >
                <p className="text-xs text-[#6B655B]">
                  {formatDate(p.date)} · {p.readingMinutes} min de lecture
                </p>
                <h2 className="font-display-lp mt-3 text-2xl leading-tight group-hover:text-[#7A5F1F]">{p.title}</h2>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[#55504A]">{p.excerpt}</p>
                <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7A5F1F]">Lire l'article</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
