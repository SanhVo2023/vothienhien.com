#!/usr/bin/env node
/**
 * Auto-generated asset implementation script for vothienhien.com
 * Generated: 2026-05-18T19:08:50.684Z
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
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/hero/hero-portrait-8ed7de4d.webp",
    "local_path": null,
    "alt": "Homepage Hero Portrait - vothienhien.com"
  },
  {
    "id": "profile-hero",
    "name": "Profile Page Hero - Desk Portrait",
    "category": "hero",
    "width": 1600,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/hero/profile-hero-6c5a93e0.webp",
    "local_path": "assets/hero/profile-hero.webp",
    "alt": "Profile Page Hero - Desk Portrait - vothienhien.com"
  },
  {
    "id": "detail-hands",
    "name": "Detail Accent Shot - Hands with Pen",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/detail-hands-34b089bb.webp",
    "local_path": "assets/content/detail-hands.webp",
    "alt": "Detail Accent Shot - Hands with Pen - vothienhien.com"
  },
  {
    "id": "practice-civil",
    "name": "Practice Area - Civil Disputes",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/practice-civil-9e32fb02.webp",
    "local_path": "assets/content/practice-civil.webp",
    "alt": "Practice Area - Civil Disputes - vothienhien.com"
  },
  {
    "id": "practice-land",
    "name": "Practice Area - Land & Real Estate",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/practice-land-bbc1cc7f.webp",
    "local_path": "assets/content/practice-land.webp",
    "alt": "Practice Area - Land & Real Estate - vothienhien.com"
  },
  {
    "id": "practice-family",
    "name": "Practice Area - Family Law & Divorce",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/practice-family-c50dd275.webp",
    "local_path": "assets/content/practice-family.webp",
    "alt": "Practice Area - Family Law & Divorce - vothienhien.com"
  },
  {
    "id": "practice-corporate",
    "name": "Practice Area - Corporate Law",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/practice-corporate-5f2c5501.webp",
    "local_path": "assets/content/practice-corporate.webp",
    "alt": "Practice Area - Corporate Law - vothienhien.com"
  },
  {
    "id": "practice-labor",
    "name": "Practice Area - Labor Disputes",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/practice-labor-aec105be.webp",
    "local_path": "assets/content/practice-labor.webp",
    "alt": "Practice Area - Labor Disputes - vothienhien.com"
  },
  {
    "id": "practice-criminal",
    "name": "Practice Area - Criminal Defense",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/practice-criminal-59f8f545.webp",
    "local_path": "assets/content/practice-criminal.webp",
    "alt": "Practice Area - Criminal Defense - vothienhien.com"
  },
  {
    "id": "bg-library",
    "name": "Library / Publications Background",
    "category": "background",
    "width": 1920,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/background/bg-library-f8675605.webp",
    "local_path": "assets/background/bg-library.webp",
    "alt": "Library / Publications Background - vothienhien.com"
  },
  {
    "id": "bg-skyline",
    "name": "HCMC Skyline Panoramic",
    "category": "background",
    "width": 1920,
    "aspect": "21:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/background/bg-skyline-4d8d3819.webp",
    "local_path": "assets/background/bg-skyline.webp",
    "alt": "HCMC Skyline Panoramic - vothienhien.com"
  },
  {
    "id": "accent-gold-stroke",
    "name": "Gold Brushstroke Decorative Element",
    "category": "content",
    "width": 800,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/accent-gold-stroke-4de2a341.webp",
    "local_path": "assets/content/accent-gold-stroke.webp",
    "alt": "Gold Brushstroke Decorative Element - vothienhien.com"
  },
  {
    "id": "bg-marble",
    "name": "Dark Marble Texture Background",
    "category": "background",
    "width": 1920,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/background/bg-marble-5a92903f.webp",
    "local_path": "assets/background/bg-marble.webp",
    "alt": "Dark Marble Texture Background - vothienhien.com"
  },
  {
    "id": "bg-speaking",
    "name": "Conference / Speaking Event",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/bg-speaking-d2c1c550.webp",
    "local_path": "assets/content/bg-speaking.webp",
    "alt": "Conference / Speaking Event - vothienhien.com"
  },
  {
    "id": "bg-district1",
    "name": "District 1 HCMC Aerial",
    "category": "background",
    "width": 1600,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/background/bg-district1-83512275.webp",
    "local_path": "assets/background/bg-district1.webp",
    "alt": "District 1 HCMC Aerial - vothienhien.com"
  },
  {
    "id": "og-default",
    "name": "Default OG / Social Sharing Image",
    "category": "og",
    "width": 1200,
    "aspect": "1200:630",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/og/og-default-a229973b.webp",
    "local_path": "assets/og/og-default.webp",
    "alt": "Default OG / Social Sharing Image - vothienhien.com"
  },
  {
    "id": "og-practice",
    "name": "Practice Areas OG Image",
    "category": "og",
    "width": 1200,
    "aspect": "1200:630",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/og/og-practice-f106e559.webp",
    "local_path": "assets/og/og-practice.webp",
    "alt": "Practice Areas OG Image - vothienhien.com"
  },
  {
    "id": "favicon-vh",
    "name": "VH Monogram Favicon/App Icon",
    "category": "icon",
    "width": 512,
    "aspect": "1:1",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/icon/favicon-vh-8cdbcafc.webp",
    "local_path": "assets/icon/favicon-vh.webp",
    "alt": "VH Monogram Favicon/App Icon - vothienhien.com"
  },
  {
    "id": "article-corporate-law",
    "name": "Article Thumbnail - Corporate Law Analysis",
    "category": "content",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/article-corporate-law-cd404779.webp",
    "local_path": "assets/content/article-corporate-law.webp",
    "alt": "Article Thumbnail - Corporate Law Analysis - vothienhien.com"
  },
  {
    "id": "article-land-dispute",
    "name": "Article Thumbnail - Land & Property Disputes",
    "category": "content",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/article-land-dispute-28b8d87f.webp",
    "local_path": "assets/content/article-land-dispute.webp",
    "alt": "Article Thumbnail - Land & Property Disputes - vothienhien.com"
  },
  {
    "id": "article-foreign-investment",
    "name": "Article Thumbnail - Foreign Investment in Vietnam",
    "category": "content",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/article-foreign-investment-087a2566.webp",
    "local_path": "assets/content/article-foreign-investment.webp",
    "alt": "Article Thumbnail - Foreign Investment in Vietnam - vothienhien.com"
  },
  {
    "id": "article-divorce-international",
    "name": "Article Thumbnail - International Divorce",
    "category": "content",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/article-divorce-international-66f796f8.webp",
    "local_path": "assets/content/article-divorce-international.webp",
    "alt": "Article Thumbnail - International Divorce - vothienhien.com"
  },
  {
    "id": "article-labor-rights",
    "name": "Article Thumbnail - Labor Rights & Employment",
    "category": "content",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/article-labor-rights-f201efee.webp",
    "local_path": "assets/content/article-labor-rights.webp",
    "alt": "Article Thumbnail - Labor Rights & Employment - vothienhien.com"
  },
  {
    "id": "article-criminal-defense",
    "name": "Article Thumbnail - Criminal Defense & Rights",
    "category": "content",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/article-criminal-defense-3fb4bf85.webp",
    "local_path": "assets/content/article-criminal-defense.webp",
    "alt": "Article Thumbnail - Criminal Defense & Rights - vothienhien.com"
  },
  {
    "id": "section-consultation",
    "name": "Consultation Room - Practice Area Pages",
    "category": "content",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/section-consultation-09ce3923.webp",
    "local_path": "assets/content/section-consultation.webp",
    "alt": "Consultation Room - Practice Area Pages - vothienhien.com"
  },
  {
    "id": "section-courtroom",
    "name": "Vietnamese Courtroom Interior",
    "category": "content",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/section-courtroom-e20bbb8d.webp",
    "local_path": "assets/content/section-courtroom.webp",
    "alt": "Vietnamese Courtroom Interior - vothienhien.com"
  },
  {
    "id": "section-document-signing",
    "name": "Legal Document Signing Close-up",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/section-document-signing-63dc5758.webp",
    "local_path": "assets/content/section-document-signing.webp",
    "alt": "Legal Document Signing Close-up - vothienhien.com"
  },
  {
    "id": "section-client-meeting",
    "name": "Attorney-Client Meeting",
    "category": "content",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/section-client-meeting-e1f7235e.webp",
    "local_path": "assets/content/section-client-meeting.webp",
    "alt": "Attorney-Client Meeting - vothienhien.com"
  },
  {
    "id": "section-team-discussion",
    "name": "Legal Team Discussion",
    "category": "content",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/section-team-discussion-8b1a2a78.webp",
    "local_path": "assets/content/section-team-discussion.webp",
    "alt": "Legal Team Discussion - vothienhien.com"
  },
  {
    "id": "perspective-thought",
    "name": "Thoughtful Lawyer Portrait - Perspectives",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/perspective-thought-740b9752.webp",
    "local_path": "assets/content/perspective-thought.webp",
    "alt": "Thoughtful Lawyer Portrait - Perspectives - vothienhien.com"
  },
  {
    "id": "bg-legal-books",
    "name": "Legal Books Close-up Background",
    "category": "background",
    "width": 1920,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/background/bg-legal-books-abdaa863.webp",
    "local_path": "assets/background/bg-legal-books.webp",
    "alt": "Legal Books Close-up Background - vothienhien.com"
  },
  {
    "id": "bg-office-hallway",
    "name": "Law Office Hallway - Premium Interior",
    "category": "background",
    "width": 1920,
    "aspect": "21:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/background/bg-office-hallway-e2bffaa5.webp",
    "local_path": "assets/background/bg-office-hallway.webp",
    "alt": "Law Office Hallway - Premium Interior - vothienhien.com"
  },
  {
    "id": "icon-scales-gold",
    "name": "Gold Scales of Justice Icon",
    "category": "icon",
    "width": 512,
    "aspect": "1:1",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/icon/icon-scales-gold-b8487acf.webp",
    "local_path": "assets/icon/icon-scales-gold.webp",
    "alt": "Gold Scales of Justice Icon - vothienhien.com"
  },
  {
    "id": "map-hcmc-office",
    "name": "Stylized HCMC Office Location Map",
    "category": "content",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/map-hcmc-office-58683e9b.webp",
    "local_path": "assets/content/map-hcmc-office.webp",
    "alt": "Stylized HCMC Office Location Map - vothienhien.com"
  },
  {
    "id": "practice-commercial",
    "name": "Practice Area - Commercial Disputes",
    "category": "content",
    "width": 1200,
    "aspect": "3:2",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/practice-commercial-b5a1a6d9.webp",
    "local_path": "assets/content/practice-commercial.webp",
    "alt": "Practice Area - Commercial Disputes - vothienhien.com"
  },
  {
    "id": "article-commercial-arbitration",
    "name": "Article Thumbnail - Commercial Arbitration at VIAC",
    "category": "content",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/article-commercial-arbitration-d880f072.webp",
    "local_path": "assets/content/article-commercial-arbitration.webp",
    "alt": "Article Thumbnail - Commercial Arbitration at VIAC - vothienhien.com"
  },
  {
    "id": "article-commercial-litigation",
    "name": "Article Thumbnail - Commercial Court Litigation",
    "category": "content",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/article-commercial-litigation-5b2e9165.webp",
    "local_path": "assets/content/article-commercial-litigation.webp",
    "alt": "Article Thumbnail - Commercial Court Litigation - vothienhien.com"
  },
  {
    "id": "section-arbitration-hearing",
    "name": "Arbitration Hearing in Progress",
    "category": "content",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/content/section-arbitration-hearing-16452da6.webp",
    "local_path": "assets/content/section-arbitration-hearing.webp",
    "alt": "Arbitration Hearing in Progress - vothienhien.com"
  },
  {
    "id": "bg-commercial-skyline",
    "name": "HCMC Financial District - Commercial Context",
    "category": "background",
    "width": 1920,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/background/bg-commercial-skyline-b4d48c2b.webp",
    "local_path": "assets/background/bg-commercial-skyline.webp",
    "alt": "HCMC Financial District - Commercial Context - vothienhien.com"
  },
  {
    "id": "og-commercial",
    "name": "Commercial Disputes OG Image",
    "category": "og",
    "width": 1200,
    "aspect": "1200:630",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/og/og-commercial-2c393856.webp",
    "local_path": "assets/og/og-commercial.webp",
    "alt": "Commercial Disputes OG Image - vothienhien.com"
  },
  {
    "id": "logo-symbolic-1-scales",
    "name": "Logo Variation 1 — Bold Scales of Justice",
    "category": "icon",
    "width": 1024,
    "aspect": "1:1",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/icon/logo-symbolic-1-scales-e3a0ad3c.webp",
    "local_path": "assets/icon/logo-symbolic-1-scales.webp",
    "alt": "Logo Variation 1 — Bold Scales of Justice - vothienhien.com"
  },
  {
    "id": "logo-symbolic-2-pillar",
    "name": "Logo Variation 2 — Classical Pillar of Law",
    "category": "icon",
    "width": 1024,
    "aspect": "1:1",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/icon/logo-symbolic-2-pillar-591535f2.webp",
    "local_path": "assets/icon/logo-symbolic-2-pillar.webp",
    "alt": "Logo Variation 2 — Classical Pillar of Law - vothienhien.com"
  },
  {
    "id": "logo-symbolic-3-gavel-book",
    "name": "Logo Variation 3 — Gavel and Open Book Crest",
    "category": "icon",
    "width": 1024,
    "aspect": "1:1",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/icon/logo-symbolic-3-gavel-book-dd31767a.webp",
    "local_path": "assets/icon/logo-symbolic-3-gavel-book.webp",
    "alt": "Logo Variation 3 — Gavel and Open Book Crest - vothienhien.com"
  },
  {
    "id": "logo-symbolic-4-laurel-scales",
    "name": "Logo Variation 4 — Laurel Wreath Around Scales",
    "category": "icon",
    "width": 1024,
    "aspect": "1:1",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/icon/logo-symbolic-4-laurel-scales-9484800b.webp",
    "local_path": "assets/icon/logo-symbolic-4-laurel-scales.webp",
    "alt": "Logo Variation 4 — Laurel Wreath Around Scales - vothienhien.com"
  },
  {
    "id": "article-work-permit-requirements-vietnam-complete-guide",
    "name": "Work Permit Requirements in Vietnam: Complete Guide for E…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-work-permit-requirements-vietnam-complete-guide-9d5cb244.webp",
    "local_path": "assets/blog/article-work-permit-requirements-vietnam-complete-guide.webp",
    "alt": "Work Permit Requirements in Vietnam: Complete Guide for E… - vothienhien.com"
  },
  {
    "id": "article-banking-finance-regulations-vietnam-foreign-investors",
    "name": "Banking and Finance Regulations in Vietnam: Guide for For…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-banking-finance-regulations-vietnam-foreign-investors-10cf1a48.webp",
    "local_path": "assets/blog/article-banking-finance-regulations-vietnam-foreign-investors.webp",
    "alt": "Banking and Finance Regulations in Vietnam: Guide for For… - vothienhien.com"
  },
  {
    "id": "article-environmental-law-compliance-vietnam-industrial-projects",
    "name": "Environmental Law Compliance in Vietnam: Requirements for…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-environmental-law-compliance-vietnam-industrial-projects-2ec5e72c.webp",
    "local_path": "assets/blog/article-environmental-law-compliance-vietnam-industrial-projects.webp",
    "alt": "Environmental Law Compliance in Vietnam: Requirements for… - vothienhien.com"
  },
  {
    "id": "article-vietnam-e-commerce-regulations-legal-compliance",
    "name": "Vietnam E-Commerce Regulations: Legal Compliance for Onli…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-vietnam-e-commerce-regulations-legal-compliance-b520df6a.webp",
    "local_path": "assets/blog/article-vietnam-e-commerce-regulations-legal-compliance.webp",
    "alt": "Vietnam E-Commerce Regulations: Legal Compliance for Onli… - vothienhien.com"
  },
  {
    "id": "article-joint-ventures-vietnam-legal-structure-governance-exit",
    "name": "Joint Ventures in Vietnam: Legal Structure, Governance, a…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-joint-ventures-vietnam-legal-structure-governance-exit-cb3cec44.webp",
    "local_path": "assets/blog/article-joint-ventures-vietnam-legal-structure-governance-exit.webp",
    "alt": "Joint Ventures in Vietnam: Legal Structure, Governance, a… - vothienhien.com"
  },
  {
    "id": "article-inheritance-law-vietnam-rights-foreign-heirs",
    "name": "Inheritance Law in Vietnam: Rights of Foreign Heirs",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-inheritance-law-vietnam-rights-foreign-heirs-944624cf.webp",
    "local_path": "assets/blog/article-inheritance-law-vietnam-rights-foreign-heirs.webp",
    "alt": "Inheritance Law in Vietnam: Rights of Foreign Heirs - vothienhien.com"
  },
  {
    "id": "article-data-privacy-law-vietnam-pdpd-compliance-guide",
    "name": "Data Privacy Law in Vietnam: PDPD Compliance Guide for Bu…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-data-privacy-law-vietnam-pdpd-compliance-guide-76a24d43.webp",
    "local_path": "assets/blog/article-data-privacy-law-vietnam-pdpd-compliance-guide.webp",
    "alt": "Data Privacy Law in Vietnam: PDPD Compliance Guide for Bu… - vothienhien.com"
  },
  {
    "id": "article-vietnam-construction-law-permits-contracts-disputes",
    "name": "Vietnam Construction Law: Permits, Contracts, and Dispute…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-vietnam-construction-law-permits-contracts-disputes-fef094d4.webp",
    "local_path": "assets/blog/article-vietnam-construction-law-permits-contracts-disputes.webp",
    "alt": "Vietnam Construction Law: Permits, Contracts, and Dispute… - vothienhien.com"
  },
  {
    "id": "article-protecting-trade-secrets-vietnam-legal-framework",
    "name": "Protecting Trade Secrets in Vietnam: Legal Framework and …",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-protecting-trade-secrets-vietnam-legal-framework-7150cf43.webp",
    "local_path": "assets/blog/article-protecting-trade-secrets-vietnam-legal-framework.webp",
    "alt": "Protecting Trade Secrets in Vietnam: Legal Framework and … - vothienhien.com"
  },
  {
    "id": "article-tax-obligations-foreign-companies-operating-vietnam",
    "name": "Tax Obligations for Foreign Companies Operating in Vietnam",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-tax-obligations-foreign-companies-operating-vietnam-79c9e645.webp",
    "local_path": "assets/blog/article-tax-obligations-foreign-companies-operating-vietnam.webp",
    "alt": "Tax Obligations for Foreign Companies Operating in Vietnam - vothienhien.com"
  },
  {
    "id": "article-vietnam-franchise-law-foreign-franchisors",
    "name": "Vietnam Franchise Law: Legal Requirements for Foreign Fra…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-vietnam-franchise-law-foreign-franchisors-24b542fd.webp",
    "local_path": "assets/blog/article-vietnam-franchise-law-foreign-franchisors.webp",
    "alt": "Vietnam Franchise Law: Legal Requirements for Foreign Fra… - vothienhien.com"
  },
  {
    "id": "article-dispute-resolution-vietnam-litigation-arbitration-mediation",
    "name": "Dispute Resolution in Vietnam: Litigation vs Arbitration …",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-dispute-resolution-vietnam-litigation-arbitration-mediation-2f0daad2.webp",
    "local_path": "assets/blog/article-dispute-resolution-vietnam-litigation-arbitration-mediation.webp",
    "alt": "Dispute Resolution in Vietnam: Litigation vs Arbitration … - vothienhien.com"
  },
  {
    "id": "article-understanding-vietnam-labor-law-guide-foreign-employers",
    "name": "Understanding Vietnam Labor Law: A Guide for Foreign Empl…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-understanding-vietnam-labor-law-guide-foreign-employers-88406995.webp",
    "local_path": "assets/blog/article-understanding-vietnam-labor-law-guide-foreign-employers.webp",
    "alt": "Understanding Vietnam Labor Law: A Guide for Foreign Empl… - vothienhien.com"
  },
  {
    "id": "article-vietnam-real-estate-purchase-agreement-foreign-buyers",
    "name": "Vietnam Real Estate Purchase Agreement: Essential Clauses…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-vietnam-real-estate-purchase-agreement-foreign-buyers-b768f167.webp",
    "local_path": "assets/blog/article-vietnam-real-estate-purchase-agreement-foreign-buyers.webp",
    "alt": "Vietnam Real Estate Purchase Agreement: Essential Clauses… - vothienhien.com"
  },
  {
    "id": "article-quy-trinh-giam-doc-tham-tai-tham-to-tung-dan-su",
    "name": "Quy Trình Giám Đốc Thẩm và Tái Thẩm Trong Tố Tụng Dân Sự",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-quy-trinh-giam-doc-tham-tai-tham-to-tung-dan-su-7e0e20d0.webp",
    "local_path": "assets/blog/article-quy-trinh-giam-doc-tham-tai-tham-to-tung-dan-su.webp",
    "alt": "Quy Trình Giám Đốc Thẩm và Tái Thẩm Trong Tố Tụng Dân Sự - vothienhien.com"
  },
  {
    "id": "article-phap-luat-hop-dong-dien-tu-tai-viet-nam",
    "name": "Pháp Luật Về Hợp Đồng Điện Tử Tại Việt Nam",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-phap-luat-hop-dong-dien-tu-tai-viet-nam-4e0b1fc1.webp",
    "local_path": "assets/blog/article-phap-luat-hop-dong-dien-tu-tai-viet-nam.webp",
    "alt": "Pháp Luật Về Hợp Đồng Điện Tử Tại Việt Nam - vothienhien.com"
  },
  {
    "id": "article-huong-dan-khieu-nai-quyet-dinh-hanh-chinh-dat-dai",
    "name": "Hướng Dẫn Khiếu Nại Quyết Định Hành Chính Về Đất Đai",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-huong-dan-khieu-nai-quyet-dinh-hanh-chinh-dat-dai-1d464cc9.webp",
    "local_path": "assets/blog/article-huong-dan-khieu-nai-quyet-dinh-hanh-chinh-dat-dai.webp",
    "alt": "Hướng Dẫn Khiếu Nại Quyết Định Hành Chính Về Đất Đai - vothienhien.com"
  },
  {
    "id": "article-giai-quyet-tranh-chap-giua-thanh-vien-cong-ty-tnhh",
    "name": "Giải Quyết Tranh Chấp Giữa Thành Viên Công Ty TNHH",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-giai-quyet-tranh-chap-giua-thanh-vien-cong-ty-tnhh-5f1577a5.webp",
    "local_path": "assets/blog/article-giai-quyet-tranh-chap-giua-thanh-vien-cong-ty-tnhh.webp",
    "alt": "Giải Quyết Tranh Chấp Giữa Thành Viên Công Ty TNHH - vothienhien.com"
  },
  {
    "id": "article-quyen-so-huu-tri-tue-thoi-dai-so-bao-ve-tac-pham",
    "name": "Quyền Sở Hữu Trí Tuệ Trong Thời Đại Số: Bảo Vệ Tác Phẩm O…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-quyen-so-huu-tri-tue-thoi-dai-so-bao-ve-tac-pham-eb51a939.webp",
    "local_path": "assets/blog/article-quyen-so-huu-tri-tue-thoi-dai-so-bao-ve-tac-pham.webp",
    "alt": "Quyền Sở Hữu Trí Tuệ Trong Thời Đại Số: Bảo Vệ Tác Phẩm O… - vothienhien.com"
  },
  {
    "id": "article-boi-thuong-tai-nan-giao-thong-quy-dinh-thuc-tien",
    "name": "Bồi Thường Khi Bị Tai Nạn Giao Thông: Quy Định và Thực Tiễn",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-boi-thuong-tai-nan-giao-thong-quy-dinh-thuc-tien-1f1e7df9.webp",
    "local_path": "assets/blog/article-boi-thuong-tai-nan-giao-thong-quy-dinh-thuc-tien.webp",
    "alt": "Bồi Thường Khi Bị Tai Nạn Giao Thông: Quy Định và Thực Tiễn - vothienhien.com"
  },
  {
    "id": "article-phap-luat-cho-vay-ngang-hang-p2p-lending-viet-nam",
    "name": "Pháp Luật Về Cho Vay Ngang Hàng (P2P Lending) Tại Việt Nam",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-phap-luat-cho-vay-ngang-hang-p2p-lending-viet-nam-75cc144d.webp",
    "local_path": "assets/blog/article-phap-luat-cho-vay-ngang-hang-p2p-lending-viet-nam.webp",
    "alt": "Pháp Luật Về Cho Vay Ngang Hàng (P2P Lending) Tại Việt Nam - vothienhien.com"
  },
  {
    "id": "article-quy-trinh-thi-hanh-an-dan-su-tu-ban-an-den-thuc-thi",
    "name": "Quy Trình Thi Hành Án Dân Sự: Từ Bản Án Đến Thực Thi",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-quy-trinh-thi-hanh-an-dan-su-tu-ban-an-den-thuc-thi-48afd2d7.webp",
    "local_path": "assets/blog/article-quy-trinh-thi-hanh-an-dan-su-tu-ban-an-den-thuc-thi.webp",
    "alt": "Quy Trình Thi Hành Án Dân Sự: Từ Bản Án Đến Thực Thi - vothienhien.com"
  },
  {
    "id": "article-luat-nha-o-2023-thay-doi-anh-huong-nguoi-mua-nha",
    "name": "Luật Nhà Ở 2023: Những Thay Đổi Ảnh Hưởng Đến Người Mua Nhà",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-luat-nha-o-2023-thay-doi-anh-huong-nguoi-mua-nha-d96519b6.webp",
    "local_path": "assets/blog/article-luat-nha-o-2023-thay-doi-anh-huong-nguoi-mua-nha.webp",
    "alt": "Luật Nhà Ở 2023: Những Thay Đổi Ảnh Hưởng Đến Người Mua Nhà - vothienhien.com"
  },
  {
    "id": "article-giai-quyet-tranh-chap-bang-hoa-giai",
    "name": "Giải Quyết Tranh Chấp Bằng Hòa Giải: Phương Thức Thay Thế…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-giai-quyet-tranh-chap-bang-hoa-giai-8cf842a3.webp",
    "local_path": "assets/blog/article-giai-quyet-tranh-chap-bang-hoa-giai.webp",
    "alt": "Giải Quyết Tranh Chấp Bằng Hòa Giải: Phương Thức Thay Thế… - vothienhien.com"
  },
  {
    "id": "article-thu-tuc-xin-cap-phep-xay-dung-huong-dan",
    "name": "Thủ Tục Xin Cấp Phép Xây Dựng: Hướng Dẫn Chi Tiết",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-thu-tuc-xin-cap-phep-xay-dung-huong-dan-4c2c170a.webp",
    "local_path": "assets/blog/article-thu-tuc-xin-cap-phep-xay-dung-huong-dan.webp",
    "alt": "Thủ Tục Xin Cấp Phép Xây Dựng: Hướng Dẫn Chi Tiết - vothienhien.com"
  },
  {
    "id": "article-toi-pham-cong-nghe-cao-thuc-trang-phong-chong",
    "name": "Tội Phạm Công Nghệ Cao: Thực Trạng và Phòng Chống",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-toi-pham-cong-nghe-cao-thuc-trang-phong-chong-f73da41e.webp",
    "local_path": "assets/blog/article-toi-pham-cong-nghe-cao-thuc-trang-phong-chong.webp",
    "alt": "Tội Phạm Công Nghệ Cao: Thực Trạng và Phòng Chống - vothienhien.com"
  },
  {
    "id": "article-tranh-chap-hop-dong-thue-nha-quyen-nghia-vu",
    "name": "Tranh Chấp Hợp Đồng Thuê Nhà: Quyền Và Nghĩa Vụ Của Các Bên",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-tranh-chap-hop-dong-thue-nha-quyen-nghia-vu-f15a7ec2.webp",
    "local_path": "assets/blog/article-tranh-chap-hop-dong-thue-nha-quyen-nghia-vu.webp",
    "alt": "Tranh Chấp Hợp Đồng Thuê Nhà: Quyền Và Nghĩa Vụ Của Các Bên - vothienhien.com"
  },
  {
    "id": "article-bao-hiem-xa-hoi-mot-lan-dieu-kien-thu-tuc",
    "name": "Bảo Hiểm Xã Hội Một Lần: Điều Kiện, Thủ Tục và Lưu Ý",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-bao-hiem-xa-hoi-mot-lan-dieu-kien-thu-tuc-6bc9dbce.webp",
    "local_path": "assets/blog/article-bao-hiem-xa-hoi-mot-lan-dieu-kien-thu-tuc.webp",
    "alt": "Bảo Hiểm Xã Hội Một Lần: Điều Kiện, Thủ Tục và Lưu Ý - vothienhien.com"
  },
  {
    "id": "article-hop-dong-dat-coc-mua-bat-dong-san-rui-ro",
    "name": "Hợp Đồng Đặt Cọc Mua Bất Động Sản: Rủi Ro và Cách Phòng T…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-hop-dong-dat-coc-mua-bat-dong-san-rui-ro-09ac0993.webp",
    "local_path": "assets/blog/article-hop-dong-dat-coc-mua-bat-dong-san-rui-ro.webp",
    "alt": "Hợp Đồng Đặt Cọc Mua Bất Động Sản: Rủi Ro và Cách Phòng T… - vothienhien.com"
  },
  {
    "id": "article-pha-san-doanh-nghiep-quy-trinh-phap-ly-he-qua",
    "name": "Phá Sản Doanh Nghiệp: Quy Trình Pháp Lý Và Hệ Quả",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-pha-san-doanh-nghiep-quy-trinh-phap-ly-he-qua-d4893d82.webp",
    "local_path": "assets/blog/article-pha-san-doanh-nghiep-quy-trinh-phap-ly-he-qua.webp",
    "alt": "Phá Sản Doanh Nghiệp: Quy Trình Pháp Lý Và Hệ Quả - vothienhien.com"
  },
  {
    "id": "article-bao-ho-nhan-hieu-tai-viet-nam-dang-ky-bao-ve",
    "name": "Bảo Hộ Nhãn Hiệu Tại Việt Nam: Từ Đăng Ký Đến Bảo Vệ Quyền",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-bao-ho-nhan-hieu-tai-viet-nam-dang-ky-bao-ve-5a1e56c5.webp",
    "local_path": "assets/blog/article-bao-ho-nhan-hieu-tai-viet-nam-dang-ky-bao-ve.webp",
    "alt": "Bảo Hộ Nhãn Hiệu Tại Việt Nam: Từ Đăng Ký Đến Bảo Vệ Quyền - vothienhien.com"
  },
  {
    "id": "article-thu-tuc-dang-ky-ket-hon-voi-nguoi-nuoc-ngoai",
    "name": "Thủ Tục Đăng Ký Kết Hôn Với Người Nước Ngoài Tại Việt Nam",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-thu-tuc-dang-ky-ket-hon-voi-nguoi-nuoc-ngoai-069b8f21.webp",
    "local_path": "assets/blog/article-thu-tuc-dang-ky-ket-hon-voi-nguoi-nuoc-ngoai.webp",
    "alt": "Thủ Tục Đăng Ký Kết Hôn Với Người Nước Ngoài Tại Việt Nam - vothienhien.com"
  },
  {
    "id": "article-trong-tai-thuong-mai-viet-nam-uu-diem-quy-trinh",
    "name": "Trọng Tài Thương Mại Tại Việt Nam: Ưu Điểm Và Quy Trình",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-trong-tai-thuong-mai-viet-nam-uu-diem-quy-trinh-d14840b2.webp",
    "local_path": "assets/blog/article-trong-tai-thuong-mai-viet-nam-uu-diem-quy-trinh.webp",
    "alt": "Trọng Tài Thương Mại Tại Việt Nam: Ưu Điểm Và Quy Trình - vothienhien.com"
  },
  {
    "id": "article-luat-lao-dong-2019-quyen-loi-moi-nguoi-lao-dong",
    "name": "Luật Lao Động 2019: Quyền Lợi Mới Của Người Lao Động",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-luat-lao-dong-2019-quyen-loi-moi-nguoi-lao-dong-47fa4cbe.webp",
    "local_path": "assets/blog/article-luat-lao-dong-2019-quyen-loi-moi-nguoi-lao-dong.webp",
    "alt": "Luật Lao Động 2019: Quyền Lợi Mới Của Người Lao Động - vothienhien.com"
  },
  {
    "id": "article-giai-quyet-tranh-chap-thua-ke-tai-san",
    "name": "Giải Quyết Tranh Chấp Thừa Kế Tài Sản: Quy Trình và Kinh …",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-giai-quyet-tranh-chap-thua-ke-tai-san-35989cea.webp",
    "local_path": "assets/blog/article-giai-quyet-tranh-chap-thua-ke-tai-san.webp",
    "alt": "Giải Quyết Tranh Chấp Thừa Kế Tài Sản: Quy Trình và Kinh … - vothienhien.com"
  },
  {
    "id": "article-quyen-nguoi-tieu-dung-phap-luat-viet-nam",
    "name": "Quyền Của Người Tiêu Dùng Theo Pháp Luật Việt Nam: Bảo Vệ…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-quyen-nguoi-tieu-dung-phap-luat-viet-nam-f99381c5.webp",
    "local_path": "assets/blog/article-quyen-nguoi-tieu-dung-phap-luat-viet-nam.webp",
    "alt": "Quyền Của Người Tiêu Dùng Theo Pháp Luật Việt Nam: Bảo Vệ… - vothienhien.com"
  },
  {
    "id": "article-thanh-lap-cong-ty-von-dau-tu-nuoc-ngoai-viet-nam",
    "name": "Thành Lập Công Ty Có Vốn Đầu Tư Nước Ngoài Tại Việt Nam: …",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-thanh-lap-cong-ty-von-dau-tu-nuoc-ngoai-viet-nam-2ae4c69c.webp",
    "local_path": "assets/blog/article-thanh-lap-cong-ty-von-dau-tu-nuoc-ngoai-viet-nam.webp",
    "alt": "Thành Lập Công Ty Có Vốn Đầu Tư Nước Ngoài Tại Việt Nam: … - vothienhien.com"
  },
  {
    "id": "article-hop-dong-mua-ban-nha-dat-dieu-khoan-quan-trong",
    "name": "Hợp Đồng Mua Bán Nhà Đất: Những Điều Khoản Quan Trọng Cần…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-hop-dong-mua-ban-nha-dat-dieu-khoan-quan-trong-f0371fe6.webp",
    "local_path": "assets/blog/article-hop-dong-mua-ban-nha-dat-dieu-khoan-quan-trong.webp",
    "alt": "Hợp Đồng Mua Bán Nhà Đất: Những Điều Khoản Quan Trọng Cần… - vothienhien.com"
  },
  {
    "id": "article-how-to-choose-lawyer-vietnam-guide-international-clients",
    "name": "How to Choose a Lawyer in Vietnam: A Practical Guide for …",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-how-to-choose-lawyer-vietnam-guide-international-clients-bc257a9c.webp",
    "local_path": "assets/blog/article-how-to-choose-lawyer-vietnam-guide-international-clients.webp",
    "alt": "How to Choose a Lawyer in Vietnam: A Practical Guide for … - vothienhien.com"
  },
  {
    "id": "article-criminal-law-vietnam-what-foreign-nationals-need-to-know",
    "name": "Criminal Law in Vietnam: What Foreign Nationals Need to Know",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-criminal-law-vietnam-what-foreign-nationals-need-to-know-5df0a411.webp",
    "local_path": "assets/blog/article-criminal-law-vietnam-what-foreign-nationals-need-to-know.webp",
    "alt": "Criminal Law in Vietnam: What Foreign Nationals Need to Know - vothienhien.com"
  },
  {
    "id": "article-how-to-enforce-foreign-court-judgment-in-vietnam",
    "name": "How to Enforce a Foreign Court Judgment in Vietnam",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-how-to-enforce-foreign-court-judgment-in-vietnam-04561ca5.webp",
    "local_path": "assets/blog/article-how-to-enforce-foreign-court-judgment-in-vietnam.webp",
    "alt": "How to Enforce a Foreign Court Judgment in Vietnam - vothienhien.com"
  },
  {
    "id": "article-resolving-commercial-disputes-vietnam-litigation-vs-arbitration",
    "name": "Resolving Commercial Disputes in Vietnam: Litigation vs A…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-resolving-commercial-disputes-vietnam-litigation-vs-arbitration-5844c682.webp",
    "local_path": "assets/blog/article-resolving-commercial-disputes-vietnam-litigation-vs-arbitration.webp",
    "alt": "Resolving Commercial Disputes in Vietnam: Litigation vs A… - vothienhien.com"
  },
  {
    "id": "article-employment-law-vietnam-guide-foreign-employers-employees",
    "name": "Employment Law in Vietnam: A Guide for Foreign Employers …",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-employment-law-vietnam-guide-foreign-employers-employees-b3b01a7a.webp",
    "local_path": "assets/blog/article-employment-law-vietnam-guide-foreign-employers-employees.webp",
    "alt": "Employment Law in Vietnam: A Guide for Foreign Employers … - vothienhien.com"
  },
  {
    "id": "article-buying-property-vietnam-foreigner-legal-rights-restrictions-process",
    "name": "Buying Property in Vietnam as a Foreigner: Legal Rights, …",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-buying-property-vietnam-foreigner-legal-rights-restrictions-process-8ef0659c.webp",
    "local_path": "assets/blog/article-buying-property-vietnam-foreigner-legal-rights-restrictions-process.webp",
    "alt": "Buying Property in Vietnam as a Foreigner: Legal Rights, … - vothienhien.com"
  },
  {
    "id": "article-getting-divorced-vietnam-foreigner-guide",
    "name": "Getting Divorced in Vietnam as a Foreigner: Everything Yo…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-getting-divorced-vietnam-foreigner-guide-65233ddf.webp",
    "local_path": "assets/blog/article-getting-divorced-vietnam-foreigner-guide.webp",
    "alt": "Getting Divorced in Vietnam as a Foreigner: Everything Yo… - vothienhien.com"
  },
  {
    "id": "article-protecting-intellectual-property-vietnam-practical-legal-guide",
    "name": "Protecting Intellectual Property in Vietnam: A Practical …",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-protecting-intellectual-property-vietnam-practical-legal-guide-65631216.webp",
    "local_path": "assets/blog/article-protecting-intellectual-property-vietnam-practical-legal-guide.webp",
    "alt": "Protecting Intellectual Property in Vietnam: A Practical … - vothienhien.com"
  },
  {
    "id": "article-vietnam-ma-guide-legal-framework-due-diligence-deal-structures",
    "name": "Vietnam M&A Guide: Legal Framework, Due Diligence and Dea…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-vietnam-ma-guide-legal-framework-due-diligence-deal-structures-860570be.webp",
    "local_path": "assets/blog/article-vietnam-ma-guide-legal-framework-due-diligence-deal-structures.webp",
    "alt": "Vietnam M&A Guide: Legal Framework, Due Diligence and Dea… - vothienhien.com"
  },
  {
    "id": "article-setting-up-business-vietnam-foreign-investors-guide-2026",
    "name": "Setting Up a Business in Vietnam: Complete Legal Guide fo…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-setting-up-business-vietnam-foreign-investors-guide-2026-d1bf84f8.webp",
    "local_path": "assets/blog/article-setting-up-business-vietnam-foreign-investors-guide-2026.webp",
    "alt": "Setting Up a Business in Vietnam: Complete Legal Guide fo… - vothienhien.com"
  },
  {
    "id": "article-khi-nao-ban-can-thue-luat-su-10-tinh-huong-pho-bien-nhat",
    "name": "Khi Nào Bạn Cần Thuê Luật Sư? 10 Tình Huống Phổ Biến Nhất",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-khi-nao-ban-can-thue-luat-su-10-tinh-huong-pho-bien-nhat-0720f199.webp",
    "local_path": "assets/blog/article-khi-nao-ban-can-thue-luat-su-10-tinh-huong-pho-bien-nhat.webp",
    "alt": "Khi Nào Bạn Cần Thuê Luật Sư? 10 Tình Huống Phổ Biến Nhất - vothienhien.com"
  },
  {
    "id": "article-quyen-cua-bi-can-bi-cao-trong-to-tung-hinh-su-viet-nam",
    "name": "Quyền Của Bị Can Bị Cáo Trong Tố Tụng Hình Sự Việt Nam",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-quyen-cua-bi-can-bi-cao-trong-to-tung-hinh-su-viet-nam-ca002c3e.webp",
    "local_path": "assets/blog/article-quyen-cua-bi-can-bi-cao-trong-to-tung-hinh-su-viet-nam.webp",
    "alt": "Quyền Của Bị Can Bị Cáo Trong Tố Tụng Hình Sự Việt Nam - vothienhien.com"
  },
  {
    "id": "article-sa-thai-trai-phap-luat-quyen-nguoi-lao-dong-va-cach-khieu-nai",
    "name": "Sa Thải Trái Pháp Luật: Quyền Của Người Lao Động Và Cách …",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-sa-thai-trai-phap-luat-quyen-nguoi-lao-dong-va-cach-khieu-nai-8317837f.webp",
    "local_path": "assets/blog/article-sa-thai-trai-phap-luat-quyen-nguoi-lao-dong-va-cach-khieu-nai.webp",
    "alt": "Sa Thải Trái Pháp Luật: Quyền Của Người Lao Động Và Cách … - vothienhien.com"
  },
  {
    "id": "article-mua-ban-sap-nhap-doanh-nghiep-ma-tai-viet-nam-quy-trinh-phap-ly",
    "name": "Mua Bán Sáp Nhập Doanh Nghiệp (M&A) Tại Việt Nam: Quy Trì…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-mua-ban-sap-nhap-doanh-nghiep-ma-tai-viet-nam-quy-trinh-phap-ly-9ec42304.webp",
    "local_path": "assets/blog/article-mua-ban-sap-nhap-doanh-nghiep-ma-tai-viet-nam-quy-trinh-phap-ly.webp",
    "alt": "Mua Bán Sáp Nhập Doanh Nghiệp (M&A) Tại Việt Nam: Quy Trì… - vothienhien.com"
  },
  {
    "id": "article-quyen-nuoi-con-sau-ly-hon-phap-luat-va-thuc-tien-xet-xu",
    "name": "Quyền Nuôi Con Sau Ly Hôn: Pháp Luật Và Thực Tiễn Xét Xử",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-quyen-nuoi-con-sau-ly-hon-phap-luat-va-thuc-tien-xet-xu-7ac08b6e.webp",
    "local_path": "assets/blog/article-quyen-nuoi-con-sau-ly-hon-phap-luat-va-thuc-tien-xet-xu.webp",
    "alt": "Quyền Nuôi Con Sau Ly Hôn: Pháp Luật Và Thực Tiễn Xét Xử - vothienhien.com"
  },
  {
    "id": "article-ly-hon-co-yeu-to-nuoc-ngoai-tai-viet-nam-huong-dan-toan-dien",
    "name": "Ly Hôn Có Yếu Tố Nước Ngoài Tại Việt Nam: Hướng Dẫn Toàn …",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-ly-hon-co-yeu-to-nuoc-ngoai-tai-viet-nam-huong-dan-toan-dien-3fc2df20.webp",
    "local_path": "assets/blog/article-ly-hon-co-yeu-to-nuoc-ngoai-tai-viet-nam-huong-dan-toan-dien.webp",
    "alt": "Ly Hôn Có Yếu Tố Nước Ngoài Tại Việt Nam: Hướng Dẫn Toàn … - vothienhien.com"
  },
  {
    "id": "article-tranh-chap-dat-dai-tai-tphcm-nguyen-nhan-giai-phap-kinh-nghiem",
    "name": "Tranh Chấp Đất Đai Tại TP.HCM: Nguyên Nhân, Giải Pháp Và …",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-tranh-chap-dat-dai-tai-tphcm-nguyen-nhan-giai-phap-kinh-nghiem-040ee398.webp",
    "local_path": "assets/blog/article-tranh-chap-dat-dai-tai-tphcm-nguyen-nhan-giai-phap-kinh-nghiem.webp",
    "alt": "Tranh Chấp Đất Đai Tại TP.HCM: Nguyên Nhân, Giải Pháp Và … - vothienhien.com"
  },
  {
    "id": "article-luat-dat-dai-2024-nhung-thay-doi-quan-trong-nhat",
    "name": "Luật Đất Đai 2024: Những Thay Đổi Quan Trọng Nhất Ảnh Hưở…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-luat-dat-dai-2024-nhung-thay-doi-quan-trong-nhat-a0a34423.webp",
    "local_path": "assets/blog/article-luat-dat-dai-2024-nhung-thay-doi-quan-trong-nhat.webp",
    "alt": "Luật Đất Đai 2024: Những Thay Đổi Quan Trọng Nhất Ảnh Hưở… - vothienhien.com"
  },
  {
    "id": "article-boi-thuong-thiet-hai-ngoai-hop-dong-quyen-loi-va-cach-bao-ve",
    "name": "Bồi Thường Thiệt Hại Ngoài Hợp Đồng: Quyền Lợi Và Cách Bả…",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-boi-thuong-thiet-hai-ngoai-hop-dong-quyen-loi-va-cach-bao-ve-180f28e6.webp",
    "local_path": "assets/blog/article-boi-thuong-thiet-hai-ngoai-hop-dong-quyen-loi-va-cach-bao-ve.webp",
    "alt": "Bồi Thường Thiệt Hại Ngoài Hợp Đồng: Quyền Lợi Và Cách Bả… - vothienhien.com"
  },
  {
    "id": "article-quy-trinh-giai-quyet-tranh-chap-hop-dong-tai-toa-an-viet-nam",
    "name": "Quy Trình Giải Quyết Tranh Chấp Hợp Đồng Tại Tòa Án Việt Nam",
    "category": "blog",
    "width": 1200,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/blog/article-quy-trinh-giai-quyet-tranh-chap-hop-dong-tai-toa-an-viet-nam-25113ccc.webp",
    "local_path": "assets/blog/article-quy-trinh-giai-quyet-tranh-chap-hop-dong-tai-toa-an-viet-nam.webp",
    "alt": "Quy Trình Giải Quyết Tranh Chấp Hợp Đồng Tại Tòa Án Việt Nam - vothienhien.com"
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
// Generated: 2026-05-18T19:08:50.686Z
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
