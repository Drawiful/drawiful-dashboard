"use client";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Skin } from "./skins";
import { withAlpha } from "./skins";
import { formatDimensions } from "@/lib/dimensions";
import {
  wrap,
  capsStyle,
  Eyebrow,
  Ornament,
  ThemedPage,
  ThemedHeader,
  ThemedFooter,
  ArtworkMedia,
  Cartel,
  ThreeDBadge,
  btnStyle,
  money,
  roman,
} from "./ThemedChrome";

function plural(n: number, one: string, many: string) {
  return n > 1 ? many : one;
}

function splitName(name: string): [string, string] {
  const words = String(name ?? "").trim().split(/\s+/).filter(Boolean);
  return [words[0] ?? "", words.slice(1).join(" ")];
}

function excerpt(text: string | null | undefined, max = 240) {
  if (!text) return "";
  const t = String(text).trim();
  return t.length > max ? t.slice(0, max).replace(/\s+\S*$/, "") + "…" : t;
}

// Lignes du cartel : dimensions et encadrement, quand ils sont renseignés.
function cartelLines(art: any): string[] {
  const lines: string[] = [];
  const dims = formatDimensions(art);
  if (dims) lines.push(art.framed ? `${dims} · encadrée` : dims);
  else if (art.framed) lines.push("Vendue encadrée");
  return lines;
}

export function ThemedListing({
  skin,
  artist,
  slug,
  cartCount = 0,
}: {
  skin: Skin;
  artist: any;
  slug: string;
  cartCount?: number;
}) {
  const artworks: any[] = artist.artworks ?? [];
  const has3d = !!artist.has3dAccess;
  const header = <ThemedHeader skin={skin} slug={slug} galleryName={artist.galleryName} cartCount={cartCount} has3d={has3d} />;

  return (
    <ThemedPage skin={skin}>
      {skin.layout === "capsule" ? (
        // Noir & Or : un faisceau de lumière tombe du plafond sur l'œuvre phare.
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div
            aria-hidden="true"
            style={{ position: "absolute", left: "50%", top: 0, width: 760, height: 900, transform: "translateX(-50%)", pointerEvents: "none", background: `radial-gradient(ellipse 38% 62% at 50% 0%, ${withAlpha("#E8D6B0", 0.2)}, ${withAlpha("#E8D6B0", 0.06)} 55%, ${withAlpha("#E8D6B0", 0)} 75%)` }}
          />
          <div
            aria-hidden="true"
            style={{ position: "absolute", left: "50%", top: 340, width: 620, height: 620, transform: "translateX(-50%)", pointerEvents: "none", background: `radial-gradient(closest-side, ${withAlpha("#6E1824", 0.32)}, ${withAlpha("#6E1824", 0)})` }}
          />
          <div style={{ position: "relative" }}>
            {header}
            <Hero skin={skin} artist={artist} slug={slug} artworks={artworks} />
          </div>
        </div>
      ) : (
        <>
          {header}
          <Hero skin={skin} artist={artist} slug={slug} artworks={artworks} />
        </>
      )}
      <Works skin={skin} artist={artist} slug={slug} artworks={artworks} />
      {has3d && <Visit3D skin={skin} slug={slug} />}
      <ArtistWord skin={skin} artist={artist} slug={slug} />
      <Guarantees skin={skin} artworks={artworks} />
      <ThemedFooter skin={skin} slug={slug} />
    </ThemedPage>
  );
}

