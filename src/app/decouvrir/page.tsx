import type { Metadata } from "next";
import Link from "next/link";
import { Bodoni_Moda, Manrope } from "next/font/google";
import LandingNav from "@/components/landing/LandingNav";
import Demo3D from "@/components/landing/Demo3D";
import CertificateShowcase from "@/components/landing/CertificateShowcase";
import HeroVideo from "@/components/landing/HeroVideo";
import StickyCta from "@/components/landing/StickyCta";

/*
  Landing Drawiful (servie sur drawiful.app via le middleware).
  Palette : mur aubergine #2B1E2F · laiton #B8912F · papier #F7F5F0 · encre #1C1A17
            · pierre #77706A · sceau bordeaux #7A2E2B
  Fil conducteur : le cartel de musée (titre, technique, date) sert de légende partout.

  Ordre (version du 19 oct. 2026, pensé pour le trafic Instagram sur mobile) :
  1. Promesse « 0 % de commission » + vidéo de la visite + bouton d'essai
  2. Démo 3D interactive   3. Le calcul sur 1 000 €   4. Le constat
  5. Pour qui, fonctionnalités, étapes, certificat, comparaison
  6. Tarifs   7. Le fondateur   8. Questions   9. Appel final
  Sur téléphone, un bouton d'essai reste fixé en bas de l'écran (StickyCta).
*/

