import type { Metadata } from "next";
import Link from "next/link";
import { Bodoni_Moda, Manrope } from "next/font/google";
import LandingNav from "@/components/landing/LandingNav";
import Demo3D from "@/components/landing/Demo3D";
import CertificateShowcase from "@/components/landing/CertificateShowcase";

/*
  Landing Drawiful (servie sur drawiful.app via le middleware).
  Palette : mur aubergine #2B1E2F · laiton #B8912F · papier #F7F5F0 · encre #1C1A17
            · pierre #77706A · sceau bordeaux #7A2E2B
  Fil conducteur : le cartel de musée (titre, technique, date) sert de légende partout.
*/

const display = Bodoni_Moda({ subsets: ["latin"], variable: "--font-lp-display", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-lp-body", display: "swap" });

export const metadata: Metadata = {
  title: "Drawiful — Votre galerie d'art en ligne, visitable en 3D",
  description:
    "Créez la galerie en ligne de vos œuvres : visite 3D, boutique, paiements internationaux et certificat d'authenticité pour chaque vente. 14 jours d'essai gratuit.",
  openGraph: {
    title: "Drawiful — Votre galerie d'art en ligne, visitable en 3D",
    description:
      "Une galerie à votre nom, visitable en 3D, avec boutique et certificats d'authenticité. 14 jours d'essai gratuit.",
    images: ["/landing/salle-haussmann.jpg"],
    locale: "fr_FR",
    type: "website",
  },
};

/* Cartel de musée : petite étiquette sous une image */
function Cartel({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="inline-block border-l-2 border-[#B8912F] pl-3">
      <p className="font-display-lp text-[15px] leading-tight">{title}</p>
      <p className="text-xs opacity-70 mt-0.5">{detail}</p>
    </div>
  );
}

function CtaPrimary({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full bg-[#B8912F] px-7 py-3.5 text-[15px] font-semibold text-[#1C1A17] hover:bg-[#C9A24A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8912F] ${className}`}
    >
      {children}
    </Link>
  );
}

const PAINS = [
  {
    title: "Tout est éparpillé",
    text: "Un site ici, un lien de paiement là, des messages privés pour conclure. Le collectionneur se perd avant d'acheter.",
  },
  {
    title: "Rien ne prouve l'authenticité",
    text: "Sans certificat, une œuvre originale ressemble à une image parmi d'autres. Et le doute fait baisser le prix.",
  },
  {
    title: "Une photo ne rend pas justice",
    text: "Sur un écran, on ne perçoit ni la taille ni la présence d'un tableau. C'est pourtant ce qui déclenche le coup de cœur.",
  },
];

const PERSONAS = [
  {
    title: "Vous peignez",
    text: "Chaque toile est accrochée à taille réelle, sous son spot, avec son cartel et son certificat d'authenticité.",
  },
  {
    title: "Vous dessinez",
    text: "Illustrations, encres et fusains encadrés, prêts à être commandés depuis votre boutique.",
  },
  {
    title: "Vous photographiez",
    text: "Chaque tirage vendu porte un certificat numéroté. Vos éditions limitées gardent leur valeur.",
  },
  {
    title: "Vous dirigez une galerie",
    text: "Jusqu'à dix artistes sous votre marque, et un tableau de bord pour piloter l'activité.",
  },
];

const FEATURES = [
  {
    title: "Une galerie visitable en 3D",
    text: "Trois salles au choix : salon haussmannien, white cube ou salle noire. Vos œuvres y sont accrochées à leurs dimensions réelles, éclairées une à une, visitables sur ordinateur comme sur téléphone.",
    big: true,
  },
  {
    title: "Une boutique à votre image",
    text: "Six styles de boutique, votre nom, vos couleurs. Panier et paiement intégrés.",
  },
  {
    title: "Votre adresse web, incluse",
    text: "Votre galerie est en ligne sur votregalerie.drawiful.app. Vous avez déjà un nom de domaine ? Reliez-le en quelques minutes.",
  },
  {
    title: "Des certificats d'authenticité",
    text: "Un certificat numéroté pour chaque œuvre, avec votre signature, vérifiable en ligne.",
  },
  {
    title: "Paiements dans le monde entier",
    text: "Vos collectionneurs paient par carte, d'où qu'ils soient. L'argent arrive sur votre compte via Stripe.",
  },
  {
    title: "L'œuvre chez le collectionneur",
    text: "Sur les téléphones compatibles, la réalité augmentée affiche l'œuvre à taille réelle sur son propre mur.",
  },
  {
    title: "Ventes et expéditions suivies",
    text: "Chiffre d'affaires, commandes, adresses de livraison : tout est au même endroit, avec un e-mail à chaque vente.",
  },
];

const STEPS = [
  { title: "Ajoutez vos œuvres", text: "Une photo, un titre, un prix et les dimensions réelles. C'est tout." },
  { title: "Choisissez votre salle", text: "Le style de la boutique et l'ambiance de la galerie 3D. Elle ressemble à votre travail." },
  { title: "Partagez et vendez", text: "Votre lien sur Instagram, vos cartes de visite, vos e-mails. Chaque vente part avec son certificat." },
];

const COMPARISON: { label: string; diy: string; drawiful: string }[] = [
  { label: "Présenter les œuvres", diy: "Des photos sur un site ou un réseau social", drawiful: "Une galerie 3D à taille réelle, plus une boutique" },
  { label: "Prouver l'authenticité", diy: "Un document fait à la main, quand il existe", drawiful: "Un certificat numéroté, vérifiable en ligne" },
  { label: "Encaisser", diy: "Lien de paiement, virement, échanges de messages", drawiful: "Paiement par carte intégré, partout dans le monde" },
  { label: "Suivre les ventes", diy: "Un tableur, des notes, la mémoire", drawiful: "Commandes, expéditions et chiffre d'affaires réunis" },
  { label: "Mettre en ligne", diy: "Des jours de réglages techniques", drawiful: "Quelques minutes, sans compétence technique" },
];

const PLANS = [
  {
    key: "aspirant",
    name: "Aspirant",
    pitch: "Pour débuter et exposer vos premières œuvres.",
    price: 19,
    features: ["5 œuvres", "Galerie publique", "1 certificat d'authenticité", "Votre adresse drawiful.app"],
    missing: ["Boutique en ligne", "Galerie 3D"],
  },
  {
    key: "artiste",
    name: "Artiste",
    pitch: "La formule complète pour vendre en artiste professionnel.",
    price: 49,
    featured: true,
    features: [
      "Œuvres illimitées",
      "Boutique en ligne personnalisée",
      "Galerie 3D et réalité augmentée",
      "Certificats illimités",
      "Commandes et expéditions",
      "Votre propre nom de domaine",
    ],
    missing: [],
  },
  {
    key: "studio",
    name: "Gallery",
    pitch: "Pour les galeries et collectifs multi-artistes.",
    price: 149,
    features: [
      "Tout le plan Artiste",
      "Jusqu'à 10 artistes",
      "Tableau de bord galerie",
      "Galeries 3D illimitées",
      "Support prioritaire",
    ],
    missing: [],
  },
];

const FAQ = [
  {
    q: "Suis-je toujours propriétaire de mes œuvres ?",
    a: "Oui, entièrement. Drawiful présente et vend vos œuvres en votre nom ; vous gardez tous vos droits sur vos créations.",
  },
  {
    q: "Comment fonctionne le certificat d'authenticité ?",
    a: "Chaque œuvre reçoit un certificat avec un numéro unique, le détail de l'œuvre et votre signature. Le collectionneur le reçoit avec son achat et peut le vérifier en ligne à tout moment grâce à ce numéro.",
  },
  {
    q: "Puis-je vendre à des collectionneurs à l'étranger ?",
    a: "Oui. Les paiements par carte sont gérés par Stripe : un collectionneur peut acheter depuis l'étranger, et l'argent est versé sur votre compte.",
  },
  {
    q: "Ai-je besoin d'un nom de domaine ou d'un hébergeur ?",
    a: "Non. Votre galerie est en ligne dès l'inscription sur votregalerie.drawiful.app. Si vous possédez déjà un nom de domaine, vous pouvez le relier depuis votre espace.",
  },
  {
    q: "Faut-il renseigner une carte bancaire pour l'essai ?",
    a: "Oui, une carte est demandée au démarrage de l'essai, mais rien n'est prélevé pendant les 14 jours. Vous pouvez annuler avant la fin sans rien payer.",
  },
  {
    q: "Que se passe-t-il après les 14 jours d'essai ?",
    a: "L'abonnement démarre au tarif de la formule choisie. Vous recevez un e-mail de rappel avant la fin de l'essai.",
  },
  {
    q: "Y a-t-il un engagement ?",
    a: "Aucun. Vous changez de formule ou annulez depuis la page Abonnement de votre espace, en quelques clics.",
  },
];

export default function LandingPage() {
  return (
    <div className={`${display.variable} ${body.variable} lp-root bg-[#F7F5F0] text-[#1C1A17] antialiased`}>
      <style>{`
        .lp-root { font-family: var(--font-lp-body), system-ui, sans-serif; }
        .font-display-lp { font-family: var(--font-lp-display), Georgia, serif; font-optical-sizing: auto; }
        .lp-root ::selection { background: #B8912F; color: #1C1A17; }
        /* Le seul mouvement de la page : la salle "s'allume" au chargement */
        @keyframes lp-lights { from { opacity: 1; } to { opacity: 0; } }
        .lp-lights { animation: lp-lights 1.6s cubic-bezier(.2,.7,.2,1) .25s both; }
        @media (prefers-reduced-motion: reduce) { .lp-lights { animation: none; opacity: 0; } }
        .lp-root details > summary { list-style: none; }
        .lp-root details > summary::-webkit-details-marker { display: none; }
        .lp-root details[open] .lp-plus { transform: rotate(45deg); }
      `}</style>

      <LandingNav />

      {/* HERO : le mur de la galerie, l'œuvre accrochée, son cartel */}
      <section className="relative overflow-hidden bg-[#2B1E2F] text-[#F7F5F0]">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 55% at 72% 38%, rgba(232,206,150,0.22), transparent 70%), radial-gradient(40% 40% at 15% 100%, rgba(0,0,0,0.35), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-28 sm:pt-36 pb-20 sm:pb-28 grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-[#E3C77A] text-sm">Pour les artistes indépendants et les galeries d'art</p>
            <h1 className="font-display-lp mt-5 text-[44px] leading-[1.02] sm:text-6xl lg:text-[76px] tracking-[-0.01em]">
              Vos œuvres méritent une vraie galerie.
            </h1>
            <p className="mt-6 text-lg text-[#F7F5F0]/80 leading-relaxed max-w-xl">
              Drawiful crée la galerie en ligne de votre travail : visitable en 3D, avec boutique, paiements dans le
              monde entier et un certificat d'authenticité pour chaque vente. Sans compétence technique.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:items-center">
              <CtaPrimary href="/inscription?plan=artiste">Créer ma galerie gratuitement</CtaPrimary>
              <a
                href="#galerie-3d"
                className="inline-flex items-center justify-center rounded-full border border-[#F7F5F0]/30 px-7 py-3.5 text-[15px] text-[#F7F5F0] hover:border-[#F7F5F0]/70"
              >
                Visiter une galerie en 3D
              </a>
            </div>
            <p className="mt-5 text-sm text-[#F7F5F0]/55">14 jours d'essai gratuit, sans engagement.</p>
          </div>

          <figure className="relative">
            <div className="relative bg-[#1C1A17] p-2.5 sm:p-3.5 shadow-[0_50px_90px_-35px_rgba(0,0,0,0.85)] ring-1 ring-[#B8912F]/40">
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/landing/salle-haussmann.jpg"
                  alt="Une galerie Drawiful : salon haussmannien, parquet en point de Hongrie, œuvres éclairées par des spots"
                  className="block w-full h-auto"
                  width={1800}
                  height={1012}
                />
                <div aria-hidden="true" className="lp-lights absolute inset-0 bg-[#120D14]" />
              </div>
            </div>
            <figcaption className="mt-5 text-[#F7F5F0]/90">
              <Cartel title="Galerie de Erwan, salon haussmannien" detail="Visite 3D Drawiful, 2026" />
            </figcaption>
          </figure>
        </div>
      </section>

      {/* La promesse en trois faits */}
      <section className="border-b border-[#1C1A17]/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            ["3 salles", "d'exposition en 3D"],
            ["6 styles", "de boutique au choix"],
            ["1 certificat", "pour chaque œuvre vendue"],
            ["24 h sur 24", "votre galerie reste ouverte"],
          ].map(([a, b]) => (
            <div key={a}>
              <p className="font-display-lp text-3xl text-[#2B1E2F]">{a}</p>
              <p className="text-sm text-[#77706A] mt-1">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LE CONSTAT */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32 grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20">
        <h2 className="font-display-lp text-4xl sm:text-5xl leading-[1.05]">
          Vendre son art en ligne n'est pas une question de chance, mais de mise en scène.
        </h2>
        <div className="flex flex-col gap-10">
          {PAINS.map((p) => (
            <div key={p.title} className="grid sm:grid-cols-[220px_1fr] gap-2 sm:gap-8">
              <h3 className="font-semibold text-[#2B1E2F]">{p.title}</h3>
              <p className="text-[#4A4540] leading-relaxed">{p.text}</p>
            </div>
          ))}
          <p className="font-display-lp text-2xl text-[#7A2E2B] leading-snug">
            Drawiful réunit la présentation, la preuve et la vente au même endroit.
          </p>
        </div>
      </section>

      {/* DÉMO 3D EN DIRECT */}
      <section id="galerie-3d" className="bg-[#1C1A17] text-[#F7F5F0] scroll-mt-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-28">
          <div className="max-w-2xl mb-10">
            <h2 className="font-display-lp text-4xl sm:text-5xl leading-[1.05]">Entrez, la galerie est ouverte.</h2>
            <p className="mt-5 text-[#F7F5F0]/70 leading-relaxed">
              Ce n'est pas une vidéo : c'est une vraie galerie Drawiful, avec les vraies œuvres d'un artiste. Changez de
              salle, marchez, approchez-vous. Vos collectionneurs vivront exactement la même visite.
            </p>
          </div>
          <Demo3D />
        </div>
      </section>

      {/* POUR QUI */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
        <h2 className="font-display-lp text-4xl sm:text-5xl leading-[1.05] max-w-2xl">
          Que vous peigniez, dessiniez ou photographiez.
        </h2>
        <div className="mt-14 grid sm:grid-cols-2 gap-x-16 gap-y-12">
          {PERSONAS.map((p) => (
            <div key={p.title} className="border-t border-[#1C1A17]/15 pt-6">
              <h3 className="font-display-lp text-2xl text-[#2B1E2F]">{p.title}</h3>
              <p className="mt-3 text-[#4A4540] leading-relaxed max-w-md">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FONCTIONNALITÉS : accrochage "salon", une grande pièce et des plus petites */}
      <section id="fonctionnalites" className="bg-[#EEEBE4] scroll-mt-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
          <h2 className="font-display-lp text-4xl sm:text-5xl leading-[1.05] max-w-3xl">
            Tout ce qu'il faut pour exposer et vendre, au même endroit.
          </h2>
          <div className="mt-14 grid md:grid-cols-3 gap-5">
            {FEATURES.map((f) =>
              f.big ? (
                <div
                  key={f.title}
                  className="md:col-span-2 md:row-span-2 bg-[#2B1E2F] text-[#F7F5F0] rounded-[6px] overflow-hidden flex flex-col"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/landing/salle-sombre.jpg"
                    alt="La salle noire : trois œuvres éclairées par des spots sur un mur sombre"
                    className="w-full aspect-[16/8] object-cover"
                    loading="lazy"
                  />
                  <div className="p-7 sm:p-9">
                    <h3 className="font-display-lp text-3xl">{f.title}</h3>
                    <p className="mt-3 text-[#F7F5F0]/75 leading-relaxed max-w-xl">{f.text}</p>
                  </div>
                </div>
              ) : (
                <div key={f.title} className="bg-[#F7F5F0] rounded-[6px] p-7">
                  <h3 className="font-display-lp text-xl text-[#2B1E2F]">{f.title}</h3>
                  <p className="mt-3 text-sm text-[#4A4540] leading-relaxed">{f.text}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE : une vraie séquence, donc numérotée */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
        <h2 className="font-display-lp text-4xl sm:text-5xl leading-[1.05]">Trois étapes, et votre galerie est ouverte.</h2>
        <ol className="mt-14 grid md:grid-cols-3 gap-10">
          {STEPS.map((s, i) => (
            <li key={s.title} className="border-t-2 border-[#2B1E2F] pt-6">
              <span className="font-display-lp text-5xl text-[#B8912F]">{i + 1}</span>
              <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-[#4A4540] leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* CERTIFICAT */}
      <section className="bg-white border-y border-[#1C1A17]/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
          <CertificateShowcase />
        </div>
      </section>

      {/* COMPARAISON */}
      <section className="mx-auto max-w-5xl px-5 sm:px-8 py-24 sm:py-32">
        <h2 className="font-display-lp text-4xl sm:text-5xl leading-[1.05]">Fini le bricolage.</h2>
        <p className="mt-5 text-[#4A4540] max-w-xl leading-relaxed">
          Ce que la plupart des artistes assemblent à la main, et ce que Drawiful fait pour vous.
        </p>
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="text-sm">
                <th className="py-4 pr-6 font-normal text-[#77706A] w-[24%]">
                  <span className="sr-only">Besoin</span>
                </th>
                <th className="py-4 pr-6 font-semibold text-[#77706A]">Le bricolage habituel</th>
                <th className="py-4 px-5 font-semibold text-[#F7F5F0] bg-[#2B1E2F] rounded-t-[6px]">Avec Drawiful</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={row.label} className="border-t border-[#1C1A17]/10 align-top">
                  <th scope="row" className="py-5 pr-6 font-semibold text-[#2B1E2F]">
                    {row.label}
                  </th>
                  <td className="py-5 pr-6 text-[#77706A]">{row.diy}</td>
                  <td
                    className={`py-5 px-5 bg-[#2B1E2F] text-[#F7F5F0] ${
                      i === COMPARISON.length - 1 ? "rounded-b-[6px]" : ""
                    }`}
                  >
                    {row.drawiful}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* TARIFS */}
      <section id="tarifs" className="bg-[#EEEBE4] scroll-mt-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
          <div className="max-w-2xl">
            <h2 className="font-display-lp text-4xl sm:text-5xl leading-[1.05]">Choisissez votre formule.</h2>
            <p className="mt-5 text-[#4A4540] leading-relaxed">
              14 jours d'essai gratuit sur chaque formule. Paiement sécurisé, sans engagement : vous changez ou
              annulez quand vous voulez.
            </p>
          </div>
          <div className="mt-14 grid lg:grid-cols-3 gap-5 items-stretch">
            {PLANS.map((p) => (
              <div
                key={p.key}
                className={`relative flex flex-col rounded-[6px] p-8 ${
                  p.featured
                    ? "bg-[#2B1E2F] text-[#F7F5F0] lg:-my-4 lg:py-12 shadow-[0_40px_80px_-40px_rgba(43,30,47,0.8)]"
                    : "bg-[#F7F5F0]"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-[#B8912F] px-3 py-1 text-xs font-semibold text-[#1C1A17]">
                    La plus choisie
                  </span>
                )}
                <h3 className="font-display-lp text-3xl">{p.name}</h3>
                <p className={`mt-2 text-sm ${p.featured ? "text-[#F7F5F0]/70" : "text-[#77706A]"}`}>{p.pitch}</p>
                <p className="mt-7 flex items-baseline gap-1.5">
                  <span className="font-display-lp text-6xl">{p.price}&nbsp;€</span>
                  <span className={p.featured ? "text-[#F7F5F0]/60" : "text-[#77706A]"}>par mois</span>
                </p>
                <ul className="mt-7 flex flex-col gap-2.5 text-[15px] flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <svg
                        className={`mt-1 shrink-0 ${p.featured ? "text-[#E3C77A]" : "text-[#B8912F]"}`}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        aria-hidden="true"
                      >
                        <path d="M4 12.5l5 5L20 6.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                  {p.missing.map((f) => (
                    <li key={f} className="flex gap-3 text-[#77706A] line-through decoration-[#77706A]/50">
                      <span className="w-[14px] shrink-0" aria-hidden="true" />
                      <span>
                        <span className="sr-only">Non inclus : </span>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/inscription?plan=${p.key}`}
                  className={`mt-9 inline-flex justify-center rounded-full px-6 py-3.5 text-[15px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8912F] ${
                    p.featured
                      ? "bg-[#B8912F] text-[#1C1A17] hover:bg-[#C9A24A]"
                      : "border border-[#2B1E2F] text-[#2B1E2F] hover:bg-[#2B1E2F] hover:text-[#F7F5F0]"
                  }`}
                >
                  Essayer {p.name} 14 jours
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUESTIONS */}
      <section id="questions" className="mx-auto max-w-3xl px-5 sm:px-8 py-24 sm:py-32 scroll-mt-16">
        <h2 className="font-display-lp text-4xl sm:text-5xl leading-[1.05]">Vos questions.</h2>
        <div className="mt-12 border-t border-[#1C1A17]/15">
          {FAQ.map((f) => (
            <details key={f.q} className="group border-b border-[#1C1A17]/15">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-lg font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B8912F]">
                {f.q}
                <span
                  className="lp-plus grid place-items-center h-8 w-8 shrink-0 rounded-full border border-[#1C1A17]/20 text-[#2B1E2F] transition-transform"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="pb-6 pr-12 text-[#4A4540] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* APPEL FINAL */}
      <section className="relative overflow-hidden bg-[#2B1E2F] text-[#F7F5F0]">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "radial-gradient(50% 70% at 50% 0%, rgba(232,206,150,0.18), transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-4xl px-5 sm:px-8 py-24 sm:py-32 text-center">
          <h2 className="font-display-lp text-4xl sm:text-6xl leading-[1.04]">
            Votre prochaine exposition commence aujourd'hui.
          </h2>
          <p className="mt-6 text-lg text-[#F7F5F0]/75 max-w-2xl mx-auto leading-relaxed">
            Créez votre galerie en quelques minutes et partagez-la dès ce soir. Nous améliorons Drawiful chaque semaine,
            avec les retours de nos artistes.
          </p>
          <div className="mt-10">
            <CtaPrimary href="/inscription?plan=artiste">Créer ma galerie gratuitement</CtaPrimary>
          </div>
          <p className="mt-5 text-sm text-[#F7F5F0]/55">14 jours d'essai gratuit, sans engagement.</p>
        </div>
      </section>

      <footer className="bg-[#1C1A17] text-[#F7F5F0]/60">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 flex flex-col sm:flex-row gap-6 justify-between">
          <div>
            <p className="font-display-lp text-2xl text-[#F7F5F0]">Drawiful</p>
            <p className="text-sm mt-2">La galerie en ligne des artistes indépendants.</p>
          </div>
          <div className="flex flex-col sm:items-end gap-2 text-sm">
            <a href="mailto:clients@drawiful.app" className="hover:text-[#F7F5F0]">
              clients@drawiful.app
            </a>
            <Link href="/login" className="hover:text-[#F7F5F0]">
              Espace artiste
            </Link>
            <p>© {new Date().getFullYear()} Drawiful</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
