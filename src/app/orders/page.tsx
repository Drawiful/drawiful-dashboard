"use client";
import { useEffect, useState } from "react";
import { TrendingUp, Package, Truck, MapPin, RotateCcw, Loader2 } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import { api } from "@/lib/api";

function formatMoney(cents: number, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(cents / 100);
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PAID: { label: "Payée", color: "#C98A3E" },
  SHIPPED: { label: "Expédiée", color: "#7A8B69" },
  REFUNDED: { label: "Remboursée", color: "#B5533C" },
  CANCELED: { label: "Annulée", color: "#B5533C" },
};

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

  return (
    <DashboardShell>
      <h2 className="font-display text-4xl text-encre mb-8">Mes ventes</h2>

      <div className="grid grid-cols-3 gap-5 mb-10">
        <div className="rounded-md p-5 bg-aubergine">
          <TrendingUp size={18} className="text-ocre" strokeWidth={1.8} />
          <p className="font-display text-2xl text-platre mt-3">
            {stats ? formatMoney(stats.revenueCents, stats.currency) : "—"}
          </p>
          <p className="text-xs mt-1 text-lilas">Chiffre d'affaires total</p>
        </div>

        <div className="rounded-md p-5 bg-white border border-bordure">
          <TrendingUp size={18} className="text-argile" strokeWidth={1.8} />
          <p className="font-display text-2xl text-encre mt-3">
            {stats ? formatMoney(stats.revenueThisMonthCents, stats.currency) : "—"}
          </p>
          <p className="text-xs mt-1 text-encre/60">Ce mois-ci</p>
        </div>

        <div className="rounded-md p-5 bg-white border border-bordure">
          <Package size={18} className="text-argile" strokeWidth={1.8} />
          <p className="font-display text-2xl text-encre mt-3">{stats?.orderCount ?? "—"}</p>
          <p className="text-xs mt-1 text-encre/60">Commandes</p>
        </div>
      </div>

      <h3 className="font-display text-2xl text-encre mb-5">Historique</h3>

      {loading ? (
        <p className="text-sm text-encre/50">Chargement...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-md border border-dashed border-bordure p-10 text-center">
          <p className="text-sm text-encre/60">
            Aucune vente pour l'instant. Connectez votre compte Stripe depuis les Paramètres pour
            commencer à vendre.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = statusLabels[order.status];
            const addr = order.shippingAddress;
            return (
              <div key={order.id} className="rounded-md bg-white border border-bordure p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-display text-lg text-encre">
                      {formatMoney(order.totalCents, order.currency)}
                    </p>
                    <p className="text-xs text-encre/60 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")} ·{" "}
                      {order.buyerName || order.buyerEmail}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ backgroundColor: `${status?.color}22`, color: status?.color }}
                  >
                    {status?.label ?? order.status}
                  </span>
                </div>

                <div className="text-sm text-encre/70 space-y-1 mb-3">
                  {order.items.map((item: any) => (
                    <p key={item.id}>
                      {item.titleSnapshot} × {item.quantity}
                    </p>
                  ))}
                </div>

                {addr && (
                  <div className="flex items-start gap-2 text-xs text-encre/60 pt-3 border-t border-bordure">
                    <MapPin size={13} className="mt-0.5 flex-shrink-0" />
                    <span>
                      {addr.line1} {addr.line2} — {addr.postal_code} {addr.city}, {addr.country}
                    </span>
                  </div>
                )}

                {(order.status === "PAID" || order.status === "SHIPPED") && (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {order.status === "PAID" && (
                      <button
                        onClick={() => handleShip(order.id)}
                        className="flex items-center gap-2 text-sm px-4 py-2 rounded-md bg-aubergine text-platre"
                      >
                        <Truck size={15} />
                        Marquer comme expédiée
                      </button>
                    )}

                    {confirmRefund === order.id ? (
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-encre/70">
                          Rembourser {formatMoney(order.totalCents, order.currency)} à l'acheteur ?
                        </span>
                        <button
                          onClick={() => handleRefund(order.id)}
                          disabled={refunding === order.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-argile text-white disabled:opacity-60"
                        >
                          {refunding === order.id && <Loader2 size={14} className="animate-spin" />}
                          {refunding === order.id ? "Remboursement..." : "Confirmer"}
                        </button>
                        <button
                          onClick={() => {
                            setConfirmRefund(null);
                            setRefundError(null);
                          }}
                          disabled={refunding === order.id}
                          className="px-3 py-1.5 rounded-md border border-bordure text-encre/70"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setConfirmRefund(order.id);
                          setRefundError(null);
                        }}
                        className="flex items-center gap-2 text-sm px-4 py-2 rounded-md border border-bordure text-encre/70 hover:text-encre"
                      >
                        <RotateCcw size={15} />
                        Rembourser
                      </button>
                    )}
                  </div>
                )}

                {confirmRefund === order.id && !refundError && (
                  <p className="text-xs mt-2 text-encre/50">
                    L'acheteur est remboursé en totalité sur sa carte et l'œuvre est remise en vente. Les frais
                    Stripe de la vente ne sont pas restitués.
                  </p>
                )}
                {refundError?.id === order.id && (
                  <p className="text-xs mt-2 text-argile">{refundError.message}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
