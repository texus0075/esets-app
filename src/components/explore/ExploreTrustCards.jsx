import React from "react";
import { TRUST_CARDS_CONTENT } from "../../config/siteContent";

export default function ExploreTrustCards() {
  return (
    <section className="px-margin-mobile pb-1">
      <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-margin-mobile px-margin-mobile scrollbar-none">
        {TRUST_CARDS_CONTENT.map(card => (
          <div 
            key={card.id}
            className="flex-shrink-0 w-[205px] p-3 rounded-xl bg-surface-container-lowest shadow-xs flex flex-col justify-between border border-surface-container"
          >
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${card.badgeColor}`}>
                <span className="material-symbols-outlined text-[16px]">{card.icon}</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface font-bold">
                {card.title}
              </span>
            </div>
            <p className="mt-2 font-body-sm text-[11px] text-on-surface-variant leading-tight">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
