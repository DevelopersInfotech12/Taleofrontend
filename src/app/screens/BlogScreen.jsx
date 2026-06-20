// BlogScreen.jsx
"use client";
import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import BlogHero from "../Components/blog/BlogHero";
import FeaturedSection from "../Components/blog/FeaturedSection";
import DiscoverSection from "../Components/blog/DiscoverSection";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const BlogScreen = () => {
  const router = useRouter();
  const [featuredSlug, setFeaturedSlug] = useState(null);

  useEffect(() => {
    fetch(`${API}/blogs/published?limit=1`)
      .then(r => r.json())
      .then(d => {
        const list = d.data?.blogs ?? d.data ?? [];
        if (list[0]?.slug) setFeaturedSlug(list[0].slug);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <Navbar />
      <BlogHero onCtaClick={() => featuredSlug && router.push(`/blog/${featuredSlug}`)} />
      <DiscoverSection />
      <FeaturedSection />
      <Footer />
    </div>
  );
};

export default BlogScreen;