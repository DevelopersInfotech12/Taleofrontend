"use client";
import { useState } from "react";
import { apiFetch } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";

const FEATURES = [
  "Manage products & inventory",
  "Create & publish blogs",
  "Track orders & refunds",
  "Coupons & promotions",
];

function LeafIcon({ size = 20, color = "currentColor", style, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0, ...style }} {...rest}>
      <path d="M11 20A7 7 0 0 1 4 13c0-4 5-10 12-11 0 7-2 12-5 15-1 1-2 3-2 3Z" />
      <path d="M4 13c4 0 8-2 10-5" />
    </svg>
  );
}

function MailIcon({ size = 16, color = "currentColor", style, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0, ...style }} {...rest}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function LockIcon({ size = 16, color = "currentColor", style, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0, ...style }} {...rest}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon({ open, size = 16, color = "currentColor", style, ...rest }) {
  return open ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0, ...style }} {...rest}>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0, ...style }} {...rest}>
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a20.3 20.3 0 0 1-3.22 4.36" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/auth/login", null, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (res.data?.user?.role !== "admin") throw new Error("Admin access only");
      login(res.data.user, res.data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", background: "#f5efe8" }}>
      {/* ── Left panel ─────────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          width: "40%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "64px 48px",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(160deg, #1a0c06 0%, #3d1f10 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #c9a96e 0, transparent 45%), radial-gradient(circle at 80% 80%, #c9a96e 0, transparent 45%)",
          }}
        />
        <div style={{ position: "relative", width: "100%", maxWidth: 320, textAlign: "center" }}>
          <div
            style={{
              width: 64, height: 64, borderRadius: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 32px",
              background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.3)",
            }}
          >
            <LeafIcon size={28} color="#c9a96e" />
          </div>

          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 30, fontWeight: 600, color: "#f5efe8", marginBottom: 16 }}>
            Admin Panel
          </h1>
          <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: 13, lineHeight: 1.7, marginBottom: 40, color: "rgba(245,239,232,0.65)" }}>
            Manage the Taleo store — products, orders, blogs and customers — all from one place.
          </p>

          <ul style={{ textAlign: "left", display: "inline-block", listStyle: "none", padding: 0, margin: 0 }}>
            {FEATURES.map((f) => (
              <li key={f} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, flexShrink: 0, background: "#c9a96e" }} />
                <span style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: 13, color: "rgba(245,239,232,0.85)" }}>
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "64px 24px" }}>
        <div style={{ width: "100%", maxWidth: 384 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
            <div
              style={{
                width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg, #3d1f10, #1a0c06)",
              }}
            >
              <LeafIcon size={20} color="#c9a96e" />
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 18, fontWeight: 700, color: "#1a1008", lineHeight: 1.2 }}>
                Taleo
              </p>
              <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: 13, color: "#8a7560" }}>
                Admin Panel
              </p>
            </div>
          </div>

          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 24, fontWeight: 600, color: "#1a1008", marginBottom: 6 }}>
            Welcome back
          </h2>
          <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: 13, color: "#8a7560", marginBottom: 32 }}>
            Sign in to manage your store
          </p>

          {error && (
            <div style={{ marginBottom: 20, padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, fontFamily: "var(--font-jost), sans-serif", fontSize: 12, color: "#b91c1c" }}>
              {error}
            </div>
          )}

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontFamily: "var(--font-jost), sans-serif", fontSize: 14, fontWeight: 600, color: "#1a1008a6", marginBottom: 8 }}>
                Email address
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#a89478", pointerEvents: "none" }}>
                  <MailIcon size={15} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@taleo.in"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    border: "1px solid #e0d4c4", borderRadius: 12,
                    padding: "12px 14px 12px 40px",
                    fontFamily: "var(--font-jost), sans-serif", fontSize: 13.5, color: "#1a1008",
                    background: "#ffffff", outline: "none",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#b08850"; e.target.style.boxShadow = "0 0 0 3px rgba(176,136,80,0.15)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e0d4c4"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: "block", fontFamily: "var(--font-jost), sans-serif", fontSize: 14, fontWeight: 600, color: "#1a1008a6", marginBottom: 8
              }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#a89478", pointerEvents: "none" }}>
                  <LockIcon size={15} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    border: "1px solid #e0d4c4", borderRadius: 12,
                    padding: "12px 44px 12px 40px",
                    fontFamily: "var(--font-jost), sans-serif", fontSize: 13.5, color: "#1a1008",
                    background: "#ffffff", outline: "none",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#b08850"; e.target.style.boxShadow = "0 0 0 3px rgba(176,136,80,0.15)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e0d4c4"; e.target.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  tabIndex={-1}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", padding: 0, cursor: "pointer",
                    color: "#a89478", display: "flex",
                  }}
                >
                  <EyeIcon open={showPassword} size={15} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", color: "#f5efe8",
                padding: "12px 0", borderRadius: 12, border: "none",
                fontFamily: "var(--font-jost), sans-serif", fontSize: 15, fontWeight: 600, letterSpacing: "0.02em",
                marginTop: 4, cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.6 : 1,
                background: "linear-gradient(135deg, #3d1f10 0%, #1a0c06 100%)",
                boxShadow: "0 6px 20px rgba(61,31,16,0.25)",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <a
              href="/"
              style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: 12.5, color: "#8a7560", textDecoration: "none" }}
            >
              ← Back to Taleo website
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
