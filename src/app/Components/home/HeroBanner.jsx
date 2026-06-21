"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeroBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ background: "#1a0c06" }}>
      {/* DESKTOP: side-by-side (lg+) */}
      <div className="hidden lg:block">
        <div className="relative h-[570px]">
          <div className="absolute inset-0">
            <img
              src="./bannernew.png"
              alt="Fine jewellery model"
              className="absolute right-0 top-0 h-full object-cover object-top"
              style={{ width: "62%" }}
            />
          </div>
          <div className="relative z-10 max-w-[1320px] mx-auto px-16 h-full flex items-center">
            <div className="max-w-[520px]">
              <EyebrowRow visible={visible} />
              <Headline visible={visible} />
              <Subtext visible={visible} />
              <CTAs visible={visible} />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE: stacked (below lg) */}
      <div className="lg:hidden flex flex-col">
        <div className="px-6 pt-12 pb-8 flex flex-col">
          <EyebrowRow visible={visible} />
          <Headline visible={visible} />
          <Subtext visible={visible} />
          <CTAs visible={visible} />
        </div>
        <div className="w-full">
          <img
            src="./bannernew.png"
            alt="Fine jewellery model"
            className="w-full object-cover object-top"
            style={{ maxHeight: "420px" }}
          />
        </div>
      </div>
    </section>
  );
}

function EyebrowRow({ visible }) {
  return (
    <div
      className="flex items-center gap-3 mb-4"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s" }}
    >
      <span style={{ display: "block", width: 24, height: 1, background: "#c9a96e", flexShrink: 0 }} />
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", color: "#c9a96e" }}>
        Timeless Elegance
      </span>
    </div>
  );
}

function Headline({ visible }) {
  return (
    <h1
      className="text-white leading-[1.05] sm:mt-[80px] mt-[50px] text-[3.9rem] lg:text-[clamp(3.2rem,5.5vw,5.5rem)]"
      style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 400,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
      }}
    >
      Crafted for<br />Forever Moments
    </h1>
  );
}

function Subtext({ visible }) {
  return (
    <p
      className="text-white/60 text-[14px] leading-[1.75] max-w-sm mt-6 mb-4"
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 300,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s",
      }}
    >
      Exquisite fine jewellery, made with rare stones<br />and exceptional craftsmanship.
    </p>
  );
}

function CTAs({ visible }) {
  return (
    <div
      className="flex flex-row gap-3 lg:gap-4"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.8s ease 0.55s, transform 0.8s ease 0.55s",
      }}
    >
      <Link
        href="/collections"
        className="border border-white/80 text-white hover:bg-white hover:text-[#1a0c06] transition-all duration-300 text-center whitespace-nowrap"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          fontSize: 10,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          padding: "13px 16px",
        }}
      >
        Explore Collection
      </Link>
      <Link
        href="/new-arrivals"
        className="border border-white/40 text-white hover:border-[#b08850] hover:text-[#b08850] transition-all duration-300 text-center whitespace-nowrap"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          fontSize: 10,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          padding: "13px 16px",
        }}
      >
        New Arrivals
      </Link>
    </div>
  );
}