import React, { useState, useEffect, useMemo } from "react";

// Custom Hooks for Hardware & Native Integration
import { useGeolocation } from "./hooks/useGeolocation";
import { usePWAInstall } from "./hooks/usePWAInstall";

// Global Layout & Navigation Components
import Navbar from "./components/Navbar";
import MenuDrawer from "./components/MenuDrawer";
import BottomNav from "./components/BottomNav";

// Isolated Tab View Components
import ExploreView from "./components/views/ExploreView";
import DistrictsView from "./components/views/DistrictsView";
import PostPropertyView from "./components/PostPropertyView";
import SavedPropertiesView from "./components/views/SavedPropertiesView";
import SettingsView from "./components/SettingsView";

// Modals
import PropertyFolioModal from "./components/PropertyFolioModal";
import LocationModal from "./components/LocationModal";
import SubscriptionModal from "./components/SubscriptionModal";
import LegalChecklistModal from "./components/LegalChecklistModal";

// Initial Listing Data
import { INITIAL_PROPERTIES } from "./data/mockData";

export default function App() {
  // Navigation & Menu State
  const [activeTab, setActiveTab] = useState("explore");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Persistent Theme State ('light' | 'dark' | 'oled')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("esets_theme") || "light";
  });

  // Persistent Global 'Sold It' Call Shield State
  const [isGlobalCallShieldActive, setIsGlobalCallShieldActive] = useState(() => {
    return localStorage.getItem("esets_call_shield") === "true";
  });

  // Persistent Saved Property IDs
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem("esets_saved_ids");
      return stored ? JSON.parse(stored) : ["prop-delhi-gk1"];
    } catch {
      return ["prop-delhi-gk1"];
    }
  });

  // Persistent Properties State
  const [properties, setProperties] = useState(() => {
    try {
      const stored = localStorage.getItem("esets_custom_properties");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const storedIds = new Set(parsed.map(p => p.id));
          const freshMissing = INITIAL_PROPERTIES.filter(p => !storedIds.has(p.id));
          return [...parsed, ...freshMissing];
        }
      }
    } catch (e) {
      console.warn("Storage parse error:", e);
    }
    return INITIAL_PROPERTIES;
  });

  // Property Filters State
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [dealIntent, setDealIntent] = useState("All"); // 'All' | 'Buy' | 'Rent'
  const [bhkFilter, setBhkFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);

  // Hardware GPS & PWA Install Hooks
  const { gpsData, isLocating: isLocatingGps, detectLocation: handleDetectRealGPS } = useGeolocation();
  const { triggerInstall: handleTriggerInstall } = usePWAInstall();

  // Sync theme class to document <html> element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "oled");
    root.classList.add(theme);
    localStorage.setItem("esets_theme", theme);
  }, [theme]);

  // Persist Call Shield & Saved IDs
  useEffect(() => {
    localStorage.setItem("esets_call_shield", isGlobalCallShieldActive);
  }, [isGlobalCallShieldActive]);

  useEffect(() => {
    localStorage.setItem("esets_saved_ids", JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem("esets_custom_properties", JSON.stringify(properties));
  }, [properties]);

  // Handlers for Properties
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
      postedAt: "Listed Just now",
      views: 1
    };
    setProperties(prev => [created, ...prev]);
    alert("🎉 Your property has been published live with 0% brokerage!");
    setActiveTab("explore");
  };

  const handleResetFilters = () => {
    setActiveCategory("All");
    setSelectedDistrict("");
    setDealIntent("All");
    setBhkFilter("All");
    setSearchQuery("");
  };

  // Filtered Properties for Explore Feed
  const filteredProperties = useMemo(() => {
    return properties.filter(item => {
      // Category filter
      if (activeCategory && activeCategory !== "All") {
        if (item.category !== activeCategory) return false;
      }

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
  }, [properties, activeCategory, selectedDistrict, dealIntent, bhkFilter, searchQuery]);

  const savedProperties = useMemo(() => {
    return properties.filter(p => savedIds.includes(p.id));
  }, [properties, savedIds]);

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col antialiased selection:bg-secondary-container selection:text-on-secondary-fixed">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        selectedDistrict={selectedDistrict || "South Delhi"}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onNavigateToSettings={() => setActiveTab("settings")}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      {/* 2. Slide-over Left Navigation Drawer */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onNavigateTab={setActiveTab}
        theme={theme}
        onThemeChange={setTheme}
        isGlobalCallShieldActive={isGlobalCallShieldActive}
        onToggleGlobalCallShield={handleToggleGlobalCallShield}
        onOpenChecklistModal={() => setIsChecklistModalOpen(true)}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
      />

      {/* 3. Modular Tab Views Routing */}
      {activeTab === "explore" && (
        <ExploreView
          properties={filteredProperties}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          selectedDistrict={selectedDistrict}
          onSelectDistrict={setSelectedDistrict}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dealIntent={dealIntent}
          onDealIntentChange={setDealIntent}
          bhkFilter={bhkFilter}
          onBhkFilterChange={setBhkFilter}
          onResetFilters={handleResetFilters}
          gpsData={gpsData}
          isLocatingGps={isLocatingGps}
          onDetectGPS={handleDetectRealGPS}
          onTriggerInstall={handleTriggerInstall}
          onPostProperty={() => setActiveTab("post-free")}
          onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
          onOpenChecklistModal={() => setIsChecklistModalOpen(true)}
          onSelectProperty={setSelectedProperty}
          isGlobalCallShieldActive={isGlobalCallShieldActive}
        />
      )}

      {activeTab === "districts" && (
        <DistrictsView
          selectedDistrict={selectedDistrict}
          onSelectDistrict={setSelectedDistrict}
          onNavigateToExplore={() => setActiveTab("explore")}
        />
      )}

      {activeTab === "post-free" && (
        <PostPropertyView 
          onBack={() => setActiveTab("explore")}
          onAddProperty={handleAddProperty}
        />
      )}

      {activeTab === "saved" && (
        <SavedPropertiesView
          savedProperties={savedProperties}
          onSelectProperty={setSelectedProperty}
          isGlobalCallShieldActive={isGlobalCallShieldActive}
        />
      )}

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

      {/* 4. Global Fixed Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* 5. Modals Container */}
      {selectedProperty && (
        <PropertyFolioModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onToggleSold={handleToggleSold}
          isGlobalCallShieldActive={isGlobalCallShieldActive}
        />
      )}

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />

      <LegalChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
      />
    </div>
  );
}
