"use client";
import { useEffect, useState } from "react";
import { Check, MapPin, Loader2 } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import { api } from "@/lib/api";

function formatMoney(cents: number, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

// Le parcours d'une œuvre acquise, raconté comme en galerie
const statusLabels: Record<string, { label: string; cls: string }> = {
  PAID: { label: "Envoi à préparer", cls: "bg-[#F3E7C4] text-[#5C4716]" },
  SHIPPED: { label: "En route vers sa collection", cls: "bg-[#E4ECE3] text-[#2F5B3A]" },
  REFUNDED: { label: "Remboursée", cls: "bg-[#F2E1DC] text-[#7A2E20]" },
  CANCELED: { label: "Annulée", cls: "bg-[#ECE7DF] text-pierre" },
};

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function longDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

function titles(order: any): string {
  return (order.items ?? []).map((i: any) => i.titleSnapshot).join(", ") || "Œuvre";
}

function collector(order: any): string {
  return order.buyerName || order.buyerEmail;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // Remboursement : confirmation en deux temps, puis appel à l'API.
  const [confirmRefund, setConfirmRefund] = useState<string | null>(null);
  const [refunding, setRefunding] = useState<string | null>(null);
  const [refundError, setRefundError] = useState<{ id: string; message: string } | null>(null);

  function load() {
    setLoading(true);
    Promise.all([api.getOrders(), api.getOrderStats()])
      .then(([o, s]) => {
        setOrders(o);
        setStats(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleShip(id: string) {
    await api.markOrderShipped(id);
    load();
  }

  async function handleRefund(id: string) {
    setRefunding(id);
    setRefundError(null);
    try {
      await api.refundOrder(id);
      setConfirmRefund(null);
      load();
    } catch (e: any) {
      setRefundError({ id, message: e?.message || "Le remboursement n'a pas pu être effectué." });
    } finally {
      setRefunding(null);
    }
  }

  const toShip = orders.filter((o) => o.status === "PAID");
  const cities = new Set(
    orders.filter((o) => o.status === "PAID" || o.status === "SHIPPED").map((o) => o.shippingAddress?.city).filter(Boolean)
  );
  const collected = orders.filter((o) => o.status === "PAID" || o.status === "SHIPPED").length;

  function RefundControl({ order }: { order: any }) {
    if (order.status !== "PAID" && order.status !== "SHIPPED") return null;
    if (confirmRefund !== order.id) {
      return (
        <button
          type="button"
          onClick={() => {
            setConfirmRefund(order.id);
            setRefundError(null);
          }}
          className="text-[13px] text-pierre underline underline-offset-4 hover:text-encre"
        >
          Rembourser
        </button>
      );
    }
    return (
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="opacity-80">Rembourser {formatMoney(order.totalCents, order.currency)} au collectionneur ?</span>
          <button
            type="button"
            onClick={() => handleRefund(order.id)}
            disabled={refunding === order.id}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-4 rounded-full bg-argile text-white disabled:opacity-60"
          >
            {refunding === order.id && <Loader2 size={14} className="animate-spin" />}
            {refunding === order.id ? "Remboursement…" : "Confirmer"}
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirmRefund(null);
              setRefundError(null);
            }}
            disabled={refunding === order.id}
            className="min-h-[40px] px-4 rounded-full border border-pierre/50 opacity-80"
          >
            Annuler
          </button>
        </div>
        {!refundError && (
          <p className="text-xs opacity-70 max-w-xl">
            Le collectionneur est remboursé en totalité sur sa carte et l'œuvre est remise en vente. Les frais Stripe de la
            vente ne sont pas restitués.
          </p>
        )}
        {refundError?.id === order.id && <p className="text-xs text-argile">{refundError.message}</p>}
      </div>
    );
  }

  return (
    <DashboardShell>
      <PageHeader
        kicker="Registre de la galerie"
        title="Acquisitions"
        intro={
          loading
            ? "\u00a0"
            : collected
              ? `Vos œuvres ont rejoint ${collected} ${collected > 1 ? "collections" : "collection"}${
                  cities.size > 1 ? `, dans ${cities.size} villes` : ""
                }.`
              : "Chaque œuvre acquise rejoindra ce registre, avec son parcours jusqu'à son collectionneur."
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-3 border-y border-bordure mb-12">
        <div className="py-6 sm:pr-6 flex flex-col gap-1.5">
          <span className="font-display text-[40px] leading-none text-encre">
            {stats ? formatMoney(stats.revenueCents, stats.currency) : "—"}
          </span>
          <span className="text-sm text-encre/70">reçus pour vos œuvres</span>
        </div>
        <div className="py-6 sm:px-6 flex flex-col gap-1.5 border-t sm:border-t-0 sm:border-l border-bordure">
          <span className="font-display text-[40px] leading-none text-encre">
            {stats ? formatMoney(stats.revenueThisMonthCents, stats.currency) : "—"}
          </span>
          <span className="text-sm text-encre/70">ce mois-ci</span>
        </div>
        <div className="py-6 sm:pl-6 flex flex-col gap-1.5 border-t sm:border-t-0 sm:border-l border-bordure">
          <span className={`font-display text-[40px] leading-none ${toShip.length ? "text-laiton" : "text-encre"}`}>
            {loading ? "—" : toShip.length}
          </span>
          <span className="text-sm text-encre/70">{toShip.length > 1 ? "envois à préparer" : "envoi à préparer"}</span>
        </div>
      </section>

      {/* Chaque acquisition à expédier : un moment, avec son parcours */}
      {toShip.map((order) => {
        const addr = order.shippingAddress;
        return (
          <section
            key={order.id}
            className="mb-8 rounded-xl bg-nuit text-ivoire p-8 sm:p-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]"
          >
            <div className="flex flex-col gap-3.5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-champagne">
                Nouvelle acquisition · {longDate(order.createdAt)}
              </p>
              <h2 className="font-display font-normal text-[32px] sm:text-[36px] leading-tight">
                <em>{titles(order)}</em> {order.items?.length > 1 ? "ont trouvé leur" : "a trouvé son"} collectionneur.
              </h2>
              <p className="text-[15px] leading-relaxed text-lilas">
                {collector(order)} l'accueille dans sa collection{addr?.city ? `, à ${addr.city}` : ""}. Préparez l'envoi
                avec soin, puis indiquez qu'elle est en route.
              </p>
              {addr && (
                <p className="flex items-start gap-2 text-[13px] text-lilas">
                  <MapPin size={14} className="mt-0.5 shrink-0" strokeWidth={1.6} />
                  <span>
                    {[addr.line1, addr.line2].filter(Boolean).join(" ")} · {addr.postal_code} {addr.city}, {addr.country}
                  </span>
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => handleShip(order.id)}
                  className="inline-flex items-center min-h-[44px] px-5 rounded-full bg-champagne text-nuit text-sm font-semibold"
                >
                  Elle est en route
                </button>
                <div className="text-lilas">
                  <RefundControl order={order} />
                </div>
              </div>
            </div>

            <ol aria-label="Parcours de l'œuvre" className="flex flex-col self-center">
              {[
                { label: "Acquise", sub: `${longDate(order.createdAt)} · ${formatMoney(order.totalCents, order.currency)} réglés`, state: "done" },
                { label: "Envoi à préparer", sub: "C'est à vous", state: "current" },
                { label: "En route vers sa collection", sub: "", state: "todo" },
              ].map((st, i, arr) => (
                <li key={st.label} className={`flex gap-4 items-start ${i < arr.length - 1 ? "pb-6" : ""}`}>
                  <span
                    className={`w-[26px] h-[26px] rounded-full shrink-0 flex items-center justify-center ${
                      st.state === "done"
                        ? "bg-champagne text-nuit"
                        : st.state === "current"
                          ? "border-[1.5px] border-champagne"
                          : "border border-ivoire/30"
                    }`}
                  >
                    {st.state === "done" && <Check size={13} strokeWidth={2.4} />}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span
                      className={`text-[15px] ${
                        st.state === "current" ? "text-champagne font-medium" : st.state === "done" ? "font-medium" : "text-lilas"
                      }`}
                    >
                      {st.label}
                    </span>
                    {st.sub && <span className="text-[13px] text-lilas">{st.sub}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        );
      })}

      <h2 className="font-display font-normal text-[28px] text-encre mb-4 mt-4">Le registre</h2>

      {loading ? (
        <p className="font-display text-lg text-pierre">Ouverture du registre…</p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-laiton/50 p-10 text-center flex flex-col items-center gap-2">
          <p className="font-display text-2xl text-encre">Le registre est encore vierge.</p>
          <p className="text-sm text-encre/70 max-w-md">
            Votre première acquisition s'inscrira ici. Pensez à ouvrir la vente de vos œuvres dans « Votre maison ».
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-papier border border-bordure">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.16em] text-pierre">
                <th scope="col" className="px-6 py-4 font-medium">Date</th>
                <th scope="col" className="px-6 py-4 font-medium">Œuvre</th>
                <th scope="col" className="px-6 py-4 font-medium">Collectionneur</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Montant</th>
                <th scope="col" className="px-6 py-4 font-medium">Parcours</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const status = statusLabels[order.status];
                return (
                  <tr key={order.id} className="border-t border-bordure align-top">
                    <td className="px-6 py-5 text-encre/70 whitespace-nowrap">{shortDate(order.createdAt)}</td>
                    <td className="px-6 py-5 font-display text-[17px] text-encre">{titles(order)}</td>
                    <td className="px-6 py-5">
                      {collector(order)}
                      {order.shippingAddress?.city && (
                        <span className="block text-[13px] text-pierre">{order.shippingAddress.city}</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right font-medium whitespace-nowrap">
                      {formatMoney(order.totalCents, order.currency)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-start gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status?.cls ?? ""}`}>
                          {status?.label ?? order.status}
                        </span>
                        {order.status === "SHIPPED" && (
                          <div className="text-encre">
                            <RefundControl order={order} />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}
