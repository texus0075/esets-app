import React from "react";
import PropertyCard from "../PropertyCard";

export default function ExplorePropertyFeed({
  properties,
  activeCategory,
  selectedDistrict,
  isGlobalCallShieldActive,
  onSelectProperty,
  onResetFilters
}) {
  return (
    <section className="px-margin-mobile mt-2 flex flex-col gap-3">
      {/* Header with Title and Property Count */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
            Direct Listings Nearby
          </h2>
          <p className="font-code-spec text-[11px] text-on-surface-variant">
            {activeCategory !== "All" ? `${activeCategory} • ` : ""}
            {selectedDistrict ? `${selectedDistrict} • ` : "All Locations • "}
            100% Genuine Freehold Deeds
          </p>
        </div>
        <span className="font-code-spec text-code-spec text-secondary font-bold bg-surface-container px-2 py-1 rounded-md">
          {properties.length} Available
        </span>
      </div>

      {/* Property Cards List */}
      {properties.map(property => (
        <PropertyCard
          key={property.id}
          property={property}
          onSelectProperty={onSelectProperty}
          isGlobalCallShieldActive={isGlobalCallShieldActive}
        />
      ))}

      {/* Empty State Fallback */}
      {properties.length === 0 && (
        <div className="p-8 text-center bg-surface-container rounded-2xl border border-surface-container-high">
          <span className="material-symbols-outlined text-[40px] text-secondary">location_searching</span>
          <p className="font-headline-sm text-headline-sm text-primary mt-2 font-bold">
            {selectedDistrict 
              ? `No Listings in "${selectedDistrict}" Yet` 
              : "No Properties Match Your Filter"}
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-sm mx-auto">
            {selectedDistrict 
              ? `Direct 0% brokerage owner listings are currently open in ${selectedDistrict}. You can be the first owner to post here or view other regions.`
              : "Try adjusting your search keywords, BHK size, or category filters."}
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button 
              onClick={onResetFilters}
              className="px-4 py-2 rounded-xl bg-primary text-surface font-label-md font-bold shadow-xs hover:opacity-90"
            >
              Show All Verified Properties
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
