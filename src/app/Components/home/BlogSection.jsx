"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY    = "'Inter', sans-serif";

const posts = [
  { id: 1, category: "Jewellery Care", title: "How to Keep Your Fine Jewellery Radiant for Generations", excerpt: "Discover the rituals behind preserving the brilliance of your most cherished pieces — from diamond rings to delicate chains.", date: "June 2, 2025", readTime: "4 min read", img: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=700&q=80&fit=crop", slug: "keep-jewellery-radiant" },
  { id: 2, category: "Behind the Craft", title: "The Art of Stone Setting: Where Precision Meets Poetry", excerpt: "Our master craftsmen share the patience and precision behind every prong, bezel, and pavé setting that holds your stone in place.", date: "May 18, 2025", readTime: "6 min read", img: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=700&q=80&fit=crop", slug: "art-of-stone-setting" },
  { id: 3, category: "Gift Guide", title: "Beyond the Ring: Jewellery Gifts That Tell a Story", excerpt: "Whether marking a milestone or simply celebrating someone you love, the right piece speaks when words fall short.", date: "May 5, 2025", readTime: "5 min read", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&q=80&fit=crop", slug: "jewellery-gifts-guide" },
];

export default function BlogSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

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
    transform: visible ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
  });

  return (
    <section ref={ref} className="w-full px-4 sm:px-8 py-16" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto">

        {/* ── Section Header (unified pattern) ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12" style={fade(0.05)}>
          <div className="flex flex-col gap-2">
            {/* Eyebrow row: gold rule + label — Inter */}
            <div className="flex items-center gap-3 ">
              <span style={{ display: "block", width: 24, height: 1, background: "#c9a96e" }} />
              <span style={{ fontFamily: BODY, fontSize: 12, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", color: "#c9a96e" }}>
                The Journal
              </span>
            </div>
            {/* Heading */}
          <div style={fade(0.3)}>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontSize: "clamp(2.4rem, 4.2vw, 3.2rem)",
                fontWeight: 700,
                lineHeight: 1.08,
                color: "#3d1f10",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Stories of Craft{" "}
              <span
                style={{
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "#9b7020",
                  letterSpacing: "-0.01em",
                }}
              >
                Beauty
              </span>
            </h2>
          </div>
          </div>

          {/* CTA — Inter */}
          <Link
            href="/journal"
            className="group inline-flex items-center gap-2.5 self-start sm:self-auto shrink-0 transition-all duration-300"
            style={{ fontFamily: BODY, fontSize: 12,fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.22em", color: "#8a7560", textDecoration: "none", borderBottom: "1px solid #2e2318", paddingBottom: 3 }}
          >
            View All Articles
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform duration-300">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <Link
              key={post.id}
              href={`/journal/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl"
              style={{ ...fade(0.12 + i * 0.12), background: "#1e1510", border: "1px solid #2e2318", textDecoration: "none" }}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                <img
                  src={post.img} alt={post.title}
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.82) saturate(0.8)", transition: "transform 0.7s ease" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
                {/* Category badge — Inter */}
                <span className="absolute top-4 left-4 px-2.5 py-1"
                      style={{ fontFamily: BODY, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.3em", background: "rgba(12,6,2,0.65)", color: "#c9a96e", border: "1px solid #c9a96e44" }}>
                  {post.category}
                </span>
              </div>

              <div className="flex flex-col flex-1 p-5 gap-3">
                {/* Meta — Inter */}
                <div className="flex items-center gap-2.5">
                  <span style={{ fontFamily: BODY, fontWeight: 400, fontSize: 11, color: "#7c7062" }}>{post.date}</span>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#3a2c1e", display: "inline-block" }} />
                  <span style={{ fontFamily: BODY, fontWeight: 400, fontSize: 11, color: "#7c7062" }}>{post.readTime}</span>
                </div>

                {/* Title — Cormorant Garamond */}
                <h3
                  className="group-hover:text-[#c9a96e] transition-colors duration-300"
                  style={{ fontFamily: DISPLAY, fontSize: "1.1rem", fontWeight: 600, lineHeight: 1.25, color: "#e8d9c4", margin: 0 }}
                >
                  {post.title}
                </h3>

                {/* Excerpt — Inter */}
                <p style={{ fontFamily: BODY, fontSize: 12, lineHeight: 1.8, color: "#c9a96e", margin: 0, fontWeight: 300 }}>
                  {post.excerpt}
                </p>

                <div style={{ flex: 1 }} />
                <div style={{ height: 1, background: "#2e2318" }} />

                {/* Read more — Inter */}
                <div className="flex items-center gap-2">
                  <span className="group-hover:text-[#e8d9c4] transition-colors duration-300"
                        style={{ fontFamily: BODY, fontSize: 11,fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.25em", color: "#c9a96e" }}>
                    Read Article
                  </span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" className="group-hover:translate-x-1 transition-transform duration-300">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
