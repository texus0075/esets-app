import React, { useState } from "react";
import HomeLoanEMICalculator from "./HomeLoanEMICalculator";
import HomeLoanEligibilityCalculator from "./HomeLoanEligibilityCalculator";
import { convertLandArea } from "../services/indianRealEstateCalculatorService";

export default function FinancialToolsModal({ 
  isOpen, 
  onClose, 
  initialTool = "emi", 
  propertyPrice = 6500000 
}) {
  const [activeTool, setActiveTool] = useState(initialTool);

  // Land Converter State
  const [areaVal, setAreaVal] = useState("1000");
  const [fromUnit, setFromUnit] = useState("sqft");
  const [toUnit, setToUnit] = useState("gaj");

  if (!isOpen) return null;

  const convertedResult = convertLandArea(areaVal, fromUnit, toUnit);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-surface-container rounded-3xl max-w-xl w-full shadow-2xl border border-surface-container overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary-container text-secondary-container flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">analytics</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-[16px] font-bold text-primary">
                PropTech Financial & Land Tools
              </h3>
              <p className="font-code-spec text-[10px] text-secondary">
                100% Free • Direct C2C Real Estate Calculators
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-2.5 bg-surface-container-low border-b border-surface-container">
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-surface-container-lowest border border-surface-container text-xs">
            <button
              type="button"
              onClick={() => setActiveTool("emi")}
              className={`py-2 px-2 rounded-lg font-bold transition flex items-center justify-center gap-1 text-[11px] ${
                activeTool === "emi"
                  ? "bg-primary text-surface shadow-xs"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">calculate</span>
              <span>Loan EMI</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool("land")}
              className={`py-2 px-2 rounded-lg font-bold transition flex items-center justify-center gap-1 text-[11px] ${
                activeTool === "land"
                  ? "bg-primary text-surface shadow-xs"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">square_foot</span>
              <span>Gaj / Bigha</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool("eligibility")}
              className={`py-2 px-2 rounded-lg font-bold transition flex items-center justify-center gap-1 text-[11px] ${
                activeTool === "eligibility"
                  ? "bg-primary text-surface shadow-xs"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">account_balance</span>
              <span>Eligibility</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {activeTool === "emi" && (
            <div className="animate-in fade-in duration-150">
              <HomeLoanEMICalculator propertyPrice={propertyPrice} />
            </div>
          )}

          {activeTool === "land" && (
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container flex flex-col gap-3.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="font-code-spec text-[11px] font-bold text-primary uppercase">
                  Regional Land Measurement Converter
                </span>
                <span className="text-[10px] text-secondary font-code-spec font-bold">
                  1 Gaj = 9 Sq.Ft
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
                {/* Input Value */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-on-surface-variant font-code-spec uppercase font-bold">Area Value</label>
                  <input 
                    type="number"
                    value={areaVal}
                    onChange={(e) => setAreaVal(e.target.value)}
                    className="w-full bg-surface-container-low text-primary p-2.5 rounded-xl font-bold text-sm focus:outline-none border border-surface-container"
                    placeholder="e.g. 1000"
                  />
                </div>

                {/* From Unit */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-on-surface-variant font-code-spec uppercase font-bold">From Unit</label>
                  <select 
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full bg-surface-container-low text-primary p-2.5 rounded-xl text-xs font-semibold focus:outline-none border border-surface-container"
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
                  <label className="text-[10px] text-on-surface-variant font-code-spec uppercase font-bold">To Unit</label>
                  <select 
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full bg-surface-container-low text-primary p-2.5 rounded-xl text-xs font-semibold focus:outline-none border border-surface-container"
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

              {/* Result Card */}
              <div className="p-3 rounded-xl bg-tertiary-fixed/30 border border-tertiary-fixed/40 flex items-center justify-between text-on-tertiary-fixed">
                <span className="font-body-sm text-xs font-medium">Converted Area:</span>
                <span className="font-headline-sm text-base font-extrabold text-primary">
                  {convertedResult.toLocaleString("en-IN")} {toUnit.replace("_pucca", " (पक्का)").replace("_kaccha", " (कच्चा)").toUpperCase()}
                </span>
              </div>

              {/* Conversion Reference Cheat Sheet */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 text-[10px] font-code-spec text-on-surface-variant">
                <div className="p-1.5 rounded-lg bg-surface-container-low border border-surface-container">
                  <strong>1 Gaj:</strong> 9 Sq.Ft
                </div>
                <div className="p-1.5 rounded-lg bg-surface-container-low border border-surface-container">
                  <strong>1 Bigha (Pucca):</strong> 3,025 Gaj
                </div>
                <div className="p-1.5 rounded-lg bg-surface-container-low border border-surface-container">
                  <strong>1 Bigha (Kaccha):</strong> 1,008 Gaj
                </div>
                <div className="p-1.5 rounded-lg bg-surface-container-low border border-surface-container">
                  <strong>1 Guntha:</strong> 1,089 Sq.Ft
                </div>
                <div className="p-1.5 rounded-lg bg-surface-container-low border border-surface-container">
                  <strong>1 Kanal:</strong> 605 Gaj
                </div>
                <div className="p-1.5 rounded-lg bg-surface-container-low border border-surface-container">
                  <strong>1 Acre:</strong> 4,840 Gaj
                </div>
              </div>
            </div>
          )}

          {activeTool === "eligibility" && (
            <div className="animate-in fade-in duration-150">
              <HomeLoanEligibilityCalculator />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
