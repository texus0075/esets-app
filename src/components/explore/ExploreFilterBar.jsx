import React from "react";

export default function ExploreFilterBar({
  selectedDistrict,
  onSelectDistrict,
  savedLocations = [],
  onOpenLocationModal,
  onSaveLocation,
  searchQuery,
  onSearchChange,
  dealIntent,
  onDealIntentChange,
  bhkFilter,
  onBhkFilterChange,
  gpsData,
  isLocatingGps,
  onDetectGPS,
  matchingCount
}) {
  return (
    <section className="px-margin-mobile pt-1 pb-2 flex flex-col gap-2.5">
      {/* 1. Real-Time Hardware GPS & Location Chips Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto -mx-margin-mobile px-margin-mobile scrollbar-none py-1">
        {/* Active GPS Trigger Button */}
        <button
          onClick={onDetectGPS}
          disabled={isLocatingGps}
          aria-label="Detect Real Device GPS Location"
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition flex items-center gap-1.5 shadow-xs ${
            isLocatingGps
              ? "bg-secondary-container text-on-secondary-fixed animate-pulse font-bold"
              : gpsData
              ? "bg-tertiary-fixed text-on-tertiary-fixed font-bold ring-2 ring-tertiary-fixed-dim"
              : "bg-surface-container-highest text-primary font-bold hover:bg-surface-dim"
          }`}
        >
          <span className={`material-symbols-outlined text-[16px] ${isLocatingGps ? 'animate-spin' : ''}`}>
            {isLocatingGps ? 'sync' : 'my_location'}
          </span>
          <span>{isLocatingGps ? 'Scanning GPS...' : (gpsData ? 'GPS Synced' : 'Auto GPS')}</span>
        </button>

        {/* User's Exact Detected City/District Box (Appears dynamically upon GPS lock) */}
        {gpsData && gpsData.district && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelectDistrict(gpsData.district)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition flex items-center gap-1.5 ${
                selectedDistrict === gpsData.district
                  ? "bg-secondary text-surface font-bold shadow-md ring-2 ring-secondary/30"
                  : "bg-surface-container-high text-primary font-semibold hover:bg-surface-dim"
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-tertiary-fixed-dim">
                location_on
              </span>
              <span>📍 {gpsData.district}</span>
              {selectedDistrict === gpsData.district && (
                <span className="material-symbols-outlined text-[14px]">check</span>
              )}
            </button>

            {/* Quick 1-tap Save Button if not already saved */}
            {!savedLocations.includes(gpsData.district) && (
              <button
                onClick={() => {
                  onSaveLocation(gpsData.district);
                  alert(`⭐ Saved "${gpsData.district}" to your permanent territories list!`);
                }}
                title="Save as permanent territory"
                className="px-2 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-dim text-secondary text-[11px] font-bold"
              >
                ⭐ Save
              </button>
            )}
          </div>
        )}

        {/* All Locations Chip */}
        <button
          onClick={() => onSelectDistrict("")}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full font-label-md text-label-md transition flex items-center gap-1 ${
            !selectedDistrict
              ? "bg-primary-container text-secondary-container font-bold shadow-xs"
              : "bg-surface-container text-on-surface hover:bg-surface-container-high font-medium"
          }`}
        >
          <span>All Locations</span>
        </button>

        {/* Saved/Custom Territories Chips */}
        {savedLocations.map(dist => {
          // If already rendered via active GPS lock, avoid duplicate
          if (gpsData && gpsData.district === dist) return null;

          const isSelected = selectedDistrict === dist;
          return (
            <button
              key={dist}
              onClick={() => onSelectDistrict(dist)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full font-label-md text-label-md transition flex items-center gap-1 ${
                isSelected
                  ? "bg-primary-container text-secondary-container font-bold shadow-xs"
                  : "bg-surface-container text-on-surface hover:bg-surface-container-high font-medium"
              }`}
            >
              <span>{dist}</span>
            </button>
          );
        })}

        {/* Manage & Add Locations Chip */}
        <button
          onClick={onOpenLocationModal}
          className="flex-shrink-0 px-3 py-1.5 rounded-full font-label-md text-label-md text-secondary border border-secondary/30 hover:bg-surface-container transition flex items-center gap-1 font-semibold"
        >
          <span className="material-symbols-outlined text-[15px]">edit_location</span>
          <span>+ Add / Manage</span>
        </button>
      </div>

      {/* 2. Real-Time Search Bar with Instant Result Feedback */}
      <div className="p-2.5 rounded-xl bg-surface-container-lowest shadow-xs flex flex-col gap-2 border border-surface-container">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low focus-within:ring-2 focus-within:ring-secondary/40 transition">
          <span className="material-symbols-outlined text-[19px] text-secondary shrink-0">search</span>
          <input 
            className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
            placeholder="Search by city, district, society, or BHK..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange("")} 
              aria-label="Clear Search"
              className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Live Search Result Indicator */}
        {searchQuery.trim() !== "" && (
          <div className="px-1 text-[11px] font-code-spec text-secondary flex items-center justify-between">
            <span>⚡ {matchingCount} result{matchingCount === 1 ? '' : 's'} matching "{searchQuery}"</span>
            <button onClick={() => onSearchChange("")} className="underline text-on-surface-variant hover:text-primary">
              Clear
            </button>
          </div>
        )}

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
