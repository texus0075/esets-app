import React from "react";
import ExploreHero from "../explore/ExploreHero";
import ExploreTrustCards from "../explore/ExploreTrustCards";
import ExploreCategoryBar from "../explore/ExploreCategoryBar";
import ExploreFilterBar from "../explore/ExploreFilterBar";
import ExplorePropertyFeed from "../explore/ExplorePropertyFeed";
import ExploreRadarCard from "../explore/ExploreRadarCard";

export default function ExploreView({
  // Filter States
  properties,
  activeCategory,
  onSelectCategory,
  selectedDistrict,
  onSelectDistrict,
  searchQuery,
  onSearchChange,
  dealIntent,
  onDealIntentChange,
  bhkFilter,
  onBhkFilterChange,
  onResetFilters,

  // Hardware GPS
  gpsData,
  isLocatingGps,
  onDetectGPS,

  // App Install
  onTriggerInstall,

  // Modals & Navigation
  onPostProperty,
  onOpenSubscriptionModal,
  onOpenChecklistModal,
  onSelectProperty,
  isGlobalCallShieldActive
}) {
  return (
    <main className="flex-1 w-full bg-surface pt-16 pb-24 min-w-0 max-w-2xl mx-auto">
      <div className="flex flex-col w-full pb-8">
        
        {/* 1. Hero & CTAs Section */}
        <ExploreHero
          onPostProperty={onPostProperty}
          onOpenSubscriptionModal={onOpenSubscriptionModal}
          onOpenChecklistModal={onOpenChecklistModal}
          onTriggerInstall={onTriggerInstall}
        />

        {/* 2. Horizontal Micro-Trust Cards */}
        <ExploreTrustCards />

        {/* 3. Horizontal Category Filter Pills */}
        <ExploreCategoryBar
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
        />

        {/* 4. District Chips, GPS Lock & Search Input */}
        <ExploreFilterBar
          selectedDistrict={selectedDistrict}
          onSelectDistrict={onSelectDistrict}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          dealIntent={dealIntent}
          onDealIntentChange={onDealIntentChange}
          bhkFilter={bhkFilter}
          onBhkFilterChange={onBhkFilterChange}
          gpsData={gpsData}
          isLocatingGps={isLocatingGps}
          onDetectGPS={onDetectGPS}
        />

        {/* 5. Direct Owner Property Feed */}
        <ExplorePropertyFeed
          properties={properties}
          activeCategory={activeCategory}
          selectedDistrict={selectedDistrict}
          isGlobalCallShieldActive={isGlobalCallShieldActive}
          onSelectProperty={onSelectProperty}
          onResetFilters={onResetFilters}
        />

        {/* 6. Topographical GPS Distance Radar */}
        <ExploreRadarCard gpsData={gpsData} />

      </div>
    </main>
  );
}
