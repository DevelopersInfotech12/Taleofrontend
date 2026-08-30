"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "../motion/Reveal";
import { API, imgUrl } from "../../lib/api";

const desktopBannersFallback = [
  { id: "d1", src: "./banneraddnew.png", alt: "Banner 1", href: "" },
  { id: "d2", src: "./banneraddnew2.png", alt: "Banner 2", href: "" },
  { id: "d3", src: "./banneraddnew3.png", alt: "Banner 3", href: "" },
  { id: "d4", src: "./banneraddnew4.png", alt: "Banner 4", href: "" },
];

const mobileBannersFallback = [
  { id: "m1", src: "./bannermobileadd1.png", alt: "Banner 1", href: "" },
  { id: "m2", src: "./bannermobileadd2.png", alt: "Banner 2", href: "" },
  { id: "m3", src: "./bannermobileadd3.png", alt: "Banner 3", href: "" },
];

function Slider({ banners, height }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  const startX = useRef(null);
  const total = banners.length;

  const go = (n) => {
    if (total === 0) return;
    setIdx((n + total) % total);
    clearInterval(timer.current);
    timer.current = setInterval(() => setIdx((p) => (p + 1) % total), 4000);
  };

  useEffect(() => {
    if (total === 0) return;
    timer.current = setInterval(() => setIdx((p) => (p + 1) % total), 4000);
    return () => clearInterval(timer.current);
  }, [total]);

  if (total === 0) return null;

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      {/* track */}
      <div style={{ overflow: "hidden", width: "100%", height: "100%", borderRadius: 16 }}>
        <div style={{ display: "flex", height: "100%", transform: `translateX(-${idx * 100}%)`, transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)" }}>
          {banners.map((b) => (
            <div key={b.id} style={{ minWidth: "100%", height: "100%" , borderRadius: 16, overflow: "hidden" }}>
              {b.href ? (
                <a href={b.href} style={{ display: "block", width: "100%", height: "100%" }}>
                  <motion.img
                    src={b.src}
                    alt={b.alt}
                    style={{ width: "100%", height: "85%", objectFit: "cover",borderRadius: 16 , display: "block" }}
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </a>
              ) : (
                <motion.img
                  src={b.src}
                  alt={b.alt}
                  style={{ width: "100%", height: "85%", objectFit: "cover",borderRadius: 16 , display: "block" }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* dots */}
      <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, alignItems: "center" }}>
        {banners.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 3, background: i === idx ? "#c9a96e" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0 }} />
        ))}
      </div>

      {/* arrows */}
      <button onClick={() => go(idx - 1)}
        style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.35)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={() => go(idx + 1)}
        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.35)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}

export default function BannerAdd() {
  const [desktopBanners, setDesktopBanners] = useState(desktopBannersFallback);
  const [mobileBanners, setMobileBanners] = useState(mobileBannersFallback);

  // Pull admin-managed slides; silently keep the built-in fallback if none
  // exist yet or the API is unreachable. Manage these at /admin/promo-banners.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/promo-banners`, { cache: "no-store" });
        const json = await res.json();
        const data = json?.data;
        if (cancelled || !Array.isArray(data) || data.length === 0) return;

        setDesktopBanners(data.map((b) => ({
          id: b._id, src: imgUrl(b.image), alt: b.alt || "", href: b.href || "",
        })));
        setMobileBanners(data.map((b) => ({
          id: b._id, src: imgUrl(b.mobileImage || b.image), alt: b.alt || "", href: b.href || "",
        })));
      } catch {
        // keep fallback
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section style={{ backgroundColor: "#f5f0e8" }} className="w-full px-4 sm:px-8 py-5 sm:py-8">
      <Reveal as="div" className="hidden md:block">
        <Slider banners={desktopBanners} height="520px" />
      </Reveal>
      <Reveal as="div" delay={0.1} className="block md:hidden">
        <Slider banners={mobileBanners} height="780px" />
      </Reveal>
    </section>
  );
}