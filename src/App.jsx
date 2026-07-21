import { useState, useEffect, useMemo } from "react";
import {
  Search, Radio, Sparkles, MapPin, Loader2, Check, X, Plus, ShieldCheck, ShieldQuestion,
  TrendingUp, Users, ChevronRight, ChevronLeft, Send, Mic, FileText, Link2, Clock, Lock, Unlock,
  Calculator, Sliders, Info, RotateCcw, LayoutGrid, UserPlus, Building2, Wallet, Ban,
} from "lucide-react";

const COLORS = {
  bg: "#12111A",
  panel: "#181722",
  card: "#1A1926",
  accent: "#F2A007",
  green: "#1FA97F",
  red: "#f87171",
  purple: "#B08CE0",
  border: "rgba(255,255,255,0.10)",
  borderHover: "rgba(242,160,7,0.5)",
};

// Platform list is intentionally open-ended and not derived from seed data —
// creators exist on plenty of platforms beyond the handful in any sample set.
// "Other" lets a real submission name something not listed at all.
const PLATFORM_LIST = [
  "Podcast", "YouTube", "Instagram", "Facebook", "TikTok", "X (Twitter)",
  "Twitch", "Snapchat", "LinkedIn", "Spotify", "SoundCloud", "Telegram Channel",
  "WhatsApp Channel", "Clubhouse", "Other",
];

// ---------- Shared show data (used by Discover + Trade) ----------
const SEED = [
  { id: "s1", title: "From The African People Podcast", host: "Jacquiline Lidonde", country: "Kenya", platform: "Podcast", category: "Business", creatorType: "Specialist", tags: ["social entrepreneurship", "impact", "development"], lang: "English", vma: 42000, engagement: 6.1, confidence: "Self-reported", baseRate: 180, desc: "Stories of opportunity and possibility for social entrepreneurs across the continent." },
  { id: "s2", title: "Afrobility", host: "Olumide Ogunsanwo & Bankole Makanju", country: "Nigeria", platform: "Podcast", category: "Tech", creatorType: "Specialist", tags: ["startups", "tech policy"], lang: "English", vma: 61000, engagement: 5.4, confidence: "Self-reported", baseRate: 240, desc: "Stories and analyses of African technology companies." },
  { id: "s3", title: "African Business Stories", host: "Akaego Okoye", country: "Nigeria", platform: "YouTube", category: "Business", creatorType: "Specialist", tags: ["women in business"], lang: "English", vma: 38000, engagement: 7.2, confidence: "Platform-verified", baseRate: 165, desc: "Insights into the women shaping Africa's business landscape." },
  { id: "s4", title: "VIP Access", host: "Anyiko Owoko", country: "Kenya", platform: "YouTube", category: "Culture", creatorType: "Face", tags: ["music", "interviews"], lang: "English", vma: 95000, engagement: 4.8, confidence: "Platform-verified", baseRate: 320, desc: "A front-row pass into interviews with Africa's rising and established artists." },
  { id: "s5", title: "Unlocking Africa Podcast", host: "Terser Adamu", country: "Nigeria", platform: "Podcast", category: "Business", creatorType: "Specialist", tags: ["trade", "policy"], lang: "English", vma: 27000, engagement: 5.9, confidence: "Self-reported", baseRate: 120, desc: "Unlocking Africa's economic potential in the 21st century." },
  { id: "s6", title: "Open Africa Podcast", host: "Laolu, Furo & Nosa", country: "Nigeria", platform: "Podcast", category: "Tech", creatorType: "Specialist", tags: ["fintech", "banking"], lang: "English", vma: 54000, engagement: 6.3, confidence: "Self-reported", baseRate: 210, desc: "Technology, startups, and issues across African banking and tech." },
  { id: "s7", title: "IBS Podcast", host: "Adedamola Oloko", country: "Nigeria", platform: "Podcast", category: "Tech", creatorType: "Specialist", tags: ["insurtech"], lang: "English", vma: 19000, engagement: 5.1, confidence: "Self-reported", baseRate: 90, desc: "Africa's InsurTech podcast — technology and innovation in insurance." },
  { id: "s8", title: "Afrobeats Intelligence", host: "Joey Akan", country: "Nigeria", platform: "YouTube", category: "Culture", creatorType: "Specialist", tags: ["music industry"], lang: "English", vma: 130000, engagement: 8.4, confidence: "Platform-verified", baseRate: 420, desc: "Candid conversations on the workings of the Nigerian music industry." },
  { id: "s9", title: "The Republic Podcast", host: "The Republic", country: "Nigeria", platform: "Podcast", category: "History", creatorType: "Specialist", tags: ["narrative", "politics"], lang: "English", vma: 71000, engagement: 6.7, confidence: "Self-reported", baseRate: 260, desc: "A narrative history podcast on Nigerian events, expanding across Africa." },
  { id: "s10", title: "I Said What I Said", host: "Jola Ayeye & Feyikemi Abudu", country: "Nigeria", platform: "YouTube", category: "Culture", creatorType: "Face", tags: ["pop culture", "comedy"], lang: "English", vma: 210000, engagement: 9.1, confidence: "Platform-verified", baseRate: 650, desc: "Unfiltered conversation on culture, relationships and pop culture." },
  { id: "s11", title: "Africa Tech Summit Podcast", host: "Africa Tech Summit", country: "Kenya", platform: "Podcast", category: "Tech", creatorType: "Specialist", tags: ["investment", "founders"], lang: "English", vma: 33000, engagement: 4.6, confidence: "Self-reported", baseRate: 140, desc: "Insights from industry leaders, investors and corporates in African tech." },
  { id: "s12", title: "Equity Merchants", host: "Techpoint Africa", country: "Nigeria", platform: "Podcast", category: "Finance", creatorType: "Specialist", tags: ["venture capital"], lang: "English", vma: 46000, engagement: 5.8, confidence: "Self-reported", baseRate: 190, desc: "Investing in African startups — VC from an African perspective." },
  { id: "s13", title: "The Baobab", host: "Mimi & George", country: "Pan-African", platform: "YouTube", category: "News", creatorType: "Specialist", tags: ["politics", "youth"], lang: "English", vma: 88000, engagement: 6.9, confidence: "Platform-verified", baseRate: 300, desc: "Real talk on Africa's toughest issues — politics and social change." },
  { id: "s14", title: "Truly Enchanted", host: "Ava", country: "Zimbabwe", platform: "Instagram", category: "Culture", creatorType: "Specialist", tags: ["society"], lang: "English", vma: 15000, engagement: 7.8, confidence: "Self-reported", baseRate: 70, desc: "Society and culture conversations from Zimbabwe." },
  { id: "s15", title: "2 Pesewas", host: "—", country: "Ghana", platform: "Podcast", category: "Culture", creatorType: "Specialist", tags: ["society"], lang: "English", vma: 22000, engagement: 6.0, confidence: "Self-reported", baseRate: 95, desc: "Society and culture, told from Accra." },
  { id: "s16", title: "Dopamine Podcast", host: "—", country: "Uganda", platform: "Podcast", category: "Culture", creatorType: "Specialist", tags: ["society", "lifestyle"], lang: "English", vma: 18000, engagement: 5.5, confidence: "Self-reported", baseRate: 80, desc: "Society and culture conversations from Kampala." },
  { id: "s17", title: "First Person", host: "—", country: "South Africa", platform: "Instagram", category: "Culture", creatorType: "Specialist", tags: ["identity"], lang: "English", vma: 29000, engagement: 6.4, confidence: "Self-reported", baseRate: 110, desc: "Personal narrative and identity, told from South Africa." },
  { id: "s18", title: "Africa Is a Country Podcast", host: "AIAC collective", country: "Pan-African", platform: "Podcast", category: "News", creatorType: "Specialist", tags: ["politics", "economy"], lang: "English", vma: 64000, engagement: 5.7, confidence: "Self-reported", baseRate: 230, desc: "Politics, economy and protest movements across the continent." },
  { id: "s19", title: "The Wanjiru Show", host: "Wanjiru Kinyua", country: "Kenya", platform: "TikTok", category: "Culture", creatorType: "Face", tags: ["daily life", "trends"], lang: "English/Swahili", vma: 310000, engagement: 7.9, confidence: "Platform-verified", baseRate: 780, desc: "Fast-cut daily commentary spanning trends, culture, and everyday life in Nairobi." },
  { id: "s20", title: "Naija Now", host: "Chidi Okonkwo", country: "Nigeria", platform: "Facebook", category: "News", creatorType: "Face", tags: ["current affairs"], lang: "English/Pidgin", vma: 145000, engagement: 6.6, confidence: "Platform-verified", baseRate: 460, desc: "Short-form explainers on Nigerian current affairs, built for Facebook feed discovery." },
  { id: "s21", title: "Lagos Twitter Spaces Roundup", host: "Tunde Bakare Jr.", country: "Nigeria", platform: "X (Twitter)", category: "News", creatorType: "Specialist", tags: ["current affairs", "audio"], lang: "English/Pidgin", vma: 41000, engagement: 5.6, confidence: "Self-reported", baseRate: 150, desc: "Live audio Spaces recapping Nigerian political and business news." },
  { id: "s22", title: "Kinshasa Beats Live", host: "Grace Mbala", country: "DR Congo", platform: "Twitch", category: "Culture", creatorType: "Specialist", tags: ["music", "livestream"], lang: "French/Lingala", vma: 12000, engagement: 8.1, confidence: "Self-reported", baseRate: 60, desc: "Live-streamed Congolese music commentary and DJ sets." },
];

const TIERS = [
  { id: "t4", name: "Emerging", minVMA: 0, maxLength: "15s", customTerms: false, color: "rgba(255,255,255,0.5)" },
  { id: "t3", name: "Established", minVMA: 20000, maxLength: "30s", customTerms: false, color: COLORS.green },
  { id: "t2", name: "Premium", minVMA: 60000, maxLength: "60s", customTerms: false, color: COLORS.accent },
  { id: "t1", name: "Flagship", minVMA: 150000, maxLength: "60s", customTerms: true, color: COLORS.purple },
];
function tierFor(vma) {
  return [...TIERS].reverse().find(t => vma >= t.minVMA) || TIERS[0];
}

const INDICES = [
  { id: "acx100", name: "ACX 100", desc: "The broadest cross-section — every indexed show, ranked by reach.", filter: () => true },
  { id: "business25", name: "ACX Business 25", desc: "Business, finance, and entrepreneurship shows.", filter: s => (s.category === "Business" || s.category === "Finance") && s.creatorType === "Specialist" },
  { id: "tech25", name: "ACX Tech 25", desc: "Startups, technology, and innovation.", filter: s => s.category === "Tech" && s.creatorType === "Specialist" },
  { id: "culture25", name: "ACX Culture 25", desc: "Music, lifestyle, and pop culture — topic specialists.", filter: s => s.category === "Culture" && s.creatorType === "Specialist" },
  { id: "faces", name: "ACX Faces", desc: "Cross-topical personalities — bought for who they are, not what they're covering that week.", filter: s => s.creatorType === "Face" },
];

