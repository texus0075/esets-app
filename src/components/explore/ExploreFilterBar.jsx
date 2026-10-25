import React from "react";
import { DISTRICTS } from "../../data/mockData";

export default function ExploreFilterBar({
  selectedDistrict,
  onSelectDistrict,
  searchQuery,
  onSearchChange,
  dealIntent,
  onDealIntentChange,
  bhkFilter,
  onBhkFilterChange,
  gpsData,
  isLocatingGps,
  onDetectGPS
}) {
  return (
    <section className="px-margin-mobile pt-1 pb-2 flex flex-col gap-2.5">
      {/* District Chips with GPS Auto-Detect Button */}
      <div className="flex items-center gap-1.5 overflow-x-auto -mx-margin-mobile px-margin-mobile scrollbar-none py-0.5">
        {/* 1-Tap Real GPS Hardware Detect Button */}
        <button
          onClick={onDetectGPS}
          disabled={isLocatingGps}
          className={`flex-shrink-0 px-3 py-1 rounded-full font-label-md text-label-md transition flex items-center gap-1.5 ${
            gpsData
              ? "bg-tertiary-fixed text-on-tertiary-fixed font-bold shadow-xs"
              : "bg-surface-container-highest text-primary font-bold hover:bg-surface-dim"
          }`}
        >
          <span className={`material-symbols-outlined text-[15px] ${isLocatingGps ? 'animate-spin' : ''}`}>
            {isLocatingGps ? 'sync' : 'my_location'}
          </span>
          <span>{isLocatingGps ? 'Detecting...' : (gpsData ? 'GPS Active' : 'Auto GPS')}</span>
        </button>

        {DISTRICTS.map(dist => (
          <button
            key={dist}
            onClick={() => onSelectDistrict(dist === "All Districts" ? "" : dist)}
            className={`flex-shrink-0 px-3 py-1 rounded-full font-label-md text-label-md transition flex items-center gap-1 ${
              selectedDistrict === dist || (dist === "All Districts" && !selectedDistrict)
                ? "bg-primary-container text-secondary-container font-semibold shadow-xs"
                : "bg-surface-container-high text-on-surface hover:bg-surface-dim font-medium"
            }`}
          >
            <span>{dist}</span>
          </button>
        ))}
      </div>

      {/* Search Input & Intent Toggle */}
      <div className="p-2.5 rounded-xl bg-surface-container-lowest shadow-xs flex flex-col gap-2 border border-surface-container">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">search</span>
          <input 
            className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
            placeholder="Search by district, metro station, or owner title..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange("")} 
              className="p-1 text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Filters: Buy/Rent Segmented Control + BHK Chips */}
        <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
          {/* Intent Toggle */}
          <div className="inline-flex p-0.5 rounded-lg bg-surface-container text-on-surface">
            {["All", "Buy", "Rent"].map(intent => (
              <button
                key={intent}
                type="button"
                onClick={() => onDealIntentChange(intent)}
                className={`px-3 py-1 rounded-md font-label-md text-label-md transition ${
                  dealIntent === intent 
                    ? "font-semibold bg-surface-container-lowest text-primary shadow-xs" 
                    : "font-medium text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {intent}
              </button>
            ))}
          </div>

          {/* BHK Chips */}
          <div className="flex items-center gap-1">
            {["All", "1 BHK", "2 BHK", "3 BHK", "4+ BHK"].map(bhk => (
              <button
                key={bhk}
                onClick={() => onBhkFilterChange(bhk)}
                className={`px-2.5 py-1 rounded-md font-code-spec text-[11px] transition ${
                  bhkFilter === bhk 
                    ? "bg-primary-container text-secondary-container font-bold" 
                    : "bg-surface-container text-on-surface-variant font-medium hover:bg-surface-container-high"
                }`}
              >
                {bhk}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
