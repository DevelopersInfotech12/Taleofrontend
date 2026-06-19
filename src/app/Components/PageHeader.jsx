"use client";
import Link from "next/link";

/**
 * Checkout-style dark hero header for info pages.
 * Props: title, subtitle, label (small caps above), breadcrumb [{label, href?}]
 */
export default function PageHeader({ title, subtitle, label, breadcrumb = [] }) {
  return (
    <div>
      {/* Dark banner */}
      <div
        className="w-full py-14 md:py-20 flex flex-col items-center justify-center text-center"
        style={{ background: "linear-gradient(160deg,#1a0c06 0%,#3d1f10 60%,#1a0c06 100%)" }}
      >
        {label && (
          <p
            className="font-[family-name:var(--font-jost)] uppercase text-[#c9a96e] mb-3"
            style={{ fontSize: "11px", letterSpacing: "0.35em", fontWeight: 600 }}
          >
            {label}
          </p>
        )}
        <h1
          className="font-[family-name:var(--font-playfair)] text-white"
          style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, lineHeight: 1.15 }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="font-[family-name:var(--font-jost)] text-[#e8d5b0]/60 mt-3"
            style={{ fontSize: "14px", letterSpacing: "0.02em" }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Breadcrumb strip */}
      {breadcrumb.length > 0 && (
        <div className="w-full bg-white border-b border-[#e8ddd0]">
          <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center gap-2">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#b08850" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="font-[family-name:var(--font-jost)] text-[#b08850] hover:text-[#3d1f10] transition-colors"
                    style={{ fontSize: "12px", letterSpacing: "0.04em" }}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className="font-[family-name:var(--font-jost)] text-[#3d1f10]/50"
                    style={{ fontSize: "12px", letterSpacing: "0.04em" }}
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
