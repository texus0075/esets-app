import React from "react";
import { HERO_CONTENT } from "../../config/siteContent";

export default function ExploreHero({
  onPostProperty,
  onOpenChecklistModal
}) {
  return (
    <section className="flex flex-col px-margin-mobile pt-3 pb-2">
      {/* Live Compact Trust Pill */}
      <div className="inline-flex items-center self-start gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface shadow-xs">
        <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
        <span className="font-code-spec text-[10.5px] tracking-wider uppercase text-on-surface-variant font-bold">
          {HERO_CONTENT.trustPill}
        </span>
      </div>

      {/* Fluid Compact Headline */}
      <h1 className="mt-2 font-headline-lg-mobile text-[1.45rem] text-primary tracking-tight leading-snug font-bold">
        {HERO_CONTENT.headlinePrefix}
        <span className="text-secondary font-bold">{HERO_CONTENT.headlineHighlight}</span>
        {HERO_CONTENT.headlineSuffix}
      </h1>

      {/* 1-Line Compact Subtitle */}
      <p className="mt-1 font-body-sm text-[12.5px] text-on-surface-variant leading-relaxed">
        {HERO_CONTENT.subtitle}
      </p>

      {/* Action Buttons */}
      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <button 
          onClick={onPostProperty}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-lg text-label-lg font-bold shadow-[0_4px_16px_rgba(213,129,15,0.3)] active:scale-[0.99] transition-transform hover:opacity-95"
        >
          <span className="material-symbols-outlined text-[19px]">add_home</span>
          <span>{HERO_CONTENT.postPropertyBtnText}</span>
        </button>

        <button 
          onClick={onOpenChecklistModal}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-dim transition-colors font-medium text-center"
        >
          <span className="material-symbols-outlined text-[16px] text-secondary">fact_check</span>
          <span>Legal Checklist</span>
        </button>
      </div>
    </section>
  );
}
