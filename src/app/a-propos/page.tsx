import type { Metadata } from "next";
import Link from "next/link";
import { Bodoni_Moda, Manrope } from "next/font/google";
import s from "../selection/maison.module.css";

const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: "À propos | Drawiful",
  description:
    "La maison Drawiful accompagne architectes d'intérieur, décorateurs et conseillers en art dans l'acquisition d'œuvres monumentales.",
};

export default function AProposPage() {
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

      <section className={`${s.section} ${s.dark}`} aria-labelledby="apropos">
        <div className={s.wrap}>
          <h1 id="apropos" className={s.h2}>
            La maison Drawiful
          </h1>
          <p className={s.text}>
            Artiste et fondateur de Drawiful, je parcours ateliers et expositions en quête d&apos;œuvres qui ont la
            présence d&apos;un lieu. La maison est née d&apos;une conviction : un grand format n&apos;est pas un décor,
            il donne à un intérieur son caractère. J&apos;accompagne architectes d&apos;intérieur, décorateurs et
            conseillers en art dans le choix, l&apos;acquisition et la livraison de pièces monumentales. Chaque œuvre
            est sélectionnée avec exigence et remise avec son certificat d&apos;authenticité.
          </p>
          <p className={s.sign}>Erwan, fondateur</p>
          <Link href="/#consultation" className={s.btn}>
            Demander un dossier d&apos;acquisition sur mesure
          </Link>
        </div>
      </section>

      <footer className={s.foot}>
        <div className={s.wrap}>
          <Link href="/" className={s.link}>
            Retour à la maison Drawiful
          </Link>
        </div>
      </footer>
    </main>
  );
}
