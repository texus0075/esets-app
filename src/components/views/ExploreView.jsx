import React, { useState } from "react";
import ExploreHero from "../explore/ExploreHero";
import ExploreTrustCards from "../explore/ExploreTrustCards";
import ExploreCategoryBar from "../explore/ExploreCategoryBar";
import ExploreFilterBar from "../explore/ExploreFilterBar";
import ExplorePropertyFeed from "../explore/ExplorePropertyFeed";
import ExploreFinancialTools from "../explore/ExploreFinancialTools";
import ExplorePriceTrends from "../explore/ExplorePriceTrends";
import ExploreRadarCard from "../explore/ExploreRadarCard";
import FinancialToolsModal from "../FinancialToolsModal";

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
  budgetFilter,
  onBudgetFilterChange,
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
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
  const [toolsModalTab, setToolsModalTab] = useState("emi");

  const handleOpenToolsModal = (tab = "emi") => {
    setToolsModalTab(tab);
    setIsToolsModalOpen(true);
  };

  return (
    <main className="flex-1 w-full bg-surface pt-16 pb-24 min-w-0 max-w-2xl mx-auto">
      <div className="flex flex-col w-full pb-8">
        
        {/* 1. Hero & CTAs Section (With Quick PropTech Tools Hub) */}
        <ExploreHero
          onPostProperty={onPostProperty}
          onOpenChecklistModal={onOpenChecklistModal}
          onOpenToolsModal={handleOpenToolsModal}
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
          budgetFilter={budgetFilter}
          onBudgetFilterChange={onBudgetFilterChange}
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

      {/* PropTech Financial & Land Tools Interactive Modal */}
      <FinancialToolsModal
        isOpen={isToolsModalOpen}
        onClose={() => setIsToolsModalOpen(false)}
        initialTool={toolsModalTab}
      />
    </main>
  );
}
