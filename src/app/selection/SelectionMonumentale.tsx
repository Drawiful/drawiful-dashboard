import Image from "next/image";
import s from "./selection-monumentale.module.css";

// Ne mentionnez que ce qui est vrai et que vous pouvez prouver
// (dimensions, provenance, état). Rien n'est inventé ici.
const LEGENDE = "Mise en situation, à titre d'illustration.";

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

        <figure className={s.frame}>
          <div className={s.mat}>
            <Image
              src="/selection/monumentale-salon.jpg"
              alt="Une œuvre monumentale dans un cadre doré, accrochée dans un hall de prestige"
              width={800}
              height={800}
              sizes="(min-width: 900px) 640px, 100vw"
              className={s.img}
            />
          </div>
          <figcaption className={s.cap}>{LEGENDE}</figcaption>
        </figure>

        <a href="#consultation" className={s.btn}>
          {cta}
        </a>
      </div>
    </section>
  );
}
