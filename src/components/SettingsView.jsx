import React, { useState } from "react";

export default function SettingsView({
  theme,
  onThemeChange,
  isGlobalCallShieldActive,
  onToggleGlobalCallShield,
  onOpenChecklistModal,
  onOpenSubscriptionModal
}) {
  const [cardDensity, setCardDensity] = useState("compact");
  const [numberMasking, setNumberMasking] = useState(true);
  const [radiusKm, setRadiusKm] = useState(5);
  const [buyerPush, setBuyerPush] = useState(true);
  const [priceDropWatch, setPriceDropWatch] = useState(true);
  const [whatsappMirror, setWhatsappMirror] = useState(false);
  const [faceIdLock, setFaceIdLock] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [cachedSize, setCachedSize] = useState("38.4 MB");

  return (
    <div className="flex-1 w-full bg-surface pt-16 pb-28 min-w-0 max-w-2xl mx-auto">
      <div className="flex flex-col w-full px-margin-mobile pb-space-2xl space-y-space-md">
        
        {/* USER PROFILE SUMMARY BANNER */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-space-md shadow-sm mt-3">
          <div className="flex items-center gap-space-sm">
            <div className="relative shrink-0">
              <img 
                alt="Vikramaditya Rao" 
                className="w-14 h-14 rounded-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDNEqxzKN8N_FTKYy49cYmujcbjsHKlO2JDm3tnzbz-IPGetcxCQ2hY-XGZnuKb2YeHYIY7sNC-ndonG2pqPJtbVXlTJitdzg2ouVetF3eshofzPIue5omHHtKh-GS8fySWsM7O7cwLDUGhPSUjrH-T2w-vP9Ng1q0DP5qmjlLvHjDPe-o4kGlnOtMoOcWIRsC3jSi9nLYPHKO8BUVrmvgiBC7H8mrYYEe-4kFQg"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-surface-container-lowest flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim"></span>
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-space-xs flex-wrap">
                <h2 className="font-headline-sm text-headline-sm text-primary tracking-tight truncate">
                  Vikramaditya Rao
                </h2>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-code-spec text-code-spec">
                  <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  Verified Direct Owner
                </span>
              </div>
              <div className="flex items-center gap-space-sm mt-1.5 font-code-spec text-code-spec text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim"></span>
                  <strong className="text-on-surface font-semibold">2</strong> Live
                </span>
                <span className="text-outline-variant">•</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                  <strong className="text-on-surface font-semibold">1</strong> Sold
                </span>
                <span className="text-outline-variant">•</span>
                <span className="text-on-surface truncate">South Delhi</span>
              </div>
            </div>
          </div>
        </div>

        {/* CALL SHIELD HERO TOGGLE */}
        <div 
          className={`rounded-2xl p-space-md shadow-md transition-all duration-300 ${
            isGlobalCallShieldActive 
              ? "bg-error-container text-on-error-container border border-error/30" 
              : "bg-primary-container text-surface-container-lowest"
          }`}
        >
          <div className="flex items-start justify-between gap-space-sm">
            <div className="flex gap-space-sm min-w-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isGlobalCallShieldActive 
                  ? "bg-error text-surface" 
                  : "bg-surface-container/15 text-secondary-container"
              }`}>
                <span className="material-symbols-outlined text-[22px]">phone_disabled</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-headline-sm text-headline-sm tracking-tight ${
                    isGlobalCallShieldActive ? "text-error font-bold" : "text-surface-container-lowest"
                  }`}>
                    The 'Sold It' Call Shield
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-code-spec text-code-spec uppercase ${
                    isGlobalCallShieldActive 
                      ? "bg-error text-on-error font-bold animate-pulse" 
                      : "bg-secondary-container text-on-secondary-fixed"
                  }`}>
                    {isGlobalCallShieldActive ? "Active • Calls Frozen" : "Standby"}
                  </span>
                </div>
                <p className={`font-body-sm text-body-sm mt-0.5 ${
                  isGlobalCallShieldActive ? "text-on-error-container" : "text-surface-variant/80"
                }`}>
                  1-tap freeze on all incoming buyer calls across every active listing. Routes queries securely to chat.
                </p>
              </div>
            </div>

            {/* Toggle Button */}
            <button 
              onClick={onToggleGlobalCallShield}
              aria-pressed={isGlobalCallShieldActive}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${
                isGlobalCallShieldActive ? "bg-error" : "bg-surface-container/30"
              }`}
              type="button"
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-surface-container-lowest shadow transition duration-200 mt-0.5 ${
                isGlobalCallShieldActive ? "translate-x-5" : "translate-x-0.5"
              }`}></span>
            </button>
          </div>
        </div>

        {/* 10 MODULES CONTAINER */}
        <div className="space-y-space-sm">

          {/* MODULE 1: THEME & VISUAL ENGINE */}
          <div className="rounded-2xl bg-surface-container-low p-space-md shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">palette</span>
                <h3 className="font-label-lg text-label-lg text-primary uppercase tracking-wider">
                  Visual Appearance & OLED (Theme Engine)
                </h3>
              </div>
              <span className="font-code-spec text-code-spec text-on-surface-variant">Mod 01</span>
            </div>
            
            <div className="grid grid-cols-3 gap-space-xs mb-space-sm">
              {/* Option 1: Warm Earth */}
              <button 
                onClick={() => onThemeChange("light")}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                  theme === "light" 
                    ? "bg-surface-container-lowest shadow-sm ring-2 ring-secondary-container text-primary" 
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
                type="button"
              >
                <div className="w-5 h-5 rounded-full bg-[#faf9f6] border border-outline/30 mb-1 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim"></span>
                </div>
                <span className="font-label-md text-label-md">Warm Earth</span>
                <span className="font-code-spec text-[10px] text-on-surface-variant mt-0.5">Default</span>
              </button>

              {/* Option 2: Dark Slate */}
              <button 
                onClick={() => onThemeChange("dark")}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                  theme === "dark" 
                    ? "bg-surface-container-lowest shadow-sm ring-2 ring-secondary-container text-primary" 
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
                type="button"
              >
                <div className="w-5 h-5 rounded-full bg-[#1b2416] mb-1"></div>
                <span className="font-label-md text-label-md">Dark Slate</span>
                <span className="font-code-spec text-[10px] text-on-surface-variant mt-0.5">#121610</span>
              </button>

              {/* Option 3: Pitch OLED */}
              <button 
                onClick={() => onThemeChange("oled")}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                  theme === "oled" 
                    ? "bg-surface-container-lowest shadow-sm ring-2 ring-secondary-container text-primary" 
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
                type="button"
              >
                <div className="w-5 h-5 rounded-full bg-black mb-1 border border-outline/40"></div>
                <span className="font-label-md text-label-md">Pitch OLED</span>
                <span className="font-code-spec text-[10px] text-on-surface-variant mt-0.5">Pure Black</span>
              </button>
            </div>

            {/* Card Density */}
            <div className="flex items-center justify-between pt-2 border-t border-surface-container">
              <div>
                <p className="font-label-md text-label-md text-primary">Card Folio Density</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Architectural specs layout mode</p>
              </div>
              <div className="flex bg-surface-container rounded-full p-0.5">
                <button 
                  onClick={() => setCardDensity("compact")}
                  className={`px-2.5 py-1 rounded-full font-label-md text-label-md transition-all ${
                    cardDensity === "compact" 
                      ? "bg-surface-container-lowest text-primary shadow-xs font-semibold" 
                      : "text-on-surface-variant"
                  }`}
                  type="button"
                >
                  Compact
                </button>
                <button 
                  onClick={() => setCardDensity("comfort")}
                  className={`px-2.5 py-1 rounded-full font-label-md text-label-md transition-all ${
                    cardDensity === "comfort" 
                      ? "bg-surface-container-lowest text-primary shadow-xs font-semibold" 
                      : "text-on-surface-variant"
                  }`}
                  type="button"
                >
                  Comfort
                </button>
              </div>
            </div>
          </div>

          {/* MODULE 2: ACCOUNT & VERIFICATION */}
          <div className="rounded-2xl bg-surface-container-low p-space-md shadow-sm space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">badge</span>
                <h3 className="font-label-lg text-label-lg text-primary uppercase tracking-wider">Identity & Role Verification</h3>
              </div>
              <span className="font-code-spec text-code-spec text-on-surface-variant">Mod 02</span>
            </div>

            <div className="rounded-xl bg-surface-container-lowest p-space-sm flex items-center justify-between shadow-xs">
              <div className="min-w-0">
                <span className="font-label-md text-label-md text-on-surface-variant">Primary Phone ID</span>
                <p className="font-code-spec text-code-spec text-primary font-medium truncate">+91 98800 12345</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-code-spec text-[10px] uppercase font-semibold">
                OTP Linked
              </span>
            </div>

            <div className="rounded-xl bg-surface-container p-space-sm flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <p className="font-label-md text-label-md text-primary flex items-center gap-1 font-semibold">
                  <span>Verified Title Deed</span>
                  <span className="material-symbols-outlined text-tertiary-fixed-dim text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Registry document #DL-2023-994K verified</p>
              </div>
              <button 
                onClick={() => alert("Upload dialog: You can attach your registered title deed copy for instant blue-check badge verification.")}
                className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md shadow-xs shrink-0 hover:bg-surface-bright"
                type="button"
              >
                Upload New
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="font-label-md text-label-md text-primary">Marketplace Persona</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Individual Owner (Zero Brokerage)</p>
              </div>
              <button 
                onClick={onOpenSubscriptionModal}
                className="px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high"
                type="button"
              >
                Switch to Dealer
              </button>
            </div>
          </div>

          {/* MODULE 3: PRIVACY & GATEKEEPER */}
          <div className="rounded-2xl bg-surface-container-low p-space-md shadow-sm space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">shield_person</span>
                <h3 className="font-label-lg text-label-lg text-primary uppercase tracking-wider">Privacy & Gatekeeper</h3>
              </div>
              <span className="font-code-spec text-code-spec text-on-surface-variant">Mod 03</span>
            </div>

            <div className="rounded-xl bg-surface-container-lowest p-space-sm space-y-space-xs shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-primary font-semibold">Calling Hours Gatekeeper</span>
                <span className="font-code-spec text-code-spec text-secondary font-bold">09:00 — 20:00 IST</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Calls outside this window route directly to automated WhatsApp buyer screening note.
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="pr-2">
                <p className="font-label-md text-label-md text-primary">Phone Number Masking</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Direct call connects via virtual routing relay</p>
              </div>
              <button 
                onClick={() => setNumberMasking(!numberMasking)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                  numberMasking ? "bg-primary-container" : "bg-surface-container"
                }`}
                type="button"
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow transition duration-200 mt-0.5 ${
                  numberMasking ? "translate-x-5" : "translate-x-0.5"
                }`}></span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="font-label-md text-label-md text-primary">Anti-Scam Auto-Blocklist</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">1,490 flagged broker bots blocked</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-code-spec text-code-spec font-medium">
                Active
              </span>
            </div>
          </div>

          {/* MODULE 4: HYPER-LOCAL GEO PREFERENCES */}
          <div className="rounded-2xl bg-surface-container-low p-space-md shadow-sm space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">pin_drop</span>
                <h3 className="font-label-lg text-label-lg text-primary uppercase tracking-wider">Geo & District Radar</h3>
              </div>
              <span className="font-code-spec text-code-spec text-on-surface-variant">Mod 04</span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-space-sm shadow-xs">
              <div className="flex items-center gap-space-xs min-w-0">
                <span className="material-symbols-outlined text-secondary text-[20px]">location_on</span>
                <div>
                  <p className="font-label-md text-label-md text-primary font-semibold">Default Home District</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">South Delhi, DL (Pincode 110048)</p>
                </div>
              </div>
              <button 
                onClick={() => alert("District selector: Tap Districts in bottom nav to switch home district.")}
                className="font-label-md text-label-md text-secondary font-semibold hover:underline"
                type="button"
              >
                Change
              </button>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-label-md text-label-md text-primary font-semibold">Discovery Radius Radar</span>
                <span className="font-code-spec text-code-spec text-primary font-bold">{radiusKm} km</span>
              </div>
              <input 
                type="range"
                min="1"
                max="25"
                step="1"
                value={radiusKm}
                onChange={(e) => setRadiusKm(e.target.value)}
                className="w-full accent-secondary"
              />
              <div className="flex justify-between font-code-spec text-[10px] text-on-surface-variant mt-1.5">
                <span>1 km</span>
                <span className={radiusKm == 5 ? "font-bold text-primary" : ""}>5 km</span>
                <span className={radiusKm == 10 ? "font-bold text-primary" : ""}>10 km</span>
                <span className={radiusKm == 25 ? "font-bold text-primary" : ""}>25 km</span>
                <span>District</span>
              </div>
            </div>
          </div>

          {/* MODULE 5: INVENTORY ANALYTICS & LISTING HEALTH */}
          <div className="rounded-2xl bg-surface-container-low p-space-md shadow-sm space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">analytics</span>
                <h3 className="font-label-lg text-label-lg text-primary uppercase tracking-wider">Inventory & Owner Analytics</h3>
              </div>
              <span className="font-code-spec text-code-spec text-on-surface-variant">Mod 05</span>
            </div>

            <div className="grid grid-cols-3 gap-space-xs">
              <div className="rounded-xl bg-surface-container-lowest p-2.5 text-center shadow-xs">
                <span className="font-headline-sm text-headline-sm text-primary font-semibold">438</span>
                <p className="font-label-md text-[10px] text-on-surface-variant uppercase mt-0.5">Folio Views</p>
              </div>
              <div className="rounded-xl bg-surface-container-lowest p-2.5 text-center shadow-xs">
                <span className="font-headline-sm text-headline-sm text-primary font-semibold">62</span>
                <p className="font-label-md text-[10px] text-on-surface-variant uppercase mt-0.5">WhatsApp</p>
              </div>
              <div className="rounded-xl bg-surface-container-lowest p-2.5 text-center shadow-xs">
                <span className="font-headline-sm text-headline-sm text-primary font-semibold">29</span>
                <p className="font-label-md text-[10px] text-on-surface-variant uppercase mt-0.5">Direct Dials</p>
              </div>
            </div>

            <div className="rounded-xl bg-surface-container-lowest p-space-sm space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <p className="font-label-lg text-label-lg text-primary truncate font-semibold">3 BHK Garden Penthouse • Indiranagar</p>
                  <p className="font-code-spec text-code-spec text-secondary font-medium">₹ 2.85 Cr • 2,150 sqft</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-code-spec text-[10px] font-semibold shrink-0">
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* MODULE 6: FOUNDING MEMBER & MONETIZATION HUB */}
          <div className="rounded-2xl bg-surface-container-low p-space-md shadow-sm space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">workspace_premium</span>
                <h3 className="font-label-lg text-label-lg text-primary uppercase tracking-wider">Founding Subscriptions</h3>
              </div>
              <span className="font-code-spec text-code-spec text-on-surface-variant">Mod 06</span>
            </div>

            <div className="rounded-xl bg-primary-container text-surface-container-lowest p-space-sm space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md uppercase tracking-wider text-secondary-container font-semibold">
                  Founding Member Pass
                </span>
                <span className="font-code-spec text-code-spec text-tertiary-fixed-dim">42 Days Left</span>
              </div>
              <p className="font-body-sm text-body-sm text-surface-variant">
                Zero transaction surcharge, direct title verification and instant buyer verification radar.
              </p>
              <div className="pt-1.5">
                <div className="flex justify-between font-code-spec text-[11px] text-surface-variant/80 mb-1">
                  <span>Founding Batch Allocation</span>
                  <span>2,480 / 3,000 Verified</span>
                </div>
                <div className="w-full bg-surface-container/20 rounded-full h-1.5">
                  <div className="bg-secondary-container h-1.5 rounded-full w-[82%]"></div>
                </div>
              </div>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-2 gap-space-xs">
              <div 
                onClick={onOpenSubscriptionModal}
                className="rounded-xl bg-surface-container-lowest p-space-sm space-y-1 shadow-xs cursor-pointer hover:border hover:border-secondary transition-all"
              >
                <span className="font-label-md text-[10px] uppercase text-on-surface-variant tracking-wider font-semibold">Silver Pro</span>
                <div className="font-headline-sm text-headline-sm text-primary font-bold">₹8,000<span className="font-body-sm text-[11px] text-on-surface-variant">/mo</span></div>
                <p className="font-body-sm text-[11px] text-on-surface-variant">25 Direct Listings + Priority Ranking</p>
              </div>

              <div 
                onClick={onOpenSubscriptionModal}
                className="rounded-xl bg-surface-container-lowest p-space-sm space-y-1 shadow-xs cursor-pointer hover:border hover:border-secondary transition-all"
              >
                <span className="font-label-md text-[10px] uppercase text-secondary font-bold tracking-wider">Gold Elite</span>
                <div className="font-headline-sm text-headline-sm text-primary font-bold">₹15,000<span className="font-body-sm text-[11px] text-on-surface-variant">/mo</span></div>
                <p className="font-body-sm text-[11px] text-on-surface-variant">Unlimited folios + 360° tours</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="font-body-sm text-body-sm text-on-surface-variant">GST invoices & ledger</span>
              <button 
                onClick={() => alert("Downloading Official GST Invoices & Payment Ledger...")}
                className="font-label-md text-label-md text-primary font-semibold flex items-center gap-1 hover:underline" 
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                Tax Invoices
              </button>
            </div>
          </div>

          {/* MODULE 7: NOTIFICATIONS & ALERTS */}
          <div className="rounded-2xl bg-surface-container-low p-space-md shadow-sm space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">notifications_active</span>
                <h3 className="font-label-lg text-label-lg text-primary uppercase tracking-wider">Alerts & Direct Pings</h3>
              </div>
              <span className="font-code-spec text-code-spec text-on-surface-variant">Mod 07</span>
            </div>

            <div className="space-y-space-xs">
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="font-label-md text-label-md text-primary font-semibold">Buyer Inquiries Push</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Instant notification when verified buyer pings</p>
                </div>
                <button 
                  onClick={() => setBuyerPush(!buyerPush)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                    buyerPush ? "bg-primary-container" : "bg-surface-container"
                  }`}
                  type="button"
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow transition duration-200 mt-0.5 ${
                    buyerPush ? "translate-x-5" : "translate-x-0.5"
                  }`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="font-label-md text-label-md text-primary font-semibold">Price Drop Watch</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Updates on bookmarked properties</p>
                </div>
                <button 
                  onClick={() => setPriceDropWatch(!priceDropWatch)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                    priceDropWatch ? "bg-primary-container" : "bg-surface-container"
                  }`}
                  type="button"
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow transition duration-200 mt-0.5 ${
                    priceDropWatch ? "translate-x-5" : "translate-x-0.5"
                  }`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="font-label-md text-label-md text-primary font-semibold">WhatsApp Concierge Mirror</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Mirror push notifications to WhatsApp</p>
                </div>
                <button 
                  onClick={() => setWhatsappMirror(!whatsappMirror)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                    whatsappMirror ? "bg-primary-container" : "bg-surface-container"
                  }`}
                  type="button"
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow transition duration-200 mt-0.5 ${
                    whatsappMirror ? "translate-x-5" : "translate-x-0.5"
                  }`}></span>
                </button>
              </div>
            </div>
          </div>

          {/* MODULE 8: SECURITY & SESSION MONITOR */}
          <div className="rounded-2xl bg-surface-container-low p-space-md shadow-sm space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">security</span>
                <h3 className="font-label-lg text-label-lg text-primary uppercase tracking-wider">Device & App Locks</h3>
              </div>
              <span className="font-code-spec text-code-spec text-on-surface-variant">Mod 08</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">fingerprint</span>
                <div>
                  <p className="font-label-md text-label-md text-primary font-semibold">Biometric FaceID Lock</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Require on portfolio appraisal view</p>
                </div>
              </div>
              <button 
                onClick={() => setFaceIdLock(!faceIdLock)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                  faceIdLock ? "bg-primary-container" : "bg-surface-container"
                }`}
                type="button"
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow transition duration-200 mt-0.5 ${
                  faceIdLock ? "translate-x-5" : "translate-x-0.5"
                }`}></span>
              </button>
            </div>

            <div className="rounded-xl bg-surface-container-lowest p-space-sm space-y-2 shadow-xs">
              <span className="font-label-md text-[10px] uppercase text-on-surface-variant tracking-wider font-semibold">Authenticated Sessions</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">phone_iphone</span>
                  <div>
                    <p className="font-label-md text-label-md text-primary font-semibold">iPhone 15 Pro • Delhi</p>
                    <p className="font-code-spec text-[10px] text-tertiary-fixed-dim">Current Device • Active now</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">laptop_mac</span>
                  <div>
                    <p className="font-label-md text-label-md text-primary font-semibold">Chrome Mac • Gurugram</p>
                    <p className="font-code-spec text-[10px] text-on-surface-variant">Logged in 2 days ago</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert("Session revoked.")}
                  className="font-code-spec text-code-spec text-error hover:underline" 
                  type="button"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>

          {/* MODULE 9: STORAGE & DATA OPTIMIZATION */}
          <div className="rounded-2xl bg-surface-container-low p-space-md shadow-sm space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">perm_media</span>
                <h3 className="font-label-lg text-label-lg text-primary uppercase tracking-wider">Storage & Data Optimization</h3>
              </div>
              <span className="font-code-spec text-code-spec text-on-surface-variant">Mod 09</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-label-md text-label-md text-primary font-semibold">Cellular Data Saver</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Compress architectural photo sets</p>
              </div>
              <button 
                onClick={() => setDataSaver(!dataSaver)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                  dataSaver ? "bg-primary-container" : "bg-surface-container"
                }`}
                type="button"
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow transition duration-200 mt-0.5 ${
                  dataSaver ? "translate-x-5" : "translate-x-0.5"
                }`}></span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="font-label-md text-label-md text-primary font-semibold">Offline Saved Properties Cache</p>
                <p className="font-code-spec text-code-spec text-on-surface-variant">{cachedSize} cached data</p>
              </div>
              <button 
                onClick={() => {
                  setCachedSize("0 KB");
                  alert("Local offline cache cleared successfully!");
                }}
                className="px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-md text-label-md hover:bg-surface-container-high"
                type="button"
              >
                Clear Cache
              </button>
            </div>
          </div>

          {/* MODULE 10: LEGAL & ANTI-FRAUD CENTER */}
          <div className="rounded-2xl bg-surface-container-low p-space-md shadow-sm space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">gavel</span>
                <h3 className="font-label-lg text-label-lg text-primary uppercase tracking-wider">Legal & Anti-Fraud Center</h3>
              </div>
              <span className="font-code-spec text-code-spec text-on-surface-variant">Mod 10</span>
            </div>

            <div className="rounded-xl bg-surface-container-lowest p-space-sm space-y-1.5 shadow-xs">
              <div className="flex items-center gap-1.5 text-secondary">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span className="font-label-md text-label-md font-bold uppercase tracking-wider">
                  0% Online Advance Manifesto
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Esets enforces zero token money transfer prior to in-person physical title verification at the sub-registrar office. Any party requesting digital deposit before physical inspection will be permanently blacklisted.
              </p>
            </div>

            <button 
              onClick={onOpenChecklistModal}
              className="w-full flex items-center justify-between p-space-sm rounded-xl bg-surface-container text-left hover:bg-surface-container-high transition-colors"
              type="button"
            >
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">checklist</span>
                <span className="font-label-md text-label-md text-primary font-semibold">
                  Legal Deed Verification: 7-Step Owner Checklist
                </span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">arrow_forward</span>
            </button>

            <div className="flex items-center justify-between pt-1">
              <button 
                onClick={() => alert("Reporting Center: Submit property link or phone number for immediate fraud desk audit.")}
                className="font-label-md text-label-md text-error hover:underline flex items-center gap-1"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">report</span>
                Report Suspicious Listing
              </button>
              <div className="flex gap-space-xs font-body-sm text-[11px] text-on-surface-variant">
                <a className="hover:underline" href="#">Terms</a>
                <span>•</span>
                <a className="hover:underline" href="#">Privacy</a>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM BUILD NOTE */}
        <div className="text-center pt-2">
          <p className="font-code-spec text-[11px] text-on-surface-variant">
            Esets Direct C2C Ecosystem • Build 4.9.1 (Delhi NCR)
          </p>
        </div>

      </div>
    </div>
  );
}
