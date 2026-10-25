/**
 * Esets Real Estate Marketplace — Site Content & Copy Configuration
 * 
 * Clean, compact, utility-first copy. Zero marketing fluff, zero intrusive install boxes,
 * and zero premature monetization/subscription clutter.
 */

export const APP_CONFIG = {
  name: "Esets",
  tagline: "Direct C2C Real Estate",
  badge: "0% Brokerage"
};

export const HERO_CONTENT = {
  trustPill: "0% BROKERAGE • DIRECT OWNER-TO-BUYER",
  headlinePrefix: "Buy & Sell Directly with ",
  headlineHighlight: "Genuine Owners",
  headlineSuffix: " — Zero Commission.",
  subtitle: "Direct unfiltered owner calls, verified freehold title deeds, and instant 1-tap 'Sold It' privacy shield.",
  postPropertyBtnText: "Post Property Free (0% Brokerage)",
  legalChecklistBtnText: "7-Step Legal Verification Checklist"
};

export const TRUST_CARDS_CONTENT = [
  {
    id: "direct-call",
    title: "1-Tap Direct Call",
    description: "Instant direct calls & WhatsApp with genuine property owners.",
    icon: "call",
    badgeColor: "bg-tertiary-fixed text-on-tertiary-fixed"
  },
  {
    id: "call-shield",
    title: "'Sold It' Call Shield",
    description: "1-tap phone masking stops all buyer calls once your deal is closed.",
    icon: "gpp_bad",
    badgeColor: "bg-error-container text-error"
  },
  {
    id: "anti-fraud",
    title: "100% Anti-Fraud",
    description: "Strict zero online advance token rule. Inspect property on-site.",
    icon: "security",
    badgeColor: "bg-secondary-fixed text-on-secondary-fixed"
  }
];

export const RADAR_CONTENT = {
  title: "Topographical Distance Radar",
  defaultStatus: "GPS Standby",
  gpsActiveStatus: "Real GPS Active",
  defaultDescription: "Real physical distance to key infrastructure points with zero fake broker landmarks.",
  landmarks: [
    { label: "Nearest Metro", distance: "400m", icon: "subway" },
    { label: "District Hospital", distance: "1.2km", icon: "local_hospital" },
    { label: "School / College", distance: "650m", icon: "school" }
  ]
};

export const DISTRICTS_VIEW_CONTENT = {
  title: "Select Territory / District",
  subtitle: "Browse 100% direct owner listings with zero middleman commissions."
};

export const SAVED_VIEW_CONTENT = {
  title: "Saved Property Folios",
  subtitle: "Direct listings bookmarked for quick owner call and price tracking.",
  emptyTitle: "No Saved Properties Yet",
  emptySubtitle: "Tap the bookmark icon on any property in the explore feed to save it here."
};

export const SETTINGS_CONTENT = {
  headerTitle: "App Settings & Privacy",
  headerSubtitle: "Direct device controls, call privacy shields, and biometric security."
};