const LENGTH_ORDER = { "15s": 0, "30s": 1, "60s": 2 };
const LENGTHS = [
  { id: "15s", label: "15 seconds", mult: 0.6 },
  { id: "30s", label: "30 seconds", mult: 1.0 },
  { id: "60s", label: "60 seconds", mult: 1.7 },
];

// Country readiness — shared between Trade's pricing and the Calculator tab.
// Only Kenya/Nigeria are individually researched; the rest are tier estimates.
const COUNTRIES = {
  kenya: { name: "Kenya", region: "East Africa", confidence: "Researched",
    scores: { marketSize: 45, digitalReach: 80, reliability: 78, dataQuality: 55, purchaseCapacity: 85, attentionPrice: 70, stability: 80 }, billboardAnchorUSD: 2500 },
  nigeria: { name: "Nigeria", region: "West Africa", confidence: "Researched",
    scores: { marketSize: 90, digitalReach: 65, reliability: 40, dataQuality: 75, purchaseCapacity: 40, attentionPrice: 45, stability: 45 }, billboardAnchorUSD: 1200 },
  ghana: { name: "Ghana", region: "West Africa", confidence: "Tier estimate",
    scores: { marketSize: 38, digitalReach: 55, reliability: 55, dataQuality: 70, purchaseCapacity: 55, attentionPrice: 40, stability: 55 }, billboardAnchorUSD: 900 },
  egypt: { name: "Egypt", region: "North Africa", confidence: "Tier estimate",
    scores: { marketSize: 95, digitalReach: 88, reliability: 90, dataQuality: 75, purchaseCapacity: 88, attentionPrice: 70, stability: 78 }, billboardAnchorUSD: 700 },
  morocco: { name: "Morocco", region: "North Africa", confidence: "Tier estimate",
    scores: { marketSize: 50, digitalReach: 70, reliability: 75, dataQuality: 65, purchaseCapacity: 35, attentionPrice: 50, stability: 60 }, billboardAnchorUSD: 1100 },
  ethiopia: { name: "Ethiopia", region: "East Africa", confidence: "Tier estimate",
    scores: { marketSize: 60, digitalReach: 30, reliability: 45, dataQuality: 40, purchaseCapacity: 25, attentionPrice: 30, stability: 40 }, billboardAnchorUSD: 600 },
  tanzania: { name: "Tanzania", region: "East Africa", confidence: "Tier estimate",
    scores: { marketSize: 42, digitalReach: 45, reliability: 50, dataQuality: 55, purchaseCapacity: 60, attentionPrice: 35, stability: 50 }, billboardAnchorUSD: 700 },
  uganda: { name: "Uganda", region: "East Africa", confidence: "Tier estimate",
    scores: { marketSize: 30, digitalReach: 40, reliability: 40, dataQuality: 60, purchaseCapacity: 55, attentionPrice: 28, stability: 42 }, billboardAnchorUSD: 550 },
  rwanda: { name: "Rwanda", region: "East Africa", confidence: "Tier estimate",
    scores: { marketSize: 22, digitalReach: 50, reliability: 55, dataQuality: 55, purchaseCapacity: 55, attentionPrice: 30, stability: 68 }, billboardAnchorUSD: 500 },
  senegal: { name: "Senegal", region: "West Africa", confidence: "Tier estimate",
    scores: { marketSize: 28, digitalReach: 45, reliability: 50, dataQuality: 55, purchaseCapacity: 50, attentionPrice: 35, stability: 52 }, billboardAnchorUSD: 650 },
  ivorycoast: { name: "Côte d'Ivoire", region: "West Africa", confidence: "Tier estimate",
    scores: { marketSize: 40, digitalReach: 42, reliability: 50, dataQuality: 50, purchaseCapacity: 50, attentionPrice: 38, stability: 55 }, billboardAnchorUSD: 700 },
  algeria: { name: "Algeria", region: "North Africa", confidence: "Tier estimate",
    scores: { marketSize: 55, digitalReach: 50, reliability: 65, dataQuality: 75, purchaseCapacity: 25, attentionPrice: 35, stability: 45 }, billboardAnchorUSD: 800 },
  namibia: { name: "Namibia", region: "Southern Africa", confidence: "Tier estimate",
    scores: { marketSize: 18, digitalReach: 45, reliability: 55, dataQuality: 40, purchaseCapacity: 40, attentionPrice: 25, stability: 55 }, billboardAnchorUSD: 400 },
  angola: { name: "Angola", region: "Southern Africa", confidence: "Tier estimate",
    scores: { marketSize: 48, digitalReach: 30, reliability: 40, dataQuality: 35, purchaseCapacity: 30, attentionPrice: 35, stability: 35 }, billboardAnchorUSD: 600 },
  zambia: { name: "Zambia", region: "Southern Africa", confidence: "Tier estimate",
    scores: { marketSize: 25, digitalReach: 35, reliability: 45, dataQuality: 50, purchaseCapacity: 45, attentionPrice: 25, stability: 42 }, billboardAnchorUSD: 450 },
  cameroon: { name: "Cameroon", region: "Central Africa", confidence: "Tier estimate",
    scores: { marketSize: 32, digitalReach: 35, reliability: 42, dataQuality: 55, purchaseCapacity: 45, attentionPrice: 28, stability: 40 }, billboardAnchorUSD: 500 },
  zimbabwe: { name: "Zimbabwe", region: "Southern Africa", confidence: "Tier estimate",
    scores: { marketSize: 20, digitalReach: 35, reliability: 30, dataQuality: 15, purchaseCapacity: 35, attentionPrice: 22, stability: 25 }, billboardAnchorUSD: 400 },
  botswana: { name: "Botswana", region: "Southern Africa", confidence: "Tier estimate",
    scores: { marketSize: 20, digitalReach: 55, reliability: 60, dataQuality: 30, purchaseCapacity: 45, attentionPrice: 30, stability: 60 }, billboardAnchorUSD: 500 },
  mozambique: { name: "Mozambique", region: "Southern Africa", confidence: "Tier estimate",
    scores: { marketSize: 22, digitalReach: 25, reliability: 35, dataQuality: 45, purchaseCapacity: 35, attentionPrice: 20, stability: 32 }, billboardAnchorUSD: 400 },
  drc: { name: "DR Congo", region: "Central Africa", confidence: "Tier estimate",
    scores: { marketSize: 95, digitalReach: 38, reliability: 20, dataQuality: 72, purchaseCapacity: 50, attentionPrice: 35, stability: 50 }, billboardAnchorUSD: 300 },
  southafrica: { name: "South Africa", region: "Southern Africa", confidence: "Tier estimate",
    scores: { marketSize: 65, digitalReach: 85, reliability: 85, dataQuality: 45, purchaseCapacity: 55, attentionPrice: 75, stability: 75 }, billboardAnchorUSD: 800 },
  eswatini: { name: "Eswatini", region: "Southern Africa", confidence: "Tier estimate",
    scores: { marketSize: 22, digitalReach: 65, reliability: 82, dataQuality: 30, purchaseCapacity: 50, attentionPrice: 55, stability: 75 }, billboardAnchorUSD: 400 },
  lesotho: { name: "Lesotho", region: "Southern Africa", confidence: "Tier estimate",
    scores: { marketSize: 20, digitalReach: 50, reliability: 35, dataQuality: 25, purchaseCapacity: 45, attentionPrice: 45, stability: 55 }, billboardAnchorUSD: 300 },
  malawi: { name: "Malawi", region: "Southern Africa", confidence: "Tier estimate",
    scores: { marketSize: 48, digitalReach: 50, reliability: 20, dataQuality: 75, purchaseCapacity: 40, attentionPrice: 35, stability: 25 }, billboardAnchorUSD: 250 },
  republicofcongo: { name: "Republic of the Congo", region: "Central Africa", confidence: "Tier estimate",
    scores: { marketSize: 35, digitalReach: 48, reliability: 25, dataQuality: 30, purchaseCapacity: 30, attentionPrice: 40, stability: 55 }, billboardAnchorUSD: 300 },
  gabon: { name: "Gabon", region: "Central Africa", confidence: "Tier estimate",
    scores: { marketSize: 15, digitalReach: 70, reliability: 80, dataQuality: 50, purchaseCapacity: 60, attentionPrice: 55, stability: 85 }, billboardAnchorUSD: 600 },
  centralafricanrepublic: { name: "Central African Republic", region: "Central Africa", confidence: "Tier estimate",
    scores: { marketSize: 15, digitalReach: 25, reliability: 18, dataQuality: 20, purchaseCapacity: 35, attentionPrice: 25, stability: 35 }, billboardAnchorUSD: 150 },
  burundi: { name: "Burundi", region: "East Africa", confidence: "Tier estimate",
    scores: { marketSize: 28, digitalReach: 15, reliability: 18, dataQuality: 15, purchaseCapacity: 50, attentionPrice: 20, stability: 35 }, billboardAnchorUSD: 150 },
  southsudan: { name: "South Sudan", region: "East Africa", confidence: "Tier estimate",
    scores: { marketSize: 25, digitalReach: 12, reliability: 10, dataQuality: 15, purchaseCapacity: 25, attentionPrice: 15, stability: 5 }, billboardAnchorUSD: 100 },
  djibouti: { name: "Djibouti", region: "East Africa", confidence: "Tier estimate",
    scores: { marketSize: 15, digitalReach: 68, reliability: 58, dataQuality: 35, purchaseCapacity: 35, attentionPrice: 45, stability: 82 }, billboardAnchorUSD: 300 },
  somalia: { name: "Somalia", region: "East Africa", confidence: "Tier estimate",
    scores: { marketSize: 30, digitalReach: 72, reliability: 30, dataQuality: 45, purchaseCapacity: 85, attentionPrice: 40, stability: 45 }, billboardAnchorUSD: 250 },
  togo: { name: "Togo", region: "West Africa", confidence: "Tier estimate",
    scores: { marketSize: 28, digitalReach: 45, reliability: 35, dataQuality: 25, purchaseCapacity: 65, attentionPrice: 35, stability: 70 }, billboardAnchorUSD: 300 },
  benin: { name: "Benin", region: "West Africa", confidence: "Tier estimate",
    scores: { marketSize: 40, digitalReach: 40, reliability: 42, dataQuality: 60, purchaseCapacity: 88, attentionPrice: 45, stability: 78 }, billboardAnchorUSD: 350 },
  sierraleone: { name: "Sierra Leone", region: "West Africa", confidence: "Tier estimate",
    scores: { marketSize: 32, digitalReach: 45, reliability: 30, dataQuality: 35, purchaseCapacity: 68, attentionPrice: 30, stability: 55 }, billboardAnchorUSD: 200 },
  liberia: { name: "Liberia", region: "West Africa", confidence: "Tier estimate",
    scores: { marketSize: 30, digitalReach: 50, reliability: 28, dataQuality: 25, purchaseCapacity: 60, attentionPrice: 30, stability: 68 }, billboardAnchorUSD: 200 },
  gambia: { name: "The Gambia", region: "West Africa", confidence: "Tier estimate",
    scores: { marketSize: 20, digitalReach: 65, reliability: 68, dataQuality: 40, purchaseCapacity: 80, attentionPrice: 35, stability: 70 }, billboardAnchorUSD: 200 },
  burkinafaso: { name: "Burkina Faso", region: "West Africa", confidence: "Tier estimate",
    scores: { marketSize: 38, digitalReach: 40, reliability: 35, dataQuality: 25, purchaseCapacity: 38, attentionPrice: 30, stability: 65 }, billboardAnchorUSD: 200 },
  niger: { name: "Niger", region: "West Africa", confidence: "Tier estimate",
    scores: { marketSize: 40, digitalReach: 42, reliability: 22, dataQuality: 20, purchaseCapacity: 15, attentionPrice: 25, stability: 55 }, billboardAnchorUSD: 150 },
  mali: { name: "Mali", region: "West Africa", confidence: "Tier estimate",
    scores: { marketSize: 35, digitalReach: 50, reliability: 25, dataQuality: 30, purchaseCapacity: 50, attentionPrice: 30, stability: 45 }, billboardAnchorUSD: 200 },
  chad: { name: "Chad", region: "Central Africa", confidence: "Tier estimate",
    scores: { marketSize: 30, digitalReach: 25, reliability: 15, dataQuality: 15, purchaseCapacity: 30, attentionPrice: 20, stability: 55 }, billboardAnchorUSD: 150 },
  tunisia: { name: "Tunisia", region: "North Africa", confidence: "Tier estimate",
    scores: { marketSize: 55, digitalReach: 88, reliability: 98, dataQuality: 65, purchaseCapacity: 55, attentionPrice: 65, stability: 55 }, billboardAnchorUSD: 600 },
  capeverde: { name: "Cape Verde", region: "West Africa", confidence: "Tier estimate",
    scores: { marketSize: 12, digitalReach: 78, reliability: 92, dataQuality: 60, purchaseCapacity: 40, attentionPrice: 40, stability: 80 }, billboardAnchorUSD: 250 },
  saotome: { name: "São Tomé and Príncipe", region: "Central Africa", confidence: "Tier estimate",
    scores: { marketSize: 8, digitalReach: 35, reliability: 60, dataQuality: 40, purchaseCapacity: 35, attentionPrice: 25, stability: 75 }, billboardAnchorUSD: 150 },
  madagascar: { name: "Madagascar", region: "Southern Africa", confidence: "Tier estimate",
    scores: { marketSize: 38, digitalReach: 25, reliability: 22, dataQuality: 20, purchaseCapacity: 20, attentionPrice: 25, stability: 45 }, billboardAnchorUSD: 150 },
};

