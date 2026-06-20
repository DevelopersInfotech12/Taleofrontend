"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'Inter', 'Poppins', sans-serif";

/* ─── block renderer ──────────────────────────────────────────────── */
function renderBlock(b, i) {
  const pStyle = { fontFamily: SANS, fontSize: "1rem", lineHeight: 1.9, color: "var(--text)", margin: "0 0 1.1rem" };
  switch (b.type) {
    case "h3":
      return <h3 key={i} style={{ fontFamily: SERIF, fontSize: "1.55rem", fontWeight: 700, color: "var(--text)", margin: "2.2rem 0 0.8rem" }}>{b.text}</h3>;
    case "p":
      return <p key={i} style={pStyle}>{b.text}</p>;
    case "ul":
      return (
        <ul key={i} style={{ listStyle: "none", padding: 0, margin: "0 0 1.2rem" }}>
          {(b.items || []).map((it, j) => (
            <li key={j} style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start", fontFamily: SANS, fontSize: "0.95rem", lineHeight: 1.8, color: "var(--text)", marginBottom: "0.5rem" }}>
              <span style={{ color: "var(--gold)", fontWeight: 700, marginTop: "0.1rem", flexShrink: 0 }}>•</span>{it}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={i} style={{ paddingLeft: "1.5rem", margin: "0 0 1.2rem" }}>
          {(b.items || []).map((it, j) => (
            <li key={j} style={{ fontFamily: SANS, fontSize: "0.95rem", lineHeight: 1.8, color: "var(--text)", marginBottom: "0.4rem" }}>{it}</li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <div key={i} style={{ background: "var(--cream)", border: "1px solid var(--cream-dk)", borderLeft: "4px solid var(--gold)", borderRadius: 10, padding: "1rem 1.25rem", margin: "1.75rem 0", fontFamily: SANS, fontSize: "0.95rem", color: "#7a5a10", lineHeight: 1.8 }}>
          {b.text}
        </div>
      );
    case "callout-warn":
      return (
        <div key={i} style={{ background: "#FFF3CD", border: "1px solid #ffc107", borderLeft: "4px solid #e67e22", borderRadius: 10, padding: "1rem 1.25rem", margin: "1.75rem 0", fontFamily: SANS, fontSize: "0.95rem", color: "#7a4a10", lineHeight: 1.8 }}>
          {b.text}
        </div>
      );
    case "steps":
      return (
        <div key={i} style={{ margin: "1.75rem 0" }}>
          {(b.stepItems || []).map((s, j) => (
            <div key={j} style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: "var(--brown)", color: "var(--gold-lt)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: "0.85rem" }}>{s.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: SANS, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontFamily: SANS, fontSize: "0.95rem", color: "var(--text)", lineHeight: 1.8 }}>{s.desc}</div>
                {s.tip && <div style={{ marginTop: 8, fontFamily: SANS, fontSize: "0.85rem", color: "var(--gold)", fontStyle: "italic", display: "flex", gap: 6, alignItems: "flex-start" }}>💡 {s.tip}</div>}
              </div>
            </div>
          ))}
        </div>
      );
    case "img":
      return (
        <figure key={i} style={{ margin: "2rem 0" }}>
          <img src={b.src} alt={b.alt || ""} style={{ width: "100%", borderRadius: 12, objectFit: "cover", maxHeight: 460 }} />
          {b.alt && <figcaption style={{ fontFamily: SANS, fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "center", marginTop: 8 }}>{b.alt}</figcaption>}
        </figure>
      );
    default: return null;
  }
}

/* ─── TOC Sidebar ─────────────────────────────────────────────────── */
function TOCSidebar({ sections, blog }) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach(s => { if (s.id) { const el = document.getElementById(s.id); if (el) obs.observe(el); } });
    return () => obs.disconnect();
  }, [sections]);

  return (
    <aside style={{ position: "sticky", top: 100, display: "flex", flexDirection: "column", gap: 20 }}>
      {/* TOC */}
      <div style={{ background: "var(--cream)", border: "1px solid var(--cream-dk)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--cream-dk)", background: "var(--brown)" }}>
          <span style={{ fontFamily: SANS, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-lt)", fontWeight: 600 }}>Contents</span>
        </div>
        <nav style={{ padding: "0.75rem 0" }}>
          {sections.filter(s => s.heading).map((s, i) => (
            <a key={i} href={s.id ? `#${s.id}` : "#"} style={{ display: "block", padding: "0.45rem 1.25rem", fontFamily: SANS, fontSize: "0.82rem", lineHeight: 1.5, color: active === s.id ? "var(--gold)" : "var(--text-muted)", fontWeight: active === s.id ? 600 : 400, textDecoration: "none", borderLeft: active === s.id ? "3px solid var(--gold)" : "3px solid transparent", transition: "all 0.2s" }}>
              {s.heading}
            </a>
          ))}
        </nav>
      </div>

      {/* Article Info */}
      <div style={{ background: "var(--cream)", border: "1px solid var(--cream-dk)", borderRadius: 14, padding: "1.25rem" }}>
        <p style={{ fontFamily: SANS, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: 14 }}>Article Info</p>
        {blog.tag && (
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontFamily: SANS, fontSize: "0.72rem", color: "var(--text-muted)", display: "block", marginBottom: 2 }}>Category</span>
            <span style={{ fontFamily: SANS, fontSize: "0.9rem", color: "var(--text)", fontWeight: 600 }}>{blog.tag}</span>
          </div>
        )}
        {blog.date && (
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontFamily: SANS, fontSize: "0.72rem", color: "var(--text-muted)", display: "block", marginBottom: 2 }}>Published</span>
            <span style={{ fontFamily: SANS, fontSize: "0.9rem", color: "var(--text)", fontWeight: 600 }}>{blog.date}</span>
          </div>
        )}
        {blog.readTime && (
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontFamily: SANS, fontSize: "0.72rem", color: "var(--text-muted)", display: "block", marginBottom: 2 }}>Read Time</span>
            <span style={{ fontFamily: SANS, fontSize: "0.9rem", color: "var(--text)", fontWeight: 600 }}>{blog.readTime}</span>
          </div>
        )}
        {blog.author && (
          <div>
            <span style={{ fontFamily: SANS, fontSize: "0.72rem", color: "var(--text-muted)", display: "block", marginBottom: 2 }}>Author</span>
            <span style={{ fontFamily: SANS, fontSize: "0.9rem", color: "var(--text)", fontWeight: 600 }}>{blog.author}</span>
          </div>
        )}
      </div>

      {/* Sidebar CTA */}
      {blog.ctaTitle && (
        <div style={{ background: "var(--brown)", borderRadius: 14, padding: "1.5rem", textAlign: "center" }}>
          <p style={{ fontFamily: SERIF, fontSize: "1.15rem", fontWeight: 700, color: "var(--cream)", marginBottom: 8, lineHeight: 1.3 }}>{blog.ctaTitle}</p>
          {blog.ctaBody && <p style={{ fontFamily: SANS, fontSize: "0.82rem", color: "rgba(245,239,232,0.65)", lineHeight: 1.7, marginBottom: 16 }}>{blog.ctaBody}</p>}
          <Link href="/collections" style={{ display: "inline-block", fontFamily: SANS, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "10px 22px", background: "var(--gold)", color: "var(--brown)", borderRadius: 100, textDecoration: "none", fontWeight: 700 }}>
            Explore Jewellery
          </Link>
        </div>
      )}
    </aside>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────── */
