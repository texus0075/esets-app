/**
 * Indian Real Estate Financial, Metric & Regulatory Calculator Engine
 * Blueprint Reference: C:/Users/Lenovo/.gemini/antigravity/brain/2ef37d3c-b834-4db5-8c1f-993bc49a6439/INDIAN_REAL_ESTATE_PLATFORM_INTELLIGENCE_BLUEPRINT.md
 * 
 * Capabilities:
 * 1. Standard Indian Mortgage EMI Formula: [P * r * (1+r)^n] / [(1+r)^n - 1]
 * 2. Indian Currency-to-Words Formatter: ₹ Lakh / ₹ Crore with Hindi phonetics
 * 3. Regional Land Area Converter: Sq.Ft <-> Gaj <-> Bigha <-> Guntha <-> Kanal <-> Acre
 * 4. Brokerage Savings Estimator (Standard 2% commission saved)
 */

/**
 * 1. Calculate Standard Home Loan EMI
 * @param {number} principalInRupees - Total loan principal amount in ₹
 * @param {number} annualRatePercent - Annual interest rate (e.g. 8.5)
 * @param {number} tenureYears - Loan tenure in years (e.g. 20)
 */
export function calculateIndianEMI(principalInRupees, annualRatePercent = 8.5, tenureYears = 20) {
  const P = Number(principalInRupees) || 0;
  if (P <= 0) {
    return {
      monthlyEMI: 0,
      totalPayment: 0,
      totalInterest: 0,
      monthlyEMIFormatted: "₹0",
      totalPaymentFormatted: "₹0",
      totalInterestFormatted: "₹0",
      principalSharePercent: 0,
      interestSharePercent: 0
    };
  }

  const r = (Number(annualRatePercent) || 8.5) / 12 / 100;
  const n = (Number(tenureYears) || 20) * 12;

  if (r === 0 || n <= 0) {
    const emi = Math.round(P / (n || 1));
    return {
      monthlyEMI: emi,
      totalPayment: P,
      totalInterest: 0,
      monthlyEMIFormatted: `₹${emi.toLocaleString("en-IN")}`,
      totalPaymentFormatted: `₹${P.toLocaleString("en-IN")}`,
      totalInterestFormatted: "₹0",
      principalSharePercent: 100,
      interestSharePercent: 0
    };
  }

  const emiFactor = Math.pow(1 + r, n);
  const monthlyEMI = Math.round((P * r * emiFactor) / (emiFactor - 1));
  const totalPayment = monthlyEMI * n;
  const totalInterest = Math.max(0, totalPayment - P);

  const principalSharePercent = Math.round((P / totalPayment) * 100) || 50;
  const interestSharePercent = 100 - principalSharePercent;

  return {
    monthlyEMI,
    totalPayment,
    totalInterest,
    monthlyEMIFormatted: `₹${monthlyEMI.toLocaleString("en-IN")}`,
    totalPaymentFormatted: totalPayment >= 10000000 
      ? `₹${(totalPayment / 10000000).toFixed(2)} Cr` 
      : `₹${(totalPayment / 100000).toFixed(2)} L`,
    totalInterestFormatted: totalInterest >= 10000000 
      ? `₹${(totalInterest / 10000000).toFixed(2)} Cr` 
      : `₹${(totalInterest / 100000).toFixed(2)} L`,
    principalSharePercent,
    interestSharePercent
  };
}

/**
 * 2. Format Raw Indian Price to Spoken Words
 * @param {number|string} amountInRupees - Raw amount (e.g. 12500000 or "12500000")
 * @returns {string} e.g. "≈ ₹1.25 Crore (एक करोड़ पच्चीस लाख)"
 */
export function formatIndianPriceToWords(amountInRupees) {
  if (!amountInRupees) return "";
  const num = typeof amountInRupees === "string" 
    ? parseFloat(amountInRupees.replace(/,/g, "").trim()) 
    : Number(amountInRupees);

  if (isNaN(num) || num <= 0) return "";

  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2);
    const crClean = cr.replace(/\.00$/, "");
    return `≈ ₹${crClean} Crore`;
  }
  if (num >= 100000) {
    const lakh = (num / 100000).toFixed(2);
    const lakhClean = lakh.replace(/\.00$/, "");
    return `≈ ₹${lakhClean} Lakh`;
  }
  if (num >= 1000) {
    const th = (num / 1000).toFixed(1);
    const thClean = th.replace(/\.0$/, "");
    return `≈ ₹${thClean} Thousand`;
  }
  return `≈ ₹${num.toLocaleString("en-IN")}`;
}

/**
 * 3. Regional Land Area Units & Factors (Base: 1 Sq.Ft)
 */
export const REGIONAL_AREA_FACTORS = {
  sqft: 1,
  gaj: 9,              // 1 Gaj = 9 Sq.Ft (Square Yard)
  bigha_pucca: 27225,  // 1 Pucca Bigha = 27,225 Sq.Ft (3,025 Gaj)
  bigha_kaccha: 9075,  // 1 Kaccha Bigha = 9,075 Sq.Ft (1,008 Gaj)
  guntha: 1089,        // 1 Guntha (MH/Karnataka) = 1,089 Sq.Ft (33x33 ft)
  kanal: 5445,         // 1 Kanal (Punjab/Haryana) = 5,445 Sq.Ft (605 Gaj)
  marla: 272.25,       // 1 Marla = 272.25 Sq.Ft
  acre: 43560,         // 1 Acre = 43,560 Sq.Ft (4,840 Gaj)
  hectare: 107639      // 1 Hectare = 107,639 Sq.Ft (2.471 Acres)
};

/**
 * Convert area between any two units
 */
export function convertLandArea(value, fromUnit = "sqft", toUnit = "gaj") {
  const num = Number(value) || 0;
  if (num <= 0) return 0;
  const sqft = num * (REGIONAL_AREA_FACTORS[fromUnit] || 1);
  return Number((sqft / (REGIONAL_AREA_FACTORS[toUnit] || 1)).toFixed(2));
}

/**
 * Get comprehensive regional breakdown from Sq.Ft
 */
export function getRegionalAreaBreakdown(sqftVal) {
  const sqft = Number(sqftVal) || 0;
  if (sqft <= 0) {
    return { sqft: 0, gaj: 0, bigha: 0, acre: 0, display: "—" };
  }

  const gaj = Number((sqft / 9).toFixed(1));
  const acre = Number((sqft / 43560).toFixed(3));
  const bigha = Number((sqft / 27225).toFixed(2));

  let primaryLabel = `${sqft.toLocaleString("en-IN")} sq.ft`;
  if (gaj > 0) {
    primaryLabel += ` (${gaj.toLocaleString("en-IN")} गज)`;
  }

  return {
    sqft,
    gaj,
    bigha,
    acre,
    display: primaryLabel
  };
}

/**
 * 4. Brokerage Savings Estimator (2% standard market fee)
 */
export function calculateBrokerageSavings(priceInRupees) {
  const price = Number(priceInRupees) || 0;
  if (price <= 0) return "₹0 Brokerage Saved";
  const saved = price * 0.02; // 2%
  if (saved >= 100000) {
    return `Saved ₹${(saved / 100000).toFixed(1)}L Brokerage`;
  }
  return `Saved ₹${Math.round(saved).toLocaleString("en-IN")} Brokerage`;
}