// Non-African markets, kept separate from ACX's core African index/tiering —
// useful as external reference points (e.g. for a diaspora advertiser
// conversation) but never mixed into the country dropdown below.
const GLOBAL_COMPARATORS = {
  uk: { name: "United Kingdom", region: "Europe", confidence: "Tier estimate",
    scores: { marketSize: 100, digitalReach: 98, reliability: 100, dataQuality: 92, purchaseCapacity: 98, attentionPrice: 90, stability: 80 }, billboardAnchorUSD: 3000 },
  china: { name: "China", region: "Asia", confidence: "Tier estimate",
    scores: { marketSize: 92, digitalReach: 98, reliability: 100, dataQuality: 90, purchaseCapacity: 95, attentionPrice: 85, stability: 80 }, billboardAnchorUSD: 3000 },
  vietnam: { name: "Vietnam", region: "Southeast Asia", confidence: "Tier estimate",
    scores: { marketSize: 85, digitalReach: 95, reliability: 98, dataQuality: 82, purchaseCapacity: 90, attentionPrice: 65, stability: 85 }, billboardAnchorUSD: 800 },
  southkorea: { name: "South Korea", region: "Asia", confidence: "Tier estimate",
    scores: { marketSize: 100, digitalReach: 100, reliability: 100, dataQuality: 95, purchaseCapacity: 98, attentionPrice: 85, stability: 95 }, billboardAnchorUSD: 2500 },
};

const COUNTRY_ORDER = [
  "kenya", "nigeria", "southafrica", "egypt", "ghana", "morocco", "ethiopia",
  "tanzania", "uganda", "rwanda", "senegal", "ivorycoast", "algeria", "namibia",
  "angola", "zambia", "cameroon", "zimbabwe", "botswana", "mozambique", "drc",
  "eswatini", "lesotho", "malawi", "republicofcongo", "gabon", "centralafricanrepublic",
  "burundi", "southsudan", "djibouti", "somalia", "togo", "benin", "sierraleone",
  "liberia", "gambia", "burkinafaso", "niger", "mali", "chad", "tunisia",
  "capeverde", "saotome", "madagascar",
];
// simple readiness index for Trade pricing, derived from the Calculator's composite (equal-weighted)
function readinessScore(countryName) {
  const entry = Object.values(COUNTRIES).find(c => c.name === countryName);
  if (!entry) return 50;
  const vals = Object.values(entry.scores);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function fmt(n) { return n >= 1000 ? (n / 1000).toFixed(0) + "K" : String(n); }
function money(n) { return "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 }); }

function Tag({ children }) {
  return (
    <span className="inline-block px-2 py-0.5 uppercase font-mono rounded-sm border" style={{ fontSize: 11, letterSpacing: "0.05em", borderColor: "rgba(242,160,7,0.4)", color: COLORS.accent }}>
      {children}
    </span>
  );
}
function ConfidenceBadge({ confidence }) {
  const verified = confidence === "Platform-verified";
  const Icon = verified ? ShieldCheck : ShieldQuestion;
  return (
    <span className="flex items-center gap-1 font-mono" style={{ fontSize: 10.5, color: verified ? COLORS.green : "rgba(255,255,255,0.4)" }} title={verified ? "Pulled directly via platform API" : "Reported by the creator, not yet API-verified"}>
      <Icon size={11} /> {confidence}
    </span>
  );
}
function TierBadge({ tier }) {
  return (
    <span className="font-mono px-1.5 py-0.5 rounded-sm border" style={{ fontSize: 10, color: tier.color, borderColor: tier.color + "60" }}>
      {tier.name}
    </span>
  );
}
function StatBox({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-sm border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.card }}>
      <Icon size={18} style={{ color: COLORS.accent }} />
      <div>
        <div className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{label}</div>
        <div className="font-semibold" style={{ fontSize: 18, color: "white" }}>{value}</div>
      </div>
    </div>
  );
}