export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);   // ← ADD
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!slug) return;
    fetch(`${API}/blogs/public/${slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          setBlog(d.data);
          // ← ADD: fetch other published blogs as "related"
          fetch(`${API}/blogs/published?limit=4`)
            .then(r => r.json())
            .then(rd => {
              const list = rd.data?.blogs ?? rd.data ?? [];
              // exclude current blog
              setRelated(list.filter(b => b.slug !== slug).slice(0, 3));
            })
            .catch(() => { });
        } else {
          setErr("Blog not found");
        }
      })
      .catch(() => setErr("Failed to load blog"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 36, height: 36, border: "2px solid var(--gold)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (err || !blog) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--cream)", gap: 16 }}>
      <p style={{ fontFamily: SANS, color: "var(--text-muted)" }}>{err || "Blog not found"}</p>
      <Link href="/blog" style={{ fontFamily: SANS, fontSize: "0.85rem", color: "var(--gold)", textDecoration: "underline" }}>← Back to Journal</Link>
    </div>
  );

  const heroImage = blog.heroImg || blog.img;
  const sections = blog.sections || [];

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <Navbar />

      {/* ── Hero ── */}
      <div style={{ position: "relative", width: "100%", height: "65vh", minHeight: 360, maxHeight: 560, overflow: "hidden" }}>
        {heroImage && <img src={heroImage} alt={blog.title} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />}
        <div style={{ position: "absolute", inset: 0, background: blog.heroGradient || "linear-gradient(to bottom, rgba(26,14,7,0.55) 0%, rgba(26,14,7,0.88) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "3rem clamp(1.5rem,6vw,7rem)" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Link href="/blog" style={{ fontFamily: SANS, fontSize: "0.75rem", color: "rgba(240,230,216,0.6)", textDecoration: "none" }}>Journal</Link>
            <span style={{ color: "rgba(240,230,216,0.4)", fontSize: "0.75rem" }}>›</span>
            {blog.tag && <span style={{ fontFamily: SANS, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "3px 11px", borderRadius: 100, background: blog.tagStyle?.bg || "rgba(176,136,80,0.25)", color: blog.tagStyle?.text || "var(--gold-lt)", fontWeight: 600, border: "1px solid rgba(176,136,80,0.4)" }}>{blog.tag}</span>}
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(1.9rem,4.5vw,3.4rem)", fontWeight: 700, color: "#f5efe8", lineHeight: 1.1, margin: "0 0 1.25rem", maxWidth: 800 }}>{blog.title}</h1>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
            {blog.author && <span style={{ fontFamily: SANS, fontSize: "0.8rem", color: "rgba(240,230,216,0.65)", display: "flex", alignItems: "center", gap: 5 }}>✍️ {blog.author}</span>}
            {blog.date && <span style={{ fontFamily: SANS, fontSize: "0.8rem", color: "rgba(240,230,216,0.65)", display: "flex", alignItems: "center", gap: 5 }}>📅 {blog.date}</span>}
            {blog.readTime && <span style={{ fontFamily: SANS, fontSize: "0.8rem", color: "rgba(240,230,216,0.65)", display: "flex", alignItems: "center", gap: 5 }}>⏱️ {blog.readTime}</span>}
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(1rem,4vw,2.5rem)", display: "grid", gridTemplateColumns: "1fr 320px", gap: "3rem", alignItems: "start", paddingTop: "3rem", paddingBottom: "5rem" }}>

        {/* ── Main Content ── */}
        <main>
          {/* Excerpt / lead */}
          {blog.excerpt && (
            <p style={{ fontFamily: SERIF, fontSize: "1.2rem", fontStyle: "italic", color: "var(--gold)", lineHeight: 1.75, borderLeft: "3px solid var(--gold)", paddingLeft: "1.25rem", marginBottom: "2rem" }}>{blog.excerpt}</p>
          )}

          {/* Key Highlights */}
          {blog.highlights?.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid var(--cream-dk)", borderRadius: 14, padding: "1.4rem 1.6rem", marginBottom: "2.5rem", boxShadow: "0 2px 12px rgba(61,31,16,0.06)" }}>
              <p style={{ fontFamily: SANS, fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 700, marginBottom: 14 }}>Key Highlights</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {blog.highlights.map((h, i) => (
                  <li key={i} style={{ fontFamily: SANS, fontSize: "0.93rem", color: "var(--text)", lineHeight: 1.75, marginBottom: 8, display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: "0.15rem", fontWeight: 700 }}>✓</span>{h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sections */}
          {sections.map((sec, si) => (
            <section key={sec.id || si} id={sec.id} style={{ marginBottom: "2.75rem", scrollMarginTop: 100 }}>
              {sec.heading && (
                <h2 style={{ fontFamily: SERIF, fontSize: "2rem", fontWeight: 700, color: "var(--text)", margin: "0 0 1.1rem", paddingBottom: "0.6rem", borderBottom: "2px solid var(--cream-dk)", lineHeight: 1.2 }}>{sec.heading}</h2>
              )}
              {(sec.content || []).map((b, bi) => renderBlock(b, bi))}
            </section>
          ))}

          {/* Meta chips */}
          {blog.meta?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, background: "#fff", border: "1px solid var(--cream-dk)", borderRadius: 14, padding: "1.4rem 1.6rem", marginTop: "2rem" }}>
              {blog.meta.map((m, i) => (
                <div key={i}>
                  <span style={{ fontFamily: SANS, fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 3 }}>{m.label}</span>
                  <span style={{ fontFamily: SANS, fontSize: "0.9rem", color: "var(--text)", fontWeight: 600 }}>{m.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "2rem" }}>
              {blog.tags.map((t, i) => (
                <span key={i} style={{ fontFamily: SANS, fontSize: "0.75rem", padding: "5px 14px", background: "var(--cream)", border: "1px solid var(--cream-dk)", borderRadius: 100, color: "var(--text-muted)", fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          )}

          {/* Bottom CTA banner */}
          {blog.ctaTitle && (
            <div style={{ background: "var(--brown)", borderRadius: 18, padding: "2.5rem 2.5rem", marginTop: "3rem", display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: SERIF, fontSize: "1.7rem", fontWeight: 700, color: "var(--cream)", marginBottom: 8 }}>{blog.ctaTitle}</h3>
                {blog.ctaBody && <p style={{ fontFamily: SANS, fontSize: "0.92rem", color: "rgba(245,239,232,0.65)", lineHeight: 1.8, margin: 0 }}>{blog.ctaBody}</p>}
              </div>
              <Link href="/collections" style={{ flexShrink: 0, display: "inline-block", fontFamily: SANS, fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "13px 28px", background: "var(--gold)", color: "var(--brown)", borderRadius: 100, textDecoration: "none", fontWeight: 700, whiteSpace: "nowrap" }}>
                Explore Jewellery →
              </Link>
            </div>
          )}

          {related.length > 0 && (
            <div style={{ marginTop: "3.5rem" }}>
              <h3 style={{ fontFamily: SERIF, fontSize: "1.7rem", color: "var(--text)", marginBottom: "1.5rem", fontWeight: 700 }}>Keep Reading</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
                {related.map((r, i) => (
                  <Link key={i} href={`/blog/${r.slug}`} style={{ textDecoration: "none" }}>
                    <article style={{
                      background: "#fff",
                      border: "1px solid var(--cream-dk)",
                      borderRadius: 14,
                      overflow: "hidden",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      cursor: "pointer",
                      height: "100%",           // ← ADD
                      display: "flex",          // ← ADD
                      flexDirection: "column",  // ← ADD
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(61,31,16,0.12)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>

                      {/* Force fixed height image — always rendered, fallback guaranteed */}
                      <div style={{
                        width: "100%",
                        height: 160,              // ← fixed height
                        flexShrink: 0,
                        overflow: "hidden",
                        background: "#f0e8dc",
                      }}>
                        <img
                          src={r.heroImg || r.img || "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=500&q=80"}
                          alt={r.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          onError={e => { e.target.src = "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=500&q=80"; }}
                        />
                      </div>

                      <div style={{ padding: "1rem", flex: 1 }}>
                        {r.tag && <span style={{ fontFamily: SANS, fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 700 }}>{r.tag}</span>}
                        {r.date && <span style={{ fontFamily: SANS, fontSize: "0.72rem", color: "var(--text-muted)", marginLeft: 8 }}>{r.date}</span>}
                        <p style={{ fontFamily: SERIF, fontSize: "1rem", fontWeight: 600, color: "var(--text)", margin: "6px 0 0", lineHeight: 1.4 }}>{r.title}</p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid var(--cream-dk)" }}>
            <Link href="/blog" style={{ fontFamily: SANS, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
              ← Back to Journal
            </Link>
          </div>
        </main>

        {/* ── Sidebar ── */}
        <TOCSidebar sections={sections} blog={blog} />
      </div>

      {/* ── Full-width bottom CTA ── */}
      <div style={{ background: "var(--brown-dk)", padding: "4rem clamp(1.5rem,6vw,7rem)", textAlign: "center" }}>
        <p style={{ fontFamily: SANS, fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold-lt)", fontWeight: 600, marginBottom: 12 }}>Start Today</p>
        <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 700, color: "var(--cream)", marginBottom: 12, lineHeight: 1.2 }}>Begin Your Journey with Us</h2>
        <p style={{ fontFamily: SANS, fontSize: "0.95rem", color: "rgba(245,239,232,0.6)", maxWidth: 520, margin: "0 auto 2rem", lineHeight: 1.8 }}>Free consultation. Clear timeline. Transparent pricing. Our experts respond within 2 hours.</p>
        <Link href="/contact" style={{ display: "inline-block", fontFamily: SANS, fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "14px 32px", background: "var(--gold)", color: "var(--brown)", borderRadius: 100, textDecoration: "none", fontWeight: 700 }}>
          Get Free Consultation
        </Link>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 860px) {
          .blog-layout { grid-template-columns: 1fr !important; }
          .blog-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
}