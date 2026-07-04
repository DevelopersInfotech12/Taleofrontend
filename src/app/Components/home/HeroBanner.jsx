"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/**
 * VIRSA — full-bleed "chapter" hero slider.
 * Layout/behaviour borrowed from House of June's full-bleed rotating hero
 * (full-height bg, centered fading headline stack, single CTA, autoplay),
 * but each slide is a numbered "Chapter" per Taleo's moodboard deck
 * (VIRSA, KANAK, RAUNAK, MEHFIL, SEHAJ, CHARKHA) instead of a plain slide.
 */

const CHAPTERS = [
  {
    chapter: "Chapter 01",
    title: "Virsa",
    tagline: "Not every inheritance is gold.",
    body: "Some are motifs. Some are rituals. Some are objects quietly woven into everyday life.",
    image: "./virsa.png",
    cta: { label: "Explore The Pieces", href: "/collections/virsa" },
  },
  {
    chapter: "Chapter 01 — I",
    title: "Kanak",
    tagline: "Before every harvest comes patience.",
    body: "Inspired by fields of wheat swaying beneath the Punjabi sun — a tribute to growth, resilience, and all the beautiful things that take time to become.",
    image: "./kanak.png",
    cta: { label: "Discover Kanak", href: "/collections/kanak" },
  },
  {
    chapter: "Chapter 01 — II",
    title: "Raunak",
    tagline: "A celebration of colour and movement.",
    body: "The energy of ordinary, memorable celebrations — pieces drawn from symbols and stories that continue to hold meaning today.",
    image: "./raunak.png",
    cta: { label: "Discover Raunak", href: "/collections/raunak" },
  },
  {
    chapter: "Chapter 01 — III",
    title: "Mehfil",
    tagline: "Inspired by evenings that begin with conversation.",
    body: "And end with music, felt more in shimmer than sound — jewellery for the gatherings you remember.",
    image: "./mehfil.png",
    cta: { label: "Discover Mehfil", href: "/collections/mehfil" },
  },
  {
    chapter: "Chapter 01 — IV",
    title: "Sehaj",
    tagline: "A reminder that peace often lives in stillness.",
    body: "Quiet pieces, made for the moments in between — where nothing needs to be proven.",
    image: "./sehaj.png",
    cta: { label: "Discover Sehaj", href: "/collections/sehaj" },
  },
];

const AUTOPLAY_MS = 6000;

