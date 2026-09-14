"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useCart } from "../../lib/CartContext";
import { useAuth, authFetch } from "../../lib/AuthContext";

const FONT = "var(--font-jost), 'Helvetica Neue', Arial, sans-serif";

// Tokens pulled straight from the "Eternal Beauty" / New Collection section —
// same eyebrow gold, same pill chips, same body weight, same CTA language.
const HEADLINE = "#2c2c2c";
const BODY_TEXT = "#575656";
const PILL_TEXT = "#5c5044";
const PILL_BORDER = "#d8cdb8";
const DIVIDER = "#e8e0d0";
const GOLD = "#a67c2e";
const GOLD_LT = "#c9a96e";
const CTA_BG = "#1a0c06";

export default function ProductCard({
  id,
  slug,
  image = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
  images,
  name = "Royal Heritage Necklace",
  category = "Necklace",
  material = "22K Gold",
  tags = [],
  description = "An heirloom-grade piece crafted by hand in small batches — made to be worn and remembered.",
  price = 45999,
  originalPrice = 52999,
  rating = 4.9,
  reviews = 124,
  badge = "NEW",
  badgeColor = "#8fbc8b",
  variants,
  onAddToCart,
}) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishBusy, setWishBusy] = useState(false);

  // Sync wishlist state from user object
  useEffect(() => {
    if (user?.wishlist && id) {
      setWishlisted(user.wishlist.some((w) => (w._id || w) === id));
    }
  }, [user, id]);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdded(true);
    addToCart(
      { id, slug, name, image: images?.[0] || image, price, originalPrice },
      { variant: variants?.[0] || "", size: "", qty: 1 }
    );
    onAddToCart?.();
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = "/account";
      return;
    }
    if (wishBusy) return;
    setWishBusy(true);
    try {
      const res = await authFetch(`/wishlist/${id}`, { method: "POST" });
      setWishlisted(res.data?.action === "added");
    } catch {
      // silent fail
    } finally {
      setWishBusy(false);
    }
  };

  const savingRupees = originalPrice ? originalPrice - price : 0;

  // Pills are built from real product attributes — material, category,
  // and whatever tags (metal/gemstone/stone color/etc.) the product actually
  // has — not a hardcoded string. Deduped, capped so the card stays tidy.
  const pillSource = [material, category, ...(Array.isArray(tags) ? tags : [])].filter(Boolean);
  const seen = new Set();
  const pillTags = pillSource.filter((t) => {
    const key = String(t).toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 4);

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative w-full overflow-hidden rounded-2xl flex flex-col h-full transition-shadow duration-500 bg-white dark:bg-[#150f0a] border border-[#e8d5b0]/40 dark:border-transparent"
      style={{ boxShadow: "0 8px 20px -10px rgba(42,26,14,0.22)" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 20px 38px -14px rgba(42,26,14,0.32)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 8px 20px -10px rgba(42,26,14,0.22)")}
    >
      {/* ── Image ── */}
      <div className="relative h-72 sm:h-72 overflow-hidden flex-shrink-0">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, 384px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />

        {/* Eyebrow-style badge, same accent color as "New Collection · 2025" */}
        {badge && (
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span style={{ display: "block", width: 14, height: 1 }} className="bg-[#c9a96e]" />
            <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: GOLD_LT }}>
              {badge === "NEW" ? "New" : badge}
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          aria-label="Add to wishlist"
          onClick={handleWishlist}
          disabled={wishBusy}
          className="absolute right-3 top-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300"
          style={{
            background: wishlisted ? "#A05568" : "rgba(12,6,2,0.5)",
            border: wishlisted ? "1px solid #A05568" : `1px solid ${GOLD_LT}44`,
            backdropFilter: "blur(6px)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 22" fill={wishlisted ? "#fff" : "none"} stroke={wishlisted ? "#fff" : GOLD_LT} strokeWidth="1.8">
            <path d="M12 21C12 21 2 13.5 2 7a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 6.5-10 14-10 14z" />
          </svg>
        </button>
      </div>

      {/* ── Details ── */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="line-clamp-2 min-w-0"
            style={{ fontFamily: FONT, fontSize: 18, fontWeight: 600, color: HEADLINE, lineHeight: 1.3 }}
          >
            {name}
          </h3>
          <div className="flex items-center gap-1 shrink-0 pt-1">
            <svg width="10" height="10" viewBox="0 0 12 12" fill={GOLD}>
              <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9.2,11 6,9.2 2.8,11 3.5,7.5 1,5 4.5,4.5" />
            </svg>
            <span style={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 600, color: HEADLINE }}>{rating}</span>
          </div>
        </div>

        {/* Description — same justified, bold-body treatment as the Eternal Beauty copy */}
        <p
          className="hidden sm:block"
          style={{
            fontFamily: FONT,
            fontSize: 13,
            fontWeight: 400,
            lineHeight: 1.6,
            color: BODY_TEXT,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            margin: 0,
          }}
        >
          {description}
        </p>

        {/* Pills — dynamic: material, category, and any tags the product actually has */}
        <div className="flex flex-wrap gap-1.5">
          {pillTags.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: FONT,
                fontSize: 11.5,
                fontWeight: 500,
                padding: "5px 10px",
                borderRadius: 4,
                border: `1px solid ${PILL_BORDER}`,
                color: PILL_TEXT,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ height: 1, background: DIVIDER }} />

        <div className="flex items-end justify-between gap-2 pt-1">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span style={{ fontFamily: FONT, fontSize: 20, fontWeight: 600, color: HEADLINE, lineHeight: 1 }}>
                ₹{price.toLocaleString("en-IN")}
              </span>
              <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#8a7c6b", textDecoration: "line-through", visibility: originalPrice > price ? "visible" : "hidden" }}>
                ₹{(originalPrice > price ? originalPrice : price).toLocaleString("en-IN")}
              </span>
            </div>
            <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: GOLD, marginTop: 2, visibility: savingRupees > 0 ? "visible" : "hidden" }}>
              You save ₹{(savingRupees > 0 ? savingRupees : 0).toLocaleString("en-IN")}
            </p>
          </div>

          {/* CTA — identical language to "Discover Now" */}
          <button
            onClick={handleAdd}
            className="group/cta inline-flex items-center gap-2.5 shrink-0 transition-opacity duration-300 hover:opacity-90"
            style={{
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 500,
              padding: "10px 16px",
              borderRadius: 4,
              background: added ? "#2d6a4f" : CTA_BG,
              color: "#fff",
            }}
          >
            {added ? (
              "Added"
            ) : (
              <>
                <span className="hidden sm:inline">Add to bag</span>
                <span className="sm:hidden">Add</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover/cta:translate-x-1 transition-transform duration-300">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (slug) {
    return (
      <Link href={`/products/${slug}`} className="block w-full h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}