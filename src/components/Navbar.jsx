import React from "react";

export default function Navbar({ 
  selectedDistrict, 
  onOpenLocationModal, 
  onNavigateToSettings 
}) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(27,36,22,0.05)] pt-safe">
      <div className="h-16 px-margin-mobile flex items-center justify-between gap-space-sm max-w-7xl mx-auto">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-space-xs flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img 
            alt="Esets Brand Logo" 
            className="h-8 w-auto object-contain" 
            src="https://lh3.googleusercontent.com/aida/AEtjO1XQuJitb0ZaeFEpPEE7bRlZ8NHRS7l9MYJZoOF-4ktjwKDEJaHFmthMrRi92yLk9N3Z_48CDmX8S0aNhbjPx79Oox_CXu8iXG0I0F0nYUUoAHRKfDRmq8MmEd4saiOw9hz4vIGfVCc9UQd2eaVsBqFePN8JD4V1o23q2ytQRmBCtPEieHEiRJM0QLn8TUYXh_dkTv2zmdbl9HfqZKnj5N1VJWXJbnT6sQld12Or6mg"
          />
          <span className="font-headline-sm text-headline-sm text-primary tracking-tight hidden xs:inline">
            Esets
          </span>
        </div>

        {/* Hyper-local Location Selector */}
        <div className="flex-1 flex justify-center min-w-0 max-w-[210px]">
          <button 
            onClick={onOpenLocationModal}
            className="w-full flex items-center justify-between gap-space-xs px-space-sm py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-left"
          >
            <span className="flex items-center gap-1 min-w-0">
              <span className="material-symbols-outlined text-[15px] text-tertiary-fixed-dim shrink-0">
                near_me
              </span>
              <span className="font-label-md text-label-md text-on-surface truncate">
                {selectedDistrict || "South Delhi, DL"}
              </span>
            </span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant shrink-0">
              expand_more
            </span>
          </button>
        </div>

        {/* 0% Broker Badge & User Profile Avatar */}
        <div className="flex items-center gap-space-xs flex-shrink-0">
          <div className="inline-flex items-center px-2 py-1 rounded bg-primary-container text-secondary-container font-code-spec text-code-spec shadow-[0_0_10px_rgba(213,129,15,0.25)]">
            <span className="font-semibold text-[11px] uppercase tracking-wide">0% Broker</span>
          </div>

          <button 
            onClick={onNavigateToSettings}
            className="relative flex items-center justify-center p-0.5 rounded-full hover:ring-2 hover:ring-secondary-container transition-all"
            title="Profile & Settings"
          >
            <img 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover" 
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
