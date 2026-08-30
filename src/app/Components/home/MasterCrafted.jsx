"use client";

import { useEffect, useState } from "react";
import { Reveal, RevealSide } from "../motion/Reveal";
import { API, imgUrl } from "../../lib/api";

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY = "'Inter', sans-serif";

const FALLBACK_COPY = {
  eyebrow: "Heritage Craft",
  headingMain: "Masterfully",
  headingAccent: "crafted in India.",
  buttonLabel: "Explore Now",
  buttonHref: "/products",
};

const col1ImagesFallback = [
    { src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80", alt: "Diamond pendant" },
    { src: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80", alt: "Gemstone necklace" },
    { src: "./master2.png", alt: "Floral ring" },
    { src: "./master1.png", alt: "Gold cuff" },
    { src: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&q=80", alt: "Gold hoops" },
    { src: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80", alt: "Layered necklaces" },
    { src: "./other.png", alt: "Diamond ring" },
    { src: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", alt: "Jewellery flat lay" },
];

const col2ImagesFallback = [
    { src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", alt: "Pearl necklace" },
    { src: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80", alt: "Kundan brooch" },
    { src: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80", alt: "Gold bracelet" },
    { src: "https://images.unsplash.com/photo-1561828995-aa79a2db86dd?w=600&q=80", alt: "Sapphire earrings" },
    { src: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80", alt: "Pearl studs" },
    { src: "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=600&q=80", alt: "Gold ring" },
    { src: "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=600&q=80", alt: "Emerald pendant" },
    { src: "https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?w=600&q=80", alt: "Vintage brooch" },
];

const col3ImagesFallback = [
    { src: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80", alt: "Gold chain" },
    { src: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&q=80", alt: "Diamond studs" },
    { src: "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=600&q=80", alt: "Ruby ring" },
    { src: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80", alt: "Gold bangles" },
    { src: "https://images.unsplash.com/photo-1620656798579-1984d9e87df7?w=600&q=80", alt: "Necklace set" },
    { src: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&q=80", alt: "Statement earrings" },
    { src: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80", alt: "Bridal set" },
    { src: "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=600&q=80", alt: "Pendant close up" },
];

const col4ImagesFallback = [
    { src: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80", alt: "Bridal set" },
    { src: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80", alt: "Gold bangles" },
    { src: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&q=80", alt: "Diamond studs" },
    { src: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&q=80", alt: "Statement earrings" },
    { src: "https://images.unsplash.com/photo-1620656798579-1984d9e87df7?w=600&q=80", alt: "Necklace set" },
    { src: "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=600&q=80", alt: "Ruby ring" },
    { src: "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=600&q=80", alt: "Pendant close up" },
    { src: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80", alt: "Gemstone necklace" },
];

const FALLBACK_COLUMNS = [col1ImagesFallback, col2ImagesFallback, col3ImagesFallback, col4ImagesFallback];
const DIRECTIONS = ["up", "down", "up", "down"];
// Same responsive visibility as the original hardcoded layout: col 3 hides below sm, col 4 hides below lg.
const COL_VISIBILITY = ["", "", "hidden sm:block", "hidden lg:block"];

const IMG_HEIGHT = 280;
const GAP = 12;

/** Round-robins a flat, admin-ordered image list into 4 columns. */
function distributeIntoColumns(images) {
    const cols = [[], [], [], []];
    if (images.length === 0) return cols;
    if (images.length < 4) {
        // too few to give each column unique content — repeat the set so no column is empty
        for (let i = 0; i < 4; i++) cols[i] = [...images];
        return cols;
    }
    images.forEach((img, i) => cols[i % 4].push(img));
    return cols;
}

export default function MasterCrafted() {
    const [copy, setCopy] = useState(FALLBACK_COPY);
    const [columns, setColumns] = useState(FALLBACK_COLUMNS);

    // Pull admin-managed content; silently keep the built-in fallback if none exists yet
    // or the API is unreachable. Manage this section at /admin/heritage.
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`${API}/heritage`, { cache: "no-store" });
                const json = await res.json();
                const doc = json?.data;
                if (cancelled || !doc) return;

                setCopy({
                    eyebrow: doc.eyebrow || FALLBACK_COPY.eyebrow,
                    headingMain: doc.headingMain || FALLBACK_COPY.headingMain,
                    headingAccent: doc.headingAccent || FALLBACK_COPY.headingAccent,
                    buttonLabel: doc.buttonLabel || FALLBACK_COPY.buttonLabel,
                    buttonHref: doc.buttonHref || FALLBACK_COPY.buttonHref,
                });

                if (Array.isArray(doc.images) && doc.images.length >= 1) {
                    const sorted = [...doc.images].sort((a, b) => a.sortOrder - b.sortOrder);
                    const mapped = sorted.map((im) => ({ src: imgUrl(im.url), alt: im.alt || "" }));
                    setColumns(distributeIntoColumns(mapped));
                }
            } catch {
                // keep fallback
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const tracks = columns.map((col) => [...col, ...col]);
    const totals = columns.map((col) => col.length * (IMG_HEIGHT + GAP));

    return (
        <section
            style={{ fontFamily: BODY }}
            className="relative w-full px-4 sm:px-8 py-5 sm:py-8 overflow-hidden bg-[#faf7f2] transition-colors duration-300"
        >
            <style>{`
        ${columns.map((col, i) => `
        @keyframes mc-scroll-${i} {
          0%   { transform: translateY(${DIRECTIONS[i] === "down" ? `-${totals[i]}px` : "0"}); }
          100% { transform: translateY(${DIRECTIONS[i] === "down" ? "0" : `-${totals[i]}px`}); }
        }
        .mc-col-${i} { animation: mc-scroll-${i} ${col.length * 3}s linear infinite; }
        `).join("\n")}
      `}</style>

            <div className="max-w-7xl mx-auto">

                {/* Small eyebrow + headline, no repeated category cards */}
                <div className="flex items-end justify-between flex-wrap gap-3 mb-4 sm:mb-6">
                    <RevealSide from="left">
                        <div className="flex items-center gap-3 mb-2">
                            <span style={{ display: "block", width: 24, height: 1 }} className="bg-[#a67c2e] dark:bg-[#c9a96e]" />
                            <span style={{ fontFamily: BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase" }} className="text-[#a67c2e] dark:text-[#c9a96e]">
                                {copy.eyebrow}
                            </span>
                        </div>
                        <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1, margin: 0, letterSpacing: "-0.02em" }} className="text-[#2c2c2c] dark:text-[#e8d9c4]">
                            {copy.headingMain} <span style={{ fontWeight: 400, fontStyle: "italic", color: "#a67c2e" }}>{copy.headingAccent}</span>
                        </h2>
                    </RevealSide>
                    <Reveal as="a" href={copy.buttonHref || "/products"} delay={0.15}
                        className="bg-[#1a0c06] dark:bg-[#c9a96e] text-[#fff]"
                        style={{ fontFamily: BODY, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, borderRadius: 4, padding: "11px 22px", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {copy.buttonLabel}
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Reveal>
                </div>

                {/* Full-width gallery — four auto-scrolling columns, no category labels */}
                <div className="flex gap-3" style={{ height: "80vh", overflow: "hidden" }}>
                    {tracks.map((track, colIdx) => (
                        <div key={colIdx} className={`flex-1 overflow-hidden ${COL_VISIBILITY[colIdx]}`}>
                            <div className={`mc-col-${colIdx} flex flex-col`} style={{ gap: `${GAP}px` }}>
                                {track.map((img, i) => (
                                    <div key={i} style={{ width: "100%", height: `${IMG_HEIGHT}px`, flexShrink: 0, borderRadius: 6, overflow: "hidden" }}>
                                        <img src={img.src} alt={img.alt}
                                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}