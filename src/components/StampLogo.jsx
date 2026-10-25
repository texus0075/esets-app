import React from "react";

export default function StampLogo({ className = "w-8 h-8", showText = false }) {
  return (
    <div className="flex items-center gap-2 select-none">
      {/* Legal Stamp Paper & Fountain Pen Emblem */}
      <svg 
        className={className} 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Esets Legal Deed & Direct Owner Stamp Logo"
      >
        <defs>
          <linearGradient id="stampPaperGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FAF7F2" />
            <stop offset="1" stopColor="#EFECE5" />
          </linearGradient>
          <linearGradient id="sealGoldGrad" x1="16" y1="18" x2="32" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="0.5" stopColor="#D97706" />
            <stop offset="1" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="penNibGrad" x1="26" y1="4" x2="44" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D5810F" />
            <stop offset="0.6" stopColor="#78350F" />
            <stop offset="1" stopColor="#1B2416" />
          </linearGradient>
          <filter id="logoShadow" x="0" y="2" width="48" height="46" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1B2416" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* 1. Legal Document / Stamp Paper Background */}
        <g filter="url(#logoShadow)">
          {/* Main Paper Sheet */}
          <rect 
            x="6" 
            y="6" 
            width="32" 
            height="38" 
            rx="3" 
            fill="url(#stampPaperGrad)" 
            stroke="#563E28" 
            strokeWidth="1.5" 
          />
          {/* Top Legal Header Ornament Band */}
          <rect x="9" y="9" width="26" height="5" rx="1.5" fill="#1B2416" />
          {/* Fine Legal Text Lines */}
          <line x1="10" y1="18" x2="22" y2="18" stroke="#87A168" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="22" x2="20" y2="22" stroke="#87A168" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="26" x2="18" y2="26" stroke="#87A168" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="38" x2="24" y2="38" stroke="#563E28" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* 2. Official Embossed Wax Stamp Seal & Ribbon */}
        <g>
          {/* Red/Gold Seal Ribbon Tails */}
          <path d="M19 32 L16 41 L21 38 L25 41 L23 32 Z" fill="#D97706" opacity="0.9" />
          {/* Circular Stamp Base */}
          <circle cx="21" cy="30" r="7.5" fill="url(#sealGoldGrad)" stroke="#FFFFFF" strokeWidth="1.2" />
          {/* Verified Star / Checkmark inside Seal */}
          <path 
            d="M18 30 L20 32 L24 28" 
            stroke="#FFFFFF" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </g>

        {/* 3. Luxury Fountain Pen writing on the Registry Document */}
        <g transform="rotate(15 36 14)">
          {/* Pen Body */}
          <rect x="33" y="-2" width="6" height="22" rx="2" fill="url(#penNibGrad)" />
          {/* Gold Grip Band */}
          <rect x="33" y="14" width="6" height="3" fill="#F59E0B" />
          {/* Pen Nib (Metallic Triangular Tip) */}
          <path d="M33 17 L36 24 L39 17 Z" fill="#FCD34D" stroke="#D97706" strokeWidth="0.8" />
          {/* Ink Nib Slit */}
          <line x1="36" y1="17" x2="36" y2="22" stroke="#1B2416" strokeWidth="0.7" />
        </g>
      </svg>

      {/* Brand Text (Optional) */}
      {showText && (
        <div className="flex flex-col">
          <span className="font-headline-sm text-[20px] font-bold text-primary tracking-tight leading-none">
            Esets
          </span>
          <span className="font-code-spec text-[9px] uppercase tracking-wider text-secondary font-semibold">
            Deed Verified C2C
          </span>
        </div>
      )}
    </div>
  );
}
