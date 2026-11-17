import Image from "next/image";
import s from "./selection-monumentale.module.css";

// Ne mentionnez que ce qui est vrai et que vous pouvez prouver.
const OEUVRES = [
  {
    src: "/selection/homme-turban.jpg",
    largeur: 1200,
    hauteur: 1597,
    alt: "Homme avec un turban, portrait à l'huile en gros plan sur fond sombre",
    artiste: "Hanneke Bantje",
    titre: "Homme avec un turban",
    detail: "Huile sur toile, 150 × 200 cm · À titre d'exemple",
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

        {OEUVRES.map((o) => (
          <figure key={o.src} className={s.frame}>
            <div className={s.mat}>
              <Image
                src={o.src}
                alt={o.alt}
                width={o.largeur}
                height={o.hauteur}
                sizes="(min-width: 900px) 460px, 90vw"
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

        <a href="#consultation" className={s.btn}>
          {cta}
        </a>
      </div>
    </section>
  );
}
