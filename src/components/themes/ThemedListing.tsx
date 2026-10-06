"use client";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Skin } from "./skins";
import { withAlpha } from "./skins";
import {
  PAD,
  ThemedPage,
  ThemedHeader,
  ThemedFooter,
  ArtworkMedia,
  ThreeDBadge,
  btnStyle,
  money,
  roman,
} from "./ThemedChrome";

function plural(n: number, one: string, many: string) {
  return n > 1 ? many : one;
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
  return (
    <ThemedPage skin={skin}>
      <ThemedHeader skin={skin} slug={slug} galleryName={artist.galleryName} cartCount={cartCount} />
      <Hero skin={skin} artist={artist} count={artworks.length} />
      <Works skin={skin} artist={artist} slug={slug} artworks={artworks} />
      <ThemedFooter skin={skin} slug={slug} />
    </ThemedPage>
  );
}

// =====================================================================
// Présentation de la galerie
// =====================================================================
function Hero({ skin, artist, count }: { skin: Skin; artist: any; count: number }) {
  const words = String(artist.galleryName ?? "").trim().split(/\s+/);
  const first = words[0] ?? "";
  const rest = words.slice(1).join(" ");
  const eyebrow = count > 0 ? `${count} ${plural(count, "pièce unique", "pièces uniques")}` : "Galerie d'art";
  const img: string | null = artist.artworks?.[0]?.imageUrl || artist.avatarUrl || null;

  const title: CSSProperties = {
    margin: 0,
    fontFamily: skin.display,
    fontWeight: skin.displayWeight,
    fontStyle: skin.displayItalic ? "italic" : "normal",
    color: skin.ink,
  };
  const bio = artist.bio ? (
    <p style={{ margin: 0, maxWidth: 500, fontSize: 18, color: skin.muted }}>{artist.bio}</p>
  ) : null;
  const cta = (
    <a href="#oeuvres" style={btnStyle(skin)}>
      Découvrir les œuvres
    </a>
  );
  const caps: CSSProperties = {
    margin: 0,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: skin.link,
  };
  const colLeft: CSSProperties = { minWidth: 0, display: "flex", flexDirection: "column", gap: 28 };

  switch (skin.layout) {
    // ----- Atelier Sombre : titre avec pastille, carte inclinée -----
    case "bento":
      return (
        <section style={{ display: "flex", flexWrap: "wrap", gap: "48px 56px", alignItems: "center", padding: `48px ${PAD} 72px` }}>
          <div style={{ ...colLeft, flex: "1.3 1 420px" }}>
            <p style={{ margin: 0, alignSelf: "flex-start", padding: "6px 16px", borderRadius: 999, border: `1px solid ${skin.decor}`, color: skin.decor, fontSize: 13, fontWeight: 700 }}>
              {eyebrow}
            </p>
            <h1 style={{ ...title, fontSize: "clamp(52px,8vw,120px)", lineHeight: 0.95, letterSpacing: "-0.04em" }}>
              {first}
              {rest && (
                <>
                  <br />
                  <span style={{ display: "inline-block", marginTop: 8, padding: "0 0.22em 0.06em", border: `3px solid ${skin.link}`, borderRadius: 999, color: skin.link }}>
                    {rest}
                  </span>
                </>
              )}
            </h1>
            {bio}
            <div>{cta}</div>
          </div>
          {img && (
            <div style={{ flex: "1 1 320px", minWidth: 0, display: "flex", justifyContent: "center", padding: 28 }}>
              <div style={{ position: "relative", width: "min(100%,360px)" }}>
                <div style={{ transform: "rotate(-3deg)", background: skin.surface, border: `1px solid ${skin.border}`, borderRadius: 28, padding: 14, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
                  <div style={{ height: 470, borderRadius: 18, overflow: "hidden", background: skin.media }}>
                    <img src={img} alt={artist.galleryName} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                </div>
                {count > 0 && (
                  <div style={{ position: "absolute", right: -20, top: -26, width: 108, height: 108, borderRadius: "50%", background: skin.decor, color: skin.bg, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: skin.display, fontWeight: 800, fontSize: 16, lineHeight: 1.1, transform: "rotate(10deg)" }}>
                    Pièce
                    <br />
                    unique
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      );

    // ----- Noir & Or : titre à gauche, grande ovale à droite -----
    case "capsule":
      return (
        <section style={{ display: "flex", flexWrap: "wrap", gap: 56, alignItems: "center", padding: `56px ${PAD} 104px` }}>
          <div style={{ ...colLeft, flex: "1.2 1 420px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ display: "block", width: 44, height: 1, background: skin.decor }} />
              <span style={{ ...caps, color: skin.decor, fontWeight: 500 }}>{eyebrow}</span>
            </div>
            <h1 style={{ ...title, fontSize: "clamp(54px,8vw,124px)", lineHeight: 1, letterSpacing: "-0.01em" }}>
              {first}
              {rest && (
                <>
                  <br />
                  <span style={{ color: skin.decor }}>{rest}</span>
                </>
              )}
            </h1>
            {bio}
            <div>{cta}</div>
          </div>
          {img && (
            <div style={{ flex: "1 1 340px", minWidth: 0, display: "flex", justifyContent: "center", padding: 28 }}>
              <div style={{ position: "relative", width: "min(100%,380px)", height: 540 }}>
                <div style={{ position: "absolute", top: -16, right: -16, bottom: -16, left: -16, borderRadius: 999, border: `1px solid ${withAlpha(skin.decor, 0.55)}` }} />
                <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, borderRadius: 999, overflow: "hidden", background: skin.surface }}>
                  <img src={img} alt={artist.galleryName} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                {count > 0 && (
                  <div style={{ position: "absolute", left: -36, bottom: 48, width: 122, height: 122, borderRadius: "50%", background: skin.decor, color: skin.onAccent, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: skin.display, fontSize: 15, lineHeight: 1.15 }}>
                    <span style={{ fontSize: 36, lineHeight: 1 }}>{count}</span>
                    {plural(count, "pièce", "pièces")}
                    <br />
                    {plural(count, "unique", "uniques")}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      );

    // ----- Terre & Argile : arche et disque ocre -----
    case "arch":
      return (
        <section style={{ display: "flex", flexWrap: "wrap", gap: 56, alignItems: "center", padding: `80px ${PAD} 96px` }}>
          <div style={{ ...colLeft, flex: "1.2 1 400px" }}>
            <p style={caps}>{eyebrow}</p>
            <h1 style={{ ...title, fontSize: "clamp(50px,7.5vw,104px)", lineHeight: 1, letterSpacing: "-0.01em" }}>
              {first}
              {rest && (
                <>
                  <br />
                  {rest}
                </>
              )}
            </h1>
            {bio}
            <div>{cta}</div>
          </div>
          {img && (
            <div style={{ flex: "1 1 340px", minWidth: 0, display: "flex", justifyContent: "center" }}>
              <div style={{ position: "relative", width: "min(100%,380px)", height: 500 }}>
                <div style={{ position: "absolute", right: -28, top: -28, width: 190, height: 190, borderRadius: "50%", background: skin.decor, opacity: 0.85 }} />
                <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, borderRadius: "999px 999px 0 0", overflow: "hidden", background: skin.surface }}>
                  <img src={img} alt={artist.galleryName} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              </div>
            </div>
          )}
        </section>
      );

    // ----- Blanc Pur : typographie géante, filets noirs -----
    case "swiss":
      return (
        <section style={{ padding: `88px ${PAD} 72px` }}>
          <h1 style={{ ...title, fontSize: "clamp(56px,12vw,184px)", lineHeight: 0.88, letterSpacing: "-0.045em" }}>
            {first}
            {rest && (
              <>
                <br />
                {rest}
              </>
            )}
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "32px 64px", marginTop: 64, paddingTop: 24, borderTop: `1px solid ${skin.ink}` }}>
            <p style={{ flex: "1 1 220px", minWidth: 0, margin: 0, fontFamily: skin.mono, fontSize: 13, lineHeight: 1.7, textTransform: "uppercase", letterSpacing: "0.04em", color: skin.muted }}>
              Galerie
              <br />
              {eyebrow}
            </p>
            <div style={{ flex: "2 1 360px", minWidth: 0, maxWidth: 640, display: "flex", flexDirection: "column", gap: 28 }}>
              {artist.bio && <p style={{ margin: 0, fontSize: 22, lineHeight: 1.4, fontWeight: 300 }}>{artist.bio}</p>}
              <div>{cta}</div>
            </div>
          </div>
        </section>
      );

    // ----- Sauge Botanique : bandeau arrondi -----
    case "soft":
      return (
        <section style={{ margin: "24px clamp(16px,3vw,40px) 0", borderRadius: 36, background: skin.media, padding: "88px clamp(24px,5vw,72px)", display: "flex", flexWrap: "wrap", gap: 40, alignItems: "center" }}>
          <div style={{ ...colLeft, flex: "1.3 1 400px", gap: 26 }}>
            <p style={{ ...caps, letterSpacing: "0.12em", fontWeight: 700 }}>{eyebrow}</p>
            <h1 style={{ ...title, fontSize: "clamp(46px,6.4vw,92px)", lineHeight: 1.02, letterSpacing: "-0.01em" }}>
              {first}
              {rest && (
                <>
                  {" "}
                  <span style={{ fontStyle: "italic", color: skin.link }}>{rest}</span>
                </>
              )}
            </h1>
            {bio}
            <div>{cta}</div>
          </div>
          {img && (
            <div style={{ flex: "1 1 300px", minWidth: 0, display: "flex", justifyContent: "center" }}>
              <div style={{ width: "min(100%,340px)", height: 430, borderRadius: 28, background: skin.surface, border: `1px solid ${skin.border}`, padding: 18, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 40px rgba(38,48,42,0.12)" }}>
                <img src={img} alt={artist.galleryName} style={{ maxWidth: "100%", maxHeight: "100%", display: "block", borderRadius: 14 }} />
              </div>
            </div>
          )}
        </section>
      );

    // ----- Maison Haussmann : œuvre encadrée + titre à ornement -----
    case "salon":
    default:
      return (
        <section style={{ display: "flex", flexWrap: "wrap", gap: 56, alignItems: "center", padding: `72px ${PAD} 96px` }}>
          {img && (
            <div style={{ flex: "1 1 360px", minWidth: 0, display: "flex", justifyContent: "center", padding: 14 }}>
              <div style={{ outline: `1px solid ${skin.border}`, outlineOffset: 12, width: "min(100%,400px)" }}>
                <ArtworkMedia skin={skin} src={img} alt={artist.galleryName} height={560} />
              </div>
            </div>
          )}
          <div style={{ ...colLeft, flex: "1.1 1 400px", gap: 26 }}>
            <p style={caps}>{eyebrow}</p>
            <h1 style={{ ...title, fontSize: "clamp(54px,7.6vw,112px)", lineHeight: 0.98, letterSpacing: "-0.01em" }}>
              {first}
              {rest && (
                <>
                  <br />
                  <span style={{ fontStyle: "italic", color: skin.link }}>{rest}</span>
                </>
              )}
            </h1>
            <Divider skin={skin} />
            {bio}
            <div>{cta}</div>
          </div>
        </section>
      );
  }
}

function Divider({ skin }: { skin: Skin }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, maxWidth: 420 }}>
      <span style={{ flex: 1, height: 1, background: skin.decor }} />
      <svg width="14" height="14" viewBox="0 0 24 24" fill={skin.decor} aria-hidden="true">
        <path d="M12 1l11 11-11 11L1 12 12 1Z" />
      </svg>
      <span style={{ flex: 1, height: 1, background: skin.decor }} />
    </div>
  );
}

// =====================================================================
// Grille des œuvres
// =====================================================================
function Works({ skin, artist, slug, artworks }: { skin: Skin; artist: any; slug: string; artworks: any[] }) {
  const n = artworks.length;
  const countLabel = `${n} ${plural(n, "pièce unique", "pièces uniques")}`;
  const cards = artworks.map((art, i) => (
    <WorkCard key={art.id} skin={skin} artist={artist} slug={slug} art={art} index={i} />
  ));
  const empty = (
    <p style={{ textAlign: "center", fontSize: 15, color: skin.muted }}>
      {"Cette galerie n'a pas encore d'œuvres publiées."}
    </p>
  );
  const h2: CSSProperties = { margin: 0, fontFamily: skin.display, fontWeight: skin.displayWeight, color: skin.ink };
  const grid = (min: number, gap: string, align: CSSProperties["alignItems"]): CSSProperties => ({
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))`,
    gap,
    alignItems: align,
  });

  switch (skin.layout) {
    case "bento":
      return (
        <section id="oeuvres" style={{ padding: `8px ${PAD} 88px` }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 28 }}>
            <h2 style={{ ...h2, fontSize: 42, letterSpacing: "-0.03em" }}>Les œuvres</h2>
            <span style={{ padding: "7px 16px", borderRadius: 999, background: skin.surface, border: `1px solid ${skin.border}`, color: skin.muted, fontSize: 14, fontWeight: 700 }}>
              {countLabel}
            </span>
          </div>
          {n === 0 ? empty : <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "stretch" }}>{cards}</div>}
        </section>
      );

    case "capsule":
      return (
        <section id="oeuvres" style={{ padding: `0 ${PAD} 104px` }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20, marginBottom: 48 }}>
            <h2 style={{ ...h2, fontSize: 46 }}>Les œuvres</h2>
            <span style={{ flex: "1 1 80px", height: 1, background: withAlpha(skin.decor, 0.4) }} />
            <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: skin.muted }}>{countLabel}</span>
          </div>
          {n === 0 ? empty : <div style={grid(210, "44px 28px", "start")}>{cards}</div>}
        </section>
      );

    case "arch":
      return (
        <section id="oeuvres" style={{ padding: `72px ${PAD} 112px`, background: skin.surface }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 44 }}>
            <h2 style={{ ...h2, fontSize: 38 }}>Les œuvres</h2>
            <span style={{ color: skin.muted, fontSize: 15 }}>{countLabel}</span>
          </div>
          {n === 0 ? empty : <div style={grid(210, "40px 28px", "start")}>{cards}</div>}
        </section>
      );

    case "swiss":
      return (
        <section id="oeuvres" style={{ padding: `0 ${PAD} 104px` }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: 12, padding: "20px 0", borderTop: `1px solid ${skin.ink}`, borderBottom: `1px solid ${skin.border}`, marginBottom: 40 }}>
            <h2 style={{ ...h2, fontWeight: 500, fontSize: 20 }}>Les œuvres</h2>
            <span style={{ fontFamily: skin.mono, fontSize: 13, color: skin.muted }}>
              {String(n).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
          </div>
          {n === 0 ? empty : <div style={grid(220, "48px 24px", "start")}>{cards}</div>}
        </section>
      );

    case "soft":
      return (
        <section id="oeuvres" style={{ padding: "88px clamp(16px,3vw,40px) 96px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: 12, margin: "0 8px 36px" }}>
            <h2 style={{ ...h2, fontWeight: 500, fontSize: 38 }}>Les œuvres</h2>
            <span style={{ color: skin.muted, fontSize: 15 }}>{countLabel}</span>
          </div>
          {n === 0 ? empty : <div style={grid(220, "24px", "start")}>{cards}</div>}
        </section>
      );

    case "salon":
    default:
      return (
        <section id="oeuvres" style={{ padding: `72px ${PAD} 112px`, background: skin.surface, borderTop: `1px solid ${skin.border}`, borderBottom: `1px solid ${skin.border}` }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 56, textAlign: "center" }}>
            <h2 style={{ ...h2, fontStyle: "italic", fontSize: 48 }}>Le Salon</h2>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: skin.muted }}>{countLabel}</span>
          </div>
          {n === 0 ? empty : <div style={grid(210, "44px 32px", "end")}>{cards}</div>}
        </section>
      );
  }
}

function WorkCard({ skin, artist, slug, art, index }: { skin: Skin; artist: any; slug: string; art: any; index: number }) {
  const href = `/g/${slug}/${art.id}`;
  const price = money(art.priceCents, art.currency);
  const num = String(index + 1).padStart(2, "0");
  const badge: ReactNode = art.model3dUrl ? <ThreeDBadge skin={skin} locked={!artist.has3dAccess} /> : undefined;
  const link: CSSProperties = { display: "block", textDecoration: "none", color: "inherit" };

  switch (skin.layout) {
    case "bento": {
      const basis = [430, 300, 300, 380, 360][index % 5];
      const h = [420, 420, 420, 320, 320][index % 5];
      return (
        <Link
          href={href}
          style={{ ...link, flex: `1 1 ${basis}px`, minWidth: 0, display: "flex", flexDirection: "column", borderRadius: skin.radius, background: skin.surface, border: `1px solid ${skin.border}`, padding: 14, boxSizing: "border-box" }}
        >
          <ArtworkMedia skin={skin} src={art.imageUrl} alt={art.title} height={h} badge={badge} />
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "16px 8px 6px" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "baseline", minWidth: 0 }}>
              <span style={{ fontFamily: skin.display, fontWeight: 800, fontSize: 15, color: skin.decor }}>{num}</span>
              <div style={{ fontFamily: skin.display, fontWeight: 700, fontSize: 20, lineHeight: 1.2 }}>{art.title}</div>
            </div>
            <span style={{ padding: "5px 14px", borderRadius: 999, border: `1px solid ${skin.accent}`, color: skin.link, fontWeight: 800, fontSize: 14, whiteSpace: "nowrap" }}>
              {price}
            </span>
          </div>
        </Link>
      );
    }

    case "capsule":
      return (
        <Link href={href} style={link}>
          <ArtworkMedia skin={skin} src={art.imageUrl} alt={art.title} height={430} badge={badge} />
          <div style={{ display: "flex", gap: 12, alignItems: "baseline", justifyContent: "space-between", padding: "20px 14px 0" }}>
            <div style={{ fontFamily: skin.display, fontSize: 21, lineHeight: 1.2 }}>{art.title}</div>
            <div style={{ fontFamily: skin.display, fontSize: 18, color: skin.decor, whiteSpace: "nowrap" }}>{price}</div>
          </div>
        </Link>
      );

    case "arch":
      return (
        <Link href={href} style={{ ...link, marginTop: index % 2 === 1 ? 44 : 0 }}>
          <ArtworkMedia skin={skin} src={art.imageUrl} alt={art.title} height={360} badge={badge} />
          <div style={{ display: "flex", gap: 12, alignItems: "baseline", justifyContent: "space-between", paddingTop: 18 }}>
            <div style={{ fontFamily: skin.display, fontSize: 20, lineHeight: 1.2 }}>{art.title}</div>
            <div style={{ fontWeight: 600, fontSize: 16, color: skin.link, whiteSpace: "nowrap" }}>{price}</div>
          </div>
        </Link>
      );

    case "swiss":
      return (
        <Link href={href} style={link}>
          <ArtworkMedia skin={skin} src={art.imageUrl} alt={art.title} height={360} badge={badge} />
          <div style={{ display: "flex", gap: 12, justifyContent: "space-between", paddingTop: 14, fontFamily: skin.mono, fontSize: 13, lineHeight: 1.5 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: skin.muted }}>{num}</div>
              <div style={{ color: skin.ink, fontWeight: 500 }}>{art.title}</div>
            </div>
            <div style={{ color: skin.ink, fontWeight: 500, whiteSpace: "nowrap" }}>{price}</div>
          </div>
        </Link>
      );

    case "soft":
      return (
        <div style={{ background: skin.surface, border: `1px solid ${skin.border}`, borderRadius: skin.radius, padding: 14 }}>
          <Link href={href} style={link}>
            <ArtworkMedia skin={skin} src={art.imageUrl} alt={art.title} height={320} badge={badge} />
          </Link>
          <div style={{ padding: "16px 8px 6px" }}>
            <div style={{ fontFamily: skin.display, fontWeight: 500, fontSize: 21, lineHeight: 1.2 }}>{art.title}</div>
            <div style={{ marginTop: 2, fontSize: 15, fontWeight: 700, color: skin.link }}>{price}</div>
          </div>
        </div>
      );

    case "salon":
    default: {
      const h = [400, 340, 440, 360, 400][index % 5];
      return (
        <Link href={href} style={link}>
          <ArtworkMedia skin={skin} src={art.imageUrl} alt={art.title} height={h} badge={badge} />
          <div style={{ paddingTop: 18, textAlign: "center" }}>
            <div style={{ fontFamily: skin.display, fontWeight: 600, fontSize: 15, letterSpacing: "0.2em", color: skin.link }}>{roman(index + 1)}</div>
            <div style={{ fontFamily: skin.display, fontStyle: "italic", fontWeight: 500, fontSize: 24, lineHeight: 1.15 }}>{art.title}</div>
            <div style={{ marginTop: 8, fontWeight: 600, fontSize: 16 }}>{price}</div>
          </div>
        </Link>
      );
    }
  }
}
