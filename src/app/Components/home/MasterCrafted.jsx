"use client";

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY = "'Inter', sans-serif";

// dinamond, floral, gold

const col1Images = [
    { src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80", alt: "Diamond pendant" },
    { src: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80", alt: "Gemstone necklace" },
    { src: "./master2.png", alt: "Floral ring" },
    { src: "./master1.png", alt: "Gold cuff" },
    { src: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&q=80", alt: "Gold hoops" },
    { src: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80", alt: "Layered necklaces" },
    { src: "./other.png", alt: "Diamond ring" },
    { src: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", alt: "Jewellery flat lay" },
];

const col2Images = [
    { src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", alt: "Pearl necklace" },
    { src: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80", alt: "Kundan brooch" },
    { src: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80", alt: "Gold bracelet" },
    { src: "https://images.unsplash.com/photo-1561828995-aa79a2db86dd?w=600&q=80", alt: "Sapphire earrings" },
    { src: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80", alt: "Pearl studs" },
    { src: "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=600&q=80", alt: "Gold ring" },
    { src: "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=600&q=80", alt: "Emerald pendant" },
    { src: "https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?w=600&q=80", alt: "Vintage brooch" },
];

const track1 = [...col1Images, ...col1Images];
const track2 = [...col2Images, ...col2Images];

const IMG_HEIGHT = 280;
const GAP = 12;
const TOTAL = col1Images.length * (IMG_HEIGHT + GAP);

export default function MasterCrafted() {
    return (
        <section
            style={{ fontFamily: BODY }}
            className="relative w-full px-4 sm:px-8 py-5 sm:py-8 overflow-hidden bg-[#faf7f2] transition-colors duration-300"
        >

            <style>{`
        @keyframes scrollUp {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-${TOTAL}px); }
        }
        @keyframes scrollDown {
          0%   { transform: translateY(-${TOTAL}px); }
          100% { transform: translateY(0); }
        }
        .col-up   { animation: scrollUp   ${col1Images.length * 3}s linear infinite; }
        .col-down { animation: scrollDown ${col2Images.length * 3}s linear infinite; }
      `}</style>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">

                {/* LEFT — card, white in light mode / dark coffee in dark mode */}
                <div className="flex h-auto">
                    <div
                        className="w-full rounded-2xl flex flex-col p-5 sm:p-7 gap-4 bg-white dark:bg-[#150f0a] border border-[#e8d5b0]/40 dark:border-transparent transition-colors duration-300"
                    >
                        {/* Eyebrow */}
                        <div className="flex items-center gap-3 mt-8">
                            <span style={{ display: "block", width: 24, height: 1, flexShrink: 0 }} className="bg-[#a67c2e] dark:bg-[#c9a96e]" />
                            <span style={{ fontFamily: BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase" }} className="text-[#a67c2e] dark:text-[#c9a96e]">
                                Heritage Craft
                            </span>
                        </div>

                        {/* Headline */}
                        <div>
                            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2.2rem, 4vw, 3.4rem)", fontWeight: 700, lineHeight: 0.92, margin: 0, letterSpacing: "-0.02em" }} className="text-[#2c2c2c] dark:text-[#e8d9c4]">
                                Masterfully
                            </h2>
                            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2.2rem, 4vw, 3.4rem)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.08, margin: 0, letterSpacing: "-0.01em" }} className="text-[#a67c2e] dark:text-[#c9a96e]">
                                crafted in India.
                            </h2>
                        </div>

                        {/* Body */}
                        <p className="text-justify sm:w-[92%] text-[#636262] dark:text-[#b1a99f] font-poppins" style={{ fontSize: 13.2, lineHeight: 1.8, margin: 0, fontWeight: 600, letterSpacing: "0.01em" }}>

                            Thoughtfully handcrafted using premium 925 sterling silver, finished with refined 18kt and 22kt gold-plated details. Hypoallergenic and designed for lasting comfort. Enjoy secure payments, complimentary shipping across India, worldwide delivery, and Cash on Delivery on select styles.

                            Each TALEO creation is crafted with meticulous attention to detail, blending timeless elegance with contemporary design.
                        </p>

                        {/* Pills */}
                        <div className="flex flex-wrap gap-1.5">
                            {["925 Silver", "18k Gold Plated", "Hypoallergenic"].map((t) => (
                                <span key={t}
                                    style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", padding: "5px 10px", borderRadius: 4, fontWeight: 700 }}
                                    className="border border-[#d8cdb8] dark:border-[#2e2318] text-[#5c5044] dark:text-[#8a7c6b]"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1 }} className="bg-[#e8e0d0] dark:bg-[#2e2318]" />

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <button
                                className="bg-[#1a0c06] dark:bg-[#c9a96e] text-[#fff]"
                                style={{ fontFamily: BODY, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, borderRadius: 4, padding: "11px 22px", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, transition: "opacity 0.2s" }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                            >
                                Explore Now
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                            <span style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }} className="text-[#8a7c6b] dark:text-[#706150]">
                                Browse all →
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT — two auto-scrolling columns */}
                <div className="flex gap-3" style={{ height: "85vh", overflow: "hidden" }}>

                    <div className="flex-1 overflow-hidden">
                        <div className="col-up flex flex-col" style={{ gap: `${GAP}px` }}>
                            {track1.map((img, i) => (
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

                    <div className="flex-1 overflow-hidden">
                        <div className="col-down flex flex-col" style={{ gap: `${GAP}px` }}>
                            {track2.map((img, i) => (
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

                </div>
            </div>
        </section>
    );
}