export default function HeroBanner() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const startAutoplay = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % CHAPTERS.length);
    }, AUTOPLAY_MS);
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(timerRef.current);
  }, [startAutoplay]);

  const goTo = (index) => {
    setActive(index);
    startAutoplay(); // reset timer on manual interaction
  };

  const goPrev = () => goTo((active - 1 + CHAPTERS.length) % CHAPTERS.length);
  const goNext = () => goTo((active + 1) % CHAPTERS.length);

  return (
    <section
      className="relative w-full overflow-hidden h-[92vh] min-h-[560px] lg:h-[100vh] lg:min-h-[680px] lg:max-h-[880px]"
      style={{ background: "#1a0c06" }}
    >
      {/* Background image stack — crossfades between chapters */}
      {CHAPTERS.map((c, i) => (
        <div
          key={c.title}
          className="absolute inset-0"
          style={{ opacity: active === i ? 1 : 0, transition: "opacity 1.1s ease", zIndex: 0 }}
          aria-hidden={active !== i}
        >
          <img
            src={c.image}
            alt={c.title}
            className="w-full h-full object-cover"
            style={{ transform: active === i ? "scale(1.04)" : "scale(1)", transition: "transform 7s ease" }}
          />
          {/* Warm editorial gradient, matching the moodboard's dark earthen tone */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(15,8,4,0.82) 0%, rgba(15,8,4,0.55) 38%, rgba(15,8,4,0.15) 62%, rgba(15,8,4,0.05) 100%), linear-gradient(0deg, rgba(15,8,4,0.55) 0%, rgba(15,8,4,0) 35%)",
            }}
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full max-w-[1320px] mx-auto px-6 lg:px-16 lg:mt-6 flex items-center">
        <div className="max-w-[560px] w-full">
          {CHAPTERS.map((c, i) => (
            <div key={c.title} style={{ display: active === i ? "block" : "none" }}>
              <ChapterEyebrow label={c.chapter} visible={visible} />
              <ChapterTitle title={c.title} visible={visible} />
              <ChapterTagline text={c.tagline} visible={visible} />
              <ChapterBody text={c.body} visible={visible} />
              <ChapterCTA cta={c.cta} visible={visible} />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={goPrev}
        aria-label="Previous chapter"
        className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full border border-white/30 text-white/80 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors duration-300"
      >
        ‹
      </button>
      <button
        onClick={goNext}
        aria-label="Next chapter"
        className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full border border-white/30 text-white/80 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors duration-300"
      >
        ›
      </button>

      {/* Chapter index / dots */}
      <div className="absolute bottom-7 left-0 right-0 z-20 flex items-center justify-center gap-3">
        {CHAPTERS.map((c, i) => (
          <button key={c.title} onClick={() => goTo(i)} aria-label={`Go to ${c.title}`} className="group flex items-center gap-2">
            <span
              style={{
                display: "block",
                height: 1,
                width: active === i ? 28 : 14,
                background: active === i ? "#c9a96e" : "rgba(255,255,255,0.35)",
                transition: "all 0.4s ease",
              }}
            />
            <span
              className="hidden lg:inline"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: active === i ? "#c9a96e" : "rgba(255,255,255,0.45)",
                transition: "color 0.4s ease",
              }}
            >
              {c.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function ChapterEyebrow({ label, visible }) {
  return (
    <div
      className="inline-flex items-center gap-2.5 mb-5 px-3 py-1.5 rounded-full backdrop-blur-md"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(201,169,110,0.35)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s cubic-bezier(.22,1,.36,1) 0.05s, transform 0.6s cubic-bezier(.22,1,.36,1) 0.05s",
      }}
    >
      <span
        style={{
          display: "block",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#c9a96e",
          boxShadow: "0 0 8px 2px rgba(201,169,110,0.6)",
        }}
      />
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "#e6d3b3",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function ChapterTitle({ title, visible }) {
  return (
    <h1
      className="leading-[1.02] text-[3.6rem] lg:text-[clamp(3.6rem,6.5vw,6.5rem)]"
      style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 500,
        letterSpacing: "0.02em",
        backgroundImage: "linear-gradient(135deg, #ffffff 30%, #e6d3b3 70%, #c9a96e 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        filter: visible ? "blur(0px)" : "blur(6px)",
        transition: "opacity 0.9s cubic-bezier(.22,1,.36,1) 0.15s, transform 0.9s cubic-bezier(.22,1,.36,1) 0.15s, filter 0.9s ease 0.15s",
      }}
    >
      {title}
    </h1>
  );
}

function ChapterTagline({ text, visible }) {
  return (
    <div className="flex items-center gap-3 mt-5">
      <span
        style={{
          display: "block",
          width: visible ? 36 : 0,
          height: 1,
          background: "linear-gradient(90deg, #c9a96e, transparent)",
          transition: "width 0.8s cubic-bezier(.22,1,.36,1) 0.4s",
        }}
      />
      <p
        className="text-[#e6d3b3] text-[16px] lg:text-[19px] italic"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 400,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(-14px)",
          transition: "opacity 0.7s ease 0.32s, transform 0.7s ease 0.32s",
        }}
      >
        {text}
      </p>
    </div>
  );
}

function ChapterBody({ text, visible }) {
  return (
    <p
      className="text-white/55 text-[14.5px] leading-[1.85] max-w-sm mt-5 mb-9"
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        textAlign: "justify",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "opacity 0.8s ease 0.48s, transform 0.8s ease 0.48s",
      }}
    >
      {text}
    </p>
  );
}

function ChapterCTA({ cta, visible }) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s",
      }}
    >
      <Link
        href={cta.href}
        className="group relative inline-flex items-center gap-3 overflow-hidden"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#1a0c06",
          background: "#f2e8d5",
          padding: "15px 24px",
          borderRadius: 2,
        }}
      >
        <span
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, #c9a96e, #f2e8d5)",
            transform: "translateX(-100%)",
            transition: "transform 0.45s cubic-bezier(.22,1,.36,1)",

          }}
        />
        <span
          className="relative font-bold"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 12, // was 10
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#1a0c06",
            background: "#f2e8d5",
            padding: "1px 2px",
            borderRadius: 2,
          }}
          onMouseEnter={(e) => (e.currentTarget.parentElement.style.color = "#1a0c06")}
        >
          {cta.label}
        </span>
        <span
          className="relative transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        >
          →
        </span>
        <style jsx>{`
          a:hover > span:first-child {
            transform: translateX(0);
          }
        `}</style>
      </Link>
    </div>
  );
}