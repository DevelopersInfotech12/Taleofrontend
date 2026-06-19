"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "../lib/CartContext";
import { useAuth } from "../lib/AuthContext";

const navLinks = [
  { href: "/", label: "Home", hasDropdown: false },
  { href: "/shop", label: "Shop", hasDropdown: true },
  { href: "/bestarrivals", label: "Best Arrivals", hasDropdown: false },
  { href: "/rings", label: "Rings", hasDropdown: false },
  { href: "/earrings", label: "Earrings", hasDropdown: false },
  { href: "/necklaces", label: "Necklaces", hasDropdown: false },
  { href: "/bracelets", label: "Bracelets", hasDropdown: false },
  { href: "/blog", label: "Journal", hasDropdown: false },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count: cartCount } = useCart();
  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement Bar */}
      <div className="relative flex items-center bg-[#3d1f10] text-[#e8d5b0] overflow-hidden h-[34px]">

        {/* Left Offer Box */}
        <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center bg-[#1a0c06] px-6 border-r border-[#c9a96e]/20">
          <Link
            href="/offers"
            className="text-[11px] tracking-[0.15em] uppercase text-[#c9a96e] hover:text-[#e8d5b0] transition-colors whitespace-nowrap"
          >
            Offers
          </Link>
        </div>

        {/* Marquee */}
        <div className="w-full overflow-hidden pl-[110px]">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="mx-10 text-[11px] tracking-[0.22em] uppercase font-poppins font-semibold"
              >
                ✦ Complimentary Worldwide Shipping
                &nbsp;&nbsp;&nbsp;
                ✦ New Arrivals: Summer Collection
                &nbsp;&nbsp;&nbsp;
                ✦ Free Gift Wrapping on Orders Above ₹5000
                &nbsp;&nbsp;&nbsp;
                ✦ Use Code TALOE10 for 10% Off First Order
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main nav — dark brown always */}
      <nav
        className={`bg-[#1a0c06] transition-all duration-500 ${scrolled
            ? "shadow-[0_2px_24px_rgba(0,0,0,0.4)]"
            : ""
          }`}
      >
        <div className="max-w-[1320px] mx-auto px-8 h-[80px] flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Taleo Fine Jewellery"
              width={520}
              height={1000}
              priority
              className="h-16 md:h-20 lg:h-24 w-auto"
            />
          </Link>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-9">
            {navLinks.map(({ href, label, hasDropdown }) => {
              const active = pathname === href;
              return (
                <div key={href} className="relative group">
                  <Link
                    href={href}
                    className={`flex items-center gap-1 text-[11.5px] tracking-[0.14em] font-poppins font-[700] uppercase transition-colors duration-200 pb-1 ${active ? "text-[#c9a96e]" : "text-[#e8d5b0]/85 hover:text-[#c9a96e]"
                      }`}
                  >
                    {label}
                    {hasDropdown && (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-50 group-hover:opacity-100 group-hover:rotate-180 transition-transform duration-300">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    )}
                  </Link>
                  {/* Active / hover underline */}
                  <span className={`absolute bottom-0 left-0 h-px bg-[#c9a96e] transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                </div>
              );
            })}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-5">
            <button className="text-[#e8d5b0]/80 hover:text-[#c9a96e] transition-colors duration-200 hidden sm:block">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </button>
            <Link href="/account" className={`transition-colors duration-200 hidden sm:block ${user ? "text-[#c9a96e]" : "text-[#e8d5b0]/80 hover:text-[#c9a96e]"}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </Link>
            <Link href="/cart" className="relative text-[#e8d5b0]/80 hover:text-[#c9a96e] transition-colors duration-200">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#c9a96e] text-[#1a0c06] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-[#e8d5b0] ml-2">
              {menuOpen
                ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
                : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              }
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-400 ${menuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="bg-[#1a0c06] border-t border-[#c9a96e]/15 px-8 py-4 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                className="text-[13px] tracking-[0.1em] uppercase font-[family-name:var(--font-jost)] text-[#e8d5b0]/80 hover:text-[#c9a96e] py-2.5 border-b border-[#c9a96e]/10 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
