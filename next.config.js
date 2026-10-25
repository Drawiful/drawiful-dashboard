/** @type {import('next').NextConfig} */

// Ancien domaine -> nouveau domaine, en 308 (chemin et paramètres conservés) :
//   drawiful.app/...            -> drawiful.art/...
//   www.drawiful.app/...        -> drawiful.art/...
//   <slug>.drawiful.app/...     -> <slug>.drawiful.art/...   (galeries, dashboard.…)
// Les redirections passent avant le middleware et couvrent aussi les fichiers
// statiques (visite 3D, images, robots.txt).
const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "drawiful.art").toLowerCase();
const LEGACY_DOMAINS = ["drawiful.app"];

const esc = (d) => d.replace(/\./g, "\\.");

const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "res.cloudinary.com" }],
  },
  async redirects() {
    return LEGACY_DOMAINS.filter((d) => d !== ROOT_DOMAIN).flatMap((legacy) => [
      {
        source: "/:path*",
        has: [{ type: "host", value: `(?:www\\.)?${esc(legacy)}` }],
        destination: `https://${ROOT_DOMAIN}/:path*`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: `(?<sub>[a-z0-9-]+)\\.${esc(legacy)}` }],
        destination: `https://:sub.${ROOT_DOMAIN}/:path*`,
        permanent: true,
      },
    ]);
  },
};

module.exports = nextConfig;
