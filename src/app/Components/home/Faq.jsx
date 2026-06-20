"use client";
import { useRef, useState, useEffect } from "react";

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY = "'Inter', sans-serif";

const FAQS = [
    { q: "How long does shipping take?", a: "All orders ship free via insured courier and arrive within 3–7 business days domestically. International orders may take 7–14 days." },
    { q: "Is your gold hallmarked?", a: "Every piece is BIS 916 hallmarked, certifying purity and authenticity. A certificate accompanies each order." },
    { q: "Can I return or exchange an item?", a: "Yes — return any unworn piece in its original packaging within 30 days for a full refund or exchange." },
    { q: "Do you offer ring resizing?", a: "Rings are resized once free of charge within 60 days of purchase, subject to design constraints." },
    { q: "How do I care for my jewelry?", a: "Store pieces separately in a soft pouch, avoid contact with perfume or chlorine, and clean gently with a dry cloth." },
];

function FaqItem({ item, index, open, onToggle, fade }) {
    return (
        <div
            style={{ ...fade(0.15 + index * 0.08), borderBottom: "1px solid rgba(42,26,14,0.12)" }}
        >
            <button
                type="button"
                onClick={() => onToggle(index)}
                className="w-full flex items-center justify-between gap-6 py-5 text-left bg-transparent border-none cursor-pointer"
            >
                <span style={{ fontFamily: DISPLAY, fontSize: 19, fontWeight: 600, color: "#3d1f10" }}>
                    {item.q}
                </span>
                <span
                    className="shrink-0 flex items-center justify-center"
                    style={{
                        width: 28, height: 28, borderRadius: "50%",
                        border: "1px solid #c9a96e",
                        color: "#9b7020",
                        transform: open ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                    }}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                </span>
            </button>
            <div
                style={{
                    maxHeight: open ? 200 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.4s ease",
                }}
            >
                <p style={{ fontFamily: BODY, fontSize: 14, color: "#7a6a5a", lineHeight: 1.7, fontWeight: 500, margin: "0 0 22px", maxWidth: 560 }}>
                    {item.a}
                </p>
            </div>
        </div>
    );
}

export default function Faq() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const [openIndex, setOpenIndex] = useState(0);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.2 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const fade = (delay = 0) => ({
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
    });

    const handleToggle = (i) => setOpenIndex((cur) => (cur === i ? -1 : i));

    return (
        <section ref={ref} className="py-20 bg-[#f0e8dc]">
            <div className="max-w-[900px] mx-auto px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left — heading block + image */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-3" style={fade(0)}>
                            <span style={{ display: "block", width: 24, height: 1, background: "#c9a96e" }} />
                            <span style={{ fontFamily: DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", color: "#c9a96e" }}>
                                Got Questions
                            </span>
                        </div>
                        <div style={fade(0.1)}>
                            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem, 3.6vw, 2.8rem)", fontWeight: 700, lineHeight: 1.1, color: "#3d1f10", margin: 0, letterSpacing: "-0.02em" }}>
                                Frequently{" "}
                                <span style={{ fontWeight: 400, fontStyle: "italic", color: "#9b7020", letterSpacing: "-0.01em" }}>
                                    asked
                                </span>
                            </h2>
                        </div>
                        <p style={{ fontFamily: BODY, fontSize: 14, color: "#7a6a5a", lineHeight: 1.6, margin: "8px 0 0", fontWeight: 600, ...fade(0.2) }}>
                            Everything you need to know before your purchase.
                        </p>

                        {/* image */}
                        <div className="sm:h-[290px]" style={{ ...fade(0.3), marginTop: 28, borderRadius: 18, overflow: "hidden", aspectRatio: "4/5" }}>
                            <img src="./faq.png" alt="Gold jewelry close up" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                    </div>

                    {/* Right — accordion list */}
                    <div>
                        {FAQS.map((item, i) => (
                            <FaqItem
                                key={item.q}
                                item={item}
                                index={i}
                                open={openIndex === i}
                                onToggle={handleToggle}
                                fade={fade}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}