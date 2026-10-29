"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api, getToken } from "@/lib/api";
import Sidebar from "./Sidebar";
import TrialBanner from "./TrialBanner";

// Essai terminé sans formule : seule la page Abonnement reste accessible.
const OPEN_WHEN_LOCKED = ["/subscription"];

export default function DashboardShell({
  children,
  onProfileLoaded,
}: {
  children: React.ReactNode;
  onProfileLoaded?: (profile: any) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    api
      .getMyProfile()
      .then((data) => {
        setProfile(data);
        onProfileLoaded?.(data);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const locked = !!profile?.limits?.locked;
  const blocked = locked && !OPEN_WHEN_LOCKED.includes(pathname);

  useEffect(() => {
    if (blocked) router.replace("/subscription");
  }, [blocked, router]);

  if (loading || blocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-platre">
        <p className="text-sm text-encre/50">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-platre">
      <Sidebar galleryName={profile?.galleryName} locked={locked} />
      <main className="flex-1 px-12 py-10 max-w-5xl">
        <TrialBanner limits={profile?.limits} />
        {children}
      </main>
    </div>
  );
}
