import React from "react";
import StampLogo from "./StampLogo";

export default function Navbar({ 
  selectedDistrict, 
  onOpenLocationModal, 
  onNavigateToSettings,
  onOpenMenu 
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

        {/* Right: 0% Broker Badge & User Profile */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="inline-flex items-center px-2 py-1 rounded bg-primary-container text-secondary-container font-code-spec text-code-spec shadow-xs">
            <span className="font-semibold text-[10.5px] uppercase tracking-wide">0% Broker</span>
          </div>

          <button 
            onClick={onNavigateToSettings}
            className="relative flex items-center justify-center p-0.5 rounded-full hover:ring-2 hover:ring-secondary-container transition-all"
            title="Profile & Settings"
          >
            <img 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover shadow-xs" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDNEqxzKN8N_FTKYy49cYmujcbjsHKlO2JDm3tnzbz-IPGetcxCQ2hY-XGZnuKb2YeHYIY7sNC-ndonG2pqPJtbVXlTJitdzg2ouVetF3eshofzPIue5omHHtKh-GS8fySWsM7O7cwLDUGhPSUjrH-T2w-vP9Ng1q0DP5qmjlLvHjDPe-o4kGlnOtMoOcWIRsC3jSi9nLYPHKO8BUVrmvgiBC7H8mrYYEe-4kFQg"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-xs">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" title="Direct Owner Verified"></span>
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}
