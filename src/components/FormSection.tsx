import type { ReactNode } from "react";

// Mise en page commune des pièces « Vos salles », « Votre maison », « Votre adresse » :
// un chiffre romain et un titre à gauche, le contenu à droite.

export const field =
  "w-full px-4 py-3 rounded-lg border border-bordure bg-papier text-[15px] text-encre placeholder:text-pierre/70 focus:outline-none focus:border-laiton";
export const fieldLabel = "block text-sm font-medium text-encre mb-2";
export const hint = "text-[13px] text-pierre leading-relaxed";
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-full bg-nuit text-ivoire text-sm font-medium disabled:opacity-60";
export const btnOutline =
  "inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-full border border-encre text-encre text-sm disabled:opacity-60";

export function Section({
  num,
  title,
  intro,
  children,
}: {
  num: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-6 md:grid-cols-[220px_1fr] py-10 border-t border-bordure first:border-t-0 first:pt-0">
      <div>
        <p className="font-display text-sm text-laiton">{num}</p>
        <h2 className="font-display font-normal text-[26px] leading-tight text-encre mt-1">{title}</h2>
        {intro && <p className={`${hint} mt-2`}>{intro}</p>}
      </div>
      <div className="flex flex-col gap-6 min-w-0">{children}</div>
    </section>
  );
}

export function FormMessage({ message }: { message: { ok: boolean; text: string } | null }) {
  if (!message) return null;
  return (
    <p role="status" className={`text-sm ${message.ok ? "text-sauge" : "text-argile"}`}>
      {message.text}
    </p>
  );
}
