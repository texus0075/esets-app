import React from "react";
import { DISTRICTS } from "../../data/mockData";
import { DISTRICTS_VIEW_CONTENT } from "../../config/siteContent";

export default function DistrictsView({
  selectedDistrict,
  onSelectDistrict,
  onNavigateToExplore
}) {
  return (
    <main className="flex-1 w-full bg-surface pt-16 pb-24 min-w-0 max-w-2xl mx-auto px-margin-mobile">
      <div className="py-4">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
          {DISTRICTS_VIEW_CONTENT.title}
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          {DISTRICTS_VIEW_CONTENT.subtitle}
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DISTRICTS.map(dist => (
            <button
              key={dist}
              onClick={() => {
                onSelectDistrict(dist === "All Districts" ? "" : dist);
                onNavigateToExplore();
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
  );
}
