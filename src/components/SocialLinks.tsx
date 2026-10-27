/*
  Liens vers les réseaux de Drawiful, en pied de page (landing et blog).
  Icônes monochromes et discrètes : elles prennent la couleur du texte autour.
  Volontairement absentes du haut de page : le trafic des pubs Instagram ne
  doit pas repartir vers Instagram avant d'avoir vu le bouton d'essai.
*/

const LINKS = [
  {
    label: "Drawiful sur Instagram",
    href: "https://www.instagram.com/drawiful.art/",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Drawiful sur TikTok",
    href: "https://www.tiktok.com/@drawiful.app",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M14.5 3h2.6c.3 2.1 1.6 3.6 3.9 3.9v2.7c-1.5 0-2.8-.4-3.9-1.1v6.6a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.8a2.9 2.9 0 1 0 2.1 2.8V3Z" />
      </svg>
    ),
  },
  {
    label: "Drawiful sur YouTube",
    href: "https://www.youtube.com/@drawiful",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12c0 1.6.1 3.2.4 4.8.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8c.3-1.6.4-3.2.4-4.8s-.1-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
      </svg>
    ),
  },
];

export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {LINKS.map((l) => (
        <li key={l.href}>
          <a
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={l.label}
            title={l.label}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#F7F5F0]/55 transition-colors hover:bg-white/10 hover:text-[#F7F5F0]"
          >
            {l.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}
