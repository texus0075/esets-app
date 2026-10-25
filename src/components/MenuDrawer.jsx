import React from "react";
import StampLogo from "./StampLogo";
import { CATEGORIES } from "../data/mockData";

export default function MenuDrawer({
  isOpen,
  onClose,
  activeCategory,
  onSelectCategory,
  onNavigateTab,
  theme,
  onThemeChange,
  isGlobalCallShieldActive,
  onToggleGlobalCallShield,
  onOpenChecklistModal,
  myPropertyCount = 1,
  currentUser,
  onOpenAuthModal
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-4/5 max-w-xs bg-surface text-on-surface h-full shadow-2xl flex flex-col z-10 overflow-y-auto animate-in slide-in-from-left duration-250">
        
        {/* Drawer Header with Stamp Logo */}
        <div className="p-4 border-b border-surface-container flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <StampLogo className="w-8 h-8" showText={true} />
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 bg-surface-container flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img 
              alt="User Avatar"
              className="w-11 h-11 rounded-full object-cover ring-2 ring-secondary-container shrink-0"
              src={currentUser?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-label-lg text-label-lg font-bold text-primary truncate">
                {currentUser?.displayName || "Guest Visitor"}
              </h4>
              <div className="flex items-center gap-1 text-[11px] font-code-spec text-secondary">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                <span>{currentUser ? "Verified Member" : "Not Signed In"}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onOpenAuthModal();
              onClose();
            }}
            title="Switch Account or Sign In"
            className="shrink-0 p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-dim text-secondary text-[10.5px] font-bold"
          >
            {currentUser ? "Switch" : "Sign In"}
          </button>
        </div>

        {/* Categories Section */}
        <div className="p-4 border-b border-surface-container">
          <span className="font-code-spec text-[10px] uppercase tracking-wider text-on-surface-variant font-bold block mb-2">
            Property Categories
          </span>
          <div className="space-y-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onNavigateTab("explore");
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl font-label-md text-label-md text-left transition ${
                  activeCategory === cat.id
                    ? "bg-primary-container text-secondary-container font-bold"
                    : "text-on-surface hover:bg-surface-container-low"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[19px] text-secondary">
                    {cat.icon}
                  </span>
                  <span>{cat.label}</span>
                </div>
                {activeCategory === cat.id && (
                  <span className="material-symbols-outlined text-[16px] text-secondary-container">
                    check
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Platform Actions */}
        <div className="p-4 border-b border-surface-container space-y-2">
          <span className="font-code-spec text-[10px] uppercase tracking-wider text-on-surface-variant font-bold block mb-1">
            Quick Actions
          </span>

          {/* My Published Listings */}
          <button
            onClick={() => {
              onNavigateTab("my-listings");
              onClose();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-secondary">real_estate_agent</span>
              <span>My Published Listings</span>
            </div>
            <span className="font-code-spec text-[10px] px-2 py-0.5 rounded-full bg-primary-container text-secondary-container font-bold">
              {myPropertyCount}
            </span>
          </button>

          {/* Post Property */}
          <button
            onClick={() => {
              onNavigateTab("post-free");
              onClose();
            }}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-md text-label-md font-bold shadow-xs active:scale-98 transition"
          >
            <span className="material-symbols-outlined text-[18px]">add_home</span>
            <span>Post Property (Free 0%)</span>
          </button>

          {/* 'Sold It' Call Shield Quick Toggle */}
          <button
            onClick={onToggleGlobalCallShield}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl font-label-md text-label-md transition ${
              isGlobalCallShieldActive 
                ? "bg-error text-on-error font-bold" 
                : "bg-surface-container-low text-on-surface hover:bg-surface-container"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">phone_disabled</span>
              <span>'Sold It' Call Shield</span>
            </div>
            <span className="text-[10px] font-code-spec px-1.5 py-0.5 rounded bg-black/20">
              {isGlobalCallShieldActive ? "ACTIVE" : "STANDBY"}
            </span>
          </button>

          {/* Legal Checklist */}
          <button
            onClick={() => {
              onOpenChecklistModal();
              onClose();
            }}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">fact_check</span>
            <span>7-Step Legal Checklist</span>
          </button>
        </div>

        {/* Theme Switcher Quick Bar */}
        <div className="p-4 border-b border-surface-container">
          <span className="font-code-spec text-[10px] uppercase tracking-wider text-on-surface-variant font-bold block mb-2">
            Theme Mode
          </span>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => onThemeChange("light")}
              className={`p-1.5 rounded-lg text-center font-label-md text-[11px] transition ${
                theme === "light" 
                  ? "bg-primary-container text-secondary-container font-bold" 
                  : "bg-surface-container text-on-surface"
              }`}
            >
              Light
            </button>
            <button
              onClick={() => onThemeChange("dark")}
              className={`p-1.5 rounded-lg text-center font-label-md text-[11px] transition ${
                theme === "dark" 
                  ? "bg-primary-container text-secondary-container font-bold" 
                  : "bg-surface-container text-on-surface"
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => onThemeChange("oled")}
              className={`p-1.5 rounded-lg text-center font-label-md text-[11px] transition ${
                theme === "oled" 
                  ? "bg-primary-container text-secondary-container font-bold" 
                  : "bg-surface-container text-on-surface"
              }`}
            >
              OLED
            </button>
          </div>
        </div>

        {/* Settings Tab Link */}
        <div className="p-4 mt-auto">
          <button
            onClick={() => {
              onNavigateTab("settings");
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-lg font-semibold transition"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>All Settings & Preferences</span>
          </button>
          <div className="text-center mt-3">
            <span className="font-code-spec text-[10px] text-on-surface-variant">
              Esets Direct C2C • 2026 Ready
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
