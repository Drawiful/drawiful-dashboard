"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Image, Palette, CreditCard, LogOut, ShoppingBag, Settings } from "lucide-react";
import { clearToken } from "@/lib/api";

const navItems = [
  { href: "/overview", icon: LayoutGrid, label: "Vue d'ensemble" },
  { href: "/artworks", icon: Image, label: "Mes œuvres" },
  { href: "/orders", icon: ShoppingBag, label: "Mes ventes" },
  { href: "/gallery", icon: Palette, label: "Ma galerie" },
  { href: "/subscription", icon: CreditCard, label: "Abonnement" },
  { href: "/settings", icon: Settings, label: "Paramètres" },
];

export default function Sidebar({ galleryName }: { galleryName?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between py-8 px-5 bg-aubergine min-h-screen">
      <div>
        <div className="px-2 mb-10">
          <h1 className="font-display text-2xl text-platre">Drawiful</h1>
          {galleryName && <p className="text-xs mt-1 text-ocre">{galleryName}</p>}
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors"
                style={{
                  backgroundColor: isActive ? "rgba(201,138,62,0.15)" : "transparent",
                  color: isActive ? "#C98A3E" : "#D8CDD9",
                }}
              >
                <Icon size={17} strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-lilas/70 hover:text-lilas"
      >
        <LogOut size={17} strokeWidth={1.8} />
        Déconnexion
      </button>
    </aside>
  );
}
