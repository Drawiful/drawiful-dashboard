import type { Metadata } from "next";
import Link from "next/link";
import { Bodoni_Moda, Manrope } from "next/font/google";
import ConsultationForm from "./ConsultationForm";
import SelectionMonumentale from "./SelectionMonumentale";
import { COLLECTION_URL, DELAI_REPONSE, DELAI_SELECTION, SHOW_COLLECTION } from "./config";
import s from "./maison.module.css";

// Astuce : Bodoni Moda accepte un réglage optique ({ axes: ["opsz"] }) qui épaissit
// les fins traits en petit corps. À essayer si les petits titres paraissent fragiles.
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: "Drawiful | L'art du grand format pour intérieurs d'exception",
  description:
    "Curation privée et acquisition sur mesure d'œuvres monumentales, pour les architectes d'intérieur, décorateurs de luxe et conseillers en art.",
};

const ETAPES = [
  {
    num: "I",
    titre: "Vous nous confiez votre projet",
    texte: "Le lieu, le mur, l'ambiance, le budget, l'échéance.",
  },
  {
    num: "II",
    titre: "Nous composons votre sélection",
    texte: "Trois à cinq œuvres, présentées dans une salle privée que vous pouvez montrer à votre client.",
  },
  {
    num: "III",
    titre: "Nous nous occupons de l'acquisition",
    texte: "Certificat, facture, emballage et livraison.",
  },
];

const ENGAGEMENTS = [
  `Une première sélection sous ${DELAI_SELECTION}`,
  "Des prix annoncés avant toute acquisition",
  "Un certificat d'authenticité pour chaque œuvre",
  "Une facture adaptée à votre activité professionnelle",
];

export default function MaisonPage() {
  return (
    <main className={`${bodoni.variable} ${manrope.variable} ${s.page}`}>
      <header className={s.nav}>
        <div className={`${s.wrap} ${s.navInner}`}>
          <Link href="/" className={s.brand} aria-label="Drawiful, accueil">
            <span className={s.disc} aria-hidden="true">
              D
            </span>
            <span className={s.brandName}>DRAWIFUL</span>
          </Link>
        </div>
      </header>

      <section className={s.hero}>
        <div className={`${s.wrap} ${s.rise}`}>
          <h1 className={s.title}>
            L&apos;art du grand format pour <span className={s.accent}>intérieurs d&apos;exception.</span>
          </h1>
          <div className={s.rule} />
          <p className={s.lead}>
            Curation privée et acquisition sur mesure d&apos;œuvres monumentales, pour les architectes
            d&apos;intérieur, décorateurs de luxe et conseillers en art.
          </p>
          <a href="#consultation" className={s.btn}>
            Demander un dossier d&apos;acquisition sur mesure
          </a>
          <p className={s.note}>Réponse personnelle sous {DELAI_REPONSE}.</p>
        </div>
      </section>

      <SelectionMonumentale cta="Demander un dossier d'acquisition sur mesure" />

      <section className={`${s.section} ${s.light}`} aria-labelledby="temps">
        <div className={s.wrap}>
          <h2 id="temps" className={s.h2}>
            Trois temps, un interlocuteur.
          </h2>
          <ol className={s.steps}>
            {ETAPES.map((e) => (
              <li key={e.num} className={s.step}>
                <span className={s.num} aria-hidden="true">
                  {e.num}
                </span>
                <div>
                  <h3 className={s.stepTitle}>{e.titre}</h3>
                  <p className={s.stepText}>{e.texte}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {SHOW_COLLECTION && (
        <section className={`${s.section} ${s.dark}`} aria-labelledby="collection">
          <div className={s.wrap}>
            <h2 id="collection" className={s.h2}>
              Une collection réunie par un artiste.
            </h2>
            <p className={s.text}>Chaque œuvre est choisie pour son regard, sa cohérence et son échelle.</p>
            <a href={COLLECTION_URL} className={s.link}>
              Découvrir la collection privée
            </a>
          </div>
        </section>
      )}

      <section className={`${s.section} ${s.light}`} aria-labelledby="engagements">
        <div className={s.wrap}>
          <h2 id="engagements" className={s.h2}>
            Nos engagements
          </h2>
          <ul className={s.list}>
            {ENGAGEMENTS.map((t) => (
              <li key={t} className={s.item}>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="consultation" className={`${s.section} ${s.dark}`} aria-labelledby="projet">
        <div className={s.wrap}>
          <h2 id="projet" className={s.h2}>
            Parlez-nous de votre projet
          </h2>
          <ConsultationForm delai={DELAI_REPONSE} />
        </div>
      </section>

      <footer className={s.foot}>
        <div className={s.wrap}>
          <Link href="/a-propos" className={s.link} style={{ marginRight: "28px" }}>
            À propos
          </Link>
          <Link href="/decouvrir" className={s.link}>
            Vous êtes artiste ? Découvrez votre galerie Drawiful.
          </Link>
          <p className={s.sign}>La maison Drawiful</p>
        </div>
      </footer>
    </main>
  );
}
