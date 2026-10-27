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
      <section className="bg-[#2B1E2F] text-[#F7F5F0]">
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16">
          <p className="text-sm text-[#E3C77A]">Le blog des artistes qui vendent leurs œuvres</p>
          <h1 className="font-display-lp mt-3 max-w-3xl text-4xl leading-[1.05] sm:text-6xl">
            Vendre son art, sans y laisser la moitié.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#F7F5F0]/75 sm:text-lg">
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
                className="group flex h-full flex-col rounded-2xl border border-[#1C1A17]/10 bg-white p-6 transition-shadow hover:shadow-[0_12px_32px_rgba(28,26,23,0.08)]"
              >
                <p className="text-xs text-[#77706A]">
                  {formatDate(p.date)} · {p.readingMinutes} min de lecture
                </p>
                <h2 className="font-display-lp mt-3 text-2xl leading-tight group-hover:text-[#7A2E2B]">{p.title}</h2>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[#4A4540]">{p.excerpt}</p>
                <p className="mt-5 text-sm font-semibold text-[#7A2E2B]">Lire l'article →</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