// ================= DISCOVER =================
function Discover({ platform, setPlatform, country, setCountry, category, setCategory }) {
  const [query, setQuery] = useState("");
  const [community, setCommunity] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rawTitle, setRawTitle] = useState("");
  const [rawHost, setRawHost] = useState("");
  const [rawPlatform, setRawPlatform] = useState("Podcast");
  const [rawOtherPlatform, setRawOtherPlatform] = useState("");
  const [rawDesc, setRawDesc] = useState("");
  const [tagging, setTagging] = useState(false);
  const [proposal, setProposal] = useState(null);
  const [tagError, setTagError] = useState("");

  const COUNTRY_LIST = ["All countries", ...Array.from(new Set(SEED.map(s => s.country))).sort()];
  const CATEGORY_LIST = ["All categories", "Business", "Tech", "Culture", "Finance", "News", "History", "Sports", "Real Estate", "Tourism", "Education", "Music", "Religion & Spirituality", "Society & Culture", "Other"];
  const PLATFORM_FILTER_LIST = ["All platforms", ...PLATFORM_LIST];

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("acx-community-entries-v3", true);
        if (res && res.value) setCommunity(JSON.parse(res.value));
      } catch (e) {} finally { setLoaded(true); }
    })();
  }, []);

  const all = useMemo(() => [...SEED, ...community], [community]);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter(item => {
      if (platform !== "All platforms" && item.platform !== platform) return false;
      if (country !== "All countries" && item.country !== country) return false;
      if (category !== "All categories" && item.category !== category) return false;
      if (!q) return true;
      const hay = [item.title, item.host, item.desc, item.category, item.platform, ...(item.tags || [])].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [all, query, platform, country, category]);

  async function runAutoTag() {
    setTagError("");
    if (!rawTitle.trim() || !rawDesc.trim()) { setTagError("Add at least a title and a short description first."); return; }
    setTagging(true); setProposal(null);
    try {
      const platformLabel = rawPlatform === "Other" ? (rawOtherPlatform.trim() || "Other") : rawPlatform;
      const prompt = `You are the AI tagging engine for ACX Discover, an index of African spoken/personality-led creator content across many platforms.
Respond with ONLY a JSON object (no markdown fences, no preamble):
{
  "category": one of ["Business","Tech","Culture","Finance","News","History","Sports","Real Estate","Tourism","Education","Music","Religion & Spirituality","Society & Culture","Other"],
  "country": your best guess at the show's home country (or "Pan-African" if unclear),
  "lang": primary spoken language,
  "tags": an array of 3-5 short lowercase topic tags,
  "summary": a single reworded sentence (max 25 words), in your own words, not copied from the input
}
Title: ${rawTitle}
Host: ${rawHost || "unknown"}
Platform: ${platformLabel}
Raw description: ${rawDesc}`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 500, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await response.json();
      const text = (data.content || []).map(b => b.text || "").join("").trim();
      const cleaned = text.replace(/^```json\s*|```$/g, "").trim();
      setProposal(JSON.parse(cleaned));
    } catch (e) { setTagError("Auto-tagging failed — try rephrasing, or add tags manually."); }
    finally { setTagging(false); }
  }

  async function confirmAdd() {
    if (!proposal) return;
    const platformLabel = rawPlatform === "Other" ? (rawOtherPlatform.trim() || "Other") : rawPlatform;
    const entry = {
      id: "c" + Date.now(), title: rawTitle.trim(), host: rawHost.trim() || "—",
      country: proposal.country || "Pan-African", platform: platformLabel,
      category: proposal.category || "Culture", tags: proposal.tags || [], lang: proposal.lang || "English",
      vma: 0, confidence: "Self-reported", desc: proposal.summary || rawDesc.trim(),
    };
    const next = [entry, ...community];
    setCommunity(next);
    try { await window.storage.set("acx-community-entries-v3", JSON.stringify(next), true); } catch (e) {}
    setShowForm(false);
    setRawTitle(""); setRawHost(""); setRawDesc(""); setRawOtherPlatform(""); setProposal(null);
  }

  return (
    <div>
      <div className="mb-3">
        <div className="font-bold" style={{ fontSize: 17, fontFamily: "'Space Grotesk', sans-serif" }}>ACX DISCOVER</div>
        <div className="font-mono mt-0.5" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Spoken & personality-led content — any platform · {all.length} shows indexed</div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-sm border" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border }}>
          <Search size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search shows, hosts, topics…" className="bg-transparent outline-none w-full" style={{ fontSize: 14, color: "white" }} />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        <select value={platform} onChange={e => setPlatform(e.target.value)} className="px-3 py-2 rounded-sm border font-mono flex-1" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border, fontSize: 13, color: "white" }}>
          {PLATFORM_FILTER_LIST.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={country} onChange={e => setCountry(e.target.value)} className="px-3 py-2 rounded-sm border font-mono flex-1" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border, fontSize: 13, color: "white" }}>
          {COUNTRY_LIST.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-2 rounded-sm border font-mono flex-1" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border, fontSize: 13, color: "white" }}>
          {CATEGORY_LIST.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {loaded && results.length === 0 && (
        <div className="text-center py-16 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>No shows match that search yet — try a broader term, or add one below.</div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {results.map(item => (
          <div key={item.id} className="p-4 flex flex-col gap-2 rounded-sm border" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-snug text-white" style={{ fontSize: 15 }}>{item.title}</h3>
              {item.confidence === "Self-reported" && item.vma === 0 && <Sparkles size={14} style={{ color: COLORS.accent, flexShrink: 0, marginTop: 2 }} />}
            </div>
            <div className="flex items-center gap-1.5 font-mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
              <MapPin size={12} /> {item.country} · {item.host}
            </div>
            <p className="leading-relaxed" style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{item.desc}</p>
            <div className="flex flex-wrap gap-1.5 mt-1 items-center">
              <Tag>{item.platform}</Tag><Tag>{item.category}</Tag>
              {(item.tags || []).slice(0, 2).map(t => <span key={t} className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>#{t.replace(/\s+/g, "")}</span>)}
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{item.lang} · VMA {fmt(item.vma)}</div>
              <ConfidenceBadge confidence={item.confidence} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-sm border p-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.panel }}>
        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 font-mono" style={{ fontSize: 13, color: COLORS.accent }}>
            <Plus size={16} /> Add a show to the index
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="font-mono flex items-center gap-2" style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}><Sparkles size={14} style={{ color: COLORS.accent }} /> Submit for AI tagging</div>
              <button onClick={() => { setShowForm(false); setProposal(null); }} style={{ color: "rgba(255,255,255,0.4)" }}><X size={16} /></button>
            </div>
            <select value={rawPlatform} onChange={e => setRawPlatform(e.target.value)} className="px-3 py-2 rounded-sm border font-mono outline-none" style={{ backgroundColor: COLORS.bg, borderColor: COLORS.border, fontSize: 13, color: "white" }}>
              {PLATFORM_LIST.map(p => <option key={p}>{p}</option>)}
            </select>
            {rawPlatform === "Other" && (
              <input value={rawOtherPlatform} onChange={e => setRawOtherPlatform(e.target.value)} placeholder="Name the platform (e.g. Threads, Bluesky, a local app…)" className="px-3 py-2 rounded-sm border outline-none" style={{ backgroundColor: COLORS.bg, borderColor: COLORS.border, fontSize: 14, color: "white" }} />
            )}
            <input value={rawTitle} onChange={e => setRawTitle(e.target.value)} placeholder="Show title" className="px-3 py-2 rounded-sm border outline-none" style={{ backgroundColor: COLORS.bg, borderColor: COLORS.border, fontSize: 14, color: "white" }} />
            <input value={rawHost} onChange={e => setRawHost(e.target.value)} placeholder="Host name (optional)" className="px-3 py-2 rounded-sm border outline-none" style={{ backgroundColor: COLORS.bg, borderColor: COLORS.border, fontSize: 14, color: "white" }} />
            <textarea value={rawDesc} onChange={e => setRawDesc(e.target.value)} placeholder="Describe the show in a sentence or two, in your own words…" rows={3} className="px-3 py-2 rounded-sm border outline-none resize-none" style={{ backgroundColor: COLORS.bg, borderColor: COLORS.border, fontSize: 14, color: "white" }} />
            {tagError && <div style={{ fontSize: 12, color: COLORS.red }}>{tagError}</div>}
            {!proposal ? (
              <button onClick={runAutoTag} disabled={tagging} className="flex items-center justify-center gap-2 font-semibold py-2 rounded-sm" style={{ backgroundColor: COLORS.accent, color: COLORS.bg, fontSize: 13, opacity: tagging ? 0.5 : 1 }}>
                {tagging ? <><Loader2 size={14} className="animate-spin" /> Tagging…</> : <>Auto-tag with AI</>}
              </button>
            ) : (
              <div className="rounded-sm p-3 flex flex-col gap-2 border" style={{ borderColor: "rgba(242,160,7,0.3)", backgroundColor: COLORS.bg }}>
                <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)" }}>Proposed tags — review before adding</div>
                <div className="flex flex-wrap gap-1.5"><Tag>{proposal.category}</Tag><span className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{proposal.country}</span><span className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{proposal.lang}</span></div>
                <div className="flex flex-wrap gap-1.5">{(proposal.tags || []).map(t => <span key={t} className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>#{String(t).replace(/\s+/g, "")}</span>)}</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{proposal.summary}</p>
                <div className="flex gap-2 mt-1">
                  <button onClick={confirmAdd} className="flex items-center gap-1.5 font-semibold px-3 py-1.5 rounded-sm" style={{ backgroundColor: COLORS.green, color: COLORS.bg, fontSize: 12 }}><Check size={13} /> Add to index</button>
                  <button onClick={() => setProposal(null)} className="px-3 py-1.5" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Discard</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="font-mono mt-6 leading-relaxed" style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
        Prototype only. Platform list is open-ended — pick "Other" to name anything not listed. "Platform-verified"
        vs "Self-reported" reflects whether VMA was pulled via API or reported by the creator. Entries you add are
        stored and visible to anyone else previewing this demo.
      </p>
    </div>
  );
}

// ================= TRADE =================
function Trade({ platform, country, category }) {
  const [selectedIndex, setSelectedIndex] = useState(INDICES[0]);
  const [length, setLength] = useState(LENGTHS[1]);
  const [assetType, setAssetType] = useState("video");
  const [assetLink, setAssetLink] = useState("");
  const [brief, setBrief] = useState("");
  const [excluded, setExcluded] = useState(new Set());
  const [showForm, setShowForm] = useState(false);
  const [brand, setBrand] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [inquiryCount, setInquiryCount] = useState(null);

  const eligible = useMemo(() => {
    return SEED
      .filter(selectedIndex.filter)
      .filter(s => platform === "All platforms" || !platform || s.platform === platform)
      .filter(s => country === "All countries" || !country || s.country === country)
      .filter(s => category === "All categories" || !category || s.category === category)
      .map(s => ({ ...s, tier: tierFor(s.vma) }));
  }, [selectedIndex, platform, country, category]);
  const bookable = useMemo(() => eligible.filter(s => {
    if (excluded.has(s.id)) return false;
    if (s.tier.customTerms) return true;
    return LENGTH_ORDER[s.tier.maxLength] >= LENGTH_ORDER[length.id];
  }), [eligible, excluded, length]);
  const incompatible = useMemo(() => eligible.filter(s => !s.tier.customTerms && LENGTH_ORDER[s.tier.maxLength] < LENGTH_ORDER[length.id]), [eligible, length]);

  const totalReach = bookable.reduce((sum, s) => sum + s.vma, 0);
  const avgEngagement = bookable.length ? (bookable.reduce((sum, s) => sum + s.engagement, 0) / bookable.length).toFixed(1) : "0.0";
  const totalCost = bookable.reduce((sum, s) => sum + Math.round(s.baseRate * length.mult * (readinessScore(s.country) / 50)), 0);

  useEffect(() => { setExcluded(new Set()); setSubmitted(false); }, [selectedIndex, length]);
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("acx-campaign-inquiries-v3", true);
        if (res && res.value) setInquiryCount(JSON.parse(res.value).length);
      } catch (e) { setInquiryCount(0); }
    })();
  }, []);

  function toggleShow(id) {
    setExcluded(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }

  async function submitInquiry() {
    setError("");
    if (!brand.trim() || !contact.trim()) { setError("Brand name and contact email are required."); return; }
    if (!assetLink.trim()) { setError("Add a link to your silent ad asset before submitting."); return; }
    if (bookable.length === 0) { setError("No shows are bookable at this length within the current selection."); return; }
    setSubmitting(true);
    try {
      const res = await window.storage.get("acx-campaign-inquiries-v3", true).catch(() => null);
      const existingList = res && res.value ? JSON.parse(res.value) : [];
      const entry = { id: "inq" + Date.now(), brand: brand.trim(), contact: contact.trim(), assetType, assetLink: assetLink.trim(), brief: brief.trim(), length: length.label, index: selectedIndex.name, showCount: bookable.length, estReach: totalReach, estCost: totalCost, status: "Pending asset review", submittedAt: new Date().toISOString() };
      const nextList = [entry, ...existingList];
      await window.storage.set("acx-campaign-inquiries-v3", JSON.stringify(nextList), true);
      setInquiryCount(nextList.length); setSubmitted(true); setShowForm(false);
      setBrand(""); setContact(""); setAssetLink(""); setBrief("");
    } catch (e) { setError("Couldn't submit right now — please try again in a moment."); }
    finally { setSubmitting(false); }
  }

  return (
    <div>
      <div className="mb-3">
        <div className="font-bold" style={{ fontSize: 17, fontFamily: "'Space Grotesk', sans-serif" }}>ACX TRADE</div>
        <div className="font-mono mt-0.5" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Tiered bundles · one asset, localized by creators across the continent</div>
      </div>
      <p className="mb-5" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
        Supply one silent ad asset — video or photo slides. Each creator localizes it in their own voice.
        Standard tiers cap ad length by reach and format fit; Flagship-tier creators can unlock custom terms.
      </p>

      <div className="mb-5">
        <div className="font-mono uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)" }}>1. Your ad asset</div>
        <div className="rounded-sm border p-4 flex flex-col gap-3" style={{ borderColor: COLORS.border, backgroundColor: COLORS.panel }}>
          <div className="flex gap-1.5">
            {[{ id: "video", label: "Silent video" }, { id: "slides", label: "Photo slides" }].map(t => {
              const active = t.id === assetType;
              return <button key={t.id} onClick={() => setAssetType(t.id)} className="px-3 py-1.5 rounded-sm border font-mono" style={{ borderColor: active ? COLORS.accent : COLORS.border, backgroundColor: active ? "rgba(242,160,7,0.1)" : COLORS.bg, color: active ? COLORS.accent : "rgba(255,255,255,0.6)", fontSize: 12 }}>{t.label}</button>;
            })}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-sm border" style={{ backgroundColor: COLORS.bg, borderColor: COLORS.border }}>
              <Link2 size={15} style={{ color: "rgba(255,255,255,0.4)" }} />
              <input value={assetLink} onChange={e => setAssetLink(e.target.value)} placeholder={assetType === "video" ? "Link to your silent video asset" : "Link to your photo slide set"} className="bg-transparent outline-none w-full" style={{ fontSize: 13, color: "white" }} />
            </div>
            <div className="flex gap-1.5">
              {LENGTHS.map(l => {
                const active = l.id === length.id;
                return <button key={l.id} onClick={() => setLength(l)} className="flex items-center gap-1.5 px-3 py-2 rounded-sm border font-mono" style={{ borderColor: active ? COLORS.accent : COLORS.border, backgroundColor: active ? "rgba(242,160,7,0.1)" : COLORS.bg, color: active ? COLORS.accent : "rgba(255,255,255,0.6)", fontSize: 12 }}><Clock size={12} /> {l.label}</button>;
              })}
            </div>
          </div>
          <textarea value={brief} onChange={e => setBrief(e.target.value)} placeholder="Voice-over brief — key message, tone…" rows={2} className="px-3 py-2 rounded-sm border outline-none resize-none" style={{ backgroundColor: COLORS.bg, borderColor: COLORS.border, fontSize: 13, color: "white" }} />
        </div>
      </div>

      <div className="mb-5">
        <div className="font-mono uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)" }}>Tiers — gate ad length and who can negotiate custom terms</div>
        <div className="grid sm:grid-cols-4 gap-2">
          {TIERS.map(t => (
            <div key={t.id} className="rounded-sm border p-3" style={{ borderColor: t.color + "50", backgroundColor: COLORS.panel }}>
              <div className="flex items-center gap-1.5"><span className="font-semibold" style={{ fontSize: 13, color: t.color }}>{t.name}</span>{t.customTerms && <Unlock size={12} style={{ color: t.color }} />}</div>
              <div className="font-mono mt-1" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{t.minVMA === 0 ? "Any VMA" : `${fmt(t.minVMA)}+ VMA`}</div>
              <div className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Ceiling: {t.maxLength}{t.customTerms ? " (negotiable)" : ""}</div>
            </div>
          ))}
        </div>
      </div>

      {(platform !== "All platforms" || country !== "All countries" || category !== "All categories") && (
        <div className="rounded-sm border p-3 mb-5 flex items-start gap-2" style={{ borderColor: "rgba(176,140,224,0.3)", backgroundColor: "rgba(176,140,224,0.06)" }}>
          <Sparkles size={14} style={{ color: COLORS.purple, marginTop: 2, flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
            Carrying over your Discover preferences —
            {platform !== "All platforms" && ` ${platform}`}
            {country !== "All countries" && ` · ${country}`}
            {category !== "All categories" && ` · ${category}`}
            . Bundles below only show matching creators. Clear filters on the Discover tab to see everyone again.
          </div>
        </div>
      )}

      <div className="mb-5">
        <div className="font-mono uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)" }}>2. Choose the bundle</div>
        <div className="grid sm:grid-cols-2 gap-2">
          {INDICES.map(idx => {
            const active = idx.id === selectedIndex.id;
            const count = SEED.filter(idx.filter).length;
            const isFaces = idx.id === "faces";
            return (
              <button key={idx.id} onClick={() => setSelectedIndex(idx)} className="text-left p-3 rounded-sm border transition-colors" style={{ borderColor: active ? (isFaces ? COLORS.purple : COLORS.accent) : COLORS.border, backgroundColor: active ? (isFaces ? "rgba(176,140,224,0.1)" : "rgba(242,160,7,0.08)") : COLORS.panel }}>
                <div className="flex items-center justify-between">
                  <div className="font-semibold flex items-center gap-1.5" style={{ fontSize: 14, color: active ? (isFaces ? COLORS.purple : COLORS.accent) : "white" }}>{isFaces && <Sparkles size={12} />} {idx.name}</div>
                  <span className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{count} shows</span>
                </div>
                <div className="mt-1" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{idx.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-3 mb-4">
        <StatBox icon={Radio} label="Bookable at this length" value={bookable.length} />
        <StatBox icon={Users} label="Estimated reach" value={fmt(totalReach)} />
        <StatBox icon={Sparkles} label="Avg. engagement" value={avgEngagement + "%"} />
        <StatBox icon={TrendingUp} label="Estimated total cost" value={money(totalCost)} />
      </div>

      {incompatible.length > 0 && (
        <div className="rounded-sm border p-3 mb-6 flex items-start gap-2" style={{ borderColor: "rgba(248,113,113,0.3)", backgroundColor: "rgba(248,113,113,0.06)" }}>
          <Lock size={14} style={{ color: COLORS.red, marginTop: 2, flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{incompatible.length} show{incompatible.length > 1 ? "s" : ""} can't carry a {length.label} ad at their current tier and {incompatible.length > 1 ? "are" : "is"} excluded automatically. Try a shorter length to include them.</div>
        </div>
      )}

      <div className="mb-6">
        <div className="font-mono uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)" }}>3. Review shows — deselect any you'd like to exclude</div>
        <div className="flex flex-col gap-1.5">
          {eligible.map(s => {
            const isExcluded = excluded.has(s.id);
            const isIncompatible = !s.tier.customTerms && LENGTH_ORDER[s.tier.maxLength] < LENGTH_ORDER[length.id];
            const rate = Math.round(s.baseRate * length.mult * (readinessScore(s.country) / 50));
            const disabled = isExcluded || isIncompatible;
            return (
              <button key={s.id} onClick={() => !isIncompatible && toggleShow(s.id)} disabled={isIncompatible} className="flex items-center justify-between px-3 py-2 rounded-sm border text-left transition-colors" style={{ borderColor: COLORS.border, backgroundColor: disabled ? "transparent" : COLORS.card, opacity: disabled ? 0.4 : 1, cursor: isIncompatible ? "not-allowed" : "pointer" }}>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center rounded-sm border" style={{ width: 16, height: 16, borderColor: disabled ? "rgba(255,255,255,0.3)" : COLORS.green, backgroundColor: disabled ? "transparent" : COLORS.green }}>
                    {!disabled && <Check size={11} style={{ color: COLORS.bg }} />}
                    {isIncompatible && <Lock size={9} style={{ color: "rgba(255,255,255,0.3)" }} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5"><span style={{ fontSize: 13, color: "white" }}>{s.title}</span><TierBadge tier={s.tier} />{s.tier.customTerms && <Unlock size={11} style={{ color: COLORS.purple }} />}</div>
                    <div className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{s.country} · {s.platform} · {s.host} · voice-over in {s.lang}</div>
                  </div>
                </div>
                <div className="font-mono text-right" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{fmt(s.vma)} VMA · {isIncompatible ? "—" : money(rate)}</div>
              </button>
            );
          })}
        </div>
      </div>

      {submitted && (
        <div className="rounded-sm border p-4 mb-4 flex items-center gap-3" style={{ borderColor: "rgba(31,169,127,0.4)", backgroundColor: "rgba(31,169,127,0.08)" }}>
          <Check size={18} style={{ color: COLORS.green }} /><div style={{ fontSize: 13, color: "white" }}>Inquiry submitted — {length.label} {assetType} asset across {selectedIndex.name}.</div>
        </div>
      )}

      <div className="rounded-sm border p-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.panel }}>
        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 font-semibold px-4 py-2 rounded-sm" style={{ backgroundColor: COLORS.accent, color: COLORS.bg, fontSize: 13 }}><Send size={14} /> Submit campaign inquiry <ChevronRight size={14} /></button>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="font-mono" style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{length.label} — {selectedIndex.name} ({bookable.length} shows, {money(totalCost)} est.)</div>
              <button onClick={() => setShowForm(false)} style={{ color: "rgba(255,255,255,0.4)" }}><X size={16} /></button>
            </div>
            <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="Brand or agency name" className="px-3 py-2 rounded-sm border outline-none" style={{ backgroundColor: COLORS.bg, borderColor: COLORS.border, fontSize: 14, color: "white" }} />
            <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Contact email" type="email" className="px-3 py-2 rounded-sm border outline-none" style={{ backgroundColor: COLORS.bg, borderColor: COLORS.border, fontSize: 14, color: "white" }} />
            {error && <div style={{ fontSize: 12, color: COLORS.red }}>{error}</div>}
            <button onClick={submitInquiry} disabled={submitting} className="flex items-center justify-center gap-2 font-semibold py-2 rounded-sm" style={{ backgroundColor: COLORS.green, color: COLORS.bg, fontSize: 13, opacity: submitting ? 0.5 : 1 }}>
              {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting…</> : <><Send size={14} /> Submit inquiry</>}
            </button>
          </div>
        )}
      </div>
      <p className="font-mono mt-6 leading-relaxed" style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
        Prototype only — VMA, engagement, tiers, and rates are illustrative. Country readiness mirrors the
        Calculator tab; only Kenya and Nigeria are individually researched.
      </p>
    </div>
  );
}

// ================= CALCULATOR =================
const CATEGORY_MULTS = [
  { id: "finance", name: "Finance / Business", mult: 1.5 },
  { id: "tech", name: "Tech / Startups", mult: 1.3 },
  { id: "news", name: "News / Politics", mult: 1.15 },
  { id: "culture", name: "Culture / Lifestyle", mult: 1.0 },
  { id: "faces", name: "ACX Faces (Generalist)", mult: 1.6 },
];
const WEIGHT_LABELS = {
  marketSize: "Market Size", digitalReach: "Digital Reach", reliability: "Infra. Reliability",
  dataQuality: "Data Cost & Quality", purchaseCapacity: "Purchase Capacity", attentionPrice: "Attention Price", stability: "Economic Stability",
};
const DEFAULT_WEIGHTS = { marketSize: 14, digitalReach: 14, reliability: 14, dataQuality: 14, purchaseCapacity: 15, attentionPrice: 15, stability: 14 };

function Calc() {
  const [countryKey, setCountryKey] = useState("kenya");
  const [category, setCategory] = useState(CATEGORY_MULTS[0]);
  const [length, setLength] = useState(LENGTHS[1]);
  const [baseRate, setBaseRate] = useState(150);
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [showInfo, setShowInfo] = useState(false);

  const country = COUNTRIES[countryKey];
  const weightSum = Object.values(weights).reduce((a, b) => a + b, 0);
  const compositeScore = useMemo(() => {
    if (weightSum === 0) return 0;
    return Object.keys(weights).reduce((sum, key) => sum + (country.scores[key] * weights[key]) / weightSum, 0);
  }, [country, weights, weightSum]);
  const readinessMultiplier = compositeScore / 50;
  const suggestedRate = baseRate * readinessMultiplier * category.mult * length.mult;

  function updateWeight(key, value) { setWeights(prev => ({ ...prev, [key]: value })); }
  function resetWeights() { setWeights(DEFAULT_WEIGHTS); }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-bold" style={{ fontSize: 17, fontFamily: "'Space Grotesk', sans-serif" }}>ACX RATE CALCULATOR</div>
          <div className="font-mono mt-0.5" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Illustrative scores, not production rates</div>
        </div>
        <button onClick={() => setShowInfo(s => !s)} className="flex items-center gap-1.5 px-2 py-1 rounded-sm border font-mono" style={{ borderColor: COLORS.border, color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
          <Info size={13} /> How this works
        </button>
      </div>

      {showInfo && (
        <div className="rounded-sm border p-4 mb-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.card }}>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
            Each country has a 0–100 readiness score across seven inputs. Adjust weights to reflect how much each
            should matter — a composite of 50 is the 1× baseline. That multiplier applies to a base rate, a category
            multiplier, and a deliverable-length multiplier to produce a suggested rate. Country scores are
            illustrative — treat them as a starting structure, not calibrated numbers.
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-5">
          <div>
            <div className="font-mono uppercase mb-2 flex items-center justify-between" style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)" }}>
              <span>Country</span><span style={{ color: country.confidence === "Researched" ? COLORS.green : "rgba(242,160,7,0.8)" }}>{country.confidence}</span>
            </div>
            <select value={countryKey} onChange={e => setCountryKey(e.target.value)} className="px-3 py-2 rounded-sm border outline-none w-full" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border, fontSize: 14, color: "white" }}>
              {COUNTRY_ORDER.map(key => <option key={key} value={key}>{COUNTRIES[key].name} — {COUNTRIES[key].region} {COUNTRIES[key].confidence === "Researched" ? "(researched)" : "(tier estimate)"}</option>)}
            </select>
          </div>

          <div>
            <div className="font-mono uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)" }}>Category / Index</div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_MULTS.map(c => {
                const active = c.id === category.id;
                return (
                  <button key={c.id} onClick={() => setCategory(c)} className="text-left px-3 py-2 rounded-sm border" style={{ borderColor: active ? COLORS.accent : COLORS.border, backgroundColor: active ? "rgba(242,160,7,0.08)" : COLORS.panel }}>
                    <div style={{ fontSize: 13, color: active ? COLORS.accent : "white" }}>{c.name}</div>
                    <div className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{c.mult}× category</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="font-mono uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)" }}>Deliverable Length</div>
            <div className="flex gap-2">
              {LENGTHS.map(l => {
                const active = l.id === length.id;
                return <button key={l.id} onClick={() => setLength(l)} className="px-4 py-2 rounded-sm border font-mono" style={{ borderColor: active ? COLORS.accent : COLORS.border, backgroundColor: active ? "rgba(242,160,7,0.1)" : COLORS.panel, color: active ? COLORS.accent : "white", fontSize: 13 }}>{l.label} · {l.mult}×</button>;
              })}
            </div>
          </div>

          <div>
            <div className="font-mono uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)" }}>Reference Base Rate (USD)</div>
            <input type="number" value={baseRate} onChange={e => setBaseRate(Number(e.target.value) || 0)} className="px-3 py-2 rounded-sm border outline-none w-40" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border, fontSize: 14, color: "white" }} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="font-mono uppercase flex items-center gap-1.5" style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)" }}><Sliders size={12} /> Input Weights ({weightSum}% total)</div>
              <button onClick={resetWeights} className="flex items-center gap-1 font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}><RotateCcw size={11} /> Reset</button>
            </div>
            <div className="flex flex-col gap-3 rounded-sm border p-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.panel }}>
              {Object.keys(WEIGHT_LABELS).map(key => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1"><span style={{ fontSize: 12.5, color: "white" }}>{WEIGHT_LABELS[key]}</span><span className="font-mono" style={{ fontSize: 11, color: COLORS.accent }}>{weights[key]}%</span></div>
                  <input type="range" min="0" max="40" value={weights[key]} onChange={e => updateWeight(key, Number(e.target.value))} className="w-full" style={{ accentColor: COLORS.accent }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="rounded-sm border p-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.card }}>
            <div className="font-mono uppercase mb-3 flex items-center justify-between" style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)" }}>
              <span>{country.name} — Readiness Scores</span><span style={{ color: country.confidence === "Researched" ? COLORS.green : "rgba(242,160,7,0.8)" }}>{country.confidence}</span>
            </div>
            <div className="flex flex-col gap-2">
              {Object.keys(WEIGHT_LABELS).map(key => (
                <div key={key} className="flex items-center justify-between">
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{WEIGHT_LABELS[key]}</span>
                  <div className="flex items-center gap-2">
                    <div className="rounded-sm overflow-hidden" style={{ width: 60, height: 6, backgroundColor: "rgba(255,255,255,0.1)" }}><div style={{ width: `${country.scores[key]}%`, height: "100%", backgroundColor: COLORS.accent }} /></div>
                    <span className="font-mono" style={{ fontSize: 11, color: "white", width: 24, textAlign: "right" }}>{country.scores[key]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-sm border p-5" style={{ borderColor: "rgba(242,160,7,0.4)", backgroundColor: "rgba(242,160,7,0.06)" }}>
            <div className="flex items-center gap-2 mb-1"><TrendingUp size={16} style={{ color: COLORS.accent }} /><span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.5)" }}>Composite Score</span></div>
            <div className="font-bold" style={{ fontSize: 32, color: COLORS.accent, fontFamily: "'Space Grotesk', sans-serif" }}>{compositeScore.toFixed(1)}<span style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}> / 100</span></div>
            <div className="font-mono mt-1" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Readiness multiplier: {readinessMultiplier.toFixed(2)}×</div>
          </div>

          <div className="rounded-sm border p-5" style={{ borderColor: "rgba(31,169,127,0.4)", backgroundColor: "rgba(31,169,127,0.06)" }}>
            <div className="font-mono uppercase mb-1" style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.5)" }}>Suggested Rate</div>
            <div className="font-bold" style={{ fontSize: 32, color: COLORS.green, fontFamily: "'Space Grotesk', sans-serif" }}>{money(suggestedRate)}</div>
            <div className="font-mono mt-2" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{money(baseRate)} base × {readinessMultiplier.toFixed(2)} readiness × {category.mult} category × {length.mult} length</div>
          </div>

          <div className="rounded-sm border p-3" style={{ borderColor: COLORS.border, backgroundColor: COLORS.card }}>
            <div className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
              Only Kenya and Nigeria are individually researched. Every other country is a tier estimate — treat
              those as a starting structure until researched the same way.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= REGISTER =================
const EXCLUSION_OPTIONS = ["Alcohol", "Betting/Gambling", "Tobacco", "Political campaigns", "Adult products", "None — open to all categories"];
const REG_COUNTRIES = ["Kenya", "Nigeria", "Ghana", "South Africa", "Uganda", "Tanzania", "Egypt", "Morocco", "Other (not yet listed)"];

function StepDots({ step, total }) {
  return (
    <div className="flex gap-1.5 mb-5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="rounded-full" style={{ width: i === step ? 20 : 6, height: 6, backgroundColor: i <= step ? COLORS.accent : "rgba(255,255,255,0.15)", transition: "width 0.2s" }} />
      ))}
    </div>
  );
}

