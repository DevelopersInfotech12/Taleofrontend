"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "./api";

/** Fixed pages that show a Products Hero. */
export const STATIC_TARGETS = [
  { value: "all", label: "All product pages (default fallback)", tableLabel: "All pages" },
  { value: "products", label: "Products page (/products)", tableLabel: "Products page" },
  { value: "shop", label: "Shop page (/shop)", tableLabel: "Shop page" },
  { value: "best-arrivals", label: "Best Arrivals (/bestarrivals)", tableLabel: "Best Arrivals" },
];

/**
 * Loads categories + collections and returns grouped hero targets:
 *   [{ group, options: [{ value, label }] }]
 * plus a `labelFor(pageKey)` helper for tables.
 *
 * Values match the `heroKey` each frontend page passes to <OtherHero />:
 *   category:<slug>   → /rings, /necklaces, /earrings, /bracelets …
 *   collection:<slug> → /collections/<slug>
 */
export function useHeroTargets() {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [c, col] = await Promise.all([
          apiFetch("/categories?includeInactive=true"),
          apiFetch("/collections?includeInactive=true"),
        ]);
        if (cancelled) return;
        setCategories(c.data || []);
        setCollections(col.data || []);
      } catch {
        // dropdown still works with the static targets
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const groups = [
    { group: "General", options: STATIC_TARGETS },
    {
      group: "Categories",
      options: categories.map((c) => ({ value: `category:${c.slug}`, label: c.name, tableLabel: `Category · ${c.name}` })),
    },
    {
      group: "Collections",
      options: collections.map((c) => ({ value: `collection:${c.slug}`, label: c.name, tableLabel: `Collection · ${c.name}` })),
    },
  ].filter((g) => g.options.length);

  const labelFor = (key) => {
    const k = key || "all";
    const hit = groups.flatMap((g) => g.options).find((o) => o.value === k);
    return hit ? hit.tableLabel || hit.label : k; // unknown / deleted category → raw key
  };

  return { groups, labelFor };
}
