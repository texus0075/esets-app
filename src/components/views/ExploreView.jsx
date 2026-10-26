import React from "react";
import ExploreHero from "../explore/ExploreHero";
import ExploreTrustCards from "../explore/ExploreTrustCards";
import ExploreCategoryBar from "../explore/ExploreCategoryBar";
import ExploreFilterBar from "../explore/ExploreFilterBar";
import ExplorePropertyFeed from "../explore/ExplorePropertyFeed";
import ExploreFinancialTools from "../explore/ExploreFinancialTools";
import ExplorePriceTrends from "../explore/ExplorePriceTrends";
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

  // Hardware GPS & Location Management
  gpsData,
  isLocatingGps,
  onDetectGPS,
  savedLocations,
  onOpenLocationModal,
  onSaveLocation,

  // Modals & Navigation
  onPostProperty,
  onOpenChecklistModal,
  onSelectProperty,
  isGlobalCallShieldActive
}) {
  return (
    <main className="flex-1 w-full bg-surface pt-16 pb-24 min-w-0 max-w-2xl mx-auto">
      <div className="flex flex-col w-full pb-8">
        
        {/* 1. Hero & CTAs Section (Clean, compact, 0 install boxes) */}
        <ExploreHero
          onPostProperty={onPostProperty}
          onOpenChecklistModal={onOpenChecklistModal}
        />

        {/* 2. Horizontal Micro-Trust Cards */}
        <ExploreTrustCards />

        {/* 3. Horizontal Category Filter Pills */}
        <ExploreCategoryBar
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
        />

        {/* 4. District Chips, Dynamic Real GPS Chip & Live Search Bar */}
        <ExploreFilterBar
          selectedDistrict={selectedDistrict}
          onSelectDistrict={onSelectDistrict}
          savedLocations={savedLocations}
          onOpenLocationModal={onOpenLocationModal}
          onSaveLocation={onSaveLocation}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          dealIntent={dealIntent}
          onDealIntentChange={onDealIntentChange}
          bhkFilter={bhkFilter}
          onBhkFilterChange={onBhkFilterChange}
          gpsData={gpsData}
          isLocatingGps={isLocatingGps}
          onDetectGPS={onDetectGPS}
          matchingCount={properties.length}
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

        {/* 6. Regional Land Unit Converter & Interactive Home Loan EMI Tools */}
        <ExploreFinancialTools />

        {/* 7. Real Estate Capital Price Trends & Rental Yields */}
        <ExplorePriceTrends />

        {/* 8. Topographical GPS Distance Radar */}
        <ExploreRadarCard gpsData={gpsData} />

      </div>
    </main>
  );
}
