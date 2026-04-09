#!/usr/bin/env node
/**
 * Auto-generated asset implementation script for vothienhien.com
 * Generated: 2026-04-08T10:39:46.457Z
 *
 * This script copies all generated images into public/images/
 * and outputs a mapping file the site code can import.
 *
 * Usage: node scripts/implement-assets.js
 */

const fs = require("fs");
const path = require("path");

const ASSETS = [
  {
    "id": "hero-portrait",
    "name": "Homepage Hero Portrait",
    "category": "hero",
    "width": 1920,
    "aspect": "16:9",
    "cdn_url": "https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/hero/hero-portrait-8ed7de4d.webp",
    "local_path": null,
    "alt": "Homepage Hero Portrait - vothienhien.com"
  },
  {
    "id": "profile-hero",
    "name": "Profile Page Hero - Desk Portrait",
    "category": "hero",
    "width": 1600,
    "aspect": "16:9",
    "cdn_url": "https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/hero/profile-hero-6c5a93e0.webp",
    "local_path": "assets/hero/profile-hero.webp",
    "alt": "Profile Page Hero - Desk Portrait - vothienhien.com"
  },
  {
    "id": "detail-hands",
    "name": "Detail Accent Shot - Hands with Pen",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/content/detail-hands-34b089bb.webp",
    "local_path": "assets/content/detail-hands.webp",
    "alt": "Detail Accent Shot - Hands with Pen - vothienhien.com"
  },
  {
    "id": "practice-civil",
    "name": "Practice Area - Civil Disputes",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/content/practice-civil-9e32fb02.webp",
    "local_path": "assets/content/practice-civil.webp",
    "alt": "Practice Area - Civil Disputes - vothienhien.com"
  },
  {
    "id": "practice-land",
    "name": "Practice Area - Land & Real Estate",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/content/practice-land-bbc1cc7f.webp",
    "local_path": "assets/content/practice-land.webp",
    "alt": "Practice Area - Land & Real Estate - vothienhien.com"
  },
  {
    "id": "practice-family",
    "name": "Practice Area - Family Law & Divorce",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/content/practice-family-c50dd275.webp",
    "local_path": "assets/content/practice-family.webp",
    "alt": "Practice Area - Family Law & Divorce - vothienhien.com"
  },
  {
    "id": "practice-corporate",
    "name": "Practice Area - Corporate Law",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/content/practice-corporate-5f2c5501.webp",
    "local_path": "assets/content/practice-corporate.webp",
    "alt": "Practice Area - Corporate Law - vothienhien.com"
  },
  {
    "id": "practice-labor",
    "name": "Practice Area - Labor Disputes",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/content/practice-labor-aec105be.webp",
    "local_path": "assets/content/practice-labor.webp",
    "alt": "Practice Area - Labor Disputes - vothienhien.com"
  },
  {
    "id": "practice-criminal",
    "name": "Practice Area - Criminal Defense",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/content/practice-criminal-59f8f545.webp",
    "local_path": "assets/content/practice-criminal.webp",
    "alt": "Practice Area - Criminal Defense - vothienhien.com"
  },
  {
    "id": "bg-library",
    "name": "Library / Publications Background",
    "category": "background",
    "width": 1920,
    "aspect": "16:9",
    "cdn_url": "https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/background/bg-library-f8675605.webp",
    "local_path": "assets/background/bg-library.webp",
    "alt": "Library / Publications Background - vothienhien.com"
  },
  {
    "id": "bg-skyline",
    "name": "HCMC Skyline Panoramic",
    "category": "background",
    "width": 1920,
    "aspect": "21:9",
    "cdn_url": "https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/background/bg-skyline-4d8d3819.webp",
    "local_path": "assets/background/bg-skyline.webp",
    "alt": "HCMC Skyline Panoramic - vothienhien.com"
  },
  {
    "id": "accent-gold-stroke",
    "name": "Gold Brushstroke Decorative Element",
    "category": "content",
    "width": 800,
    "aspect": "16:9",
    "cdn_url": "https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/content/accent-gold-stroke-4de2a341.webp",
    "local_path": "assets/content/accent-gold-stroke.webp",
    "alt": "Gold Brushstroke Decorative Element - vothienhien.com"
  },
  {
    "id": "bg-marble",
    "name": "Dark Marble Texture Background",
    "category": "background",
    "width": 1920,
    "aspect": "16:9",
    "cdn_url": "https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/background/bg-marble-5a92903f.webp",
    "local_path": "assets/background/bg-marble.webp",
    "alt": "Dark Marble Texture Background - vothienhien.com"
  },
  {
    "id": "bg-speaking",
    "name": "Conference / Speaking Event",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/content/bg-speaking-d2c1c550.webp",
    "local_path": "assets/content/bg-speaking.webp",
    "alt": "Conference / Speaking Event - vothienhien.com"
  },
  {
    "id": "bg-district1",
    "name": "District 1 HCMC Aerial",
    "category": "background",
    "width": 1600,
    "aspect": "16:9",
    "cdn_url": "https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/background/bg-district1-83512275.webp",
    "local_path": "assets/background/bg-district1.webp",
    "alt": "District 1 HCMC Aerial - vothienhien.com"
  },
  {
    "id": "og-default",
    "name": "Default OG / Social Sharing Image",
    "category": "og",
    "width": 1200,
    "aspect": "1200:630",
    "cdn_url": "https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/og/og-default-a229973b.webp",
    "local_path": "assets/og/og-default.webp",
    "alt": "Default OG / Social Sharing Image - vothienhien.com"
  },
  {
    "id": "og-practice",
    "name": "Practice Areas OG Image",
    "category": "og",
    "width": 1200,
    "aspect": "1200:630",
    "cdn_url": "https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/og/og-practice-f106e559.webp",
    "local_path": "assets/og/og-practice.webp",
    "alt": "Practice Areas OG Image - vothienhien.com"
  },
  {
    "id": "favicon-vh",
    "name": "VH Monogram Favicon/App Icon",
    "category": "icon",
    "width": 512,
    "aspect": "1:1",
    "cdn_url": "https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/icon/favicon-vh-8cdbcafc.webp",
    "local_path": "assets/icon/favicon-vh.webp",
    "alt": "VH Monogram Favicon/App Icon - vothienhien.com"
  }
];