const display = Bodoni_Moda({ subsets: ["latin"], variable: "--font-lp-display", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-lp-body", display: "swap" });

export const metadata: Metadata = {
  title: "Drawiful — 0 % de commission. Ta galerie d'art en 3D, à ton nom.",
  description:
    "Expose et vends tes œuvres dans ta propre galerie en ligne, visitable en 3D, avec certificat d'authenticité. 0 % de commission sur tes ventes. 14 jours d'essai gratuit.",
  openGraph: {
    title: "Drawiful — 0 % de commission. Ta galerie d'art en 3D, à ton nom.",
    description:
      "Ta galerie à ton nom, visitable en 3D, avec boutique et certificats d'authenticité. 0 % de commission. 14 jours d'essai gratuit.",
    images: ["/landing/salle-haussmann.jpg"],
    locale: "fr_FR",
    type: "website",
  },
};

function CtaPrimary({
  href,
  children,
  className = "",
  id,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <Link
      id={id}
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
    title: "Tu peins",
    text: "Chaque toile est accrochée à taille réelle, sous son spot, avec son cartel et son certificat d'authenticité.",
  },
  {
    title: "Tu dessines",
    text: "Illustrations, encres et fusains encadrés, prêts à être commandés depuis ta boutique.",
  },
  {
    title: "Tu photographies",
    text: "Chaque tirage vendu porte un certificat numéroté. Tes éditions limitées gardent leur valeur.",
  },
  {
    title: "Tu diriges une galerie",
    text: "Jusqu'à dix artistes sous ta marque, et un tableau de bord pour piloter l'activité.",
  },
];

const FEATURES = [
  {
    title: "Une galerie visitable en 3D",
    text: "Trois salles au choix : salon haussmannien, white cube ou salle noire. Tes œuvres y sont accrochées à leurs dimensions réelles, éclairées une à une, visitables sur ordinateur comme sur téléphone.",
    big: true,
  },
  {
    title: "Une boutique à ton image",
    text: "Six styles de boutique, ton nom, tes couleurs. Panier et paiement intégrés.",
  },
  {
    title: "Ton adresse web, incluse",
    text: "Ta galerie est en ligne sur tagalerie.drawiful.app. Tu as déjà un nom de domaine ? Relie-le en quelques minutes.",
  },
  {
    title: "Des certificats d'authenticité",
    text: "Un certificat numéroté pour chaque œuvre, avec ta signature, vérifiable en ligne.",
  },
  {
    title: "Paiements dans le monde entier",
    text: "Tes collectionneurs paient par carte, d'où qu'ils soient. L'argent arrive sur ton compte via Stripe.",
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
  { title: "Ajoute tes œuvres", text: "Une photo, un titre, un prix et les dimensions réelles. C'est tout." },
  { title: "Choisis ta salle", text: "Le style de la boutique et l'ambiance de la galerie 3D. Elle ressemble à ton travail." },
  { title: "Partage et vends", text: "Ton lien sur Instagram, tes cartes de visite, tes e-mails. Chaque vente part avec son certificat." },
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
    pitch: "Pour débuter et exposer tes premières œuvres.",
    price: 19,
    features: ["5 œuvres", "Galerie publique", "1 certificat d'authenticité", "Ton adresse drawiful.app"],
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
      "Ton propre nom de domaine",
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
    q: "Drawiful prend-il une commission sur mes ventes ?",
    a: "Non, aucune. Le collectionneur paie directement sur ton compte Stripe. Seuls les frais bancaires de Stripe sont déduits (environ 1,5 % + 0,25 € pour une carte européenne). Tu ne paies que ton abonnement mensuel, quel que soit ton chiffre d'affaires.",
  },
  {
    q: "Suis-je toujours propriétaire de mes œuvres ?",
    a: "Oui, entièrement. Drawiful présente et vend tes œuvres en ton nom ; tu gardes tous tes droits sur tes créations.",
  },
  {
    q: "Comment fonctionne le certificat d'authenticité ?",
    a: "Chaque œuvre reçoit un certificat avec un numéro unique, le détail de l'œuvre et ta signature. Le collectionneur le reçoit avec son achat et peut le vérifier en ligne à tout moment grâce à ce numéro.",
  },
  {
    q: "Puis-je vendre à des collectionneurs à l'étranger ?",
    a: "Oui. Les paiements par carte sont gérés par Stripe : un collectionneur peut acheter depuis l'étranger, et l'argent est versé sur ton compte.",
  },
  {
    q: "Ai-je besoin d'un nom de domaine ou d'un hébergeur ?",
    a: "Non. Ta galerie est en ligne dès l'inscription sur tagalerie.drawiful.app. Si tu possèdes déjà un nom de domaine, tu peux le relier depuis ton espace.",
  },
  {
    q: "Faut-il renseigner une carte bancaire pour l'essai ?",
    a: "Oui, une carte est demandée au démarrage de l'essai, mais rien n'est prélevé pendant les 14 jours. Tu peux annuler avant la fin sans rien payer.",
  },
  {
    q: "Que se passe-t-il après les 14 jours d'essai ?",
    a: "L'abonnement démarre au tarif de la formule choisie. Tu reçois un e-mail de rappel avant la fin de l'essai.",
  },
  {
    q: "Y a-t-il un engagement ?",
    a: "Aucun. Tu changes de formule ou annules depuis la page Abonnement de ton espace, en quelques clics.",
  },
];

export default function LandingPage() {
  return (
    <div className={`${display.variable} ${body.variable} lp-root bg-[#F7F5F0] text-[#1C1A17] antialiased`}>
      <style>{`
        .lp-root { font-family: var(--font-lp-body), system-ui, sans-serif; }
        .font-display-lp { font-family: var(--font-lp-display), Georgia, serif; font-optical-sizing: auto; }
        .lp-root ::selection { background: #B8912F; color: #1C1A17; }
        .lp-root details > summary { list-style: none; }
        .lp-root details > summary::-webkit-details-marker { display: none; }
        .lp-root details[open] .lp-plus { transform: rotate(45deg); }
      `}</style>

      <LandingNav />

      {/* 1. PREMIER ÉCRAN : la promesse de la pub, la visite en vidéo, le bouton */}
      <section className="relative overflow-hidden bg-[#2B1E2F] text-[#F7F5F0]">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 55% at 72% 38%, rgba(232,206,150,0.22), transparent 70%), radial-gradient(40% 40% at 15% 100%, rgba(0,0,0,0.35), transparent 70%)",
          }}
        />

        {/* Téléphone : la vidéo en bandeau, tout en haut ; elle finit sur l'œuvre et son prix */}
        <div className="md:hidden relative pt-16">
          <HeroVideo variant="mobile" className="block w-full aspect-[16/11] object-cover bg-[#1C1A17]" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#2B1E2F] to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-5 md:pt-32 lg:pt-36 pb-12 md:pb-24 grid md:grid-cols-[1.25fr_0.75fr] gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-[#E3C77A] text-sm">Pour les artistes qui veulent vendre leurs œuvres</p>
            <h1 className="font-display-lp mt-3 md:mt-5 text-[36px] leading-[1.05] sm:text-5xl lg:text-[68px] tracking-[-0.01em]">
              <span className="text-[#E3C77A]">0&nbsp;% de commission.</span> Ta galerie d'art en 3D, à ton nom.
            </h1>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-[#F7F5F0]/80 leading-relaxed max-w-xl">
              Expose et vends tes œuvres avec certificat d'authenticité. En ligne en 10 minutes.
            </p>
            <div className="mt-6 md:mt-9 flex flex-col sm:flex-row gap-3 sm:items-center">
              <CtaPrimary id="hero-cta" href="/inscription?plan=artiste">
                Essayer 14 jours gratuits
              </CtaPrimary>
              <a
                href="#galerie-3d"
                className="hidden md:inline-flex items-center justify-center rounded-full border border-[#F7F5F0]/30 px-7 py-3.5 text-[15px] text-[#F7F5F0] hover:border-[#F7F5F0]/70"
              >
                Visiter la galerie en 3D
              </a>
            </div>
            <p className="mt-3 md:mt-4 text-[13px] text-[#F7F5F0]/60">
              Sans engagement · aucun débit pendant 14 jours · annulable en 1 clic
            </p>
            <a href="#galerie-3d" className="md:hidden mt-5 inline-block text-sm text-[#E3C77A] underline underline-offset-4">
              Ou visite d'abord une vraie galerie en 3D ↓
            </a>
          </div>

          {/* Ordinateur : la vidéo entière, dans un cadre de téléphone */}
          <figure className="hidden md:block justify-self-center">
            <div className="relative w-[280px] lg:w-[320px] rounded-[38px] bg-[#1C1A17] p-3 shadow-[0_50px_90px_-35px_rgba(0,0,0,0.85)] ring-1 ring-[#B8912F]/40">
              <div className="overflow-hidden rounded-[28px]">
                <HeroVideo className="block w-full aspect-[540/968] object-cover bg-[#1C1A17]" />
              </div>
            </div>
            <figcaption className="mt-5 text-center text-sm text-[#F7F5F0]/70">
              La galerie de Erwan, filmée sur téléphone
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 2. DÉMO 3D EN DIRECT */}
      <section id="galerie-3d" className="bg-[#1C1A17] text-[#F7F5F0] scroll-mt-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-28">
          <div className="max-w-2xl mb-8 sm:mb-10">
            <h2 className="font-display-lp text-4xl sm:text-5xl leading-[1.05]">Entre, la galerie est ouverte.</h2>
            <p className="mt-5 text-[#F7F5F0]/70 leading-relaxed">
              Cette fois, ce n'est plus une vidéo : c'est la vraie galerie, avec les vraies œuvres d'un artiste. Change de
              salle, avance, approche-toi. Tes collectionneurs vivront exactement la même visite.
            </p>
          </div>
          <Demo3D />
          <p className="mt-6 text-sm text-[#F7F5F0]/70">
            Envie de voir aussi la boutique de cet artiste ?{" "}
            <a
              href="https://erwan.drawiful.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E3C77A] underline underline-offset-4 hover:text-[#F7F5F0]"
            >
              Ouvrir erwan.drawiful.app
            </a>
          </p>
        </div>
      </section>

      {/* 3. 0 % DE COMMISSION : le calcul sur une vente de 1 000 € */}
      <section id="commission" className="bg-[#2B1E2F] text-[#F7F5F0] scroll-mt-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-28 grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-20 items-center">
          <div>
            <p className="text-[#E3C77A] text-sm">0 % de commission</p>
            <h2 className="font-display-lp mt-4 text-4xl sm:text-5xl leading-[1.05]">
              Tu vends une œuvre 1&nbsp;000&nbsp;€. Combien tu gardes&nbsp;?
            </h2>
            <p className="mt-6 text-[#F7F5F0]/75 leading-relaxed max-w-lg">
              Drawiful ne prend aucune commission sur tes ventes. Le collectionneur paie directement sur ton compte
              Stripe : seuls les frais bancaires de Stripe sont déduits. Ton abonnement reste le même, que tu vendes une
              œuvre ou cent.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-[6px] border border-[#F7F5F0]/15 p-5 sm:p-7">
              <p className="text-sm text-[#F7F5F0]/60">Plateforme à 30 % de commission</p>
              <p className="font-display-lp text-4xl sm:text-5xl mt-4 text-[#F7F5F0]/60">700&nbsp;€</p>
              <p className="text-sm text-[#F7F5F0]/50 mt-3">300 € partent à la plateforme.</p>
            </div>
            <div className="rounded-[6px] bg-[#F7F5F0] text-[#1C1A17] p-5 sm:p-7 ring-2 ring-[#B8912F]">
              <p className="text-sm text-[#77706A]">Avec Drawiful</p>
              <p className="font-display-lp text-4xl sm:text-5xl mt-4 text-[#2B1E2F]">985&nbsp;€</p>
              <p className="text-sm text-[#4A4540] mt-3">Environ 15 € de frais Stripe, rien pour Drawiful.</p>
            </div>
            <p className="col-span-2 text-xs text-[#F7F5F0]/50 leading-relaxed">
              Exemple pour une carte bancaire européenne (frais Stripe d'environ 1,5 % + 0,25 €). Les frais varient selon
              le pays et le type de carte de l'acheteur.
            </p>
          </div>
        </div>
      </section>

      {/* 4. LE CONSTAT */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-32 grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20">
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

      {/* 5a. POUR QUI */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-20 sm:pb-32">
        <h2 className="font-display-lp text-4xl sm:text-5xl leading-[1.05] max-w-2xl">
          Que tu peignes, dessines ou photographies.
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

      {/* 5b. FONCTIONNALITÉS : accrochage "salon", une grande pièce et des plus petites */}
      <section id="fonctionnalites" className="bg-[#EEEBE4] scroll-mt-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-32">
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

      {/* 5c. COMMENT ÇA MARCHE : une vraie séquence, donc numérotée */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-32">
        <h2 className="font-display-lp text-4xl sm:text-5xl leading-[1.05]">Trois étapes, et ta galerie est ouverte.</h2>
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

      {/* 5d. CERTIFICAT */}
      <section className="bg-white border-y border-[#1C1A17]/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-32">
          <CertificateShowcase />
        </div>
      </section>

      {/* 5e. COMPARAISON */}
      <section className="mx-auto max-w-5xl px-5 sm:px-8 py-20 sm:py-32">
        <h2 className="font-display-lp text-4xl sm:text-5xl leading-[1.05]">Fini le bricolage.</h2>
        <p className="mt-5 text-[#4A4540] max-w-xl leading-relaxed">
          Ce que la plupart des artistes assemblent à la main, et ce que Drawiful fait pour toi.
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

      {/* 6. TARIFS */}
      <section id="tarifs" className="bg-[#EEEBE4] scroll-mt-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-32">
          <div className="max-w-2xl">
            <h2 className="font-display-lp text-4xl sm:text-5xl leading-[1.05]">Choisis ta formule.</h2>
            <p className="mt-5 text-[#4A4540] leading-relaxed">
              14 jours d'essai gratuit sur chaque formule. Une carte est demandée pour démarrer, mais rien n'est prélevé
              pendant l'essai. Sans engagement : tu changes ou annules quand tu veux.
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
                    Recommandée
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

      {/* 7. LE FONDATEUR */}
      <section className="mx-auto max-w-3xl px-5 sm:px-8 py-20 sm:py-28">
        <p className="text-sm text-[#77706A]">Qui est derrière Drawiful</p>
        <blockquote className="mt-4 font-display-lp text-3xl sm:text-4xl leading-[1.15] text-[#2B1E2F]">
          « Je suis dessinateur. Je voulais exposer mes dessins comme dans une vraie galerie, et je ne trouvais pas
          l'outil. Alors je l'ai construit. »
        </blockquote>
        <p className="mt-6 text-[#4A4540] leading-relaxed">
          Erwan, fondateur de Drawiful. Ma propre galerie est celle que tu vois dans la vidéo et la démo :{" "}
          <a
            href="https://erwan.drawiful.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7A2E2B] underline underline-offset-4"
          >
            erwan.drawiful.app
          </a>
          . Une question ? Écris-moi à{" "}
          <a href="mailto:clients@drawiful.app" className="text-[#7A2E2B] underline underline-offset-4">
            clients@drawiful.app
          </a>
          , je réponds moi-même.
        </p>
      </section>

      {/* 8. QUESTIONS */}
      <section id="questions" className="mx-auto max-w-3xl px-5 sm:px-8 pb-20 sm:pb-32 scroll-mt-16">
        <h2 className="font-display-lp text-4xl sm:text-5xl leading-[1.05]">Tes questions.</h2>
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

      {/* 9. APPEL FINAL */}
      <section id="appel-final" className="relative overflow-hidden bg-[#2B1E2F] text-[#F7F5F0]">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "radial-gradient(50% 70% at 50% 0%, rgba(232,206,150,0.18), transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-4xl px-5 sm:px-8 py-20 sm:py-32 text-center">
          <h2 className="font-display-lp text-4xl sm:text-6xl leading-[1.04]">
            Ta prochaine exposition commence aujourd'hui.
          </h2>
          <p className="mt-6 text-lg text-[#F7F5F0]/75 max-w-2xl mx-auto leading-relaxed">
            Crée ta galerie en 10 minutes et partage-la dès ce soir. 0 % de commission sur tes ventes, pour toujours.
          </p>
          <div className="mt-10">
            <CtaPrimary href="/inscription?plan=artiste">Essayer 14 jours gratuits</CtaPrimary>
          </div>
          <p className="mt-5 text-sm text-[#F7F5F0]/55">Sans engagement · aucun débit pendant 14 jours</p>
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

      <StickyCta />
    </div>
  );
}
