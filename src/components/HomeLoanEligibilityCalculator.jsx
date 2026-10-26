import React, { useState, useMemo } from "react";
import { calculateHomeLoanEligibility } from "../services/indianRealEstateCalculatorService";

export default function HomeLoanEligibilityCalculator({ className = "" }) {
  const [monthlySalary, setMonthlySalary] = useState(65000);
  const [existingEmis, setExistingEmis] = useState(5000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const eligibilityResult = useMemo(() => {
    return calculateHomeLoanEligibility(monthlySalary, existingEmis, interestRate, tenureYears);
  }, [monthlySalary, existingEmis, interestRate, tenureYears]);

  return (
    <div className={`p-3.5 rounded-2xl bg-surface-container-low border border-surface-container shadow-xs flex flex-col gap-3.5 ${className}`}>
      {/* Header Result Callout */}
      <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container flex flex-col gap-1 text-center shadow-xs">
        <span className="font-code-spec text-[10.5px] uppercase tracking-wider text-on-surface-variant font-bold">
          Estimated Maximum Loan Eligibility
        </span>
        <div className="font-headline-sm text-2xl font-black text-primary">
          {eligibilityResult.eligibleLoanFormatted}
        </div>
        <div className="flex items-center justify-center gap-2 text-[11px] font-code-spec text-secondary font-semibold">
          <span>Max Monthly EMI: {eligibilityResult.maxEmiFormatted}</span>
          <span>•</span>
          <span>50% FOIR Standard</span>
        </div>
      </div>

      {/* Sliders Cluster */}
      <div className="flex flex-col gap-3 text-xs">
        {/* Slider 1: Monthly Net In-Hand Salary */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between font-code-spec">
            <span className="text-on-surface-variant uppercase text-[10px] font-bold">Net Monthly Salary</span>
            <span className="font-bold text-primary text-[12px]">
              ₹{(monthlySalary / 1000).toFixed(0)}k ({monthlySalary >= 100000 ? `₹${(monthlySalary / 100000).toFixed(2)}L` : `₹${monthlySalary.toLocaleString("en-IN")}`})
            </span>
          </div>
          <input 
            type="range"
            min={15000}
            max={500000}
            step={5000}
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(Number(e.target.value))}
            className="w-full accent-primary h-1.5 bg-surface-container-highest rounded-lg cursor-pointer"
          />
        </div>

        {/* Slider 2: Existing Monthly EMIs */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between font-code-spec">
            <span className="text-on-surface-variant uppercase text-[10px] font-bold">Existing Monthly EMIs</span>
            <span className="font-bold text-secondary text-[12px]">
              ₹{existingEmis.toLocaleString("en-IN")} / mo
            </span>
          </div>
          <input 
            type="range"
            min={0}
            max={100000}
            step={1000}
            value={existingEmis}
            onChange={(e) => setExistingEmis(Number(e.target.value))}
            className="w-full accent-secondary h-1.5 bg-surface-container-highest rounded-lg cursor-pointer"
          />
        </div>

        {/* Slider 3: Loan Tenure */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between font-code-spec">
            <span className="text-on-surface-variant uppercase text-[10px] font-bold">Loan Tenure</span>
            <span className="font-bold text-primary text-[12px]">{tenureYears} Years</span>
          </div>
          <input 
            type="range"
            min={5}
            max={30}
            step={1}
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full accent-primary h-1.5 bg-surface-container-highest rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Banking Context Note */}
      <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container text-[10.5px] font-body-sm text-on-surface-variant leading-relaxed">
        💡 <strong>Banking Rule:</strong> Indian banks (SBI, HDFC, ICICI) generally limit total loan repayments to 50% of your net monthly income (Fixed Obligation to Income Ratio).
      </div>
    </div>
  );
}
