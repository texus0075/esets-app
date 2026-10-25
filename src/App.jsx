import React, { useState, useEffect, useMemo } from "react";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import PropertyCard from "./components/PropertyCard";
import PropertyFolioModal from "./components/PropertyFolioModal";
import PostPropertyView from "./components/PostPropertyView";
import SettingsView from "./components/SettingsView";
import LocationModal from "./components/LocationModal";
import SubscriptionModal from "./components/SubscriptionModal";
import LegalChecklistModal from "./components/LegalChecklistModal";
import { INITIAL_PROPERTIES, DISTRICTS } from "./data/mockData";

export default function App() {
  // Navigation & Theme State
  const [activeTab, setActiveTab] = useState("explore");
  const [theme, setTheme] = useState("light"); // 'light' | 'dark' | 'oled'
  const [isGlobalCallShieldActive, setIsGlobalCallShieldActive] = useState(false);

  // Property & Filter State
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [dealIntent, setDealIntent] = useState("All"); // 'All' | 'Buy' | 'Rent'
  const [bhkFilter, setBhkFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState(["prop-1"]);

  // Modals
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);

  // Sync theme class to document <html> element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "oled");
    root.classList.add(theme);
  }, [theme]);

  // Handlers
  const handleToggleSold = (propertyId, currentStatus) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        return { ...p, isSold: !currentStatus };
      }
      return p;
    }));
    if (selectedProperty && selectedProperty.id === propertyId) {
      setSelectedProperty(prev => ({ ...prev, isSold: !currentStatus }));
    }
  };

  const handleToggleGlobalCallShield = () => {
    setIsGlobalCallShieldActive(prev => !prev);
  };

  const handleAddProperty = (newProperty) => {
    const created = {
      ...newProperty,
      id: `prop-${Date.now()}`,
      postedAt: "Just now",
      views: 1
    };
    setProperties(prev => [created, ...prev]);
    alert("🎉 Your property has been published live with 0% brokerage!");
    setActiveTab("explore");
  };

  // Filtered Properties for Explore Feed
  const filteredProperties = useMemo(() => {
    return properties.filter(item => {
      // District filter
      if (selectedDistrict && selectedDistrict !== "All Districts" && selectedDistrict !== "") {
        if (item.district !== selectedDistrict) return false;
      }
      // Deal intent (Buy/Sale vs Rent)
      if (dealIntent === "Buy" && item.dealType !== "Sale") return false;
      if (dealIntent === "Rent" && item.dealType !== "Rent") return false;

      // BHK filter
      if (bhkFilter !== "All") {
        if (bhkFilter === "1 BHK" && item.bhk !== 1) return false;
        if (bhkFilter === "2 BHK" && item.bhk !== 2) return false;
        if (bhkFilter === "3 BHK" && item.bhk !== 3) return false;
        if (bhkFilter === "4+ BHK" && item.bhk < 4) return false;
      }

      // Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesLocality = item.locality?.toLowerCase().includes(q);
        const matchesDistrict = item.district?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLocality && !matchesDistrict) return false;
      }

      return true;
    });
  }, [properties, selectedDistrict, dealIntent, bhkFilter, searchQuery]);

  const savedProperties = useMemo(() => {
    return properties.filter(p => savedIds.includes(p.id));
  }, [properties, savedIds]);

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col antialiased selection:bg-secondary-container selection:text-on-secondary-fixed">
      {/* Top Navbar */}
      <Navbar
        selectedDistrict={selectedDistrict || "South Delhi, DL"}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onNavigateToSettings={() => setActiveTab("settings")}
      />

      {/* Main Tab Routing */}
      {activeTab === "explore" && (
        <main className="flex-1 w-full bg-surface pt-16 pb-24 min-w-0 max-w-2xl mx-auto">
          <div className="flex flex-col w-full pb-8">
            
            {/* Top Trust Bar / Micro Hero Section */}
            <section className="flex flex-col px-margin-mobile pt-3 pb-4">
              {/* Live Trust Pill */}
              <div className="inline-flex items-center self-start gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface shadow-xs">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
                <span className="font-code-spec text-[10px] tracking-wider uppercase text-on-surface-variant font-semibold">
                  DIRECT C2C REAL ESTATE • 0% BROKERAGE • ZERO MIDDLEMEN
                </span>
              </div>

              {/* Fluid Clamped Headline */}
              <h1 className="mt-3 font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight leading-tight">
                Buy & Sell Real Estate Directly with Owners — <span className="text-secondary font-bold">₹0 Brokerage</span>, Zero Commission.
              </h1>

              {/* Subtitle */}
              <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Hyper-local direct marketplace. Skip the broker. Call or WhatsApp genuine property owners directly, schedule site visits, and close deals safely on the spot.
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-col gap-2">
                <button 
                  onClick={() => setActiveTab("post-free")}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-lg text-label-lg font-bold shadow-[0_4px_16px_rgba(213,129,15,0.35)] active:scale-[0.99] transition-transform hover:opacity-95"
                >
                  <span className="material-symbols-outlined text-[20px]">add_home</span>
                  <span>Post Property For Free (0% Brokerage)</span>
                </button>

                <button 
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-dim transition-colors font-medium"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                  <span>Dealer & Builder Subscription (₹8,000/mo)</span>
                </button>
              </div>

              {/* 3 Luxury Micro-Trust Cards (Horizontal Carousel) */}
              <div className="mt-4 flex gap-2.5 overflow-x-auto pb-1 -mx-margin-mobile px-margin-mobile scrollbar-none">
                {/* Trust Card 1 */}
                <div className="flex-shrink-0 w-[215px] p-3 rounded-xl bg-surface-container-lowest shadow-xs flex flex-col justify-between border border-surface-container">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                      <span className="material-symbols-outlined text-[16px]">call</span>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface font-bold">1-Tap Direct Call</span>
                  </div>
                  <p className="mt-2 font-body-sm text-[11px] text-on-surface-variant leading-tight">
                    Instant unfiltered phone calls with verified genuine owners.
                  </p>
                </div>

                {/* Trust Card 2 */}
                <div className="flex-shrink-0 w-[215px] p-3 rounded-xl bg-surface-container-lowest shadow-xs flex flex-col justify-between border border-surface-container">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-error-container flex items-center justify-center text-error">
                      <span className="material-symbols-outlined text-[16px]">gpp_bad</span>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface font-bold">'Sold It' Call Shield</span>
                  </div>
                  <p className="mt-2 font-body-sm text-[11px] text-on-surface-variant leading-tight">
                    One tap stops calls forever the minute your deal is closed.
                  </p>
                </div>

                {/* Trust Card 3 */}
                <div className="flex-shrink-0 w-[215px] p-3 rounded-xl bg-surface-container-lowest shadow-xs flex flex-col justify-between border border-surface-container">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                      <span className="material-symbols-outlined text-[16px]">security</span>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface font-bold">100% Anti-Fraud</span>
                  </div>
                  <p className="mt-2 font-body-sm text-[11px] text-on-surface-variant leading-tight">
                    Mandatory zero online advance token policy across all listings.
                  </p>
                </div>
              </div>
            </section>

            {/* Sticky-styled Hyper-local Filter & Search Bar */}
            <section className="px-margin-mobile pt-1 pb-3 flex flex-col gap-2.5">
              {/* District Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto -mx-margin-mobile px-margin-mobile scrollbar-none py-0.5">
                {DISTRICTS.map(dist => (
                  <button
                    key={dist}
                    onClick={() => setSelectedDistrict(dist === "All Districts" ? "" : dist)}
                    className={`flex-shrink-0 px-3 py-1 rounded-full font-label-md text-label-md transition flex items-center gap-1 ${
                      selectedDistrict === dist || (dist === "All Districts" && !selectedDistrict)
                        ? "bg-primary-container text-secondary-container font-semibold shadow-xs"
                        : "bg-surface-container-high text-on-surface hover:bg-surface-dim font-medium"
                    }`}
                  >
                    {(selectedDistrict === dist || (dist === "All Districts" && !selectedDistrict)) && (
                      <span className="material-symbols-outlined text-[14px]">my_location</span>
                    )}
                    <span>{dist}</span>
                  </button>
                ))}
              </div>

              {/* Search Input & Intent Toggle */}
              <div className="p-2.5 rounded-xl bg-surface-container-lowest shadow-xs flex flex-col gap-2 border border-surface-container">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">search</span>
                  <input 
                    className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
                    placeholder="Search by district, metro station, or locality..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="p-1 text-on-surface-variant hover:text-primary">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>

                {/* Filters: Buy/Rent Segmented Control + BHK Chips */}
                <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
                  {/* Intent Toggle */}
                  <div className="inline-flex p-0.5 rounded-lg bg-surface-container text-on-surface">
                    {["All", "Buy", "Rent"].map(intent => (
                      <button
                        key={intent}
                        type="button"
                        onClick={() => setDealIntent(intent)}
                        className={`px-3 py-1 rounded-md font-label-md text-label-md transition ${
                          dealIntent === intent 
                            ? "font-semibold bg-surface-container-lowest text-primary shadow-xs" 
                            : "font-medium text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        {intent}
                      </button>
                    ))}
                  </div>

                  {/* BHK Chips */}
                  <div className="flex items-center gap-1">
                    {["All", "1 BHK", "2 BHK", "3 BHK", "4+ BHK"].map(bhk => (
                      <button
                        key={bhk}
                        onClick={() => setBhkFilter(bhk)}
                        className={`px-2.5 py-1 rounded-md font-code-spec text-[11px] transition ${
                          bhkFilter === bhk 
                            ? "bg-primary-container text-secondary-container font-bold" 
                            : "bg-surface-container text-on-surface-variant font-medium hover:bg-surface-container-high"
                        }`}
                      >
                        {bhk}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Founding Members Community Counter Banner */}
            <section className="px-margin-mobile my-1.5">
              <div className="p-3 rounded-xl bg-gradient-to-r from-primary-container via-primary-container to-surface-variant text-on-primary-fixed shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-secondary-container">shield_with_heart</span>
                    <div>
                      <div className="font-label-lg text-label-lg text-secondary-container font-semibold">Direct Owner Guarantee</div>
                      <div className="font-body-sm text-[11px] text-primary-fixed-dim">Zero Middlemen • Founding Member Intake</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-code-spec text-label-lg text-surface-bright font-bold">2,480</span>
                    <span className="font-code-spec text-[10px] text-on-primary-container"> / 3,000</span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-2.5 w-full h-1.5 rounded-full bg-on-primary-fixed-variant overflow-hidden">
                  <div className="h-full bg-secondary-container rounded-full" style={{ width: '82%' }}></div>
                </div>
                <div className="mt-1.5 flex justify-between items-center text-[10px] text-on-primary-container font-label-md">
                  <span>82% Tier 1 Quota Claimed</span>
                  <span className="text-secondary-fixed">520 Free Slots Remaining</span>
                </div>
              </div>
            </section>

            {/* Listings Feed */}
            <section className="px-margin-mobile mt-2 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm text-primary">Direct Listings Nearby</h2>
                <span className="font-code-spec text-code-spec text-on-surface-variant">
                  {filteredProperties.length} Available Now
                </span>
              </div>

              {filteredProperties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSelectProperty={setSelectedProperty}
                  isGlobalCallShieldActive={isGlobalCallShieldActive}
                />
              ))}

              {filteredProperties.length === 0 && (
                <div className="p-8 text-center bg-surface-container rounded-2xl">
                  <span className="material-symbols-outlined text-[32px] text-on-surface-variant">search_off</span>
                  <p className="font-headline-sm text-headline-sm text-primary mt-2">No Properties Found</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Try resetting your district or intent filters.</p>
                  <button 
                    onClick={() => { setSelectedDistrict(""); setDealIntent("All"); setBhkFilter("All"); setSearchQuery(""); }}
                    className="mt-3 px-4 py-2 rounded-xl bg-primary-container text-secondary-container font-label-md"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </section>

            {/* Hyper-Local Neighborhood Radar Card */}
            <section className="px-margin-mobile mt-4">
              <div className="p-3.5 rounded-xl bg-surface-container flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-secondary">explore</span>
                    <span className="font-label-lg text-label-lg text-primary font-bold">Hyper-Local Distance Radar</span>
                  </div>
                  <span className="font-code-spec text-[10px] text-on-surface-variant bg-surface-container-lowest px-2 py-0.5 rounded">GPS Active</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Every listing displays verifiable distance to local schools, metro junctions, and commercial hubs with zero fake broker landmarks.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2.5 py-1 rounded bg-surface-container-lowest font-code-spec text-[11px] text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-secondary">subway</span> Metro: 400m
                  </span>
                  <span className="px-2.5 py-1 rounded bg-surface-container-lowest font-code-spec text-[11px] text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-secondary">local_hospital</span> Hospital: 1.2km
                  </span>
                  <span className="px-2.5 py-1 rounded bg-surface-container-lowest font-code-spec text-[11px] text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-secondary">school</span> High School: 650m
                  </span>
                </div>
              </div>
            </section>

          </div>
        </main>
      )}

      {/* Tab 2: Districts */}
      {activeTab === "districts" && (
        <main className="flex-1 w-full bg-surface pt-16 pb-24 min-w-0 max-w-2xl mx-auto px-margin-mobile">
          <div className="py-4">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
              Districts & Micro-Markets
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Select your territory to browse 100% direct owner listings with zero middleman commissions.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DISTRICTS.map(dist => (
                <button
                  key={dist}
                  onClick={() => {
                    setSelectedDistrict(dist === "All Districts" ? "" : dist);
                    setActiveTab("explore");
                  }}
                  className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                    selectedDistrict === dist || (dist === "All Districts" && !selectedDistrict)
                      ? "bg-primary-container text-secondary-container border-secondary-container font-bold"
                      : "bg-surface-container-lowest text-on-surface border-surface-container hover:bg-surface-container-low"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">location_city</span>
                    <span className="font-label-lg text-label-lg">{dist}</span>
                  </div>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* Tab 3: Post Free (3-Step Stepper) */}
      {activeTab === "post-free" && (
        <PostPropertyView 
          onBack={() => setActiveTab("explore")}
          onAddProperty={handleAddProperty}
        />
      )}

      {/* Tab 4: Saved */}
      {activeTab === "saved" && (
        <main className="flex-1 w-full bg-surface pt-16 pb-24 min-w-0 max-w-2xl mx-auto px-margin-mobile">
          <div className="py-4">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
              Saved Property Folios
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Properties bookmarked for instant 1-tap owner inquiries and price drop tracking.
            </p>

            <div className="mt-4 space-y-4">
              {savedProperties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSelectProperty={setSelectedProperty}
                  isGlobalCallShieldActive={isGlobalCallShieldActive}
                />
              ))}

              {savedProperties.length === 0 && (
                <div className="p-8 text-center bg-surface-container rounded-2xl">
                  <span className="material-symbols-outlined text-[32px] text-on-surface-variant">bookmark_border</span>
                  <p className="font-headline-sm text-headline-sm text-primary mt-2">No Saved Properties</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Bookmark properties from the Explore feed to monitor them here.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Tab 5: Settings (10 Compulsory Modules) */}
      {activeTab === "settings" && (
        <SettingsView
          theme={theme}
          onThemeChange={setTheme}
          isGlobalCallShieldActive={isGlobalCallShieldActive}
          onToggleGlobalCallShield={handleToggleGlobalCallShield}
          onOpenChecklistModal={() => setIsChecklistModalOpen(true)}
          onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
        />
      )}

      {/* Fixed Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Property Folio Detail Modal */}
      {selectedProperty && (
        <PropertyFolioModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onToggleSold={handleToggleSold}
          isGlobalCallShieldActive={isGlobalCallShieldActive}
        />
      )}

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
      />

      {/* Dealer Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />

      {/* Legal 7-Step Checklist Modal */}
      <LegalChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
      />
    </div>
  );
}
