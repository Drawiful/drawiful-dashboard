"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ShieldCheck, Calendar, Hash } from "lucide-react";
import { api } from "@/lib/api";

export default function CertificatePage() {
  const params = useParams();
  const serialNumber = params.serialNumber as string;
  const [certificate, setCertificate] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .getCertificate(serialNumber)
      .then(setCertificate)
      .catch(() => setError(true));
  }, [serialNumber]);

  const pageUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pageUrl)}`;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-platre px-4">
        <p className="text-sm text-encre/60">Certificat introuvable ou invalide.</p>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-platre">
        <p className="text-sm text-encre/50">Chargement...</p>
      </div>
    );
  }

  const artwork = certificate.artwork;
  const artist = artwork?.artist;

  return (
    <div className="min-h-screen bg-platre flex items-center justify-center px-4 py-12 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700&family=Caveat:wght@600&display=swap');
      `}</style>
      <div className="w-full max-w-xl bg-white rounded-lg border-2 border-ocre/40 overflow-hidden">
        <div className="bg-aubergine px-8 py-6 flex items-center gap-3">
          <ShieldCheck size={24} className="text-ocre" />
          <div>
            <p className="text-platre font-display text-lg">Certificat d'authenticité</p>
            <p className="text-lilas text-xs mt-0.5">Drawiful — Vérification officielle</p>
          </div>
        </div>

        {artwork?.imageUrl && (
          <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-64 object-cover" />
        )}

        <div className="p-8">
          <h1 className="font-display text-3xl text-encre mb-1">{artwork?.title}</h1>
          <p className="text-sm text-encre/60 mb-6">
            Par {artist?.galleryName ?? "Artiste inconnu"}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-2">
              <Calendar size={16} className="text-argile mt-0.5" />
              <div>
                <p className="text-xs text-encre/50">Date d'émission</p>
                <p className="text-sm text-encre">
                  {new Date(certificate.issuedAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Hash size={16} className="text-argile mt-0.5" />
              <div>
                <p className="text-xs text-encre/50">Numéro de série</p>
                <p className="text-sm text-encre font-mono">{certificate.serialNumber}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs text-encre/50 mb-2">Signature de l'artiste</p>
            {artist?.signatureUrl ? (
              <img src={artist.signatureUrl} alt="Signature" className="h-16 object-contain" />
            ) : (
              <p
                className="text-3xl text-encre"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                {artist?.galleryName}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-bordure">
            <img src={qrCodeUrl} alt="QR Code de vérification" className="w-20 h-20" />
            <div>
              <p className="text-sm text-encre">Ce certificat est vérifiable publiquement.</p>
              <p className="text-xs text-encre/50 mt-1 font-mono break-all">{certificate.hash}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
