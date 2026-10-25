import React, { useState, useEffect, useMemo } from "react";

// Custom Hooks for Hardware & Native Integration
import { useGeolocation } from "./hooks/useGeolocation";

// Global Layout & Navigation Components
import Navbar from "./components/Navbar";
import MenuDrawer from "./components/MenuDrawer";
import BottomNav from "./components/BottomNav";

// Isolated Tab View Components
import ExploreView from "./components/views/ExploreView";
import MyListingsView from "./components/views/MyListingsView";
import PostPropertyView from "./components/PostPropertyView";
import SavedPropertiesView from "./components/views/SavedPropertiesView";
import SettingsView from "./components/SettingsView";

// Modals
import PropertyFolioModal from "./components/PropertyFolioModal";
import LocationModal from "./components/LocationModal";
import LegalChecklistModal from "./components/LegalChecklistModal";

// Initial Listing Data
import { INITIAL_PROPERTIES, DISTRICTS } from "./data/mockData";

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

  // Persistent Saved Property IDs (Bookmarks)
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem("esets_saved_ids");
      return stored ? JSON.parse(stored) : ["prop-delhi-gk1", "prop-ggn-golfcourse"];
    } catch {
      return ["prop-delhi-gk1", "prop-ggn-golfcourse"];
    }
  });

  // Persistent User's Owned Property IDs
  const [myPropertyIds, setMyPropertyIds] = useState(() => {
    try {
      const stored = localStorage.getItem("esets_my_property_ids");
      return stored ? JSON.parse(stored) : ["prop-delhi-gk1"];
    } catch {
      return ["prop-delhi-gk1"];
    }
  });

  // Persistent Custom Saved Territories (Locations that user adds or saves from GPS)
  const [savedLocations, setSavedLocations] = useState(() => {
    try {
      const stored = localStorage.getItem("esets_saved_locations");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Locations parse error:", e);
    }
    return DISTRICTS.filter(d => d !== "All Districts");
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
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);

  // Hardware GPS Hook with Real-time Reverse Geocoding
  const { gpsData, isLocating: isLocatingGps, detectLocation } = useGeolocation();

  // Sync theme class to document <html> element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "oled");
    root.classList.add(theme);
    localStorage.setItem("esets_theme", theme);
  }, [theme]);

  // Persist Call Shield, Saved IDs, My Properties & Saved Locations
  useEffect(() => {
    localStorage.setItem("esets_call_shield", isGlobalCallShieldActive);
  }, [isGlobalCallShieldActive]);

  useEffect(() => {
    localStorage.setItem("esets_saved_ids", JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem("esets_my_property_ids", JSON.stringify(myPropertyIds));
  }, [myPropertyIds]);

  useEffect(() => {
    localStorage.setItem("esets_saved_locations", JSON.stringify(savedLocations));
  }, [savedLocations]);

  useEffect(() => {
    localStorage.setItem("esets_custom_properties", JSON.stringify(properties));
  }, [properties]);

  // Location Management Handlers
  const handleSaveLocation = (newLoc) => {
    if (!newLoc) return;
    setSavedLocations(prev => {
      if (prev.includes(newLoc)) return prev;
      return [newLoc, ...prev];
    });
  };

  const handleRemoveLocation = (locToRemove) => {
    setSavedLocations(prev => prev.filter(l => l !== locToRemove));
    if (selectedDistrict === locToRemove) {
      setSelectedDistrict("");
    }
  };

  // Trigger Hardware GPS with Instant Reverse Geocoding & Automatic Selection
  const handleDetectGPS = () => {
    detectLocation((resolved) => {
      if (resolved && resolved.district) {
        setSelectedDistrict(resolved.district);
        handleSaveLocation(resolved.district);
        alert(`📍 Real GPS Locked:\n${resolved.fullName}\n\n"${resolved.district}" saved & prioritized in your territories!`);
      }
    });
  };

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

  const handleDeleteProperty = (propertyId) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
    setMyPropertyIds(prev => prev.filter(id => id !== propertyId));
    setSavedIds(prev => prev.filter(id => id !== propertyId));
    if (selectedProperty && selectedProperty.id === propertyId) {
      setSelectedProperty(null);
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
      views: 1,
      sellerName: "Vikramaditya Rao",
      verifiedOwner: true
    };
    setProperties(prev => [created, ...prev]);
    setMyPropertyIds(prev => [created.id, ...prev]);
    alert("🎉 Your property has been published live with 0% brokerage!");
    setActiveTab("my-listings");
  };

  const handleResetFilters = () => {
    setActiveCategory("All");
    setSelectedDistrict("");
    setDealIntent("All");
    setBhkFilter("All");
    setSearchQuery("");
  };

  // High-Precision Real-Time Filtering for Explore Feed
  const filteredProperties = useMemo(() => {
    return properties.filter(item => {
      // 1. Category Filter
      if (activeCategory && activeCategory !== "All") {
        if (item.category !== activeCategory) return false;
      }

      // 2. District & Locality Filter
      if (selectedDistrict && selectedDistrict !== "All Districts" && selectedDistrict !== "") {
        const target = selectedDistrict.toLowerCase();
        const itemDistrict = (item.district || "").toLowerCase();
        const itemLocality = (item.locality || "").toLowerCase();
        const itemState = (item.state || "").toLowerCase();
        
        const matchesDistrict = itemDistrict.includes(target) || target.includes(itemDistrict);
        const matchesLocality = itemLocality.includes(target) || target.includes(itemLocality);
        const matchesState = itemState.includes(target);

        if (!matchesDistrict && !matchesLocality && !matchesState) {
          return false;
        }
      }

      // 3. Deal Intent (Buy/Sale vs Rent)
      if (dealIntent === "Buy" && item.dealType !== "Sale") return false;
      if (dealIntent === "Rent" && item.dealType !== "Rent") return false;

      // 4. BHK Filter
      if (bhkFilter !== "All") {
        if (bhkFilter === "1 BHK" && item.bhk !== 1) return false;
        if (bhkFilter === "2 BHK" && item.bhk !== 2) return false;
        if (bhkFilter === "3 BHK" && item.bhk !== 3) return false;
        if (bhkFilter === "4+ BHK" && item.bhk < 4) return false;
      }

      // 5. Comprehensive Real-Time Search Query Matching
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesLocality = item.locality?.toLowerCase().includes(q);
        const matchesDistrict = item.district?.toLowerCase().includes(q);
        const matchesState = item.state?.toLowerCase().includes(q);
        const matchesCategory = item.category?.toLowerCase().includes(q);
        const matchesDealType = item.dealType?.toLowerCase().includes(q);
        const matchesBhk = `${item.bhk} bhk`.toLowerCase().includes(q) || `${item.bhk}bhk`.toLowerCase().includes(q);
        const matchesPincode = item.pincode?.includes(q);
        const matchesSeller = item.sellerName?.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);

        if (!matchesTitle && !matchesLocality && !matchesDistrict && !matchesState &&
            !matchesCategory && !matchesDealType && !matchesBhk && !matchesPincode &&
            !matchesSeller && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [properties, activeCategory, selectedDistrict, dealIntent, bhkFilter, searchQuery]);

  const savedProperties = useMemo(() => {
    return properties.filter(p => savedIds.includes(p.id));
  }, [properties, savedIds]);

  const myProperties = useMemo(() => {
    return properties.filter(p => myPropertyIds.includes(p.id));
  }, [properties, myPropertyIds]);

  // Determine current active location label for Navbar
  const currentLocationLabel = useMemo(() => {
    if (selectedDistrict) return selectedDistrict;
    if (gpsData && gpsData.district) return gpsData.district;
    return "All Locations";
  }, [selectedDistrict, gpsData]);

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col antialiased selection:bg-secondary-container selection:text-on-secondary-fixed">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        selectedDistrict={currentLocationLabel}
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
        myPropertyCount={myProperties.length}
      />

      {/* 3. Modular Tab Views Routing */}
      {activeTab === "explore" && (
        <ExploreView
          properties={filteredProperties}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          selectedDistrict={selectedDistrict}
          onSelectDistrict={setSelectedDistrict}
          savedLocations={savedLocations}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          onSaveLocation={handleSaveLocation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dealIntent={dealIntent}
          onDealIntentChange={setDealIntent}
          bhkFilter={bhkFilter}
          onBhkFilterChange={setBhkFilter}
          onResetFilters={handleResetFilters}
          gpsData={gpsData}
          isLocatingGps={isLocatingGps}
          onDetectGPS={handleDetectGPS}
          onPostProperty={() => setActiveTab("post-free")}
          onOpenChecklistModal={() => setIsChecklistModalOpen(true)}
          onSelectProperty={setSelectedProperty}
          isGlobalCallShieldActive={isGlobalCallShieldActive}
        />
      )}

      {activeTab === "my-listings" && (
        <MyListingsView
          myProperties={myProperties}
          onSelectProperty={setSelectedProperty}
          onToggleSold={handleToggleSold}
          onDeleteProperty={handleDeleteProperty}
          onNavigateToPost={() => setActiveTab("post-free")}
          isGlobalCallShieldActive={isGlobalCallShieldActive}
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

      {/* Location & Territory Manager Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
        savedLocations={savedLocations}
        onSaveLocation={handleSaveLocation}
        onRemoveLocation={handleRemoveLocation}
        onDetectGPS={handleDetectGPS}
        isLocatingGps={isLocatingGps}
        gpsData={gpsData}
      />

      {/* Legal 7-Step Checklist Modal */}
      <LegalChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
      />
    </div>
  );
}
