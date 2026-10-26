import React, { useState } from "react";
import HomeLoanEMICalculator from "../HomeLoanEMICalculator";
import { convertLandArea, REGIONAL_AREA_FACTORS } from "../../services/indianRealEstateCalculatorService";

export default function ExploreFinancialTools() {
  const [activeTool, setActiveTool] = useState("emi"); // 'emi' | 'land'
  
  // Land Converter State
  const [areaVal, setAreaVal] = useState("1000");
  const [fromUnit, setFromUnit] = useState("sqft");
  const [toUnit, setToUnit] = useState("gaj");

  const convertedResult = convertLandArea(areaVal, fromUnit, toUnit);

  return (
    <section id="financial-tools-section" className="px-margin-mobile mt-4 scroll-mt-20">
      <div className="p-3.5 rounded-2xl bg-surface-container border border-surface-container flex flex-col gap-3 shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-secondary">analytics</span>
            <span className="font-label-lg text-label-lg text-primary font-bold">
              Real Estate Financial & Land Tools
            </span>
          </div>
          <span className="font-code-spec text-[10px] text-secondary bg-surface-container-lowest px-2 py-0.5 rounded font-bold uppercase">
            0% Brokerage Toolkit
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-surface-container-low border border-surface-container text-xs">
          <button
            type="button"
            onClick={() => setActiveTool("emi")}
            className={`py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              activeTool === "emi"
                ? "bg-primary text-surface shadow-xs"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">calculate</span>
            <span>Home Loan EMI</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTool("land")}
            className={`py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              activeTool === "land"
                ? "bg-primary text-surface shadow-xs"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">square_foot</span>
            <span>Gaj / Bigha Converter</span>
          </button>
        </div>

        {/* Tool 1: Interactive Home Loan EMI Calculator */}
        {activeTool === "emi" && (
          <div className="animate-in fade-in duration-150">
            <HomeLoanEMICalculator propertyPrice={6500000} />
          </div>
        )}

        {/* Tool 2: Regional Indian Land Converter */}
        {activeTool === "land" && (
          <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container flex flex-col gap-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-code-spec text-[11px] font-bold text-primary uppercase">
                Regional Land Measurement Unit Converter
              </span>
              <span className="text-[10px] text-on-surface-variant font-code-spec">
                1 Gaj = 9 Sq.Ft
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
              {/* Input Value */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-on-surface-variant font-code-spec uppercase">Area Value</label>
                <input 
                  type="number"
                  value={areaVal}
                  onChange={(e) => setAreaVal(e.target.value)}
                  className="w-full bg-surface-container-low text-primary p-2 rounded-lg font-bold text-sm focus:outline-none"
                  placeholder="e.g. 1000"
                />
              </div>

              {/* From Unit */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-on-surface-variant font-code-spec uppercase">From Unit</label>
                <select 
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full bg-surface-container-low text-primary p-2 rounded-lg text-xs font-semibold focus:outline-none"
                >
                  <option value="sqft">Square Feet (Sq.Ft)</option>
                  <option value="gaj">Gaj (गज / Sq.Yd)</option>
                  <option value="bigha_pucca">Bigha (बीघा पक्का)</option>
                  <option value="bigha_kaccha">Bigha (बीघा कच्चा)</option>
                  <option value="guntha">Guntha (गुंठा)</option>
                  <option value="kanal">Kanal (कनाल)</option>
                  <option value="acre">Acre (एकड़)</option>
                </select>
              </div>

              {/* To Unit */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-on-surface-variant font-code-spec uppercase">To Unit</label>
                <select 
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full bg-surface-container-low text-primary p-2 rounded-lg text-xs font-semibold focus:outline-none"
                >
                  <option value="gaj">Gaj (गज / Sq.Yd)</option>
                  <option value="sqft">Square Feet (Sq.Ft)</option>
                  <option value="bigha_pucca">Bigha (बीघा पक्का)</option>
                  <option value="bigha_kaccha">Bigha (बीघा कच्चा)</option>
                  <option value="guntha">Guntha (गुंठा)</option>
                  <option value="kanal">Kanal (कनाल)</option>
                  <option value="acre">Acre (एकड़)</option>
                </select>
              </div>
            </div>

            {/* Result Badge */}
            <div className="p-2.5 rounded-xl bg-tertiary-fixed/30 border border-tertiary-fixed/40 flex items-center justify-between text-on-tertiary-fixed">
              <span className="font-body-sm text-xs font-medium">Converted Area:</span>
              <span className="font-headline-sm text-base font-extrabold text-primary">
                {convertedResult.toLocaleString("en-IN")} {toUnit.replace("_pucca", " (पक्का)").replace("_kaccha", " (कच्चा)").toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
