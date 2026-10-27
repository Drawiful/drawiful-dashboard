import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, SITE_URL, formatDate, getPost } from "@/lib/blog";

export const dynamicParams = false; // seules les adresses des articles existants répondent

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: post.seoTitle,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      locale: "fr_FR",
      url,
      publishedTime: post.date,
      authors: ["Erwan, fondateur de Drawiful"],
      images: ["/landing/salle-haussmann.jpg"],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

// Mise en forme du texte des articles (titres, paragraphes, listes, liens)
const PROSE = [
  "text-[17px] leading-[1.75] text-[#2A2622]",
  "[&>p]:my-5",
  "[&>h2]:font-display-lp [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:text-[28px] [&>h2]:leading-tight [&>h2]:text-[#1C1A17] sm:[&>h2]:text-[32px]",
  "[&>h3]:mt-8 [&>h3]:mb-2 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-[#1C1A17]",
  "[&>ul]:my-5 [&>ul]:space-y-2 [&>ul]:pl-6 [&>ul>li]:list-disc [&>ul>li]:pl-1",
  "[&>ol]:my-5 [&>ol]:space-y-2 [&>ol]:pl-6 [&>ol>li]:list-decimal [&>ol>li]:pl-1",
  "[&>p_a]:text-[#7A2E2B] [&>p_a]:underline [&>p_a]:underline-offset-4 [&>ul_a]:text-[#7A2E2B] [&>ul_a]:underline [&>ul_a]:underline-offset-4",
  "[&_strong]:font-semibold [&_strong]:text-[#1C1A17]",
  "[&>pre]:my-6 [&>pre]:whitespace-pre-wrap [&>pre]:rounded-xl [&>pre]:border [&>pre]:border-[#1C1A17]/10 [&>pre]:bg-white [&>pre]:p-5 [&>pre]:font-sans [&>pre]:text-[15px] [&>pre]:leading-relaxed",
].join(" ");

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  const { Content } = post;
  const others = POSTS.filter((p) => p.slug !== post.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "fr-FR",
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    author: { "@type": "Person", name: "Erwan", jobTitle: "Fondateur de Drawiful, dessinateur" },
    publisher: { "@type": "Organization", name: "Drawiful", url: SITE_URL },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="mx-auto max-w-[720px] px-5 pb-8 pt-10 sm:px-8 sm:pt-14">
        <nav aria-label="Fil d'Ariane" className="text-sm text-[#77706A]">
          <Link href="/blog" className="hover:text-[#7A2E2B]">
            ← Tous les articles
          </Link>
        </nav>
        <h1 className="font-display-lp mt-5 text-[34px] leading-[1.08] sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-sm text-[#77706A]">
          Par Erwan, dessinateur et fondateur de Drawiful · {formatDate(post.date)} · {post.readingMinutes} min de
          lecture
        </p>

        <div className={`mt-8 ${PROSE}`}>
          <Content />
        </div>
      </article>

      {others.length > 0 && (
        <section className="border-t border-[#1C1A17]/10 bg-white/60">
          <div className="mx-auto max-w-[720px] px-5 py-12 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#77706A]">À lire aussi</p>
            <ul className="mt-5 space-y-4">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="group block">
                    <span className="font-display-lp text-xl leading-snug group-hover:text-[#7A2E2B]">{p.title}</span>
                    <span className="mt-1 block text-[15px] text-[#4A4540]">{p.excerpt}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
