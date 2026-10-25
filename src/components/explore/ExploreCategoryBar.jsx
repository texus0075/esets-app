import React from "react";
import { CATEGORIES } from "../../data/mockData";

export default function ExploreCategoryBar({ activeCategory, onSelectCategory }) {
  return (
    <section className="px-margin-mobile py-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-code-spec text-[10.5px] uppercase tracking-wider text-on-surface-variant font-bold">
          Browse by Property Type
        </span>
        {activeCategory !== "All" && (
          <button 
            onClick={() => onSelectCategory("All")}
            className="font-code-spec text-[10.5px] text-secondary font-bold hover:underline"
          >
            Reset (All)
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 overflow-x-auto -mx-margin-mobile px-margin-mobile scrollbar-none py-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl font-label-md text-label-md transition flex items-center gap-1.5 ${
              activeCategory === cat.id
                ? "bg-primary text-surface font-bold shadow-sm"
                : "bg-surface-container hover:bg-surface-container-high text-on-surface font-medium"
            }`}
          >
            <span className="material-symbols-outlined text-[17px] text-secondary">
              {cat.icon}
            </span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
