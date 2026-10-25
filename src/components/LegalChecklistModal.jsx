import React from "react";

export default function LegalChecklistModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const steps = [
    {
      num: "01",
      title: "Mother Deed & Chain of Title (30 Years)",
      desc: "Verify unbroken chain of title documents for the past 30 years to confirm legal ancestral succession and lawful transfers."
    },
    {
      num: "02",
      title: "Form 15 Nil Encumbrance Certificate",
      desc: "Procure Form 15 Encumbrance Certificate from the Sub-Registrar Office to verify there are zero outstanding bank mortgages, liens, or court injunctions."
    },
    {
      num: "03",
      title: "Municipal Khata & Tax Receipts",
      desc: "Confirm A-Khata / Municipal Mutation entry in seller's name and ensure property tax is fully cleared for the current financial year."
    },
    {
      num: "04",
      title: "Sanctioned Plan & Occupancy Certificate (OC)",
      desc: "Ensure the building layout complies with sanctioned municipal drawings with valid OC, preventing illegal floor penalties."
    },
    {
      num: "05",
      title: "RERA Registration Check",
      desc: "Verify project RERA registration number and quarterly project filing reports on state RERA portal."
    },
    {
      num: "06",
      title: "Society NOC & Maintenance Clearance",
      desc: "Procure written No-Objection Certificate from the Resident Welfare Association (RWA) verifying no unpaid maintenance."
    },
    {
      num: "07",
      title: "In-Person Sub-Registrar Biometric Signing",
      desc: "Execute the sale deed strictly in presence of both parties at the official Sub-Registrar office. Never transfer token advances online prior to this step."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-surface p-6 shadow-2xl border border-surface-container max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">fact_check</span>
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
              Legal Deed Due Diligence: 7 Steps
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {steps.map(step => (
            <div key={step.num} className="p-3 rounded-xl bg-surface-container-low shadow-xs flex items-start gap-3">
              <span className="font-code-spec text-[12px] font-bold text-secondary bg-surface-container px-2 py-1 rounded">
                {step.num}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="font-label-lg text-label-lg text-primary font-bold">{step.title}</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 p-3 rounded-xl bg-error-container text-on-error-container flex items-center gap-2">
          <span className="material-symbols-outlined text-error text-[20px] shrink-0">shield</span>
          <p className="font-body-sm text-[11px] font-semibold leading-tight">
            Esets Zero Token Policy: Never transfer token money via UPI or netbanking before in-person verification.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-primary-container text-secondary-container font-label-lg font-bold"
        >
          Got It, Close Checklist
        </button>
      </div>
    </div>
  );
}
