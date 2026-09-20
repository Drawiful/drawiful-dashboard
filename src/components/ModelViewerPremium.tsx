"use client";
import { useEffect, useRef, useState } from "react";
import { View, Sparkles } from "lucide-react";

export default function ModelViewerPremium({
  src,
  poster,
  alt,
}: {
  src: string;
  poster?: string;
  alt: string;
}) {
  const ref = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [arSupported, setArSupported] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onLoad = () => setLoaded(true);
    const onArStatus = (e: any) => setArSupported(e.detail?.status !== "not-presenting" || true);
    el.addEventListener("load", onLoad);
    return () => el.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="relative w-full h-full bg-[#FAFAF7]">
      {/* @ts-ignore - web component */}
      <model-viewer
        ref={ref}
        src={src}
        poster={poster}
        alt={alt}
        camera-controls
        auto-rotate
        rotation-per-second="12deg"
        environment-image="neutral"
        exposure="1.05"
        shadow-intensity="1"
        shadow-softness="0.9"
        interaction-prompt="none"
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-placement="floor"
        style={{
          width: "100%",
          height: "100%",
          opacity: loaded ? 1 : 0,
          transition: "opacity 1.1s ease",
          "--poster-color": "transparent",
        }}
      >
        <button
          slot="ar-button"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#1A1A18] text-white text-xs tracking-wide uppercase px-5 py-3 rounded-full shadow-lg"
        >
          <View size={14} />
          Voir dans votre espace
        </button>
        {/* @ts-ignore */}
      </model-viewer>

      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#FAFAF7]">
          <Sparkles size={18} className="text-[#B08D57] animate-pulse" />
          <p className="text-xs tracking-widest uppercase text-[#8A8578]">
            Préparation de l'œuvre
          </p>
        </div>
      )}
    </div>
  );
}