function Register() {
  const [role, setRole] = useState(null); // "creator" | "advertiser"
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(null); // holds the confirmation record
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // creator fields
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [country, setCountry] = useState(REG_COUNTRIES[0]);
  const [languages, setLanguages] = useState("");
  const [platforms, setPlatforms] = useState([]); // [{platform, method, vma}]
  const [category, setCategory] = useState("Culture");
  const [creatorType, setCreatorType] = useState("Specialist");
  const [exclusions, setExclusions] = useState(new Set());
  const [payoutMethod, setPayoutMethod] = useState("Mobile Money");
  const [payoutProvider, setPayoutProvider] = useState("");
  const [payoutAccount, setPayoutAccount] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // advertiser fields
  const [company, setCompany] = useState("");
  const [billingContact, setBillingContact] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [website, setWebsite] = useState("");

  const CREATOR_STEPS = ["Identity", "Platforms", "Category", "Exclusions", "Payout", "Review"];
  const ADVERTISER_STEPS = ["Company", "Billing", "Review"];
  const steps = role === "creator" ? CREATOR_STEPS : ADVERTISER_STEPS;

  function togglePlatform(p) {
    setPlatforms(prev => {
      const exists = prev.find(x => x.platform === p);
      if (exists) return prev.filter(x => x.platform !== p);
      return [...prev, { platform: p, method: "self-report", vma: "" }];
    });
  }
  function updatePlatformField(p, field, value) {
    setPlatforms(prev => prev.map(x => x.platform === p ? { ...x, [field]: value } : x));
  }
  function toggleExclusion(e) {
    setExclusions(prev => {
      const next = new Set(prev);
      if (e === "None — open to all categories") { return next.has(e) ? new Set() : new Set([e]); }
      next.delete("None — open to all categories");
      if (next.has(e)) next.delete(e); else next.add(e);
      return next;
    });
  }

  function validateStep() {
    setError("");
    if (role === "creator") {
      if (step === 0 && (!name.trim() || !contact.trim())) return "Name and contact are required.";
      if (step === 1 && platforms.length === 0) return "Select at least one platform you create on.";
      if (step === 4 && payoutMethod !== "Not set up yet" && (!payoutProvider.trim() || !payoutAccount.trim())) return "Add your payout provider and account details, or choose 'Not set up yet'.";
    } else {
      if (step === 0 && (!company.trim() || !billingContact.trim())) return "Company name and billing contact are required.";
      if (step === 1 && !billingEmail.trim()) return "Billing email is required.";
    }
    return "";
  }

  function next() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep(s => Math.min(s + 1, steps.length - 1));
  }
  function back() { setError(""); setStep(s => Math.max(s - 1, 0)); }

  async function submit() {
    if (!agreedToTerms) { setError("You must agree to the Terms and Conditions before submitting."); return; }
    setSubmitting(true);
    setError("");
    try {
      if (role === "creator") {
        const record = {
          id: "creator_" + Date.now(),
          name: name.trim(), contact: contact.trim(), country, languages: languages.trim(),
          platforms, category, creatorType,
          exclusions: Array.from(exclusions),
          payoutMethod, payoutProvider: payoutProvider.trim(), payoutAccount: payoutAccount.trim(),
          tier: "Emerging", tierStatus: "Pending verification",
          registeredAt: new Date().toISOString(),
        };
        const res = await window.storage.get("acx-creator-registrations", true).catch(() => null);
        const existing = res && res.value ? JSON.parse(res.value) : [];
        await window.storage.set("acx-creator-registrations", JSON.stringify([record, ...existing]), true);
        setSubmitted(record);
      } else {
        const record = {
          id: "advertiser_" + Date.now(),
          company: company.trim(), billingContact: billingContact.trim(), billingEmail: billingEmail.trim(), website: website.trim(),
          status: "Pending review",
          registeredAt: new Date().toISOString(),
        };
        const res = await window.storage.get("acx-advertiser-registrations", true).catch(() => null);
        const existing = res && res.value ? JSON.parse(res.value) : [];
        await window.storage.set("acx-advertiser-registrations", JSON.stringify([record, ...existing]), true);
        setSubmitted(record);
      }
    } catch (e) {
      setError("Couldn't submit right now — please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetAll() {
    setRole(null); setStep(0); setSubmitted(null); setError("");
    setName(""); setContact(""); setCountry(REG_COUNTRIES[0]); setLanguages("");
    setPlatforms([]); setCategory("Culture"); setCreatorType("Specialist"); setExclusions(new Set());
    setPayoutMethod("Mobile Money"); setPayoutProvider(""); setPayoutAccount(""); setAgreedToTerms(false);
    setCompany(""); setBillingContact(""); setBillingEmail(""); setWebsite("");
  }

  // ---- role picker ----
  if (!role) {
    return (
      <div>
        <div className="mb-5">
          <div className="font-bold" style={{ fontSize: 17, fontFamily: "'Space Grotesk', sans-serif" }}>REGISTER WITH ACX</div>
          <div className="font-mono mt-0.5" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Set up an account as a creator or as an advertiser</div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <button onClick={() => setRole("creator")} className="text-left p-5 rounded-sm border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.panel }}>
            <UserPlus size={22} style={{ color: COLORS.accent }} />
            <div className="font-semibold mt-2" style={{ fontSize: 15, color: "white" }}>I'm a Creator</div>
            <div className="mt-1" style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)" }}>Register your show or channel, connect platforms, and get placed in a tier.</div>
          </button>
          <button onClick={() => setRole("advertiser")} className="text-left p-5 rounded-sm border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.panel }}>
            <Building2 size={22} style={{ color: COLORS.green }} />
            <div className="font-semibold mt-2" style={{ fontSize: 15, color: "white" }}>I'm an Advertiser</div>
            <div className="mt-1" style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)" }}>Set up billing so you can book campaigns through ACX Trade.</div>
          </button>
        </div>
      </div>
    );
  }

  // ---- confirmation ----
  if (submitted) {
    const isCreator = role === "creator";
    return (
      <div className="max-w-lg">
        <div className="rounded-sm border p-5 mb-4" style={{ borderColor: "rgba(31,169,127,0.4)", backgroundColor: "rgba(31,169,127,0.08)" }}>
          <div className="flex items-center gap-2 mb-2"><Check size={18} style={{ color: COLORS.green }} /><span className="font-semibold" style={{ fontSize: 15, color: "white" }}>Registration submitted</span></div>
          {isCreator ? (
            <>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Welcome, {submitted.name}. You've been placed at:</p>
              <div className="flex items-center gap-2 mt-2">
                <TierBadge tier={{ name: submitted.tier, color: "rgba(255,255,255,0.5)" }} />
                <span className="font-mono" style={{ fontSize: 12, color: COLORS.accent }}>{submitted.tierStatus}</span>
              </div>
              <p className="mt-3" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                Every creator starts at Emerging regardless of claimed stats. Your tier moves up once your VMA is
                confirmed — via platform API where connected, or a spot-check if self-reported — reviewed periodically,
                not instantly.
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Thanks, {submitted.company}. Your account is:</p>
              <div className="mt-2 font-mono" style={{ fontSize: 12, color: COLORS.accent }}>{submitted.status}</div>
              <p className="mt-3" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>ACX will follow up to verify billing details before you can submit campaigns in Trade.</p>
            </>
          )}
        </div>
        <button onClick={resetAll} className="font-mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>← Register another account</button>
      </div>
    );
  }

  // ---- creator wizard ----
  if (role === "creator") {
    return (
      <div className="max-w-xl">
        <div className="flex items-center justify-between mb-1">
          <div className="font-bold" style={{ fontSize: 17, fontFamily: "'Space Grotesk', sans-serif" }}>CREATOR REGISTRATION</div>
          <button onClick={resetAll} style={{ color: "rgba(255,255,255,0.4)" }}><X size={16} /></button>
        </div>
        <div className="font-mono mb-4" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Step {step + 1} of {steps.length} — {steps[step]}</div>
        <StepDots step={step} total={steps.length} />

        {step === 0 && (
          <div className="flex flex-col gap-3">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name or show name" className="px-3 py-2 rounded-sm border outline-none" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border, fontSize: 14, color: "white" }} />
            <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Phone or email" className="px-3 py-2 rounded-sm border outline-none" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border, fontSize: 14, color: "white" }} />
            <select value={country} onChange={e => setCountry(e.target.value)} className="px-3 py-2 rounded-sm border outline-none" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border, fontSize: 14, color: "white" }}>
              {REG_COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input value={languages} onChange={e => setLanguages(e.target.value)} placeholder="Language(s) you create in (e.g. English, Swahili)" className="px-3 py-2 rounded-sm border outline-none" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border, fontSize: 14, color: "white" }} />
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-2">
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)" }}>Select every platform you publish on:</div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PLATFORM_LIST.filter(p => p !== "Other").map(p => {
                const active = platforms.some(x => x.platform === p);
                return (
                  <button key={p} onClick={() => togglePlatform(p)} className="px-3 py-1.5 rounded-sm border font-mono" style={{ borderColor: active ? COLORS.accent : COLORS.border, backgroundColor: active ? "rgba(242,160,7,0.1)" : COLORS.panel, color: active ? COLORS.accent : "rgba(255,255,255,0.6)", fontSize: 12 }}>{p}</button>
                );
              })}
            </div>
            {platforms.map(p => (
              <div key={p.platform} className="rounded-sm border p-3 flex flex-col gap-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.card }}>
                <div className="font-semibold" style={{ fontSize: 13, color: "white" }}>{p.platform}</div>
                <div className="flex gap-1.5">
                  {[{ id: "api", label: "Connect via platform API" }, { id: "self-report", label: "Self-report stats" }].map(m => (
                    <button key={m.id} onClick={() => updatePlatformField(p.platform, "method", m.id)} className="px-2.5 py-1 rounded-sm border font-mono" style={{ borderColor: p.method === m.id ? COLORS.accent : COLORS.border, backgroundColor: p.method === m.id ? "rgba(242,160,7,0.1)" : COLORS.bg, color: p.method === m.id ? COLORS.accent : "rgba(255,255,255,0.5)", fontSize: 11 }}>{m.label}</button>
                  ))}
                </div>
                {p.method === "self-report" ? (
                  <input type="number" value={p.vma} onChange={e => updatePlatformField(p.platform, "vma", e.target.value)} placeholder="Approx. monthly reach/views" className="px-2.5 py-1.5 rounded-sm border outline-none" style={{ backgroundColor: COLORS.bg, borderColor: COLORS.border, fontSize: 13, color: "white" }} />
                ) : (
                  <div className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Simulated in this prototype — a real build would open {p.platform}'s OAuth/API connection here.</div>
                )}
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <div className="font-mono uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)" }}>Primary category</div>
              <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-2 rounded-sm border outline-none w-full" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border, fontSize: 14, color: "white" }}>
                {["Business", "Tech", "Culture", "Finance", "News", "History", "Sports", "Real Estate", "Tourism", "Education", "Music", "Religion & Spirituality", "Society & Culture", "Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <div className="font-mono uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)" }}>Are you a topic specialist, or cross-topical?</div>
              <div className="flex gap-2">
                {[{ id: "Specialist", label: "Specialist — I stay in my category" }, { id: "Face", label: "Face — I talk about anything" }].map(t => (
                  <button key={t.id} onClick={() => setCreatorType(t.id)} className="flex-1 text-left px-3 py-2 rounded-sm border" style={{ borderColor: creatorType === t.id ? COLORS.purple : COLORS.border, backgroundColor: creatorType === t.id ? "rgba(176,140,224,0.1)" : COLORS.panel, color: creatorType === t.id ? COLORS.purple : "white", fontSize: 13 }}>{t.label}</button>
                ))}
              </div>
              {creatorType === "Face" && <div className="mt-2 font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>You'll be eligible for ACX Faces instead of a topic index — bought for who you are, not what you're covering.</div>}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="font-mono uppercase mb-2 flex items-center gap-1.5" style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)" }}><Ban size={12} /> Categories you won't carry ads for</div>
            <div className="flex flex-col gap-2">
              {EXCLUSION_OPTIONS.map(e => {
                const active = exclusions.has(e);
                return (
                  <button key={e} onClick={() => toggleExclusion(e)} className="flex items-center gap-2 px-3 py-2 rounded-sm border text-left" style={{ borderColor: active ? COLORS.accent : COLORS.border, backgroundColor: active ? "rgba(242,160,7,0.08)" : COLORS.panel }}>
                    <div className="flex items-center justify-center rounded-sm border" style={{ width: 15, height: 15, borderColor: active ? COLORS.accent : "rgba(255,255,255,0.3)", backgroundColor: active ? COLORS.accent : "transparent" }}>
                      {active && <Check size={10} style={{ color: COLORS.bg }} />}
                    </div>
                    <span style={{ fontSize: 13, color: "white" }}>{e}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-3">
            <div className="font-mono uppercase mb-1 flex items-center gap-1.5" style={{ fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)" }}><Wallet size={12} /> How should ACX pay you?</div>
            <div className="flex gap-2">
              {["Mobile Money", "Bank Transfer", "Not set up yet"].map(m => (
                <button key={m} onClick={() => setPayoutMethod(m)} className="px-3 py-1.5 rounded-sm border font-mono" style={{ borderColor: payoutMethod === m ? COLORS.accent : COLORS.border, backgroundColor: payoutMethod === m ? "rgba(242,160,7,0.1)" : COLORS.panel, color: payoutMethod === m ? COLORS.accent : "rgba(255,255,255,0.6)", fontSize: 12 }}>{m}</button>
              ))}
            </div>
            {payoutMethod !== "Not set up yet" && (
              <>
                <input value={payoutProvider} onChange={e => setPayoutProvider(e.target.value)} placeholder={payoutMethod === "Mobile Money" ? "Provider (e.g. M-Pesa, MTN MoMo)" : "Bank name"} className="px-3 py-2 rounded-sm border outline-none" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border, fontSize: 14, color: "white" }} />
                <input value={payoutAccount} onChange={e => setPayoutAccount(e.target.value)} placeholder={payoutMethod === "Mobile Money" ? "Mobile money number" : "Account number"} className="px-3 py-2 rounded-sm border outline-none" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border, fontSize: 14, color: "white" }} />
              </>
            )}
            <div className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Prototype only — no real payout details are processed or transmitted anywhere.</div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-2">
            <div className="rounded-sm border p-3" style={{ borderColor: COLORS.border, backgroundColor: COLORS.card }}>
              <div className="font-mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
                <strong style={{ color: "white" }}>{name}</strong> · {contact}<br />
                {country} · speaks {languages || "—"}<br />
                Platforms: {platforms.map(p => p.platform).join(", ") || "none selected"}<br />
                Category: {category} ({creatorType})<br />
                Exclusions: {exclusions.size ? Array.from(exclusions).join(", ") : "none set"}<br />
                Payout: {payoutMethod}{payoutProvider ? ` — ${payoutProvider}` : ""}
              </div>
            </div>
            <div className="rounded-sm border p-3 flex items-start gap-2" style={{ borderColor: "rgba(242,160,7,0.3)", backgroundColor: "rgba(242,160,7,0.06)" }}>
              <Info size={14} style={{ color: COLORS.accent, marginTop: 1, flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>You'll be placed at <strong>Emerging, pending verification</strong> regardless of the numbers above — tier moves up once your reach is confirmed.</div>
            </div>
            <button onClick={() => setAgreedToTerms(a => !a)} className="flex items-start gap-2 px-3 py-2 rounded-sm border text-left" style={{ borderColor: agreedToTerms ? COLORS.accent : COLORS.border, backgroundColor: agreedToTerms ? "rgba(242,160,7,0.08)" : COLORS.panel }}>
              <div className="flex items-center justify-center rounded-sm border mt-0.5" style={{ width: 15, height: 15, minWidth: 15, borderColor: agreedToTerms ? COLORS.accent : "rgba(255,255,255,0.3)", backgroundColor: agreedToTerms ? COLORS.accent : "transparent" }}>
                {agreedToTerms && <Check size={10} style={{ color: COLORS.bg }} />}
              </div>
              <span style={{ fontSize: 12.5, color: "white" }}>I agree to ACX's <span style={{ color: COLORS.accent, textDecoration: "underline" }}>Terms and Conditions</span>, including the tier, payment, and exclusion terms described above.</span>
            </button>
          </div>
        )}

        {error && <div className="mt-3" style={{ fontSize: 12, color: COLORS.red }}>{error}</div>}

        <div className="flex items-center justify-between mt-5">
          <button onClick={back} disabled={step === 0} className="flex items-center gap-1 font-mono" style={{ fontSize: 12, color: step === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)" }}><ChevronLeft size={14} /> Back</button>
          {step < steps.length - 1 ? (
            <button onClick={next} className="flex items-center gap-1.5 font-semibold px-4 py-2 rounded-sm" style={{ backgroundColor: COLORS.accent, color: COLORS.bg, fontSize: 13 }}>Next <ChevronRight size={14} /></button>
          ) : (
            <button onClick={submit} disabled={submitting} className="flex items-center gap-1.5 font-semibold px-4 py-2 rounded-sm" style={{ backgroundColor: COLORS.green, color: COLORS.bg, fontSize: 13, opacity: submitting ? 0.5 : 1 }}>
              {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting…</> : <>Submit registration</>}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---- advertiser wizard ----
  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-1">
        <div className="font-bold" style={{ fontSize: 17, fontFamily: "'Space Grotesk', sans-serif" }}>ADVERTISER REGISTRATION</div>
        <button onClick={resetAll} style={{ color: "rgba(255,255,255,0.4)" }}><X size={16} /></button>
      </div>
      <div className="font-mono mb-4" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Step {step + 1} of {steps.length} — {steps[step]}</div>
      <StepDots step={step} total={steps.length} />

      {step === 0 && (
        <div className="flex flex-col gap-3">
          <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company or agency name" className="px-3 py-2 rounded-sm border outline-none" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border, fontSize: 14, color: "white" }} />
          <input value={billingContact} onChange={e => setBillingContact(e.target.value)} placeholder="Billing contact name" className="px-3 py-2 rounded-sm border outline-none" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border, fontSize: 14, color: "white" }} />
          <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="Company website (optional)" className="px-3 py-2 rounded-sm border outline-none" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border, fontSize: 14, color: "white" }} />
        </div>
      )}
      {step === 1 && (
        <div className="flex flex-col gap-3">
          <input value={billingEmail} onChange={e => setBillingEmail(e.target.value)} type="email" placeholder="Billing email" className="px-3 py-2 rounded-sm border outline-none" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border, fontSize: 14, color: "white" }} />
          <div className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>A real build would collect business registration details here for verification before large campaigns can be booked.</div>
        </div>
      )}
      {step === 2 && (
        <div className="flex flex-col gap-2">
          <div className="rounded-sm border p-3" style={{ borderColor: COLORS.border, backgroundColor: COLORS.card }}>
            <div className="font-mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
              <strong style={{ color: "white" }}>{company}</strong><br />
              Contact: {billingContact}<br />
              Billing email: {billingEmail}<br />
              Website: {website || "—"}
            </div>
          </div>
          <button onClick={() => setAgreedToTerms(a => !a)} className="flex items-start gap-2 px-3 py-2 rounded-sm border text-left" style={{ borderColor: agreedToTerms ? COLORS.accent : COLORS.border, backgroundColor: agreedToTerms ? "rgba(242,160,7,0.08)" : COLORS.panel }}>
            <div className="flex items-center justify-center rounded-sm border mt-0.5" style={{ width: 15, height: 15, minWidth: 15, borderColor: agreedToTerms ? COLORS.accent : "rgba(255,255,255,0.3)", backgroundColor: agreedToTerms ? COLORS.accent : "transparent" }}>
              {agreedToTerms && <Check size={10} style={{ color: COLORS.bg }} />}
            </div>
            <span style={{ fontSize: 12.5, color: "white" }}>I agree to ACX's <span style={{ color: COLORS.accent, textDecoration: "underline" }}>Terms and Conditions</span>, including payment, billing, and campaign terms.</span>
          </button>
        </div>
      )}

      {error && <div className="mt-3" style={{ fontSize: 12, color: COLORS.red }}>{error}</div>}

      <div className="flex items-center justify-between mt-5">
        <button onClick={back} disabled={step === 0} className="flex items-center gap-1 font-mono" style={{ fontSize: 12, color: step === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)" }}><ChevronLeft size={14} /> Back</button>
        {step < steps.length - 1 ? (
          <button onClick={next} className="flex items-center gap-1.5 font-semibold px-4 py-2 rounded-sm" style={{ backgroundColor: COLORS.accent, color: COLORS.bg, fontSize: 13 }}>Next <ChevronRight size={14} /></button>
        ) : (
          <button onClick={submit} disabled={submitting} className="flex items-center gap-1.5 font-semibold px-4 py-2 rounded-sm" style={{ backgroundColor: COLORS.green, color: COLORS.bg, fontSize: 13, opacity: submitting ? 0.5 : 1 }}>
            {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting…</> : <>Submit registration</>}
          </button>
        )}
      </div>
    </div>
  );
}

