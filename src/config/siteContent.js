/**
 * Esets Real Estate Marketplace — Site Content & Copy Configuration
 * 
 * Centralized content repository for all text, headlines, subtitles,
 * button labels, trust badges, and static UI messages across the application.
 * 
 * If you need to update any text, headline, or slogan, edit ONLY this file.
 * This guarantees zero unintended side-effects on application logic or styles.
 */

export const APP_CONFIG = {
  name: "Esets",
  tagline: "Deed Verified C2C",
  version: "v2.4",
  badge: "0% Broker",
  brokerageSavedRatio: 0.02 // 2% typical brokerage saved
};

export const HERO_CONTENT = {
  trustPill: "DIRECT C2C REAL ESTATE • 0% BROKERAGE • ZERO MIDDLEMEN",
  headlinePrefix: "Buy & Sell Real Estate Directly with Owners — ",
  headlineHighlight: "₹0 Brokerage",
  headlineSuffix: ", Zero Commission.",
  subtitle: "Hyper-local direct marketplace. Skip the broker. Call or WhatsApp genuine property owners directly, schedule site visits, and close deals safely on the spot.",
  postPropertyBtnText: "Post Property For Free (0% Brokerage)",
  dealerPlansBtnText: "Dealer Plans (₹8k/mo)",
  legalChecklistBtnText: "Legal Checklist",
  appInstallTitle: "Esets Mobile App (v2.4)",
  appInstallSubtitle: "Instant 1-finger scroll • Verified deeds",
  installBtnText: "Install"
};

export const TRUST_CARDS_CONTENT = [
  {
    id: "direct-call",
    title: "1-Tap Direct Call",
    description: "Instant unfiltered phone calls with verified genuine owners.",
    icon: "call",
    badgeColor: "bg-tertiary-fixed text-on-tertiary-fixed"
  },
  {
    id: "call-shield",
    title: "'Sold It' Call Shield",
    description: "One tap stops calls forever the minute your deal is closed.",
    icon: "gpp_bad",
    badgeColor: "bg-error-container text-error"
  },
  {
    id: "anti-fraud",
    title: "100% Anti-Fraud",
    description: "Mandatory zero online advance token policy across all listings.",
    icon: "security",
    badgeColor: "bg-secondary-fixed text-on-secondary-fixed"
  }
];

export const RADAR_CONTENT = {
  title: "Hyper-Local Distance Radar",
  defaultStatus: "Location Active",
  gpsActiveStatus: "Real GPS Lock",
  defaultDescription: "Every listing displays verifiable distance to local schools, metro junctions, and commercial hubs with zero fake broker landmarks.",
  landmarks: [
    { label: "Metro", distance: "400m", icon: "subway" },
    { label: "Hospital", distance: "1.2km", icon: "local_hospital" },
    { label: "High School", distance: "650m", icon: "school" }
  ]
};

export const DISTRICTS_VIEW_CONTENT = {
  title: "Districts & Micro-Markets",
  subtitle: "Select your territory to browse 100% direct owner listings with zero middleman commissions."
};

export const SAVED_VIEW_CONTENT = {
  title: "Saved Property Folios",
  subtitle: "Properties bookmarked for instant 1-tap owner inquiries and price drop tracking.",
  emptyTitle: "No Saved Properties",
  emptySubtitle: "Bookmark properties from the Explore feed to monitor them here."
};

export const SETTINGS_CONTENT = {
  headerTitle: "Settings & System Security",
  headerSubtitle: "Direct device controls, call privacy shields, and verified credentials."
};
