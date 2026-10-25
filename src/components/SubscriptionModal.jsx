import React, { useState } from "react";

export default function SubscriptionModal({ isOpen, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState("silver");
  const [isJoined, setIsJoined] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface rounded-2xl max-w-xl w-full shadow-2xl border border-surface-container overflow-hidden my-auto max-h-[92vh] flex flex-col text-on-surface">
        
        {/* Modal Header */}
        <div className="p-6 bg-primary-container text-surface-container-lowest relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-surface/10 backdrop-blur-md flex items-center justify-center border border-surface/20 text-secondary-container shadow-inner">
                <span className="material-symbols-outlined text-[28px]">workspace_premium</span>
              </div>
              <div>
                <span className="font-code-spec text-[10px] uppercase tracking-widest text-secondary-container font-bold">
                  Esets Business Pro
                </span>
                <h3 className="font-headline-sm text-headline-sm text-surface font-bold">
                  Dealer & Builder Subscription
                </h3>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface/10 hover:bg-surface/20 flex items-center justify-center text-surface transition"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-surface/10 backdrop-blur-sm border border-surface/10 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-secondary-container">groups</span>
              <span>Community Intake: <strong>2,480 / 3,000</strong> Active Members</span>
            </div>
            <span className="bg-secondary-container text-on-secondary-fixed px-2 py-0.5 rounded-full font-bold text-[10px]">
              Founding Member Tier
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            If you are a professional property dealer, agent, or builder, choose a <strong>monthly tier</strong> to elevate your portfolio, gain verified credibility badges, and unlock priority locality placement.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Silver Plan */}
            <div 
              onClick={() => setSelectedPlan("silver")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedPlan === "silver"
                  ? "border-secondary bg-secondary-container/20 ring-2 ring-secondary/30"
                  : "border-surface-container bg-surface-container-low hover:bg-surface-container"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-code-spec text-[11px] font-bold uppercase text-secondary bg-surface-container-lowest px-2 py-0.5 rounded">
                  Silver Pro
                </span>
                {selectedPlan === "silver" && (
                  <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                )}
              </div>

              <div className="mb-2">
                <span className="font-headline-sm text-headline-sm text-primary font-bold">₹8,000</span>
                <span className="font-code-spec text-code-spec text-on-surface-variant"> / month</span>
              </div>

              <ul className="space-y-1.5 font-body-sm text-[12px] text-on-surface">
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">check</span>
                  <span>List up to <strong>25 properties</strong></span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">check</span>
                  <span><strong>'Verified Dealer'</strong> Blue Check</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">check</span>
                  <span>Priority District Search Ranking</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">check</span>
                  <span>Direct WhatsApp Lead Routing</span>
                </li>
              </ul>
            </div>

            {/* Gold Plan */}
            <div 
              onClick={() => setSelectedPlan("gold")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedPlan === "gold"
                  ? "border-secondary bg-secondary-container/20 ring-2 ring-secondary/30"
                  : "border-surface-container bg-surface-container-low hover:bg-surface-container"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-code-spec text-[11px] font-bold uppercase text-secondary-container bg-primary-container px-2 py-0.5 rounded">
                  Gold Elite
                </span>
                {selectedPlan === "gold" && (
                  <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                )}
              </div>

              <div className="mb-2">
                <span className="font-headline-sm text-headline-sm text-primary font-bold">₹15,000</span>
                <span className="font-code-spec text-code-spec text-on-surface-variant"> / month</span>
              </div>

              <ul className="space-y-1.5 font-body-sm text-[12px] text-on-surface">
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">check</span>
                  <span><strong>Unlimited Listings</strong></span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">check</span>
                  <span><strong>'Gold Elite Builder'</strong> Badge</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">check</span>
                  <span>Featured Home Banner Showcase</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">check</span>
                  <span>360° Drone & Video Walkthroughs</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container flex items-center justify-between text-xs">
            <span className="font-body-sm text-on-surface-variant">Founding Promotion (First 3,000 Members)</span>
            <span className="font-code-spec text-secondary font-bold">14-Day Free Trial Available</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container font-label-md"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              setIsJoined(true);
              setTimeout(() => {
                alert(`Subscribed to ${selectedPlan.toUpperCase()} Tier successfully!`);
                onClose();
              }, 400);
            }}
            className="px-6 py-2.5 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-lg font-bold shadow-md hover:opacity-90 active:scale-95 transition"
          >
            {isJoined ? "Processing..." : `Activate ${selectedPlan === "silver" ? "Silver Pro (₹8,000)" : "Gold Elite (₹15,000)"}`}
          </button>
        </div>
      </div>
    </div>
  );
}
