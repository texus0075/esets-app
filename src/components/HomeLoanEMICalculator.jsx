import React, { useState, useMemo } from "react";
import { calculateIndianEMI } from "../services/indianRealEstateCalculatorService";

export default function HomeLoanEMICalculator({ propertyPrice = 5000000, className = "" }) {
  const price = Number(propertyPrice) || 5000000;
  
  // Default loan amount is 80% of property value (standard bank LTV)
  const defaultLoanLakhs = Math.max(5, Math.round((price * 0.8) / 100000));
  const maxLoanLakhs = Math.max(10, Math.round(price / 100000));

  const [loanLakhs, setLoanLakhs] = useState(defaultLoanLakhs);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [isExpanded, setIsExpanded] = useState(false);

  const emiResult = useMemo(() => {
    return calculateIndianEMI(loanLakhs * 100000, interestRate, tenureYears);
  }, [loanLakhs, interestRate, tenureYears]);

  return (
    <div className={`p-3.5 rounded-2xl bg-surface-container-low border border-surface-container shadow-xs flex flex-col gap-3 ${className}`}>
      {/* Header with Monthly EMI Callout */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-[19px]">calculate</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-headline-sm text-[13.5px] font-bold text-primary">Home Loan EMI Estimate</h4>
              <span className="font-code-spec text-[9.5px] px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-bold">
                8.5% p.a.
              </span>
            </div>
            <p className="font-body-sm text-[11px] text-on-surface-variant">
              Starts at <strong className="text-secondary font-bold">{emiResult.monthlyEMIFormatted}</strong> / month
            </p>
          </div>
        </div>

        <button 
          type="button"
          aria-label="Toggle EMI Details"
          className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isExpanded ? "expand_less" : "tune"}
          </span>
        </button>
      </div>

      {/* Sliders & Visual Breakdown */}
      {isExpanded && (
        <div className="pt-2 border-t border-surface-container flex flex-col gap-3 animate-in fade-in duration-150">
          {/* Slider 1: Loan Amount */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs font-label-md">
              <span className="text-on-surface-variant">Loan Principal (80% LTV)</span>
              <span className="font-bold text-primary">₹{loanLakhs} Lakh</span>
            </div>
            <input 
              type="range"
              min="5"
              max={maxLoanLakhs}
              step="1"
              value={loanLakhs}
              onChange={(e) => setLoanLakhs(Number(e.target.value))}
              className="w-full accent-secondary cursor-pointer h-1.5 bg-surface-container rounded-lg"
            />
            <div className="flex justify-between text-[9.5px] text-on-surface-variant font-code-spec">
              <span>₹5L</span>
              <span>₹{maxLoanLakhs}L (Full Price)</span>
            </div>
          </div>

          {/* Slider 2: Interest Rate */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs font-label-md">
              <span className="text-on-surface-variant">Interest Rate (% p.a.)</span>
              <span className="font-bold text-primary">{interestRate}%</span>
            </div>
            <input 
              type="range"
              min="6.5"
              max="14.0"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-secondary cursor-pointer h-1.5 bg-surface-container rounded-lg"
            />
            <div className="flex justify-between text-[9.5px] text-on-surface-variant font-code-spec">
              <span>6.5% (Prime)</span>
              <span>14.0%</span>
            </div>
          </div>

          {/* Slider 3: Tenure */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs font-label-md">
              <span className="text-on-surface-variant">Loan Duration</span>
              <span className="font-bold text-primary">{tenureYears} Years</span>
            </div>
            <input 
              type="range"
              min="5"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-secondary cursor-pointer h-1.5 bg-surface-container rounded-lg"
            />
            <div className="flex justify-between text-[9.5px] text-on-surface-variant font-code-spec">
              <span>5 Yrs</span>
              <span>30 Yrs</span>
            </div>
          </div>

          {/* Ratio Progress Bar */}
          <div className="flex flex-col gap-1 pt-1">
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-surface-container">
              <div 
                className="bg-primary h-full transition-all"
                style={{ width: `${emiResult.principalSharePercent}%` }}
                title={`Principal: ${emiResult.principalSharePercent}%`}
              />
              <div 
                className="bg-secondary h-full transition-all"
                style={{ width: `${emiResult.interestSharePercent}%` }}
                title={`Interest: ${emiResult.interestSharePercent}%`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-on-surface-variant font-code-spec">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                Principal: ₹{loanLakhs}L
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span>
                Interest: {emiResult.totalInterestFormatted}
              </span>
            </div>
          </div>

          {/* Summary Metric Pills */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2 rounded-xl bg-surface-container-lowest border border-surface-container flex flex-col text-center">
              <span className="text-[10px] text-on-surface-variant font-code-spec">TOTAL PAYABLE</span>
              <span className="text-xs font-bold text-primary">{emiResult.totalPaymentFormatted}</span>
            </div>
            <div className="p-2 rounded-xl bg-surface-container-lowest border border-surface-container flex flex-col text-center">
              <span className="text-[10px] text-on-surface-variant font-code-spec">MONTHLY OUTFLOW</span>
              <span className="text-xs font-bold text-secondary">{emiResult.monthlyEMIFormatted}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
