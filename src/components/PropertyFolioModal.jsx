import React, { useState } from "react";
import StampLogo from "./StampLogo";
import { resolvePropertyLandmarks } from "../services/landmarkRadarService";

export default function PropertyFolioModal({ 
  property, 
  onClose, 
  onToggleSold,
  isGlobalCallShieldActive = false
}) {
  if (!property) return null;

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [is360Active, setIs360Active] = useState(false);
  const [isMapInteractive, setIsMapInteractive] = useState(false);
  const landmarks = resolvePropertyLandmarks(property);

  // Fallback images if property has fewer images
  const photos = property.images && property.images.length > 0 ? property.images : [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
  ];

  const isSold = property.isSold || isGlobalCallShieldActive;

  const mapQuery = encodeURIComponent(
    `${property.locality || "Greater Kailash"}, ${property.district || "South Delhi"}, ${property.state || "Delhi"}`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-surface text-on-surface flex flex-col antialiased">
      {/* Top Fixed Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/95 backdrop-blur-md shadow-[0_1px_8px_rgba(27,36,22,0.05)] pt-safe border-b border-surface-container">
        <div className="h-16 px-margin-mobile flex items-center justify-between gap-space-xs max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <button 
              aria-label="Go back" 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container active:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
            </button>
            <StampLogo className="w-7 h-7" showText={false} />
            <h1 className="font-headline-sm text-[17px] text-primary tracking-tight truncate max-w-[170px] font-bold">
              Property Folio
            </h1>
          </div>
          <div className="flex items-center gap-space-xs">
            <div className="inline-flex items-center px-2 py-0.5 rounded bg-primary-container text-secondary-container font-code-spec text-code-spec shadow-xs">
              <span className="font-semibold text-[10px] uppercase tracking-wide">0% Brok.</span>
            </div>
            <img 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover shadow-xs" 
              src={property.sellerAvatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBDNEqxzKN8N_FTKYy49cYmujcbjsHKlO2JDm3tnzbz-IPGetcxCQ2hY-XGZnuKb2YeHYIY7sNC-ndonG2pqPJtbVXlTJitdzg2ouVetF3eshofzPIue5omHHtKh-GS8fySWsM7O7cwLDUGhPSUjrH-T2w-vP9Ng1q0DP5qmjlLvHjDPe-o4kGlnOtMoOcWIRsC3jSi9nLYPHKO8BUVrmvgiBC7H8mrYYEe-4kFQg"}
            />
          </div>
        </div>
      </header>

      {/* Main Scrollable Folio Body */}
      <main className="flex-1 w-full bg-surface pt-16 min-w-0 max-w-3xl mx-auto">
        <div className="flex flex-col w-full pb-32">
          
          {/* Top Trust & Status Ribbon */}
          <section className="px-margin-mobile pt-3 pb-2 flex flex-wrap items-center justify-between gap-2 bg-surface-container-low border-b border-surface-container">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-code-spec text-code-spec shadow-xs ${
              isSold 
                ? "bg-error-container text-on-error-container" 
                : "bg-primary-container text-tertiary-fixed"
            }`}>
              <span className={`w-2 h-2 rounded-full ${isSold ? "bg-error" : "bg-tertiary-fixed-dim animate-pulse"}`}></span>
              <span className="font-bold uppercase tracking-wider text-[11px]">
                {isSold ? "SOLD OUT • CALLS SHIELDED" : "Active Direct Listing"}
              </span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container font-code-spec text-code-spec font-bold">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="tracking-tight text-[11px]">0% Brokerage • ₹0 Middleman Fee</span>
            </div>
          </section>

          {/* Gallery & Media Hub */}
          <section className="relative w-full bg-primary-container overflow-hidden">
            {/* Main Photo Showcase */}
            <div className="relative w-full aspect-[16/11] bg-surface-dim overflow-hidden select-none">
              <div 
                className={`w-full h-full bg-cover bg-center transition-all duration-300 ${isSold ? "grayscale contrast-75 brightness-90" : ""}`}
                style={{ backgroundImage: `url('${photos[activePhotoIdx]}')` }}
              >
                {/* Floating Verified Shield Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/95 backdrop-blur-md text-primary shadow-md">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                    shield_with_heart
                  </span>
                  <span className="font-label-md text-label-md tracking-wide font-bold">
                    Direct Deed Verified
                  </span>
                </div>

                {/* 360 & Video Walkthrough Badges */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button 
                    onClick={() => setIs360Active(!is360Active)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full backdrop-blur-md text-surface shadow-md active:scale-95 transition-transform ${
                      is360Active ? "bg-tertiary-container text-tertiary-fixed" : "bg-primary/80 text-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
                    <span className="font-code-spec text-[10px] uppercase font-semibold">360° Tour</span>
                  </button>
                  {property.videoUrl && (
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface shadow-md">
                      <span className="material-symbols-outlined text-[16px]">videocam</span>
                    </div>
                  )}
                </div>

                {/* Sold Out Diagonal Ribbon Overlay */}
                {isSold && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-primary/25">
                    <div className="transform -rotate-12 bg-error text-on-error font-headline-sm text-[15px] sm:text-headline-sm font-bold tracking-widest px-6 py-2 shadow-2xl flex items-center gap-2">
                      <span className="material-symbols-outlined text-[22px]">verified</span>
                      DEAL CLOSED • SOLD OUT
                    </div>
                  </div>
                )}

                {/* Counter Indicator Overlay */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-primary/85 backdrop-blur-md text-surface font-code-spec text-code-spec font-medium">
                  <span>{activePhotoIdx + 1} / {photos.length}</span> Photos
                </div>

                {/* Subtle Gradient Scrim */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-primary/60 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Thumbnails Scroller */}
            <div className="p-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar bg-primary-container">
              {photos.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`flex-shrink-0 w-14 h-11 rounded-lg overflow-hidden shadow-sm transition-all ${
                    activePhotoIdx === idx 
                      ? "ring-2 ring-secondary-container opacity-100" 
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <div 
                    className="w-full h-full bg-cover bg-center" 
                    style={{ backgroundImage: `url('${imgUrl}')` }}
                  />
                </button>
              ))}
            </div>
          </section>

          {/* Title & Pricing Folio Header */}
          <section className="px-margin-mobile pt-4 pb-3 bg-surface">
            <div className="flex items-center gap-1.5 text-secondary font-label-md text-label-md uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-[15px]">pin_drop</span>
              <span className="font-bold">{property.locality} • {property.district}</span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight font-bold">
              {property.title}
            </h2>
            <div className="mt-2.5 flex items-baseline justify-between flex-wrap gap-2">
              <div className="flex items-baseline gap-2">
                <span className={`font-headline-xl-mobile text-headline-xl-mobile font-bold tracking-tight ${isSold ? "line-through text-on-surface-variant" : "text-primary"}`}>
                  {property.priceUnit}
                </span>
                <span className="font-code-spec text-code-spec text-on-surface-variant bg-surface-container px-2 py-0.5 rounded font-semibold">
                  {property.pricePerSqft || `₹${Math.round(property.price / (property.area || 1000)).toLocaleString()} / sq.ft`}
                </span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-container text-tertiary-fixed font-code-spec text-[11px] font-bold">
                <span className="material-symbols-outlined text-[13px]">currency_exchange</span>
                <span>{property.savingsBrokerage || "Saved 100% Brokerage"}</span>
              </div>
            </div>
          </section>

          {/* Anti-Fraud Shield Warning Banner */}
          <section className="px-margin-mobile py-2.5">
            <div className="p-3 rounded-xl bg-secondary-container text-on-secondary-container flex items-start gap-2.5 shadow-xs border border-secondary/20">
              <span className="material-symbols-outlined text-secondary text-[22px] flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                security
              </span>
              <div className="min-w-0">
                <div className="font-label-lg text-label-lg text-on-secondary-fixed font-bold leading-tight flex items-center gap-1">
                  <span>Zero Brokerage Guarantee</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-secondary text-surface uppercase font-code-spec">Strict Anti-Fraud</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-secondary-container mt-1 leading-snug">
                  Direct peer-to-peer listing. If anyone claiming to be an agent or caretaker asks for "visiting pass charges" or lock-in advance, report them immediately for a lifetime IP & PAN ban.
                </p>
              </div>
            </div>
          </section>

          {/* Core Architectural Specifications Matrix */}
          <section className="px-margin-mobile py-3">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-label-lg text-label-lg text-primary uppercase tracking-wider font-bold">Architectural Specifications</span>
              <span className="font-code-spec text-code-spec text-on-surface-variant">Spec ID: {property.id?.toUpperCase()}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {/* Area */}
              <div className="p-3 rounded-xl bg-surface-container-low shadow-xs border border-surface-container flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[18px] text-secondary">straighten</span>
                  <span>Super Built-up Area</span>
                </div>
                <div className="mt-2">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    {property.area} sq.ft
                  </span>
                  <p className="font-code-spec text-[11px] text-on-surface-variant mt-0.5">
                    Carpet: {property.carpetArea || Math.round(property.area * 0.82)} sq.ft
                  </p>
                </div>
              </div>

              {/* Configuration */}
              <div className="p-3 rounded-xl bg-surface-container-low shadow-xs border border-surface-container flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[18px] text-secondary">bedroom_parent</span>
                  <span>Configuration</span>
                </div>
                <div className="mt-2">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    {property.bhk} BHK • {property.bathrooms} Bath
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Balconies • Vastu Verified
                  </p>
                </div>
              </div>

              {/* Floor & Facing */}
              <div className="p-3 rounded-xl bg-surface-container-low shadow-xs border border-surface-container flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[18px] text-secondary">explore</span>
                  <span>Orientation</span>
                </div>
                <div className="mt-2">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    {property.floorLevel || "Middle Floor"}
                  </span>
                  <p className="font-code-spec text-[11px] text-on-surface-variant mt-0.5">
                    {property.facing || "North-East Facing"}
                  </p>
                </div>
              </div>

              {/* Furnishing & Deed */}
              <div className="p-3 rounded-xl bg-surface-container-low shadow-xs border border-surface-container flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[18px] text-secondary">chair</span>
                  <span>Furnish & Registry</span>
                </div>
                <div className="mt-2">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    {property.furnishing}
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    {property.ownership || "Freehold Clear Title"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Mandatory Google Maps Satellite View Embed - WITH ZERO TOUCH TRAPPING */}
          <section className="px-margin-mobile py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  satellite_alt
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Satellite Neighborhood Radar</h3>
              </div>
              <span className="font-code-spec text-[11px] text-tertiary-container bg-tertiary-fixed px-2 py-0.5 rounded font-bold">
                Live Satellite (t=k)
              </span>
            </div>

            {/* Satellite Map Embed Container */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-primary-container border border-surface-container">
              <div className="relative w-full h-56 bg-surface-dim">
                <iframe
                  allowFullScreen=""
                  className={`w-full h-full filter saturate-[1.1] contrast-[1.05] ${
                    isMapInteractive ? "pointer-events-auto" : "pointer-events-none"
                  }`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${mapQuery}&t=k&z=16&output=embed`}
                  style={{ border: 0 }}
                  title={`Google Maps Satellite View - ${property.locality}`}
                  width="100%"
                  height="100%"
                ></iframe>

                {/* Overhead Coordinates Tag */}
                <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded bg-primary/85 backdrop-blur-md text-surface font-code-spec text-[10px] flex items-center gap-1 pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                  <span>{property.coords || "28.5355° N, 77.2410° E"}</span>
                </div>

                {/* 1-Finger Scroll Guard / Interactive Toggle Button */}
                <button
                  onClick={() => setIsMapInteractive(!isMapInteractive)}
                  className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest/95 backdrop-blur-md text-primary font-label-md text-label-md font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    {isMapInteractive ? "lock" : "pan_tool"}
                  </span>
                  <span>{isMapInteractive ? "Lock Map (Resume Scroll)" : "Tap to Pan Map"}</span>
                </button>
              </div>

              {/* Neighborhood Proximity Matrix */}
              <div className="p-3 bg-surface-container-low flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                  <span className="font-code-spec text-[10px] text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-primary">verified_user</span>
                    Verified Topography Radar
                  </span>
                  <span className="font-code-spec text-[10px] text-on-surface-variant">Real Pedestrian Walking Times</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center">
                  {landmarks.map((lm, idx) => (
                    <div 
                      key={idx} 
                      className="p-2.5 rounded-xl bg-surface-container-lowest shadow-xs flex flex-col items-center justify-between border border-surface-container min-h-[82px]"
                    >
                      <span className="material-symbols-outlined text-[18px] text-secondary">{lm.icon || "pin_drop"}</span>
                      <div className="my-0.5">
                        <span className="font-headline-sm text-[13px] font-bold text-primary block leading-none">{lm.distance}</span>
                        {lm.time && (
                          <span className="font-code-spec text-[9px] text-secondary block mt-0.5 font-medium">{lm.time}</span>
                        )}
                      </div>
                      <span className="font-body-sm text-[10px] text-on-surface-variant truncate w-full font-medium" title={lm.label}>
                        {lm.label}
                      </span>
                    </div>
                  ))}
                </div>

                <a 
                  className="w-full mt-1 py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-lg text-label-lg font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  href={`https://maps.google.com/maps?q=${mapQuery}&t=k&z=17`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">open_in_new</span>
                  <span>Open Full Satellite View in Google Maps</span>
                </a>
              </div>
            </div>
          </section>

          {/* Direct Owner Dossier & 'Sold It' Call Shield Control */}
          <section className="px-margin-mobile py-3">
            <div className="p-4 rounded-2xl bg-surface-container shadow-xs border border-surface-container flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <img 
                    alt={property.sellerName}
                    className="w-14 h-14 rounded-full object-cover shadow-sm ring-2 ring-secondary-container"
                    src={property.sellerAvatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBDNEqxzKN8N_FTKYy49cYmujcbjsHKlO2JDm3tnzbz-IPGetcxCQ2hY-XGZnuKb2YeHYIY7sNC-ndonG2pqPJtbVXlTJitdzg2ouVetF3eshofzPIue5omHHtKh-GS8fySWsM7O7cwLDUGhPSUjrH-T2w-vP9Ng1q0DP5qmjlLvHjDPe-o4kGlnOtMoOcWIRsC3jSi9nLYPHKO8BUVrmvgiBC7H8mrYYEe-4kFQg"}
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-surface flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px] text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-headline-sm text-headline-sm text-primary font-bold truncate">
                      {property.sellerName}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-primary-container text-tertiary-fixed font-code-spec text-[10px] font-bold">
                      {property.sellerType || "Owner"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-[12px] mt-0.5">
                    <span className="material-symbols-outlined text-[14px] text-secondary">badge</span>
                    <span>Title Deed & Aadhaar Authenticated</span>
                  </div>
                </div>
              </div>

              {/* Calling Hours & Call Shield Indicator */}
              <div className="p-2.5 rounded-xl bg-surface-container-lowest text-on-surface flex items-center justify-between text-xs font-body-sm shadow-xs">
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                  <span>Calling Hours: <strong className="text-on-surface">{property.callingHours || "9:00 AM – 8:30 PM"}</strong></span>
                </div>
                <span className={`inline-flex items-center gap-1 font-code-spec text-[10px] font-bold ${isSold ? "text-error" : "text-tertiary-container"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSold ? "bg-error" : "bg-tertiary-container"}`}></span>
                  {isSold ? "Calls Blocked" : "Call Shield Ready"}
                </span>
              </div>

              {/* Owner's Note */}
              <div className="p-3 rounded-xl bg-surface-container-low text-primary font-body-sm text-body-sm leading-relaxed italic border border-surface-container">
                “{property.description}”
              </div>

              {/* Signature 'SOLD IT' Demo Controller Toggle */}
              <div className="mt-1 p-3.5 rounded-xl bg-surface-container-high/60 border border-surface-container flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[18px]">admin_panel_settings</span>
                    <span className="font-label-lg text-label-lg text-primary font-bold">Owner Call-Shield Control</span>
                  </div>
                  <span className="font-code-spec text-[10px] uppercase text-on-surface-variant font-bold">Seller Sandbox</span>
                </div>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  Are you the owner? Tap “Sold It” to freeze incoming phone calls instantly and lock inquiries across all platforms.
                </p>
                <button 
                  onClick={() => onToggleSold(property.id, property.isSold)}
                  className="w-full py-2.5 px-3 rounded-xl bg-surface-container-lowest hover:bg-error-container text-primary hover:text-error font-code-spec text-code-spec font-bold flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isSold ? "lock_open" : "lock"}
                  </span>
                  <span>
                    {isSold ? "Unfreeze Listing (Resume Calls)" : "Test 'Sold It' Instant Freeze"}
                  </span>
                </button>
                {isSold && (
                  <div className="p-2 rounded-lg bg-error text-on-error font-code-spec text-[11px] text-center font-bold animate-pulse">
                    Listing Marked as SOLD OUT • Direct Dials Blocked • Call Shield Active
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Sticky Floating Direct CTA Bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-surface/95 backdrop-blur-md shadow-[0_-8px_24px_-4px_rgba(27,36,22,0.12)] p-margin-mobile pb-safe border-t border-surface-container">
        <div className="max-w-md mx-auto flex items-center gap-2.5">
          {isSold ? (
            <div className="w-full py-3 px-3 rounded-xl bg-surface-container-high text-on-surface-variant font-label-md text-[13px] flex items-center justify-center gap-2 text-center cursor-not-allowed">
              <span className="material-symbols-outlined text-[18px] text-error">lock</span>
              <span className="font-bold">This property is sold out • Inquiries frozen</span>
            </div>
          ) : (
            <>
              {/* Direct Call Button */}
              <a 
                className="flex-1 py-3 px-3 rounded-xl bg-secondary text-surface font-headline-sm text-[15px] font-bold flex items-center justify-center gap-2 shadow-md hover:bg-on-secondary-fixed active:scale-[0.98] transition-all"
                href={`tel:${property.sellerPhone?.replace(/\s+/g, '')}`}
              >
                <span className="material-symbols-outlined text-[19px]">call</span>
                <span>Direct Call (₹0 Brok.)</span>
              </a>

              {/* WhatsApp Owner Button */}
              <a 
                className="flex-1 py-3 px-3 rounded-xl bg-primary-container text-tertiary-fixed font-headline-sm text-[15px] font-bold flex items-center justify-center gap-2 shadow-md hover:bg-tertiary-container active:scale-[0.98] transition-all"
                href={`https://wa.me/${property.sellerPhone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${property.sellerName}, I saw your ${property.title} in ${property.locality} on Esets. Is it available for site visit?`)}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[19px]">chat</span>
                <span>WhatsApp Owner</span>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