// =====================================================================
// Ouverture : nom de la galerie, bio et œuvre phare
// =====================================================================
function Hero({ skin, artist, slug, artworks }: { skin: Skin; artist: any; slug: string; artworks: any[] }) {
  const [first, rest] = splitName(artist.galleryName);
  const count = artworks.length;
  const countLabel = count > 0 ? `${count} ${plural(count, "pièce unique", "pièces uniques")}` : "Galerie d'art";
  const featured = artworks[0];
  const img: string | null = featured?.imageUrl || artist.avatarUrl || null;
  const featuredHref = featured ? `/g/${slug}/${featured.id}` : `/g/${slug}`;
  const title: CSSProperties = { margin: 0, fontFamily: skin.display, fontWeight: skin.displayWeight, color: skin.ink };
  const bio = artist.bio ? (
    <p style={{ margin: 0, maxWidth: 440, fontSize: skin.layout === "salon" ? 20 : 17, lineHeight: 1.7, color: skin.muted, whiteSpace: "pre-line" }}>{excerpt(artist.bio, 280)}</p>
  ) : null;

  // ----- Noir & Or : ouverture « cinéma », centrée -----
  if (skin.layout === "capsule") {
    return (
      <section style={wrap({ paddingTop: 40, paddingBottom: 110, display: "flex", flexDirection: "column", alignItems: "center", gap: 44, textAlign: "center" })}>
        {img && (
          <Link href={featuredHref} style={{ display: "block", width: "min(100%, 340px)" }}>
            <img
              src={img}
              alt={featured?.title ?? artist.galleryName}
              style={{ display: "block", width: "100%", maxHeight: 520, objectFit: "contain", background: skin.mat, padding: 18, boxSizing: "border-box", boxShadow: `0 0 0 1px ${withAlpha("#C8AE7D", 0.35)}, 0 60px 110px rgba(0,0,0,0.85)` }}
            />
          </Link>
        )}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span aria-hidden="true" style={{ display: "block", width: 64, height: 1, background: skin.hairline }} />
            <Eyebrow skin={skin}>{countLabel}</Eyebrow>
            <span aria-hidden="true" style={{ display: "block", width: 64, height: 1, background: skin.hairline }} />
          </div>
          <h1 style={{ ...title, fontSize: "clamp(54px,8vw,120px)", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
            {first} {rest && <span style={{ fontStyle: "italic", color: skin.link }}>{rest}</span>}
          </h1>
          {bio}
        </div>
        <a href="#oeuvres" style={btnStyle(skin, "link")}>
          Découvrir la collection
        </a>
      </section>
    );
  }

  // ----- Maison Haussmann : trois panneaux de boiserie -----
  if (skin.layout === "salon") {
    const panel = (flex: string, content: ReactNode, inner: CSSProperties = {}) => (
      <div className="dw-moulure" style={{ flex, minWidth: 0, padding: 10, display: "flex" }}>
        <div className="dw-moulure-int" style={{ flex: 1, padding: "44px 30px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 22, ...inner }}>
          {content}
        </div>
      </div>
    );
    return (
      <section style={wrap({ paddingTop: 52, paddingBottom: 96 })}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "stretch" }}>
          {panel(
            "1 1 300px",
            <>
              <Eyebrow skin={skin}>{countLabel}</Eyebrow>
              <h1 style={{ ...title, fontSize: "clamp(44px,5.2vw,76px)", lineHeight: 1.02 }}>
                {first}
                {rest && (
                  <>
                    <br />
                    <span style={{ fontStyle: "italic", color: skin.link }}>{rest}</span>
                  </>
                )}
              </h1>
              {bio}
            </>
          )}
          {img &&
            panel(
              "1.4 1 420px",
              <>
                <Link href={featuredHref} className="dw-cadre-dore" style={{ display: "block", width: "100%", maxWidth: 380, boxSizing: "border-box" }}>
                  <span className="dw-passe" style={{ display: "block", background: skin.mat, padding: 26 }}>
                    <img src={img} alt={featured?.title ?? artist.galleryName} style={{ display: "block", width: "100%", maxHeight: 520, objectFit: "contain" }} />
                  </span>
                </Link>
                {featured && (
                  <span className="dw-plaque" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "10px 22px", color: skin.ink, textAlign: "center" }}>
                    <span style={{ ...capsStyle(skin, 9) }}>Œuvre phare</span>
                    <span style={{ fontFamily: skin.display, fontStyle: "italic", fontSize: 17 }}>{featured.title}</span>
                    <span style={{ ...capsStyle(skin, 11) }}>{money(featured.priceCents, featured.currency)}</span>
                  </span>
                )}
              </>,
              { alignItems: "center", padding: "52px 28px" }
            )}
          {panel(
            "1 1 300px",
            <>
              <span style={{ fontFamily: skin.display, fontStyle: "italic", fontSize: 28, lineHeight: 1.25 }}>Une galerie comme un salon parisien.</span>
              <p style={{ margin: 0, fontSize: 19, lineHeight: 1.6, color: skin.muted }}>Chaque œuvre est une pièce unique, choisie et signée par l'artiste.</p>
              <div>
                <a href="#oeuvres" style={btnStyle(skin, "primary")}>
                  Voir la collection
                </a>
              </div>
              {artist.has3dAccess && (
                <div>
                  <Link href={`/g/${slug}/visite-3d`} style={btnStyle(skin, "link")}>
                    Entrer dans le salon 3D
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    );
  }

  // ----- Blanc Pur : texte à gauche, œuvre phare seule sur un pan de mur -----
  return (
    <section style={wrap({ paddingTop: 40, paddingBottom: 130, display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 64 })}>
      <div style={{ flex: "1 1 320px", minWidth: 0, display: "flex", flexDirection: "column", gap: 28, paddingBottom: 12 }}>
        <Eyebrow skin={skin}>Galerie · {countLabel}</Eyebrow>
        <h1 style={{ ...title, fontSize: "clamp(52px,7vw,104px)", lineHeight: 0.96, letterSpacing: "-0.01em" }}>
          {first}
          {rest && (
            <>
              <br />
              <span style={{ fontStyle: "italic" }}>{rest}</span>
            </>
          )}
        </h1>
        {bio}
        <div>
          <a href="#oeuvres" style={btnStyle(skin, "link")}>
            Voir les œuvres
          </a>
        </div>
      </div>
      {img && (
        <figure style={{ flex: "1.6 1 480px", minWidth: 0, margin: 0, background: skin.surface, padding: "clamp(40px,7vw,110px) clamp(24px,6vw,96px) clamp(32px,5vw,72px)", display: "flex", flexDirection: "column", alignItems: "center", gap: 40, boxSizing: "border-box" }}>
          <Link href={featuredHref} style={{ display: "block", width: "min(100%, 380px)" }}>
            <img
              src={img}
              alt={featured?.title ?? artist.galleryName}
              style={{ display: "block", width: "100%", maxHeight: 560, objectFit: "contain", background: skin.mat, padding: 22, boxSizing: "border-box", boxShadow: "0 2px 4px rgba(20,18,17,0.06), 0 28px 50px rgba(20,18,17,0.12)" }}
            />
          </Link>
          {featured && (
            <figcaption style={{ alignSelf: "flex-end", minWidth: 190 }}>
              <Cartel skin={skin} kicker="Œuvre phare" title={featured.title} lines={cartelLines(featured)} />
              <p style={{ margin: "6px 0 0 15px", fontSize: 15, fontWeight: 400 }}>{money(featured.priceCents, featured.currency)}</p>
            </figcaption>
          )}
        </figure>
      )}
    </section>
  );
}

// =====================================================================
// La collection
// =====================================================================
function Works({ skin, artist, slug, artworks }: { skin: Skin; artist: any; slug: string; artworks: any[] }) {
  const n = artworks.length;
  const empty = <p style={{ margin: 0, textAlign: "center", fontSize: 15, color: skin.muted }}>{"Cette galerie n'a pas encore d'œuvres publiées."}</p>;
  const h2: CSSProperties = { margin: 0, fontFamily: skin.display, fontWeight: skin.displayWeight, color: skin.ink, lineHeight: 1 };
  const badgeFor = (art: any): ReactNode => (art.model3dUrl ? <ThreeDBadge skin={skin} locked={!artist.has3dAccess} /> : undefined);

  // ----- Noir & Or : une œuvre par rangée, chacune sous son halo -----
  if (skin.layout === "capsule") {
    return (
      <section id="oeuvres" style={{ borderTop: `1px solid ${skin.border}` }}>
        <div style={wrap({ paddingTop: 110, paddingBottom: 120, display: "flex", flexDirection: "column", gap: 120 })}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
            <Eyebrow skin={skin}>La collection</Eyebrow>
            <h2 style={{ ...h2, fontSize: "clamp(40px,4.8vw,68px)" }}>
              {n} {plural(n, "pièce", "pièces")} <span style={{ fontStyle: "italic" }}>{plural(n, "unique", "uniques")}</span>
            </h2>
          </div>
          {n === 0
            ? empty
            : artworks.map((art, i) => {
                const href = `/g/${slug}/${art.id}`;
                return (
                  <article key={art.id} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "40px 80px", flexDirection: i % 2 === 1 ? "row-reverse" : "row" }}>
                    <Link href={href} style={{ flex: "1.2 1 420px", minWidth: 0, display: "block" }}>
                      <ArtworkMedia skin={skin} src={art.imageUrl} alt={art.title} height={600} badge={badgeFor(art)} />
                    </Link>
                    <div style={{ flex: "1 1 320px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
                      <span style={{ fontFamily: skin.display, fontStyle: "italic", fontSize: 22, color: skin.link }}>{roman(i + 1)}.</span>
                      <h3 style={{ ...h2, fontSize: "clamp(36px,3.8vw,54px)", lineHeight: 1.04 }}>{art.title}</h3>
                      {art.description && <p style={{ margin: 0, fontSize: 16, lineHeight: 1.8, color: skin.muted, maxWidth: 420 }}>{excerpt(art.description, 220)}</p>}
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "16px 0", borderTop: `1px solid ${skin.border}`, borderBottom: `1px solid ${skin.border}`, maxWidth: 420, fontSize: 14, color: skin.muted }}>
                        {cartelLines(art).map((l) => (
                          <span key={l}>{l}</span>
                        ))}
                        <span>{art.certificate ? "Pièce unique · certificat d'authenticité" : "Pièce unique"}</span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 28 }}>
                        <span style={{ fontFamily: skin.display, fontSize: 34, color: skin.ink }}>{money(art.priceCents, art.currency)}</span>
                        <Link href={href} style={btnStyle(skin, "link")}>
                          Voir l'œuvre
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
        </div>
      </section>
    );
  }

  // ----- Maison Haussmann : accrochage « salon », cadres dorés et cartels -----
  if (skin.layout === "salon") {
    const heights = [460, 380, 420, 400, 360];
    return (
      <section id="oeuvres" className="dw-mur-profond" style={{ borderTop: `1px solid ${skin.border}`, borderBottom: `1px solid ${skin.border}` }}>
        <div style={wrap({ paddingTop: 96, paddingBottom: 112, display: "flex", flexDirection: "column", gap: 60 })}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
            <Eyebrow skin={skin}>L'accrochage</Eyebrow>
            <h2 style={{ ...h2, fontSize: "clamp(38px,4.4vw,60px)" }}>
              La <span style={{ fontStyle: "italic" }}>collection</span>
            </h2>
            <Ornament skin={skin} />
          </div>
          {n === 0 ? (
            empty
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "56px 44px", alignItems: "center" }}>
              {artworks.map((art, i) => (
                <article key={art.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
                  <Link href={`/g/${slug}/${art.id}`} style={{ display: "block", width: "100%" }}>
                    <ArtworkMedia skin={skin} src={art.imageUrl} alt={art.title} height={heights[i % heights.length]} badge={badgeFor(art)} />
                  </Link>
                  <Cartel skin={skin} title={art.title} lines={cartelLines(art)} price={money(art.priceCents, art.currency)} />
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // ----- Blanc Pur : grille aérée, œuvres posées sur une même ligne -----
  return (
    <section id="oeuvres" style={wrap({ paddingBottom: 140, display: "flex", flexDirection: "column", gap: 64 })}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: 16, borderTop: `1px solid ${skin.ink}`, paddingTop: 22 }}>
        <h2 style={{ ...h2, fontSize: "clamp(38px,4.4vw,64px)" }}>La collection</h2>
        <Eyebrow skin={skin}>
          {String(n).padStart(2, "0")} {plural(n, "œuvre", "œuvres")} · {plural(n, "pièce unique", "pièces uniques")}
        </Eyebrow>
      </div>
      {n === 0 ? (
        empty
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "88px 64px", alignItems: "end" }}>
          {artworks.map((art, i) => (
            <article key={art.id} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <Link href={`/g/${slug}/${art.id}`} style={{ display: "block" }}>
                <ArtworkMedia skin={skin} src={art.imageUrl} alt={art.title} height={440} align="end" badge={badgeFor(art)} />
              </Link>
              <Cartel skin={skin} kicker={`N° ${String(i + 1).padStart(2, "0")}`} title={art.title} lines={cartelLines(art)} price={money(art.priceCents, art.currency)} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

// =====================================================================
// Bandeau « Visite 3D » (artistes avec accès 3D)
// =====================================================================
const VISIT_COPY: Record<Skin["layout"], { title: string; italic: string; text: string; cta: string }> = {
  swiss: {
    title: "Chaque œuvre,",
    italic: "à sa vraie taille.",
    text: "Entrez dans la salle blanche, approchez-vous d'une œuvre et imaginez-la chez vous.",
    cta: "Entrer dans la galerie",
  },
  capsule: {
    title: "Entrez.",
    italic: "La lumière vous attend.",
    text: "Chaque œuvre dans son halo, comme un soir de vernissage. Approchez-vous, prenez votre temps.",
    cta: "Entrer dans la salle",
  },
  salon: {
    title: "Poussez la porte",
    italic: "du salon.",
    text: "Moulures, parquet ciré, lumière d'un lustre : approchez-vous de chaque œuvre comme dans un appartement parisien.",
    cta: "Entrer dans le salon",
  },
};

function Visit3D({ skin, slug }: { skin: Skin; slug: string }) {
  const c = VISIT_COPY[skin.layout];
  const dark = skin.layout !== "swiss";
  const image =
    skin.layout === "salon" ? (
      <div className="dw-cadre-dore" style={{ flex: "1.2 1 400px", minWidth: 0, maxWidth: 560, boxSizing: "border-box", padding: 12 }}>
        <img src={skin.roomImage} alt="La salle de la visite 3D" style={{ display: "block", width: "100%", aspectRatio: "4 / 5", objectFit: "cover" }} />
      </div>
    ) : (
      <img
        src={skin.roomImage}
        alt="La salle de la visite 3D"
        style={{ flex: "1.2 1 400px", minWidth: 0, width: "100%", maxWidth: 580, aspectRatio: "4 / 5", objectFit: "cover", display: "block", boxShadow: dark ? `0 0 0 1px ${withAlpha("#C8AE7D", 0.3)}, 0 50px 90px rgba(0,0,0,0.6)` : "none" }}
      />
    );
  const ctaStyle: CSSProperties =
    skin.layout === "swiss"
      ? btnStyle(skin, "outline")
      : { ...btnStyle(skin, "primary"), background: skin.layout === "salon" ? "#D9BC7A" : skin.accent, borderColor: skin.layout === "salon" ? "#D9BC7A" : skin.accent, color: skin.band };

  return (
    <section style={{ background: skin.band, color: skin.bandInk, borderTop: dark ? `1px solid ${skin.border}` : "none", borderBottom: dark ? `1px solid ${skin.border}` : "none" }}>
      <div style={wrap({ paddingTop: 110, paddingBottom: 110, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "48px 80px", flexDirection: skin.layout === "swiss" ? "row" : "row-reverse" })}>
        {image}
        <div style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>
          <Eyebrow skin={skin} color={skin.layout === "salon" ? "#D9BC7A" : undefined}>
            Visite 3D
          </Eyebrow>
          <h2 style={{ margin: 0, fontFamily: skin.display, fontWeight: skin.displayWeight, fontSize: "clamp(38px,4.4vw,62px)", lineHeight: 1.04 }}>
            {c.title}
            <br />
            <span style={{ fontStyle: "italic", color: dark ? (skin.layout === "salon" ? "#D9BC7A" : skin.link) : "inherit" }}>{c.italic}</span>
          </h2>
          <p style={{ margin: 0, maxWidth: 420, fontSize: skin.layout === "salon" ? 20 : 17, lineHeight: 1.7, color: dark ? withAlpha(skin.bandInk.startsWith("#") ? skin.bandInk : "#F2EBDD", 0.82) : skin.muted }}>{c.text}</p>
          <div>
            <Link href={`/g/${slug}/visite-3d`} style={ctaStyle}>
              {c.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Le mot de l'artiste (bio + signature)
// =====================================================================
function ArtistWord({ skin, artist, slug }: { skin: Skin; artist: any; slug: string }) {
  if (!artist.bio && !artist.signatureUrl) return null;
  const dark = skin.layout === "capsule";
  return (
    <section style={wrap({ maxWidth: 820, paddingTop: 130, paddingBottom: 110, display: "flex", flexDirection: "column", alignItems: "center", gap: 28, textAlign: "center" })}>
      <Eyebrow skin={skin}>Le mot de l'artiste</Eyebrow>
      {artist.bio && (
        <p
          style={{
            margin: 0,
            fontFamily: skin.layout === "salon" ? skin.body : skin.display,
            fontStyle: dark ? "italic" : "normal",
            fontSize: skin.layout === "salon" ? 22 : "clamp(22px,2.6vw,32px)",
            lineHeight: 1.5,
            color: skin.ink,
            whiteSpace: "pre-line",
          }}
        >
          {excerpt(artist.bio, 420)}
        </p>
      )}
      {artist.signatureUrl ? (
        // Les signatures sont en général à l'encre foncée : sur fond sombre,
        // on les pose sur un cartouche ivoire pour qu'elles restent lisibles.
        <span style={{ display: "inline-block", padding: dark ? "14px 28px" : 0, background: dark ? skin.mat : "transparent" }}>
          <img src={artist.signatureUrl} alt={`Signature de ${artist.galleryName}`} style={{ display: "block", height: 64, objectFit: "contain" }} />
        </span>
      ) : (
        <span style={{ fontFamily: skin.display, fontStyle: "italic", fontSize: 34, color: skin.link }}>{artist.galleryName}</span>
      )}
      <Link href={`/g/${slug}/a-propos`} style={btnStyle(skin, "link")}>
        Découvrir l'artiste
      </Link>
    </section>
  );
}

// =====================================================================
// Garanties
// =====================================================================
function Guarantees({ skin, artworks }: { skin: Skin; artworks: any[] }) {
  const items: [string, string][] = [];
  if (artworks.some((a) => a.certificate)) items.push(["Certificat d'authenticité", "Numéroté, vérifiable en ligne"]);
  items.push(["Livraison incluse", "Expédiée par l'artiste"]);
  items.push(["Paiement sécurisé", "Directement auprès de l'artiste"]);

  const title: CSSProperties =
    skin.layout === "salon" ? { ...capsStyle(skin, 15), color: skin.ink } : { fontFamily: skin.display, fontSize: 22, color: skin.ink };

  return (
    <section style={wrap({ paddingBottom: 64 })}>
      {skin.layout === "salon" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 20 }}>
          {items.map(([t, d]) => (
            <div key={t} className="dw-moulure" style={{ padding: 8 }}>
              <div className="dw-moulure-int" style={{ padding: "28px 22px", textAlign: "center", display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={title}>{t}</span>
                <span style={{ fontSize: 17, color: skin.muted }}>{d}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ borderTop: `1px solid ${skin.border}`, borderBottom: `1px solid ${skin.border}`, padding: "34px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: 28, textAlign: skin.layout === "capsule" ? "center" : "left" }}>
          {items.map(([t, d]) => (
            <div key={t} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={title}>{t}</span>
              <span style={{ fontSize: 14, color: skin.muted }}>{d}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
