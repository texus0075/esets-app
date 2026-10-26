import React from "react";
import { calculateIndianEMI } from "../services/indianRealEstateCalculatorService";

export default function PropertyCard({ 
  property, 
  onSelectProperty,
  isGlobalCallShieldActive = false
}) {
  const isSold = property.isSold || isGlobalCallShieldActive;
  const mainImage = property.images && property.images.length > 0 ? property.images[0] : "";

  // RightHome Financial Intelligence: 80% Loan EMI & 2% Brokerage Savings
  const priceNum = Number(property.price) || 0;
  const loanPrincipal = priceNum * 0.8;
  const emiData = calculateIndianEMI(loanPrincipal, 8.5, 20);
  const brokerageSavedNum = priceNum * 0.02;
  const brokerageSavedFormatted = brokerageSavedNum >= 100000 
    ? `₹${(brokerageSavedNum / 100000).toFixed(1)}L` 
    : `₹${Math.round(brokerageSavedNum).toLocaleString("en-IN")}`;
  const psfValue = property.area && priceNum > 0 ? Math.round(priceNum / property.area) : null;

  return (
    <article 
      onClick={() => onSelectProperty(property)}
      className={`flex flex-col rounded-xl bg-surface-container-lowest overflow-hidden shadow-sm cursor-pointer transition-all hover:shadow-md ${
        isSold ? "opacity-90" : ""
      }`}
    >
      {/* Media Header */}
      <div className={`relative w-full aspect-[16/10] overflow-hidden ${isSold ? "bg-surface-dim" : "bg-surface-container"}`}>
        <img 
          alt={property.title}
          className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
            isSold ? "grayscale contrast-75 brightness-90" : ""
          }`}
          src={mainImage}
          loading="lazy"
        />

        {/* Sold Overlay */}
        {isSold ? (
          <>
            <div className="absolute inset-0 bg-primary/25"></div>
            
            {/* Signature SOLD OUT Diagonal Ribbon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="transform -rotate-12 bg-error text-on-error font-headline-sm text-[15px] sm:text-headline-sm font-bold tracking-widest px-4 sm:px-6 py-1.5 sm:py-2 shadow-xl flex items-center gap-1.5 sm:gap-2">
                <span className="material-symbols-outlined text-[18px] sm:text-[22px]">verified</span>
                DEAL CLOSED • SOLD OUT
              </div>
            </div>

            {/* Call Shield Active Badge */}
            <div className="absolute top-2.5 left-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-code-spec text-[10px] font-bold uppercase shadow-sm">
                <span className="material-symbols-outlined text-[13px]">phone_disabled</span>
                Call Shield Active
              </span>
            </div>

            {/* Strikethrough Price Tag */}
            <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-lg bg-surface-container-lowest/90 backdrop-blur-md">
              <div className="font-headline-sm text-headline-sm text-on-surface-variant line-through font-bold">
                {property.priceUnit}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Top Floating Chips */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
              {property.verifiedOwner && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-code-spec text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  Verified Owner
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-md text-[10px] font-bold uppercase">
                {property.dealType || "Sale"}
              </span>
              {property.videoUrl && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-container text-surface font-label-md text-[10px] font-bold uppercase">
                  <span className="material-symbols-outlined text-[12px] text-secondary-container">videocam</span>
                  Video
                </span>
              )}
            </div>

            {/* 0% Brokerage Chip */}
            <div className="absolute top-2.5 right-2.5">
              <span className="px-2.5 py-1 rounded bg-primary-container text-secondary-container font-code-spec text-[10px] uppercase font-bold tracking-wider shadow-sm">
                0% Brokerage
              </span>
            </div>

            {/* Price & Rate Overlaid Tag */}
            <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-lg bg-surface-container-lowest/95 backdrop-blur-md shadow-sm flex items-center gap-2">
              <div className="font-headline-sm text-headline-sm text-primary font-bold">
                {property.priceUnit}
              </div>
              {psfValue && (
                <span className="font-code-spec text-[10px] text-on-surface-variant border-l border-surface-container pl-1.5 font-medium">
                  ₹{psfValue.toLocaleString("en-IN")}/sqft
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Card Body Content */}
      <div className="p-3.5 flex flex-col gap-2">
        <div>
          <div className="flex items-center justify-between">
            <h3 className={`font-headline-sm text-[16px] font-semibold leading-snug truncate ${isSold ? "text-on-surface-variant" : "text-primary"}`}>
              {property.title}
            </h3>
            {isSold && (
              <span className="font-code-spec text-[10px] text-error font-semibold shrink-0 ml-1">
                0 Inquiries Accepted
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-[12px] mt-0.5">
            <span className="material-symbols-outlined text-[15px] text-secondary">location_on</span>
            <span className="truncate">{property.locality}, {property.district}</span>
          </div>
        </div>

        {/* Tabular Micro Specs Data Cluster */}
        <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 rounded-lg bg-surface-container-low text-center">
          <div className="flex flex-col">
            <span className="font-code-spec text-[10px] text-on-surface-variant uppercase">Super Area</span>
            <span className="font-code-spec text-[11px] text-on-surface font-semibold truncate">
              {property.area} sqft {property.area ? `(${Math.round(property.area / 9)} गज)` : ''}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-code-spec text-[10px] text-on-surface-variant uppercase">Layout</span>
            <span className="font-code-spec text-code-spec text-on-surface font-semibold">{property.bhk} BHK</span>
          </div>
          <div className="flex flex-col">
            <span className="font-code-spec text-[10px] text-on-surface-variant uppercase">Tenure</span>
            <span className="font-code-spec text-code-spec text-on-surface font-semibold truncate">{property.ownership?.split(' ')[0] || "Freehold"}</span>
          </div>
        </div>

        {/* RightHome PropTech Financial & Vastu Intelligence Strip */}
        <div className="flex items-center justify-between gap-1.5 py-0.5 px-0.5 text-[11px]">
          {/* Monthly EMI Indicator */}
          {emiData.monthlyEMI > 0 && (
            <div className="flex items-center gap-1 font-code-spec text-primary font-bold">
              <span className="material-symbols-outlined text-[14px] text-secondary">calculate</span>
              <span>EMI from ₹{emiData.monthlyEMI.toLocaleString("en-IN")}/mo*</span>
            </div>
          )}

          {/* 2% Brokerage Savings Tag */}
          {brokerageSavedNum > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-code-spec text-[10px] font-bold">
              <span className="material-symbols-outlined text-[12px]">savings</span>
              Save {brokerageSavedFormatted} Brok.
            </span>
          )}
        </div>

        {/* Vastu & Ready Status Tags */}
        <div className="flex items-center gap-1.5 flex-wrap text-[10.5px] font-code-spec text-on-surface-variant">
          <span className="px-2 py-0.5 rounded-md bg-surface-container-low flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[12px] text-secondary">explore</span>
            {property.facing || "East Facing (Vastu)"}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-surface-container-low flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[12px] text-tertiary-fixed-dim">verified</span>
            {property.status || "Ready to Move"}
          </span>
        </div>

        {/* Bottom Interactive Area */}
        {isSold ? (
          <div className="flex flex-col gap-1.5 mt-1">
            {/* Masked Number Micro Info */}
            <div className="p-2 rounded-lg bg-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[13px]">shield</span>
                </div>
                <div className="font-code-spec text-[11px] text-on-surface-variant font-medium">
                  Owner Phone: +91 98200 •••••
                </div>
              </div>
              <span className="font-code-spec text-[9px] text-outline uppercase font-semibold">Protected</span>
            </div>

            {/* Shielded Interaction Replacement */}
            <div className="w-full py-2 px-2.5 rounded-lg bg-surface-container-high text-on-surface-variant font-label-md text-[11px] flex items-center justify-center gap-1.5 text-center cursor-not-allowed">
              <span className="material-symbols-outlined text-[15px] text-error">lock</span>
              <span className="truncate">Property sold • Owner has frozen incoming calls</span>
            </div>
          </div>
        ) : (
          /* Twin Direct Interaction Buttons */
          <div className="mt-1 grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
            <a 
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-secondary-container text-on-secondary-fixed font-label-md text-label-md font-semibold active:scale-[0.98] transition-transform hover:opacity-90 shadow-xs"
              href={`tel:${property.sellerPhone?.replace(/\s+/g, '')}`}
            >
              <span className="material-symbols-outlined text-[17px]">call</span>
              <span>Direct Call</span>
            </a>
            <a 
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold active:scale-[0.98] transition-transform hover:bg-surface-dim shadow-xs"
              href={`https://wa.me/${property.sellerPhone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I am interested in your ${property.title} on Esets.`)}`}
              rel="noopener noreferrer" 
              target="_blank"
            >
              <span className="material-symbols-outlined text-[17px] text-on-tertiary-container">chat</span>
              <span>WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
