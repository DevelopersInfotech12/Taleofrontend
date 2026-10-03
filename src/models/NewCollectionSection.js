import mongoose from "mongoose";

/**
 * Singleton document powering the homepage "New Collection — Eternal Beauty"
 * section (Components/home/NewCollectionBanner.jsx). Fully managed from the
 * admin panel — image + all copy + pills + both buttons.
 */
const newCollectionSectionSchema = new mongoose.Schema(
  {
    // Image on the left (Cloudinary URL). Blank = frontend keeps built-in image.
    image: { type: String, default: "" },
    imageAlt: { type: String, trim: true, default: "Eternal Beauty jewellery" },

    // Small line above the headline
    eyebrow: { type: String, trim: true, default: "New Collection · 2025" },

    // Headline: main (bold) + accent (italic, gold)
    headingMain: { type: String, trim: true, default: "Eternal" },
    headingAccent: { type: String, trim: true, default: "Beauty." },

    // Paragraph
    body: {
      type: String,
      trim: true,
      default:
        "Each piece cast in 22k chocolate gold, stone-set by hand in batches of forty. Created in limited numbers to preserve exclusivity and craftsmanship. Every detail is meticulously finished by skilled artisans, ensuring exceptional quality. Designed to be treasured today and passed down for generations.",
    },

    // Small outlined tags under the paragraph
    pills: { type: [String], default: ["22k Gold", "Hand-set stones", "40 pieces only"] },

    // Primary (filled) + secondary (text) buttons
    primaryButtonLabel: { type: String, trim: true, default: "Discover Now" },
    primaryButtonHref: { type: String, trim: true, default: "/collections/eternal-beauty" },
    secondaryButtonLabel: { type: String, trim: true, default: "Browse all →" },
    secondaryButtonHref: { type: String, trim: true, default: "/collections" },
  },
  { timestamps: true }
);

const NewCollectionSection = mongoose.model("NewCollectionSection", newCollectionSectionSchema);
export default NewCollectionSection;
