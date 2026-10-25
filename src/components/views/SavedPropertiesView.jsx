import React from "react";
import PropertyCard from "../PropertyCard";
import { SAVED_VIEW_CONTENT } from "../../config/siteContent";

export default function SavedPropertiesView({
  savedProperties,
  onSelectProperty,
  isGlobalCallShieldActive
}) {
  return (
    <main className="flex-1 w-full bg-surface pt-16 pb-24 min-w-0 max-w-2xl mx-auto px-margin-mobile">
      <div className="py-4">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
          {SAVED_VIEW_CONTENT.title}
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          {SAVED_VIEW_CONTENT.subtitle}
        </p>

        <div className="mt-4 space-y-4">
          {savedProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelectProperty={onSelectProperty}
              isGlobalCallShieldActive={isGlobalCallShieldActive}
            />
          ))}

          {savedProperties.length === 0 && (
            <div className="p-8 text-center bg-surface-container rounded-2xl">
              <span className="material-symbols-outlined text-[32px] text-on-surface-variant">bookmark_border</span>
              <p className="font-headline-sm text-headline-sm text-primary mt-2">
                {SAVED_VIEW_CONTENT.emptyTitle}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                {SAVED_VIEW_CONTENT.emptySubtitle}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