// ================= APP SHELL WITH TABS =================
export default function ACXApp() {
  const [tab, setTab] = useState("discover");
  // Shared across Discover and Trade so a preference set in one carries into the other.
  const [platform, setPlatform] = useState("All platforms");
  const [country, setCountry] = useState("All countries");
  const [category, setCategory] = useState("All categories");
  const TABS = [
    { id: "discover", label: "Discover", icon: Radio },
    { id: "trade", label: "Trade", icon: TrendingUp },
    { id: "calc", label: "Calculator", icon: Calculator },
    { id: "register", label: "Register", icon: UserPlus },
  ];

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: COLORS.bg, fontFamily: "Inter, sans-serif" }}>
      <div className="px-5 py-3 flex items-center gap-1 sticky top-0 z-20 border-b" style={{ borderColor: COLORS.border, backgroundColor: "rgba(18,17,26,0.95)", backdropFilter: "blur(6px)" }}>
        <div className="flex items-center gap-1.5 mr-4">
          <LayoutGrid size={16} style={{ color: COLORS.accent }} />
          <span className="font-bold" style={{ fontSize: 14, fontFamily: "'Space Grotesk', sans-serif" }}>ACX</span>
        </div>
        {TABS.map(t => {
          const active = t.id === tab;
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-mono" style={{ fontSize: 12.5, color: active ? COLORS.accent : "rgba(255,255,255,0.5)", backgroundColor: active ? "rgba(242,160,7,0.1)" : "transparent", border: active ? `1px solid ${COLORS.accent}50` : "1px solid transparent" }}>
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>
      <div className="max-w-5xl mx-auto px-5 py-6">
        <div style={{ display: tab === "discover" ? "block" : "none" }}>
          <Discover platform={platform} setPlatform={setPlatform} country={country} setCountry={setCountry} category={category} setCategory={setCategory} />
        </div>
        <div style={{ display: tab === "trade" ? "block" : "none" }}>
          <Trade platform={platform} country={country} category={category} />
        </div>
        <div style={{ display: tab === "calc" ? "block" : "none" }}><Calc /></div>
        <div style={{ display: tab === "register" ? "block" : "none" }}><Register /></div>
      </div>
    </div>
  );
}
