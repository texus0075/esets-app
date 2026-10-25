import React from "react";

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-4px_20px_rgba(27,36,22,0.06)] border-t border-surface-container">
      <div className="flex justify-between items-center h-16 px-gutter-mobile relative max-w-lg mx-auto">
        {/* Tab 1: Explore */}
        <button
          onClick={() => onTabChange("explore")}
          className={`flex-1 flex flex-col items-center justify-center h-full min-w-[56px] transition-colors ${
            activeTab === "explore"
              ? "text-primary-container font-semibold"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">explore</span>
          <span className="font-label-md text-label-md mt-0.5">Explore</span>
        </button>

        {/* Tab 2: My Listings (Seller Portfolio) */}
        <button
          onClick={() => onTabChange("my-listings")}
          className={`flex-1 flex flex-col items-center justify-center h-full min-w-[56px] transition-colors ${
            activeTab === "my-listings"
              ? "text-secondary font-bold"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">real_estate_agent</span>
          <span className="font-label-md text-[11px] mt-0.5">My Listings</span>
        </button>

        {/* Tab 3: Post Free (Center elevated Amber CTA) */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-w-[56px]">
          <button
            onClick={() => onTabChange("post-free")}
            className="absolute -top-5 flex flex-col items-center group focus:outline-none"
          >
            <div className="w-13 h-13 p-3 rounded-full bg-secondary-container text-on-secondary-fixed shadow-[0_6px_18px_rgba(213,129,15,0.35)] flex items-center justify-center transition-transform active:scale-95 group-hover:scale-105">
              <span className="material-symbols-outlined text-[26px]">add</span>
            </div>
            <span className="font-label-md text-label-md text-on-secondary-fixed mt-2 font-semibold">
              Post Free
            </span>
          </button>
        </div>

        {/* Tab 4: Saved */}
        <button
          onClick={() => onTabChange("saved")}
          className={`flex-1 flex flex-col items-center justify-center h-full min-w-[56px] transition-colors ${
            activeTab === "saved"
              ? "text-primary-container font-semibold"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">bookmark</span>
          <span className="font-label-md text-label-md mt-0.5">Saved</span>
        </button>

        {/* Tab 5: Settings */}
        <button
          onClick={() => onTabChange("settings")}
          className={`flex-1 flex flex-col items-center justify-center h-full min-w-[56px] transition-colors ${
            activeTab === "settings"
              ? "text-primary-container font-semibold"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">tune</span>
          <span className="font-label-md text-label-md mt-0.5">Settings</span>
        </button>
      </div>
    </nav>
  );
}
