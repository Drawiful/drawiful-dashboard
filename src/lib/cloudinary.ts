const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// Upload direct depuis le navigateur vers Cloudinary (le fichier ne
// transite jamais par notre backend). "resourceType" doit être "image"
// pour les photos, "raw" pour les fichiers 3D (.glb/.usdz).
export async function uploadToCloudinary(
  file: File,
  resourceType: "image" | "raw" = "image"
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET!);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    throw new Error("Échec de l'upload du fichier");
  }

  const data = await res.json();
  return data.secure_url;
}
