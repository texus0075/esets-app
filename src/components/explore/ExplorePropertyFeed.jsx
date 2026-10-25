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
            {selectedDistrict ? `${selectedDistrict} • ` : ""}
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
        <div className="p-8 text-center bg-surface-container rounded-2xl">
          <span className="material-symbols-outlined text-[36px] text-on-surface-variant">search_off</span>
          <p className="font-headline-sm text-headline-sm text-primary mt-2">No Matching Properties</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Try resetting your category or district filters.
          </p>
          <button 
            onClick={onResetFilters}
            className="mt-3 px-4 py-2 rounded-xl bg-primary-container text-secondary-container font-label-md font-bold"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
}
