"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken } from "@/lib/api";
import Sidebar from "./Sidebar";

export default function DashboardShell({
  children,
  onProfileLoaded,
}: {
  children: React.ReactNode;
  onProfileLoaded?: (profile: any) => void;
}) {
  const router = useRouter();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-platre">
        <p className="text-sm text-encre/50">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-platre">
      <Sidebar galleryName={profile?.galleryName} />
      <main className="flex-1 px-12 py-10 max-w-5xl">{children}</main>
    </div>
  );
}
