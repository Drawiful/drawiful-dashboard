import type { Metadata } from "next";
import Link from "next/link";
import { Bodoni_Moda, Manrope } from "next/font/google";
import LandingNav from "@/components/landing/LandingNav";
import Demo3D from "@/components/landing/Demo3D";
import CertificateShowcase from "@/components/landing/CertificateShowcase";
import HeroFilm from "@/components/landing/HeroFilm";
import StickyCta from "@/components/landing/StickyCta";
import SocialLinks from "@/components/SocialLinks";

/*
  Landing Drawiful (servie sur drawiful.art via le middleware).
  Ligne éditoriale du 29 oct. 2026 : une expérience plutôt qu'un logiciel,
  ton premium, centré sur les bénéfices de l'artiste, vouvoiement.

  Un seul chemin : l'inscription (essai de 14 jours sans carte bancaire).
  L'en-tête n'a pas de menu d'ancres ; le seul lien sortant est la galerie
  d'Erwan, ouverte dans un nouvel onglet.

  Palette : encre #0E0C0A · nuit #16130F · ivoire #F4EFE6 · champagne #D9B75C
            · laiton #9A7B2F (sur fond clair) · pierre #8A8378 · papier #F7F3EC
  Ordre : 1. Premier écran (film + accès privé)  2. Les atmosphères (démo 3D)
  3. Manifeste  4. Disciplines  5. Engagements (+ certificat)  6. Trois étapes
  7. Commissions  8. Avant / après  9. Formules  10. Fondateur  11. Questions
  12. Appel final. Sur téléphone, un bouton reste fixé en bas (StickyCta).
*/

