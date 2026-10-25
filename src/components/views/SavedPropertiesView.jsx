import React, { useState, useMemo } from "react";
import PropertyCard from "../PropertyCard";
import { CATEGORIES } from "../../data/mockData";
import { SAVED_VIEW_CONTENT } from "../../config/siteContent";

export default function SavedPropertiesView({
  savedProperties,
  onSelectProperty,
  isGlobalCallShieldActive
}) {
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter saved properties by the selected category
  const filteredSaved = useMemo(() => {
    if (activeCategory === "All") return savedProperties;
    return savedProperties.filter(p => p.category === activeCategory);
  }, [savedProperties, activeCategory]);

  return (
    <main className="flex-1 w-full bg-surface pt-16 pb-24 min-w-0 max-w-2xl mx-auto px-margin-mobile">
      <div className="py-4 space-y-4">
        {/* Title Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline-lg-mobile text-[1.4rem] text-primary font-bold">
              {SAVED_VIEW_CONTENT.title}
            </h1>
            <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">
              {SAVED_VIEW_CONTENT.subtitle}
            </p>
          </div>
          <span className="font-code-spec text-[11px] font-bold text-secondary bg-surface-container px-2.5 py-1 rounded-md">
            {savedProperties.length} Saved
          </span>
        </div>

        {/* Category Filter Tabs for Saved Folios */}
        <div className="flex items-center gap-1.5 overflow-x-auto -mx-margin-mobile px-margin-mobile scrollbar-none py-1">
          {CATEGORIES.map(cat => {
            const count = cat.id === "All"
              ? savedProperties.length
              : savedProperties.filter(p => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl font-label-md text-[12px] transition flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? "bg-primary text-surface font-bold shadow-xs"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high font-medium"
                }`}
              >
                <span className="material-symbols-outlined text-[15px] text-secondary">
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-75 font-code-spec">({count})</span>
              </button>
            );
          })}
        </div>

        {/* List of Saved Property Cards */}
        <div className="space-y-4">
          {filteredSaved.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelectProperty={onSelectProperty}
              isGlobalCallShieldActive={isGlobalCallShieldActive}
            />
          ))}

          {/* Empty State */}
          {filteredSaved.length === 0 && (
            <div className="p-8 text-center bg-surface-container rounded-2xl border border-surface-container-high">
              <span className="material-symbols-outlined text-[36px] text-on-surface-variant">
                bookmark_border
              </span>
              <p className="font-headline-sm text-headline-sm text-primary mt-2 font-bold">
                {activeCategory === "All" ? SAVED_VIEW_CONTENT.emptyTitle : `No Saved ${activeCategory}s`}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-sm mx-auto">
                {activeCategory === "All" 
                  ? SAVED_VIEW_CONTENT.emptySubtitle
                  : `You haven't bookmarked any properties under "${activeCategory}" yet.`}
              </p>
              {activeCategory !== "All" && (
                <button
                  onClick={() => setActiveCategory("All")}
                  className="mt-3 px-4 py-2 rounded-xl bg-primary-container text-secondary-container font-label-md font-bold"
                >
                  Show All Saved
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
