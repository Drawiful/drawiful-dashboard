"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

// Message discret affiché en bas de la boutique (remplace les alert() du
// navigateur). Se ferme seul après quelques secondes.
export default function ShopNotice({
  message,
  onClose,
  duration = 7000,
}: {
  message: string | null;
  onClose: () => void;
  duration?: number;
}) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        left: "50%",
        bottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
        transform: "translateX(-50%)",
        zIndex: 1000,
        width: "min(520px, calc(100vw - 32px))",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "16px 18px",
        borderRadius: 14,
        background: "#2B1E2F",
        color: "#F7F5F0",
        boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
        fontSize: 15,
        lineHeight: 1.5,
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        aria-label="Fermer"
        style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", padding: 2, minWidth: 28, minHeight: 28 }}
      >
        <X size={18} />
      </button>
    </div>
  );
}

export const NOT_OPEN_MESSAGE =
  "La vente en ligne de cette galerie ouvre très bientôt. Revenez dans quelques jours pour acquérir cette œuvre.";
