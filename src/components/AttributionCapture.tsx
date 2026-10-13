"use client";
import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

// Retient la provenance de la première visite (voir lib/attribution.ts).
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
