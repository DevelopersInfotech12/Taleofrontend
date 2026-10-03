"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { API, imgUrl } from "../../lib/api";

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY = "'Inter', sans-serif";

/** Used until/unless the admin panel has saved this section (or API is unreachable). Manage at /admin/new-collection. */
const FALLBACK = {
  image: "./banner10.png",
  imageAlt: "Eternal Beauty jewellery",
  eyebrow: "New Collection · 2025",
  headingMain: "Eternal",
  headingAccent: "Beauty.",
  body: "Each piece cast in 22k chocolate gold, stone-set by hand in batches of forty. Created in limited numbers to preserve exclusivity and craftsmanship. Every detail is meticulously finished by skilled artisans, ensuring exceptional quality. Designed to be treasured today and passed down for generations.",
  pills: ["22k Gold", "Hand-set stones", "40 pieces only"],
  primaryButtonLabel: "Discover Now",
  primaryButtonHref: "/collections/eternal-beauty",
  secondaryButtonLabel: "Browse all →",
  secondaryButtonHref: "/collections",
};

export default function NewCollectionBanner() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [c, setC] = useState(FALLBACK);

  // Pull admin-managed copy; silently keep the fallback if none saved.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/new-collection`, { cache: "no-store" });
        if (!res.ok) return;
        const d = (await res.json())?.data;
        if (!d || cancelled) return;
        setC({
          image: d.image ? imgUrl(d.image) : FALLBACK.image,
          imageAlt: d.imageAlt || FALLBACK.imageAlt,
          eyebrow: d.eyebrow ?? FALLBACK.eyebrow,
          headingMain: d.headingMain ?? FALLBACK.headingMain,
          headingAccent: d.headingAccent ?? FALLBACK.headingAccent,
          body: d.body ?? FALLBACK.body,
          pills: Array.isArray(d.pills) ? d.pills : FALLBACK.pills,
          primaryButtonLabel: d.primaryButtonLabel || FALLBACK.primaryButtonLabel,
          primaryButtonHref: d.primaryButtonHref || FALLBACK.primaryButtonHref,
          secondaryButtonLabel: d.secondaryButtonLabel || FALLBACK.secondaryButtonLabel,
          secondaryButtonHref: d.secondaryButtonHref || FALLBACK.secondaryButtonHref,
        });
      } catch {
        /* keep fallback */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const fade = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  });

  return (
    <section ref={ref} className="w-full px-4 sm:px-8 py-5 sm:py-8 bg-[#faf7f2] transition-colors duration-300">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">

        {/* LEFT — image */}
        <div
          className="overflow-hidden rounded-2xl"
          style={{
            minHeight: 220,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.9s ease 0.05s",
          }}
        >
          <img
            src={c.image}
            alt={c.imageAlt}
            className="w-full h-full object-cover"
            style={{ display: "block" }}
          />
        </div>

        {/* RIGHT — card, white in light mode / dark coffee in dark mode */}
        <div className="flex h-auto">
          <div
            className="w-full rounded-2xl flex flex-col p-5 sm:p-7 gap-4 bg-white dark:bg-[#150f0a] border border-[#e8d5b0]/40 dark:border-transparent transition-colors duration-300"
          >

            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span style={{ display: "block", width: 24, height: 1, flexShrink: 0 }} className="bg-[#a67c2e] dark:bg-[#c9a96e]" />
              <span style={{ fontFamily: BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase" }} className="text-[#a67c2e] dark:text-[#c9a96e]">
                {c.eyebrow}
              </span>
            </div>

            {/* Headline */}
            <div style={fade(0.3)}>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2.2rem, 8vw, 3.4rem)", fontWeight: 700, lineHeight: 0.92, margin: 0, letterSpacing: "-0.02em" }} className="text-[#2c2c2c] dark:text-[#e8d9c4]">
                {c.headingMain}
              </h2>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2.2rem, 8vw, 3.4rem)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.08, margin: 0, letterSpacing: "-0.01em" }} className="text-[#a67c2e] dark:text-[#c9a96e]">
                {c.headingAccent}
              </h2>
            </div>

            {/* Body — full text on mobile, no clamp */}
            <p className="text-justify sm:w-[92%] dark:text-[#b1a99f]" style={{ fontSize: 14.5, lineHeight: 1.8, margin: 0, fontWeight: 700, letterSpacing: "0.01em", color: "#575656" }}>
              {c.body}
            </p>

            {/* Pills */}
            <div className="flex flex-wrap gap-1.5" style={fade(0.48)}>
              {c.pills.map((t) => (
                <span
                  key={t}
                  style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", padding: "5px 10px", borderRadius: 4, fontWeight: 600 }}
                  className="border border-[#d8cdb8] dark:border-[#2e2318] text-[#5c5044] dark:text-[#74624b]"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, ...fade(0.55) }} className="bg-[#e8e0d0] dark:bg-[#2e2318]" />

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3" style={fade(0.6)}>
              <Link
                href={c.primaryButtonHref}
                className="group inline-flex items-center gap-3 transition-all duration-300 hover:opacity-90 bg-[#1a0c06] dark:bg-[#c9a96e] text-white dark:text-[#0f0804]"
                style={{ fontFamily: BODY, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, borderRadius: 4, padding: "11px 22px" }}
              >
                {c.primaryButtonLabel}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform duration-300">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href={c.secondaryButtonHref}
                className="transition-colors duration-200 text-[#8a7c6b] dark:text-[#bdb5ad]"
                style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}
              >
                {c.secondaryButtonLabel}
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}