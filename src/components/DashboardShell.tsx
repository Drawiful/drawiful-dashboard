"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api, getToken } from "@/lib/api";
import Sidebar from "./Sidebar";
import TrialBanner from "./TrialBanner";
import { galleryUrl } from "@/lib/domain";

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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-nuit">
        <img src="/icon.png" alt="" className="w-12 h-12 rounded-full animate-pulse" />
        <p className="font-display text-lg text-ivoire/80">Ouverture de votre galerie…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-platre">
      <Sidebar
        galleryName={profile?.galleryName}
        galleryUrl={profile?.slug ? galleryUrl(profile.slug) : undefined}
        limits={profile?.limits}
        locked={locked}
      />
      <main className="flex-1 min-w-0 px-5 py-8 sm:px-10 md:px-14 md:py-12">
        <div className="max-w-[1080px] mx-auto">
          <TrialBanner limits={profile?.limits} />
          {children}
        </div>
      </main>
    </div>
  );
}
