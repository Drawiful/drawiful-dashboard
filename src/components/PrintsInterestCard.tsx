"use client";
import { useEffect, useState } from "react";
import { Frame } from "lucide-react";
import { api } from "@/lib/api";

/*
  Teste l'intérêt des artistes pour les tirages d'art encadrés avant de construire
  la fonctionnalité. Chaque réponse est enregistrée et envoyée par e-mail à Drawiful.
*/

const FORMATS = [
  { key: "Petit (A4)", label: "Petit · A4" },
  { key: "Moyen (A3)", label: "Moyen · A3" },
  { key: "Grand (A2 et plus)", label: "Grand · A2 et plus" },
];
const PRICES = ["Moins de 50 €", "50 à 100 €", "100 à 200 €", "Plus de 200 €"];

export default function PrintsInterestCard() {
  const [state, setState] = useState<"loading" | "idle" | "form" | "sending" | "done">("loading");
  const [formats, setFormats] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getMyInterests()
      .then((rows: any[]) => setState(rows?.some((r) => r.feature === "tirages") ? "done" : "idle"))
      .catch(() => setState("idle"));
  }, []);

  function toggle(key: string) {
    setFormats((f) => (f.includes(key) ? f.filter((x) => x !== key) : [...f, key]));
  }

  async function send() {
    setState("sending");
    setError(null);
    try {
      await api.registerInterest({ feature: "tirages", formats, priceRange: price || undefined });
      setState("done");
    } catch {
      setError("L'envoi n'a pas abouti. Réessayez dans un instant.");
      setState("form");
    }
  }

  if (state === "loading") return null;

  return (
    <div className="rounded-xl border border-bordure bg-papier p-8">
      <div className="flex gap-4">
        <Frame size={22} className="text-laiton shrink-0 mt-1" strokeWidth={1.5} />
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-laiton">Bientôt</p>
          <p className="font-display text-2xl text-encre mt-1.5">Vos œuvres en tirages d'art encadrés</p>

          {state === "done" ? (
            <p className="text-sm text-encre/70 mt-1.5">
              Merci, c'est noté. On vous prévient dès que les tirages sont disponibles.
            </p>
          ) : (
            <>
              <p className="text-sm text-encre/70 mt-1.5 max-w-2xl leading-relaxed">
                Vos œuvres en tirages numérotés, imprimés sur papier d'art, encadrés et livrés directement à vos
                collectionneurs, sans rien manipuler. Vos originaux restent des pièces uniques.
              </p>

              {state === "idle" && (
                <button
                  onClick={() => setState("form")}
                  className="mt-5 inline-flex items-center min-h-[44px] px-5 rounded-full text-sm font-medium bg-nuit text-ivoire"
                >
                  Ça m'intéresse
                </button>
              )}

              {(state === "form" || state === "sending") && (
                <div className="mt-5 space-y-5">
                  <fieldset>
                    <legend className="text-sm text-encre/80 mb-2">Quels formats vous intéressent ? — facultatif</legend>
                    <div className="flex flex-wrap gap-2">
                      {FORMATS.map((f) => (
                        <label
                          key={f.key}
                          className={`text-sm px-3 py-1.5 rounded-full border cursor-pointer ${
                            formats.includes(f.key) ? "border-nuit bg-nuit text-ivoire" : "border-bordure text-encre/80"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={formats.includes(f.key)}
                            onChange={() => toggle(f.key)}
                          />
                          {f.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="text-sm text-encre/80 mb-2">
                      À quel prix vendriez-vous un tirage encadré ? — facultatif
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {PRICES.map((p) => (
                        <label
                          key={p}
                          className={`text-sm px-3 py-1.5 rounded-full border cursor-pointer ${
                            price === p ? "border-nuit bg-nuit text-ivoire" : "border-bordure text-encre/80"
                          }`}
                        >
                          <input
                            type="radio"
                            name="prints-price"
                            className="sr-only"
                            checked={price === p}
                            onChange={() => setPrice(p)}
                          />
                          {p}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {error && <p className="text-sm text-argile">{error}</p>}
                  <div className="flex gap-3">
                    <button
                      onClick={send}
                      disabled={state === "sending"}
                      className="inline-flex items-center min-h-[44px] px-5 rounded-full text-sm font-medium bg-nuit text-ivoire disabled:opacity-60"
                    >
                      {state === "sending" ? "Envoi..." : "Envoyer"}
                    </button>
                    <button onClick={() => setState("idle")} className="text-sm px-3 py-2 text-encre/60">
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