const PUBLIC_DIR = path.resolve(__dirname, "../public/images");

function main() {
  console.log("\n=== Implementing Image Assets for vothienhien.com ===\n");

  // Create public/images directories
  const categories = [...new Set(ASSETS.map(a => a.category))];
  for (const cat of categories) {
    fs.mkdirSync(path.join(PUBLIC_DIR, cat), { recursive: true });
  }

  // Copy local assets to public/images/
  let copied = 0;
  for (const asset of ASSETS) {
    if (asset.local_path) {
      const src = path.resolve(__dirname, "..", asset.local_path);
      const dest = path.join(PUBLIC_DIR, asset.category, asset.id + ".webp");
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`  Copied: ${asset.id}.webp → public/images/${asset.category}/`);
        copied++;
      } else {
        console.log(`  SKIP (no local file): ${asset.id}`);
      }
    }
  }

  // Generate TypeScript image map for the site code
  const tsMap = `// Auto-generated image asset map for vothienhien.com
// Generated: 2026-04-08T10:39:46.458Z
// Usage: import { IMAGES } from "@/lib/images";
//        <Image src={IMAGES.heroPortrait.cdn} alt={IMAGES.heroPortrait.alt} />

export const IMAGES = {
${ASSETS.map(a => {
    const key = a.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const cdn = a.cdn_url ? `"${a.cdn_url}"` : "null";
    const local = `"/images/${a.category}/${a.id}.webp"`;
    return `  ${key}: {
    id: "${a.id}",
    name: "${a.name}",
    category: "${a.category}",
    cdn: ${cdn},
    local: ${local},
    src: ${cdn} || ${local},
    alt: "${a.alt}",
    width: ${a.width},
    aspect: "${a.aspect}",
  }`;
  }).join(",\n")}
} as const;

export type ImageId = keyof typeof IMAGES;
`;

  const libDir = path.resolve(__dirname, "../src/lib");
  fs.mkdirSync(libDir, { recursive: true });
  fs.writeFileSync(path.join(libDir, "images.ts"), tsMap);
  console.log(`\n  Generated: src/lib/images.ts (${ASSETS.length} images)`);

  // Generate a quick reference markdown
  let readme = "# Image Assets\n\n";
  readme += "| Variable | CDN URL | Local | Alt |\n";
  readme += "|----------|---------|-------|-----|\n";
  for (const a of ASSETS) {
    const key = a.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    readme += `| IMAGES.${key} | ${a.cdn_url || "N/A"} | /images/${a.category}/${a.id}.webp | ${a.alt} |\n`;
  }
  fs.writeFileSync(path.join(PUBLIC_DIR, "README.md"), readme);

  console.log(`\n=== Done! ${copied} files copied, images.ts generated ===`);
  console.log("\nNext steps for the agent:");
  console.log("  1. Import { IMAGES } from '@/lib/images' in your components");
  console.log("  2. Use IMAGES.heroPortrait.src for the src prop");
  console.log("  3. Use IMAGES.heroPortrait.alt for the alt prop");
  console.log("  4. CDN URLs are preferred (IMAGES.xxx.cdn), local fallback (IMAGES.xxx.local)\n");
}

main();
