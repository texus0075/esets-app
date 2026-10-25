import React from "react";
import StampLogo from "../StampLogo";
import { HERO_CONTENT } from "../../config/siteContent";

export default function ExploreHero({
  onPostProperty,
  onOpenSubscriptionModal,
  onOpenChecklistModal,
  onTriggerInstall
}) {
  return (
    <section className="flex flex-col px-margin-mobile pt-3 pb-3">
      {/* Native App Install Header Chip */}
      <div className="mb-2.5 flex items-center justify-between p-2 rounded-xl bg-surface-container-high border border-surface-container">
        <div className="flex items-center gap-2 min-w-0">
          <StampLogo className="w-6 h-6 shrink-0" showText={false} />
          <div className="min-w-0">
            <div className="font-label-md text-label-md text-primary font-bold truncate">
              {HERO_CONTENT.appInstallTitle}
            </div>
            <div className="font-code-spec text-[10px] text-on-surface-variant truncate">
              {HERO_CONTENT.appInstallSubtitle}
            </div>
          </div>
        </div>
        <button
          onClick={onTriggerInstall}
          className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary-container text-on-secondary-fixed font-label-md text-label-md font-bold shadow-xs active:scale-95 transition"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          <span>{HERO_CONTENT.installBtnText}</span>
        </button>
      </div>

      {/* Live Trust Pill */}
      <div className="inline-flex items-center self-start gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface shadow-xs">
        <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
        <span className="font-code-spec text-[10px] tracking-wider uppercase text-on-surface-variant font-semibold">
          {HERO_CONTENT.trustPill}
        </span>
      </div>

      {/* Fluid Clamped Headline */}
      <h1 className="mt-2.5 font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight leading-tight">
        {HERO_CONTENT.headlinePrefix}
        <span className="text-secondary font-bold">{HERO_CONTENT.headlineHighlight}</span>
        {HERO_CONTENT.headlineSuffix}
      </h1>

      {/* Subtitle */}
      <p className="mt-1.5 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
        {HERO_CONTENT.subtitle}
      </p>

      {/* Action Buttons */}
      <div className="mt-3.5 flex flex-col gap-2">
        <button 
          onClick={onPostProperty}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-lg text-label-lg font-bold shadow-[0_4px_16px_rgba(213,129,15,0.35)] active:scale-[0.99] transition-transform hover:opacity-95"
        >
          <span className="material-symbols-outlined text-[20px]">add_home</span>
          <span>{HERO_CONTENT.postPropertyBtnText}</span>
        </button>

        <div className="flex gap-2">
          <button 
            onClick={onOpenSubscriptionModal}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-dim transition-colors font-medium text-center"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
            <span>{HERO_CONTENT.dealerPlansBtnText}</span>
          </button>

          <button 
            onClick={onOpenChecklistModal}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-dim transition-colors font-medium text-center"
          >
            <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">gavel</span>
            <span>{HERO_CONTENT.legalChecklistBtnText}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
