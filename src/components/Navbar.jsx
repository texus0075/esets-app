import React from "react";
import StampLogo from "./StampLogo";

export default function Navbar({ 
  selectedDistrict, 
  onOpenLocationModal, 
  onNavigateToSettings,
  onOpenMenu,
  currentUser,
  onOpenAuthModal
}) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md shadow-[0_1px_8px_rgba(27,36,22,0.05)] pt-safe border-b border-surface-container">
      <div className="h-16 px-margin-mobile flex items-center justify-between gap-space-xs max-w-7xl mx-auto">
        
        {/* Left: Hamburger Menu Button + Stamp Paper Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Hamburger Menu (☰) */}
          <button
            onClick={onOpenMenu}
            aria-label="Open Navigation Menu"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-container-high text-primary transition active:scale-95"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          {/* Stamp Paper & Fountain Pen Official Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 cursor-pointer"
          >
            <StampLogo className="w-8 h-8" showText={false} />
            <div className="flex flex-col">
              <span className="font-headline-sm text-[19px] text-primary tracking-tight font-bold leading-tight">
                Esets
              </span>
              <span className="font-code-spec text-[8.5px] uppercase tracking-wider text-secondary font-semibold hidden sm:inline">
                Deed Verified C2C
              </span>
            </div>
          </div>
        </div>

        {/* Center: Hyper-Local Location Selector Button */}
        <div className="flex-1 flex justify-center min-w-0 max-w-[210px] mx-1">
          <button 
            onClick={onOpenLocationModal}
            className="w-full flex items-center justify-between gap-1 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-left shadow-xs"
          >
            <span className="flex items-center gap-1 min-w-0">
              <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim shrink-0">
                near_me
              </span>
              <span className="font-label-md text-label-md text-on-surface truncate">
                {selectedDistrict || "South Delhi"}
              </span>
            </span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant shrink-0">
              expand_more
            </span>
          </button>
        </div>

        {/* Right: 0% Broker Badge & User Profile / Login */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <div className="hidden xs:inline-flex items-center px-2 py-1 rounded bg-primary-container text-secondary-container font-code-spec text-code-spec shadow-xs">
            <span className="font-semibold text-[10px] uppercase tracking-wide">0% Broker</span>
          </div>

          {currentUser ? (
            <button 
              onClick={onNavigateToSettings}
              className="relative flex items-center justify-center p-0.5 rounded-full hover:ring-2 hover:ring-secondary-container transition-all"
              title={`Logged in as ${currentUser.displayName}`}
            >
              <img 
                alt={currentUser.displayName || "User"} 
                className="w-8 h-8 rounded-full object-cover shadow-xs ring-1 ring-secondary-container/40" 
                src={currentUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-xs">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" title="Direct Owner Verified"></span>
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-2.5 py-1 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-md text-[11px] font-bold shadow-xs active:scale-95 transition"
            >
              Sign In
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
