import type { ReactNode } from "react";

// En-tête des pièces de la galerie : surtitre, grand titre Bodoni, phrase d'accueil.
export default function PageHeader({
  kicker,
  title,
  intro,
  action,
}: {
  kicker?: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div className="flex flex-col gap-3 min-w-0">
        {kicker && <p className="text-xs uppercase tracking-[0.18em] text-pierre">{kicker}</p>}
        <h1 className="font-display font-normal text-[40px] sm:text-[52px] leading-[1.05] text-encre">{title}</h1>
        {intro && <p className="text-base leading-relaxed text-encre/75 max-w-xl">{intro}</p>}
      </div>
      {action}
    </header>
  );
}
