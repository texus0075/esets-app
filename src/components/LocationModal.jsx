import React, { useState } from "react";

export default function LocationModal({ 
  isOpen, 
  onClose, 
  selectedDistrict, 
  onSelectDistrict,
  savedLocations = [],
  onSaveLocation,
  onRemoveLocation,
  onDetectGPS,
  isLocatingGps,
  gpsData
}) {
  const [newCityInput, setNewCityInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const handleAddNewLocation = (e) => {
    e.preventDefault();
    const trimmed = newCityInput.trim();
    if (!trimmed) return;
    onSaveLocation(trimmed);
    onSelectDistrict(trimmed);
    setNewCityInput("");
  };

  const filteredLocations = savedLocations.filter(loc => 
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface rounded-2xl max-w-md w-full shadow-2xl border border-surface-container overflow-hidden text-on-surface flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">pin_drop</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                Location & Territory Manager
              </h3>
              <p className="font-body-sm text-[11.5px] text-on-surface-variant">
                Save, add, or remove cities to customize your feed
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* GPS Auto-Detect & Instant Save Button */}
        <div className="p-4 border-b border-surface-container space-y-2 bg-surface-container-low">
          <button 
            onClick={() => {
              onDetectGPS();
            }}
            disabled={isLocatingGps}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-primary text-surface font-label-md text-label-md font-bold transition shadow-xs active:scale-98"
          >
            <span className={`material-symbols-outlined text-[18px] text-secondary ${isLocatingGps ? "animate-spin" : ""}`}>
              {isLocatingGps ? "sync" : "my_location"}
            </span>
            <span>{isLocatingGps ? "Acquiring GPS Satellite Lock..." : "Auto-Detect My Current GPS Location"}</span>
          </button>

          {/* Current GPS Status Pill */}
          {gpsData && (
            <div className="p-2.5 rounded-xl bg-surface-container flex items-center justify-between text-[11.5px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-[16px] text-secondary">explore</span>
                <span className="truncate font-semibold text-primary">📍 {gpsData.fullName}</span>
              </div>
              <button
                onClick={() => {
                  if (gpsData.district) {
                    onSaveLocation(gpsData.district);
                    onSelectDistrict(gpsData.district);
                    alert(`⭐ Saved "${gpsData.district}" to your permanent territories list!`);
                  }
                }}
                className="shrink-0 ml-2 font-code-spec text-[10.5px] text-secondary font-bold hover:underline"
              >
                + Save as Home
              </button>
            </div>
          )}
        </div>

        {/* Add Custom Location Input */}
        <form onSubmit={handleAddNewLocation} className="p-4 pb-2 border-b border-surface-container">
          <label className="font-code-spec text-[10.5px] uppercase font-bold text-on-surface-variant block mb-1.5">
            Add Your City, District, or Town
          </label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. Alwar, Kota, Neemrana, Dwarka..."
              value={newCityInput}
              onChange={(e) => setNewCityInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-surface-container text-body-sm text-[12.5px] focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
            <button 
              type="submit"
              className="px-4 py-2 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-md text-[12px] font-bold shadow-xs active:scale-95 transition"
            >
              Add
            </button>
          </div>
        </form>

        {/* Search Saved Locations */}
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">search</span>
            <input 
              type="text" 
              placeholder="Filter your territories list..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent font-body-sm text-[12px] text-on-surface placeholder:text-outline focus:outline-none"
            />
          </div>
        </div>

        {/* Saved Locations List with 1-Tap Select & Delete Option */}
        <div className="p-4 pt-2 overflow-y-auto space-y-1.5 flex-1">
          {/* All Locations Option */}
          <button
            onClick={() => {
              onSelectDistrict("");
              onClose();
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition ${
              !selectedDistrict 
                ? "bg-primary-container text-secondary-container font-bold" 
                : "hover:bg-surface-container-low text-on-surface"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[17px] text-secondary">public</span>
              <span className="font-label-md text-[13px]">All Locations (Pan-India)</span>
            </div>
            {!selectedDistrict && (
              <span className="material-symbols-outlined text-[16px]">check</span>
            )}
          </button>

          {/* User's Territories */}
          {filteredLocations.map(dist => {
            const isSelected = selectedDistrict === dist;
            return (
              <div
                key={dist}
                className={`flex items-center justify-between p-2 rounded-xl transition ${
                  isSelected 
                    ? "bg-primary-container text-secondary-container font-bold" 
                    : "hover:bg-surface-container-low text-on-surface"
                }`}
              >
                <button
                  onClick={() => {
                    onSelectDistrict(dist);
                    onClose();
                  }}
                  className="flex-1 flex items-center gap-2 text-left min-w-0 py-0.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                  <span className="font-label-md text-[13px] truncate">{dist}</span>
                </button>

                <div className="flex items-center gap-1">
                  {isSelected && (
                    <span className="material-symbols-outlined text-[16px] mr-1">check</span>
                  )}
                  {/* Delete Location button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveLocation(dist);
                    }}
                    title="Remove from saved territories"
                    className="p-1 rounded-md hover:bg-error-container text-on-surface-variant hover:text-error transition"
                  >
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
