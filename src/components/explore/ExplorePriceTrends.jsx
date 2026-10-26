import React from "react";

const PRICE_TRENDS = [
  { city: "South Delhi / NCR", avgPsf: "₹14,500 / sq.ft", growth: "+12.4%", trend: "up", rentYield: "3.8%" },
  { city: "Mumbai Suburban", avgPsf: "₹22,800 / sq.ft", growth: "+9.1%", trend: "up", rentYield: "4.2%" },
  { city: "Bangalore Whitefield", avgPsf: "₹8,900 / sq.ft", growth: "+15.6%", trend: "up", rentYield: "4.9%" },
  { city: "Jaipur Mansarovar", avgPsf: "₹4,850 / sq.ft", growth: "+8.2%", trend: "up", rentYield: "3.5%" },
  { city: "Rajsamand / Udaipur", avgPsf: "₹3,400 / sq.ft", growth: "+10.1%", trend: "up", rentYield: "4.0%" }
];

export default function ExplorePriceTrends() {
  return (
    <section className="px-margin-mobile mt-4">
      <div className="p-3.5 rounded-2xl bg-surface-container border border-surface-container flex flex-col gap-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[19px] text-secondary">trending_up</span>
            <span className="font-label-lg text-label-lg text-primary font-bold">
              Property Price Trends (QoQ Capital Growth)
            </span>
          </div>
          <span className="font-code-spec text-[10px] text-secondary bg-surface-container-lowest px-2 py-0.5 rounded font-bold uppercase">
            Market Index
          </span>
        </div>

        <p className="font-body-sm text-[11px] text-on-surface-variant">
          Historical average capital values per sq.ft and rental yields across active direct-owner territories.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {PRICE_TRENDS.map((pt, idx) => (
            <div 
              key={idx}
              className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container flex items-center justify-between shadow-xs"
            >
              <div>
                <span className="font-label-md text-xs font-bold text-primary block">{pt.city}</span>
                <span className="font-code-spec text-[11px] text-on-surface-variant">{pt.avgPsf}</span>
              </div>
              <div className="text-right">
                <span className="font-code-spec text-[11px] font-extrabold text-secondary px-1.5 py-0.5 rounded bg-secondary-container block">
                  {pt.growth}
                </span>
                <span className="text-[9.5px] text-on-surface-variant font-code-spec mt-0.5 block">
                  Yield: {pt.rentYield}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
