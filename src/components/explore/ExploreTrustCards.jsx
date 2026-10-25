import React from "react";
import { TRUST_CARDS_CONTENT } from "../../config/siteContent";

export default function ExploreTrustCards() {
  return (
    <section className="px-margin-mobile py-1">
      <div className="grid grid-cols-3 gap-1.5">
        {TRUST_CARDS_CONTENT.map(card => (
          <div 
            key={card.id}
            className="p-2 sm:p-2.5 rounded-xl bg-surface-container-lowest shadow-xs flex flex-col justify-between border border-surface-container text-center"
          >
            <div className="flex flex-col items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${card.badgeColor} shrink-0`}>
                <span className="material-symbols-outlined text-[13px]">{card.icon}</span>
              </div>
              <span className="font-label-md text-[11px] font-bold text-primary truncate w-full">
                {card.title}
              </span>
            </div>
            <p className="mt-1 font-body-sm text-[10px] text-on-surface-variant leading-tight line-clamp-2">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
