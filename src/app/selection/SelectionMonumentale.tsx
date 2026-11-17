import Image from "next/image";
import s from "./selection-monumentale.module.css";

// Ne mentionnez que ce qui est vrai et que vous pouvez prouver.
// Dimensions : hauteur × largeur.
const OEUVRES = [
  {
    src: "/selection/homme-turban.jpg",
    largeur: 1200,
    hauteur: 1597,
    format: "portrait",
    alt: "Homme avec un turban, portrait à l'huile en gros plan sur fond sombre",
    artiste: "Hanneke Bantje",
    titre: "Homme avec un turban",
    detail: "Huile sur toile, 200 × 150 cm",
  },
  {
    src: "/selection/two-worlds-pruhonice.jpg",
    largeur: 1400,
    hauteur: 1028,
    format: "paysage",
    alt: "Paysage d'automne reflété dans un étang du parc de Průhonice, sous un ciel nuageux",
    artiste: "Martina Krupičková",
    titre: "Two Worlds in Průhonice park",
    detail: "Huile sur toile, 60 × 80 cm · 2026",
  },
];

export default function SelectionMonumentale({ cta }: { cta: string }) {
  return (
    <section className={s.section} aria-labelledby="monumentale">
      <div className={s.wrap}>
        <h2 id="monumentale" className={s.h2}>
          Sélection monumentale
        </h2>
        <p className={s.lead}>
          Des œuvres de grand format, choisies pour un mur, une entrée, un salon. Elles se regardent à l&apos;échelle
          d&apos;une pièce.
        </p>

        <div className={s.grille}>
          {OEUVRES.map((o) => (
            <figure key={o.src} className={`${s.frame} ${o.format === "portrait" ? s.portrait : s.paysage}`}>
              <div className={s.mat}>
                <Image
                  src={o.src}
                  alt={o.alt}
                  width={o.largeur}
                  height={o.hauteur}
                  sizes={o.format === "portrait" ? "(min-width: 900px) 340px, 90vw" : "(min-width: 900px) 500px, 90vw"}
                  className={s.img}
                />
              </div>
              <figcaption className={s.cap}>
                <span className={s.artiste}>{o.artiste}</span>
                <span className={s.titre}>{o.titre}</span>
                <span className={s.detail}>{o.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className={s.cap}>Œuvres présentées à titre d&apos;exemple. Dimensions : hauteur × largeur.</p>

        <a href="#consultation" className={s.btn}>
          {cta}
        </a>
      </div>
    </section>
  );
}
