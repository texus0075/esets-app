import React from "react";
import { HERO_CONTENT } from "../../config/siteContent";

export default function ExploreHero({
  onPostProperty,
  onOpenChecklistModal,
  onOpenToolsModal
}) {
  return (
    <section className="px-margin-mobile pt-2 pb-2">
      <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-container-low border border-surface-container shadow-xs flex flex-col gap-2.5">
        
        {/* Top Status Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface shadow-xs">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
            <span className="font-code-spec text-[10px] tracking-wider uppercase text-on-surface font-bold">
              {HERO_CONTENT.trustPill}
            </span>
          </div>

          <span className="font-code-spec text-[10px] text-secondary font-bold uppercase tracking-wider bg-surface-container px-2 py-0.5 rounded">
            Freehold Deeds Only
          </span>
        </div>

        {/* Fluid Clamped Headline */}
        <h1 className="font-headline-lg-mobile text-[1.28rem] sm:text-[1.5rem] text-primary tracking-tight leading-tight font-bold">
          {HERO_CONTENT.headlinePrefix}
          <span className="text-secondary font-bold">{HERO_CONTENT.headlineHighlight}</span>
          {HERO_CONTENT.headlineSuffix}
        </h1>

        {/* 1-Line Compact Subtitle */}
        <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
          {HERO_CONTENT.subtitle}
        </p>

        {/* Action Buttons: Unified Full-Width & Proportional */}
        <div className="pt-1 flex flex-col sm:flex-row gap-2">
          <button 
            onClick={onPostProperty}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-md text-label-md font-bold shadow-[0_2px_12px_rgba(213,129,15,0.25)] active:scale-[0.99] transition hover:opacity-95"
          >
            <span className="material-symbols-outlined text-[18px]">add_home</span>
            <span>{HERO_CONTENT.postPropertyBtnText}</span>
          </button>

          <button 
            onClick={onOpenChecklistModal}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface-container text-on-surface font-label-md text-[12px] hover:bg-surface-dim transition font-medium text-center"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">fact_check</span>
            <span>Legal Checklist</span>
          </button>
        </div>

        {/* Quick PropTech Tools & Calculators Action Bar */}
        <div className="pt-2 border-t border-surface-container/60 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-code-spec">
            <span className="flex items-center gap-1 font-bold text-primary uppercase text-[10px] tracking-wider">
              <span className="material-symbols-outlined text-[14px] text-secondary">calculate</span>
              PropTech Smart Tools
            </span>
            <span className="text-[10px] text-secondary font-bold">100% Free • Direct C2C</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => onOpenToolsModal ? onOpenToolsModal('emi') : null}
              className="p-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container transition flex items-center gap-1.5 text-left border border-surface-container active:scale-95 shadow-2xs"
            >
              <div className="w-6 h-6 rounded-lg bg-primary-container text-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[14px]">calculate</span>
              </div>
              <div className="min-w-0">
                <span className="block font-label-md text-[11px] font-bold text-primary truncate leading-tight">Loan EMI</span>
                <span className="block font-code-spec text-[9px] text-secondary font-semibold truncate">8.5% Rate</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onOpenToolsModal ? onOpenToolsModal('land') : null}
              className="p-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container transition flex items-center gap-1.5 text-left border border-surface-container active:scale-95 shadow-2xs"
            >
              <div className="w-6 h-6 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[14px]">square_foot</span>
              </div>
              <div className="min-w-0">
                <span className="block font-label-md text-[11px] font-bold text-primary truncate leading-tight">Gaj / Bigha</span>
                <span className="block font-code-spec text-[9px] text-secondary font-semibold truncate">Land Unit</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("price-trends-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="p-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container transition flex items-center gap-1.5 text-left border border-surface-container active:scale-95 shadow-2xs"
            >
              <div className="w-6 h-6 rounded-lg bg-secondary-container text-on-secondary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
              </div>
              <div className="min-w-0">
                <span className="block font-label-md text-[11px] font-bold text-primary truncate leading-tight">Price Index</span>
                <span className="block font-code-spec text-[9px] text-secondary font-semibold truncate">+10% QoQ</span>
              </div>
            </button>

            <button
              type="button"
              onClick={onOpenChecklistModal}
              className="p-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container transition flex items-center gap-1.5 text-left border border-surface-container active:scale-95 shadow-2xs"
            >
              <div className="w-6 h-6 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[14px]">verified</span>
              </div>
              <div className="min-w-0">
                <span className="block font-label-md text-[11px] font-bold text-primary truncate leading-tight">7-Step Legal</span>
                <span className="block font-code-spec text-[9px] text-on-surface-variant truncate">Deed Check</span>
              </div>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
