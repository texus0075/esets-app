import React, { useState } from "react";
import { DISTRICTS } from "../data/mockData";

export default function LocationModal({ isOpen, onClose, selectedDistrict, onSelectDistrict }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);

  if (!isOpen) return null;

  const detectLocation = () => {
    setIsDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => {
            setIsDetecting(false);
            onSelectDistrict("South Delhi");
            onClose();
          }, 500);
        },
        () => {
          setIsDetecting(false);
          alert("Location permission denied. Please select your district from the list.");
        }
      );
    } else {
      setIsDetecting(false);
      alert("Location detection is not supported in this browser.");
    }
  };

  const filteredDistricts = DISTRICTS.filter(d => 
    d.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface rounded-2xl max-w-md w-full shadow-2xl border border-surface-container overflow-hidden text-on-surface">
        
        {/* Header */}
        <div className="p-4 border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">location_on</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Select District</h3>
              <p className="font-body-sm text-[11px] text-on-surface-variant">Hyper-local C2C listings nearby</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* GPS Auto-Detect Button */}
        <div className="p-4 border-b border-surface-container">
          <button 
            onClick={detectLocation}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md font-semibold transition"
          >
            <span className={`material-symbols-outlined text-[18px] text-tertiary-fixed-dim ${isDetecting ? "animate-spin" : ""}`}>
              my_location
            </span>
            <span>{isDetecting ? "Detecting GPS..." : "Auto-Detect My Current Location"}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">search</span>
            <input 
              type="text" 
              placeholder="Search district or micro-market..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
            />
          </div>
        </div>

        {/* District List */}
        <div className="p-4 pt-1 max-h-64 overflow-y-auto space-y-1">
          {filteredDistricts.map(dist => (
            <button
              key={dist}
              onClick={() => {
                onSelectDistrict(dist === "All Districts" ? "" : dist);
                onClose();
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition ${
                selectedDistrict === dist || (dist === "All Districts" && !selectedDistrict)
                  ? "bg-primary-container text-secondary-container font-bold"
                  : "hover:bg-surface-container-low text-on-surface"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-secondary">pin_drop</span>
                <span className="font-label-md text-label-md">{dist}</span>
              </div>
              {(selectedDistrict === dist || (dist === "All Districts" && !selectedDistrict)) && (
                <span className="material-symbols-outlined text-[16px] text-secondary-container">check</span>
              )}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