const display = Bodoni_Moda({ subsets: ["latin"], variable: "--font-lp-display", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-lp-body", display: "swap" });

export const metadata: Metadata = {
  title: "Drawiful — L'écrin digital des artistes contemporains",
  description:
    "Exposez vos œuvres dans votre propre galerie visitable en 3D, avec certificats d'authenticité et vente en ligne. 0 % de commission. 14 jours offerts, sans carte bancaire.",
  openGraph: {
    title: "Drawiful — L'écrin digital des artistes contemporains",
    description:
      "Votre galerie à votre nom, visitable en 3D, avec certificats d'authenticité et vente en ligne. 0 % de commission. 14 jours offerts.",
    images: ["/landing/salle-haussmann.jpg"],
    locale: "fr_FR",
    type: "website",
  },
};

const SIGNUP = "/inscription";

function CtaPrimary({ href, children, id, className = "" }: { href: string; children: React.ReactNode; id?: string; className?: string }) {
  return (
    <Link
      id={id}
      href={href}
      className={`inline-flex items-center justify-center gap-3 rounded-full bg-[#D9B75C] px-8 py-4 text-[15px] font-semibold tracking-[0.01em] text-[#0E0C0A] transition-colors hover:bg-[#E6C877] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9B75C] ${className}`}
    >
      {children}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

// Petit intitulé numéroté, à la manière d'un cartel d'exposition
function Kicker({ n, children, light = false }: { n: string; children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] ${light ? "text-[#D9B75C]" : "text-[#9A7B2F]"}`}>
      <span>{n}</span>
      <span className={`h-px w-10 ${light ? "bg-[#D9B75C]/50" : "bg-[#9A7B2F]/50"}`} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

const ATMOSPHERES = [
  {
    name: "Le Salon Haussmannien",
    text: "Les volumes classiques et la lumière traversante des plus beaux appartements parisiens.",
    img: "/landing/salle-haussmann.jpg",
  },
  {
    name: "Le White Cube",
    text: "La pureté intemporelle, minimaliste et muséale, pour laisser l'œuvre respirer.",
    img: "/landing/salle-blanche.jpg",
  },
  {
    name: "La Salle Noire",
    text: "Un clair-obscur feutré et théâtral, où chaque spot sublime les contrastes de vos créations.",
    img: "/landing/salle-sombre.jpg",
  },
];

const MANIFESTO = [
  {
    label: "Le constat",
    title: "L'éparpillement des outils",
    text: "Un portfolio sur un réseau, un lien de paiement impersonnel, des négociations par message privé… Le collectionneur s'égare, et la magie s'estompe avant la transaction.",
  },
  {
    label: "Le risque",
    title: "Le doute sur l'authenticité",
    text: "Sans certificat d'authenticité, une œuvre originale se confond avec le flux d'images numériques. Le moindre doute fragilise la valeur de votre travail.",
  },
  {
    label: "La limite",
    title: "L'aplatissement de la présence",
    text: "Une simple photographie ne rendra jamais justice aux textures ni à l'échelle. C'est pourtant la confrontation avec la taille réelle qui déclenche le coup de cœur.",
  },
];

const DISCIPLINES = [
  {
    title: "La peinture",
    text: "Vos huiles, acryliques et techniques mixtes s'exposent avec la solennité qu'elles méritent. Chaque œuvre est accrochée à ses dimensions réelles, baignée d'un éclairage dédié, accompagnée de son cartel et de son certificat d'authenticité.",
  },
  {
    title: "Le dessin et les œuvres graphiques",
    text: "Illustrations, encres, fusains et œuvres sur papier. Présentez vos travaux encadrés avec le plus grand soin, prêts à rejoindre les collections privées en quelques instants.",
  },
  {
    title: "La photographie d'art",
    text: "Protégez la rareté de vos tirages. Chaque tirage vendu reçoit son certificat numéroté : vos éditions limitées conservent leur rareté et leur valeur.",
  },
  {
    title: "Les galeries et collectifs",
    text: "Réunissez jusqu'à dix artistes sous votre propre identité, et offrez à vos collectionneurs un parcours d'une fluidité absolue.",
  },
];

const ENGAGEMENTS = [
  {
    title: "Une galerie visitable en 3D",
    text: "Vos œuvres sont accrochées à l'échelle exacte, au centimètre près, et se visitent instantanément sur ordinateur comme sur smartphone.",
  },
  {
    title: "Un écrin de vente à votre identité",
    text: "Des styles épurés et haut de gamme, à vos couleurs et à votre nom. Le panier et le paiement s'intègrent avec discrétion, sans rompre l'expérience esthétique.",
  },
  {
    title: "Votre propre nom de domaine",
    text: "Votre galerie réside à l'adresse de votre choix (votrenom.com), sécurisée et connectée en quelques minutes. Elle est aussi accessible dès l'inscription sur votrenom.drawiful.art.",
  },
  {
    title: "Des certificats d'authenticité",
    text: "Un certificat numéroté et signé pour chaque œuvre, avec sa page de vérification en ligne, consultable à tout moment par vos collectionneurs.",
  },
  {
    title: "Une ouverture sur le monde",
    text: "Vos acquéreurs règlent par carte bancaire en toute sérénité, d'où qu'ils viennent, via l'infrastructure sécurisée de Stripe. Les fonds sont versés directement sur votre compte.",
  },
  {
    title: "L'œuvre chez le collectionneur",
    text: "D'un geste sur leur smartphone compatible, vos acheteurs projettent votre création en taille réelle sur leur propre mur, grâce à la réalité augmentée. La distance n'est plus un frein.",
  },
];

const STEPS = [
  {
    title: "Déposez vos créations",
    text: "Une photographie, vos dimensions réelles, votre technique et votre prix. Drawiful accroche l'œuvre dans votre galerie 3D.",
  },
  {
    title: "Choisissez votre scénographie",
    text: "L'atmosphère et le style de galerie qui résonnent le plus fidèlement avec l'esprit de votre travail.",
  },
  {
    title: "Partagez l'expérience",
    text: "Diffusez votre lien auprès de vos collectionneurs, sur vos réseaux ou dans vos catalogues. Chaque acquisition est accompagnée de son certificat d'authenticité.",
  },
];

const COMPARISON = [
  {
    need: "Présentation des œuvres",
    before: "Des clichés figés sur un site générique ou un réseau social saturé",
    after: "Une galerie 3D immersive à l'échelle réelle et un espace de vente privé",
  },
  {
    need: "Garantie d'authenticité",
    before: "Un document fait à la main, souvent oublié faute de temps",
    after: "Un certificat numéroté, signé et vérifiable en ligne",
  },
  {
    need: "Transactions internationales",
    before: "Des virements, des échanges de RIB et des négociations privées",
    after: "Un paiement par carte sécurisé, fluide et accessible dans le monde entier",
  },
  {
    need: "Suivi des collections",
    before: "Un tableur austère, des notes éparpillées, une mémoire sollicitée",
    after: "Un espace unique qui réunit commandes, ventes et expéditions",
  },
  {
    need: "Mise en ligne",
    before: "Des jours de configuration laborieuse et de compromis esthétiques",
    after: "Un univers prêt à exposer en quelques minutes, sans aucune ligne de code",
  },
];

const PLANS = [
  {
    key: "aspirant",
    name: "Aspirant",
    pitch: "Pour poser les fondations de votre présence en ligne et exposer vos premières créations.",
    price: 19 as number | null,
    features: [
      "Une sélection de 5 œuvres",
      "Galerie publique en ligne",
      "1 certificat d'authenticité",
      "Votre adresse dédiée : votrenom.drawiful.art",
    ],
    missing: ["Vente en ligne", "Galerie 3D immersive", "Nom de domaine personnalisé"],
  },
  {
    key: "artiste",
    name: "Artiste",
    pitch: "La formule d'excellence des artistes professionnels qui vendent leurs œuvres.",
    price: 49,
    featured: true,
    features: [
      "Œuvres et expositions illimitées",
      "Écrin de vente personnalisé",
      "Galerie 3D immersive et réalité augmentée",
      "Certificats d'authenticité illimités",
      "Suivi des commandes et des expéditions",
      "Votre propre nom de domaine",
    ],
    missing: [],
  },
  {
    key: "studio",
    name: "Gallery",
    pitch: "Pour les galeries d'art, les agents et les collectifs multi-artistes.",
    price: null,
    features: [
      "L'intégralité de la formule Artiste",
      "De 2 à 10 artistes sous votre enseigne",
      "Tableau de bord de galerie",
      "Expositions 3D illimitées",
      "Support prioritaire et accompagnement",
    ],
    missing: [],
  },
];

const FAQ = [
  {
    q: "Faut-il une carte bancaire pour commencer ?",
    a: "Non. Votre accès de 14 jours s'ouvre avec votre seule adresse e-mail. Vous choisissez une formule uniquement si l'expérience vous convient.",
  },
  {
    q: "Que se passe-t-il à la fin des 14 jours ?",
    a: "Vous choisissez la formule qui vous ressemble, depuis votre espace. Si vous la choisissez pendant l'essai, rien n'est prélevé avant la fin des 14 jours. Sans formule, votre galerie reste visible, mais la vente en ligne et la visite 3D se mettent en pause jusqu'à votre choix. Vos œuvres et vos réglages sont conservés.",
  },
  {
    q: "Puis-je vendre pendant l'essai ?",
    a: "Oui. Pendant 14 jours, tout est ouvert : galerie 3D, vente en ligne, certificats. Il vous suffit d'activer les paiements avec Stripe, en quelques minutes.",
  },
  {
    q: "Drawiful prélève-t-il une commission sur mes ventes ?",
    a: "Aucune. Le collectionneur paie directement sur votre compte Stripe : seuls les frais bancaires de Stripe sont déduits (environ 1,5 % + 0,25 € pour une carte européenne). Votre abonnement reste le même, quel que soit votre chiffre d'affaires.",
  },
  {
    q: "Restez-vous propriétaire de vos œuvres ?",
    a: "Entièrement. Drawiful présente et vend vos œuvres en votre nom ; vous conservez tous vos droits sur vos créations.",
  },
  {
    q: "Comment fonctionne le certificat d'authenticité ?",
    a: "Chaque œuvre reçoit un certificat portant un numéro unique, le détail de l'œuvre et votre signature. Le collectionneur le reçoit avec son acquisition et peut le vérifier en ligne à tout moment grâce à ce numéro.",
  },
  {
    q: "Y a-t-il un engagement ?",
    a: "Aucun. Vous changez de formule ou suspendez votre abonnement depuis votre espace, en quelques clics.",
  },
];

export default function LandingPage() {
  return (
    <div className={`${display.variable} ${body.variable} lp-root bg-[#0E0C0A] text-[#F4EFE6] antialiased`}>
      <style>{`
        .lp-root { font-family: var(--font-lp-body), system-ui, sans-serif; }
        .font-display-lp { font-family: var(--font-lp-display), Georgia, serif; font-optical-sizing: auto; }
        .lp-root ::selection { background: #D9B75C; color: #0E0C0A; }
        .lp-root details > summary { list-style: none; }
        .lp-root details > summary::-webkit-details-marker { display: none; }
        .lp-root details[open] .lp-plus { transform: rotate(45deg); }
      `}</style>

      <LandingNav />

      {/* 1. PREMIER ÉCRAN */}
      <section className="relative overflow-hidden">
        {/* Téléphone : le film en bandeau, le texte dessous (la toile reste lisible) */}
        <div className="md:hidden">
          <div className="relative h-[52svh] min-h-[340px]">
            <HeroFilm className="absolute inset-0 h-full w-full object-cover" />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, rgba(14,12,10,0.6) 0%, rgba(14,12,10,0) 20%, rgba(14,12,10,0) 70%, #0E0C0A 100%)" }}
            />
          </div>
          <div className="relative -mt-8 px-5 pb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D9B75C]">
              L'excellence numérique au service de la création
            </p>
            <h1 className="font-display-lp mt-4 text-[40px] leading-[1.02] tracking-[-0.01em]">
              L'écrin digital des artistes contemporains.
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-[#F4EFE6]/80">
              Offrez à vos collectionneurs une immersion grandeur nature dans votre univers. Exposez en 3D, vendez dans le
              monde entier et scellez l'authenticité de vos œuvres. Sans aucune commission.
            </p>
            <CtaPrimary id="hero-cta" href={SIGNUP} className="mt-7 w-full">
              Initier mon accès privé
            </CtaPrimary>
            <p className="mt-3 text-center text-[12px] leading-relaxed text-[#F4EFE6]/60">
              14 jours offerts, sans carte bancaire · Sans engagement
            </p>
          </div>
        </div>

        {/* Ordinateur : le texte à gauche, le film encadré comme une œuvre, avec son cartel */}
        <div className="hidden md:block relative">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "radial-gradient(55% 60% at 75% 45%, rgba(217,183,92,0.10), transparent 70%)" }}
          />
          <div className="relative mx-auto max-w-7xl px-8 pt-36 pb-28 lg:pt-40 grid grid-cols-[1.15fr_0.85fr] gap-16 lg:gap-24 items-center">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.32em] text-[#D9B75C]">
                L'excellence numérique au service de la création
              </p>
              <h1 className="font-display-lp mt-6 text-6xl lg:text-[82px] leading-[1.0] tracking-[-0.015em]">
                L'écrin digital des artistes contemporains.
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#F4EFE6]/75">
                Offrez à vos collectionneurs une immersion grandeur nature dans votre univers. Exposez en 3D, vendez dans
                le monde entier et scellez l'authenticité de vos œuvres. Sans aucune commission.
              </p>
              <div className="mt-10">
                <CtaPrimary href={SIGNUP}>Initier mon accès privé</CtaPrimary>
              </div>
              <p className="mt-4 text-[13px] text-[#F4EFE6]/55">
                14 jours offerts, sans carte bancaire · Sans engagement · Configuration sereine en quelques minutes
              </p>
            </div>

            <figure className="justify-self-center">
              <div className="relative w-[320px] lg:w-[360px] bg-[#16130F] p-3 ring-1 ring-[#D9B75C]/35 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]">
                <HeroFilm className="block w-full aspect-[9/16] object-cover bg-[#16130F]" />
              </div>
              <figcaption className="mt-5 border-l border-[#D9B75C]/50 pl-4 text-[13px] leading-relaxed text-[#F4EFE6]/60">
                <span className="block font-display-lp text-base italic text-[#F4EFE6]/85">Coin parisien, Erwan</span>
                Filmée dans une galerie Drawiful · Salon haussmannien, puis salle noire
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 2. LES ATMOSPHÈRES : la démo 3D en direct */}
      <section id="galerie-3d" className="bg-[#16130F] scroll-mt-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-32">
          <Kicker n="I" light>
            L'immersion
          </Kicker>
          <div className="mt-6 grid lg:grid-cols-[1fr_0.9fr] gap-8 lg:gap-20 items-end">
            <h2 className="font-display-lp text-[38px] sm:text-6xl leading-[1.03]">
              Choisissez l'atmosphère de votre prochaine exposition.
            </h2>
            <p className="text-[#F4EFE6]/70 leading-relaxed">
              Entrez, la galerie est ouverte. Ce n'est plus une simple image : c'est un espace que l'on parcourt, qui
              restitue la présence réelle des œuvres. Avancez, approchez-vous des toiles. Vos collectionneurs vivront
              exactement ce voyage.
            </p>
          </div>

          <div className="mt-12 sm:mt-16">
            <Demo3D />
          </div>

          <div className="mt-14 grid sm:grid-cols-3 gap-8 sm:gap-10">
            {ATMOSPHERES.map((a) => (
              <div key={a.name}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.img} alt="" loading="lazy" className="w-full aspect-[4/3] object-cover ring-1 ring-white/10" />
                <h3 className="font-display-lp mt-5 text-2xl">{a.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#F4EFE6]/65">{a.text}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-sm text-[#F4EFE6]/60">
            Découvrir la galerie personnelle de notre artiste résident :{" "}
            <a
              href="https://erwan.drawiful.art"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D9B75C] underline underline-offset-4 hover:text-[#F4EFE6]"
            >
              erwan.drawiful.art
            </a>
          </p>
        </div>
      </section>

      {/* 3. MANIFESTE */}
      <section className="bg-[#F7F3EC] text-[#1A1714]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-32">
          <Kicker n="II">Le manifeste</Kicker>
          <div className="mt-6 grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-24">
            <div>
              <h2 className="font-display-lp text-[38px] sm:text-6xl leading-[1.03]">
                Présenter son art en ligne est un acte de mise en scène.
              </h2>
              <p className="mt-6 text-[#55504A] leading-relaxed max-w-md">
                Le marché de l'art exige de la clarté et du prestige. Les solutions standards brisent l'émotion de l'acte
                d'achat.
              </p>
            </div>
            <div className="flex flex-col">
              {MANIFESTO.map((m) => (
                <div key={m.title} className="border-t border-[#1A1714]/15 py-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9A7B2F]">{m.label}</p>
                  <h3 className="font-display-lp mt-3 text-2xl sm:text-3xl">{m.title}</h3>
                  <p className="mt-3 text-[#55504A] leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="font-display-lp mt-16 sm:mt-24 max-w-4xl text-3xl sm:text-[44px] leading-[1.15] text-[#1A1714]">
            Drawiful réunit la scénographie, la preuve d'authenticité et la sécurité de la vente{" "}
            <span className="italic text-[#9A7B2F]">au sein d'un seul espace, le vôtre.</span>
          </p>
        </div>
      </section>

      {/* 4. DISCIPLINES */}
      <section className="bg-[#F7F3EC] text-[#1A1714] border-t border-[#1A1714]/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-32">
          <Kicker n="III">Pour chaque sensibilité</Kicker>
          <h2 className="font-display-lp mt-6 max-w-3xl text-[38px] sm:text-6xl leading-[1.03]">
            Une technologie invisible, au service de votre discipline.
          </h2>
          <div className="mt-14 sm:mt-20 grid sm:grid-cols-2 gap-x-16 gap-y-14">
            {DISCIPLINES.map((d) => (
              <div key={d.title} className="border-t border-[#1A1714]/20 pt-7">
                <h3 className="font-display-lp text-[28px]">{d.title}</h3>
                <p className="mt-3 max-w-md text-[#55504A] leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ENGAGEMENTS */}
      <section className="bg-[#0E0C0A]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-32">
          <Kicker n="IV" light>
            Nos engagements
          </Kicker>
          <h2 className="font-display-lp mt-6 max-w-3xl text-[38px] sm:text-6xl leading-[1.03]">
            Tout ce qu'exige la présentation d'une œuvre d'art.
          </h2>
          <div className="mt-14 sm:mt-20 grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#F4EFE6]/10">
            {ENGAGEMENTS.map((e, i) => (
              <div key={e.title} className="border-r border-b border-[#F4EFE6]/10 p-7 sm:p-9">
                <span className="font-display-lp text-sm text-[#D9B75C]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display-lp mt-4 text-2xl leading-snug">{e.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#F4EFE6]/65">{e.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5b. LE CERTIFICAT, en exemple */}
      <section className="bg-white text-[#1A1714]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-32">
          <CertificateShowcase />
        </div>
      </section>

      {/* 6. TROIS ÉTAPES */}
      <section className="bg-[#16130F]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-32">
          <Kicker n="V" light>
            Votre première exposition
          </Kicker>
          <h2 className="font-display-lp mt-6 max-w-3xl text-[38px] sm:text-6xl leading-[1.03]">
            Votre galerie ouvre en trois temps.
          </h2>
          <ol className="mt-14 sm:mt-20 grid md:grid-cols-3 gap-12 md:gap-10">
            {STEPS.map((s, i) => (
              <li key={s.title} className="border-t border-[#D9B75C]/40 pt-7">
                <span className="font-display-lp text-6xl text-[#D9B75C]">{i + 1}</span>
                <h3 className="font-display-lp mt-5 text-2xl">{s.title}</h3>
                <p className="mt-3 text-[#F4EFE6]/65 leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-16">
            <CtaPrimary href={SIGNUP}>Initier mon accès privé</CtaPrimary>
            <p className="mt-3 text-[13px] text-[#F4EFE6]/50">14 jours offerts, sans carte bancaire</p>
          </div>
        </div>
      </section>

      {/* 7. COMMISSIONS */}
      <section id="commission" className="bg-[#0E0C0A] scroll-mt-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-32 grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-24 items-center">
          <div>
            <Kicker n="VI" light>
              0 % de commission
            </Kicker>
            <h2 className="font-display-lp mt-6 text-[38px] sm:text-6xl leading-[1.03]">Préservez l'intégralité de votre valeur.</h2>
            <p className="mt-7 max-w-lg text-[#F4EFE6]/70 leading-relaxed">
              Drawiful ne prélève aucune commission sur vos ventes. Le montant de chaque transaction est versé directement
              sur votre compte : seuls les frais bancaires de Stripe sont déduits. Votre abonnement reste le même, que vous
              vendiez une œuvre unique ou une collection entière.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            <div className="border border-[#F4EFE6]/15 p-5 sm:p-8">
              <p className="text-[13px] leading-snug text-[#F4EFE6]/55">Plateforme traditionnelle, 30 à 50 % de commission</p>
              <p className="font-display-lp mt-6 text-[34px] sm:text-5xl leading-[1.05] text-[#F4EFE6]/45">500 à 700&nbsp;€</p>
              <p className="mt-4 text-[13px] leading-snug text-[#F4EFE6]/45">300 à 500 € quittent l'artiste pour rémunérer l'intermédiaire.</p>
            </div>
            <div className="bg-[#F4EFE6] text-[#0E0C0A] p-5 sm:p-8 ring-1 ring-[#D9B75C]">
              <p className="text-[13px] leading-snug text-[#6E675F]">Avec Drawiful, 0 % de commission</p>
              <p className="font-display-lp mt-6 text-[34px] sm:text-5xl leading-[1.05]">985&nbsp;€</p>
              <p className="mt-4 text-[13px] leading-snug text-[#55504A]">Environ 15 € de frais Stripe, rien pour Drawiful. Votre art vous appartient.</p>
            </div>
            <p className="col-span-2 text-xs leading-relaxed text-[#F4EFE6]/45">
              Pour une œuvre vendue 1 000 €, réglée par une carte bancaire européenne (frais Stripe d'environ 1,5 % +
              0,25 €). Les frais varient selon le pays et le type de carte de l'acheteur.
            </p>
          </div>
        </div>
      </section>

      {/* 8. AVANT / APRÈS */}
      <section className="bg-[#F7F3EC] text-[#1A1714]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-32">
          <Kicker n="VII">Avant, après</Kicker>
          <h2 className="font-display-lp mt-6 text-[38px] sm:text-6xl leading-[1.03]">Restaurez l'harmonie.</h2>
          <p className="mt-6 max-w-xl text-[#55504A] leading-relaxed">
            Ce que la plupart des artistes assemblent à la main, et ce que Drawiful réunit pour vous.
          </p>

          {/* Téléphone : une carte par besoin */}
          <div className="mt-12 flex flex-col gap-4 md:hidden">
            {COMPARISON.map((r) => (
              <div key={r.need} className="bg-white ring-1 ring-[#1A1714]/10">
                <p className="px-5 pt-5 font-display-lp text-xl">{r.need}</p>
                <p className="px-5 pt-3 text-sm text-[#8A8378] line-through decoration-[#8A8378]/40">{r.before}</p>
                <p className="mt-4 bg-[#0E0C0A] px-5 py-4 text-sm leading-relaxed text-[#F4EFE6]">{r.after}</p>
              </div>
            ))}
          </div>

          {/* Ordinateur : le tableau */}
          <table className="mt-14 hidden md:table w-full text-left">
            <thead>
              <tr className="text-[12px] uppercase tracking-[0.22em]">
                <th className="py-4 pr-6 font-semibold text-[#8A8378] w-[22%]">Vos exigences</th>
                <th className="py-4 pr-6 font-semibold text-[#8A8378]">La gestion fragmentée habituelle</th>
                <th className="py-4 px-6 font-semibold text-[#D9B75C] bg-[#0E0C0A]">L'expérience Drawiful</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((r) => (
                <tr key={r.need} className="border-t border-[#1A1714]/12 align-top">
                  <th scope="row" className="py-6 pr-6 font-display-lp text-xl font-normal">
                    {r.need}
                  </th>
                  <td className="py-6 pr-6 text-[#8A8378] leading-relaxed">{r.before}</td>
                  <td className="py-6 px-6 bg-[#0E0C0A] text-[#F4EFE6] leading-relaxed">{r.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 9. FORMULES */}
      <section id="tarifs" className="bg-[#16130F] scroll-mt-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-32">
          <Kicker n="VIII" light>
            Les formules
          </Kicker>
          <div className="mt-6 grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-20 items-end">
            <h2 className="font-display-lp text-[38px] sm:text-6xl leading-[1.03]">Commencez par 14 jours offerts.</h2>
            <p className="text-[#F4EFE6]/70 leading-relaxed">
              Votre accès s'ouvre sans carte bancaire, avec tout inclus : galerie 3D, vente en ligne, certificats. À la fin
              de l'essai, choisissez la formule qui vous ressemble. Vous restez maître de votre engagement et pouvez faire
              évoluer ou suspendre votre abonnement en quelques clics.
            </p>
          </div>

          <div className="mt-14 sm:mt-20 grid lg:grid-cols-3 gap-5 items-stretch">
            {PLANS.map((p) => (
              <div
                key={p.key}
                className={`relative flex flex-col p-8 sm:p-9 ${
                  p.featured
                    ? "bg-[#F4EFE6] text-[#0E0C0A] lg:-my-5 lg:py-14 shadow-[0_50px_100px_-50px_rgba(217,183,92,0.45)]"
                    : "border border-[#F4EFE6]/12"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-8 bg-[#D9B75C] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0E0C0A]">
                    Recommandée
                  </span>
                )}
                <h3 className="font-display-lp text-4xl">{p.name}</h3>
                <p className={`mt-3 text-sm leading-relaxed ${p.featured ? "text-[#55504A]" : "text-[#F4EFE6]/60"}`}>{p.pitch}</p>
                {p.price != null ? (
                  <p className="mt-8 flex items-baseline gap-2">
                    <span className="font-display-lp text-6xl">{p.price}&nbsp;€</span>
                    <span className={p.featured ? "text-[#6E675F]" : "text-[#F4EFE6]/55"}>par mois</span>
                  </p>
                ) : (
                  <p className="mt-8 flex flex-col">
                    <span className="font-display-lp text-5xl leading-[1.15]">Sur devis</span>
                    <span className="mt-1 text-sm text-[#F4EFE6]/55">Adapté à l'envergure de vos projets</span>
                  </p>
                )}
                <ul className="mt-8 flex flex-1 flex-col gap-3 text-[15px]">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <svg className={`mt-1 shrink-0 ${p.featured ? "text-[#9A7B2F]" : "text-[#D9B75C]"}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
                        <path d="M4 12.5l5 5L20 6.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                  {p.missing.map((f) => (
                    <li key={f} className="flex gap-3 text-[#F4EFE6]/40 line-through decoration-[#F4EFE6]/25">
                      <span className="w-[14px] shrink-0" aria-hidden="true" />
                      <span>
                        <span className="sr-only">Non inclus : </span>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {p.price != null ? (
                  <Link
                    href={`${SIGNUP}?plan=${p.key}`}
                    className={`mt-9 inline-flex justify-center rounded-full px-6 py-4 text-[15px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9B75C] ${
                      p.featured
                        ? "bg-[#0E0C0A] text-[#F4EFE6] hover:bg-[#2A2520]"
                        : "border border-[#F4EFE6]/30 text-[#F4EFE6] hover:border-[#D9B75C] hover:text-[#D9B75C]"
                    }`}
                  >
                    Commencer avec {p.name}
                  </Link>
                ) : (
                  <a
                    href={`mailto:clients@drawiful.app?subject=${encodeURIComponent("Formule Gallery — demande de devis")}&body=${encodeURIComponent("Bonjour,\n\nNom de la galerie ou du collectif :\nNombre d'artistes :\nSite ou Instagram :\nVos besoins :\n\nMerci !")}`}
                    className="mt-9 inline-flex justify-center rounded-full border border-[#F4EFE6]/30 px-6 py-4 text-[15px] font-semibold text-[#F4EFE6] transition-colors hover:border-[#D9B75C] hover:text-[#D9B75C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9B75C]"
                  >
                    Demander un devis
                  </a>
                )}
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-[13px] text-[#F4EFE6]/50">
            Aspirant et Artiste : 14 jours offerts, sans carte bancaire, puis prélèvement mensuel si vous choisissez de
            continuer.
          </p>
        </div>
      </section>

      {/* 10. LE FONDATEUR */}
      <section className="bg-[#F7F3EC] text-[#1A1714]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-20 sm:py-32">
          <Kicker n="IX">Le fondateur</Kicker>
          <h2 className="font-display-lp mt-6 text-[38px] sm:text-5xl leading-[1.05]">L'outil d'un créateur, pour les créateurs.</h2>
          <blockquote className="mt-10 border-l-2 border-[#9A7B2F] pl-6 sm:pl-8">
            <p className="font-display-lp text-2xl sm:text-[30px] leading-[1.35] italic">
              « En tant que dessinateur, j'ai longtemps cherché un espace numérique capable de restituer la solennité et
              l'émotion d'une véritable exposition. Ne trouvant aucune solution à la hauteur de notre métier, j'ai choisi
              de bâtir Drawiful. »
            </p>
            <p className="mt-6 text-[#55504A] leading-relaxed">
              Ma propre galerie est celle que vous parcourez dans nos démonstrations :{" "}
              <a href="https://erwan.drawiful.art" target="_blank" rel="noopener noreferrer" className="text-[#9A7B2F] underline underline-offset-4">
                erwan.drawiful.art
              </a>
              . Je veille personnellement à ce que la technologie s'efface derrière votre art. Une question, une vision à
              partager ? Écrivez-moi à{" "}
              <a href="mailto:clients@drawiful.app" className="text-[#9A7B2F] underline underline-offset-4">
                clients@drawiful.app
              </a>
              : je réponds personnellement à chaque message.
            </p>
            <footer className="mt-6 text-sm font-semibold tracking-wide">Erwan, fondateur de Drawiful</footer>
          </blockquote>
        </div>
      </section>

      {/* 11. QUESTIONS */}
      <section id="questions" className="bg-[#F7F3EC] text-[#1A1714] border-t border-[#1A1714]/10 scroll-mt-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-20 sm:py-28">
          <h2 className="font-display-lp text-[38px] sm:text-5xl leading-[1.05]">Vos questions.</h2>
          <div className="mt-12 border-t border-[#1A1714]/15">
            {FAQ.map((f) => (
              <details key={f.q} className="group border-b border-[#1A1714]/15">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-lg font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9A7B2F]">
                  {f.q}
                  <span className="lp-plus grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#1A1714]/25 transition-transform" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="pb-6 pr-12 text-[#55504A] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 12. APPEL FINAL */}
      <section id="appel-final" className="relative overflow-hidden bg-[#0E0C0A]">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "radial-gradient(50% 70% at 50% 0%, rgba(217,183,92,0.14), transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-4xl px-5 sm:px-8 py-24 sm:py-36 text-center">
          <h2 className="font-display-lp text-[40px] sm:text-7xl leading-[1.02]">Votre prochaine exposition commence aujourd'hui.</h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-[#F4EFE6]/70">
            Façonnez votre galerie en quelques instants et accueillez vos premiers collectionneurs dès ce soir. 0 % de
            commission, pour toujours.
          </p>
          <div className="mt-11">
            <CtaPrimary href={SIGNUP}>Entrer dans l'expérience Drawiful</CtaPrimary>
          </div>
          <p className="mt-5 text-sm text-[#F4EFE6]/50">14 jours offerts, sans carte bancaire · Sans engagement</p>
        </div>
      </section>

      <footer className="bg-[#0E0C0A] border-t border-[#F4EFE6]/10 text-[#F4EFE6]/55">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-12 sm:flex-row sm:px-8">
          <div>
            <p className="font-display-lp text-2xl text-[#F4EFE6]">Drawiful</p>
            <p className="mt-2 text-sm">L'écrin digital des artistes contemporains.</p>
            <SocialLinks className="mt-4 -ml-2.5" />
          </div>
          <div className="flex flex-col gap-2 text-sm sm:items-end">
            <a href="mailto:clients@drawiful.app" className="hover:text-[#F4EFE6]">
              clients@drawiful.app
            </a>
            <Link href="/blog" className="hover:text-[#F4EFE6]">
              Blog
            </Link>
            <Link href="/login" className="hover:text-[#F4EFE6]">
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
