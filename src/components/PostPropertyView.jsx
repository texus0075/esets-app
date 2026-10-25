import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function PostPropertyView({ onBack, onAddProperty }) {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [dealType, setDealType] = useState("Sale");
  const [category, setCategory] = useState("Apartment");
  const [title, setTitle] = useState("Spacious 3 BHK Sunlit Penthouse with Private Terrace");
  const [priceNum, setPriceNum] = useState("2.85");
  const [priceUnit, setPriceUnit] = useState("Cr");
  const [superArea, setSuperArea] = useState("2150");
  const [bhk, setBhk] = useState("3");
  const [bathrooms, setBathrooms] = useState("3");
  const [furnishing, setFurnishing] = useState("Semi-Furnished");

  // Step 2 State
  const [stateName, setStateName] = useState("Karnataka");
  const [district, setDistrict] = useState("Indiranagar BLR");
  const [locality, setLocality] = useState("Indiranagar 100ft Road");
  const [pincode, setPincode] = useState("560038");

  // Step 3 State
  const [imageUrl, setImageUrl] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuCV-_a25YQvnTI8Tv1GvQj6_8bcaTVs10sFXtJMtbaJJC0eGW4Dfvix2xtse6Kgpi2j96cgyY6XxbwopzEdu3SNbwAYs9I8kRDIAiS0OS-kHQYZpd5AWLuVrZEw6HggnTUSJ_hprFqd4orACpFRNlNpIWevtxMVwszm9YvMD_phbDx9JDVEGr16N_Evw4oWSGKG-YNSmi7nwDk4zhyOB9WkJRtUbMBX54P_3F9l-w");
  const [sellerName, setSellerName] = useState(currentUser?.displayName || "Vikramaditya Rao");
  const [sellerPhone, setSellerPhone] = useState(currentUser?.phoneNumber || "+91 98800 12345");
  const [callingHours, setCallingHours] = useState("9:00 AM – 8:30 PM");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !priceNum || !locality) {
      alert("Please fill in the required property details.");
      return;
    }

    const calculatedPrice = priceUnit === "Cr" 
      ? parseFloat(priceNum) * 10000000 
      : parseFloat(priceNum) * 100000;

    const formattedPriceUnit = priceUnit === "Cr" 
      ? `₹${priceNum} Cr` 
      : `₹${priceNum} Lakh`;

    const newProperty = {
      title,
      category,
      dealType,
      price: calculatedPrice,
      priceUnit: formattedPriceUnit,
      area: parseInt(superArea) || 1200,
      carpetArea: Math.round((parseInt(superArea) || 1200) * 0.82),
      bhk: parseInt(bhk) || 2,
      bathrooms: parseInt(bathrooms) || 2,
      state: stateName,
      district,
      locality,
      pincode,
      description: "Direct owner listing with zero brokerage. Inspected and registered clear freehold deed. Genuine buyers welcome for weekend site inspection.",
      images: [imageUrl],
      sellerName,
      sellerPhone,
      sellerType: "Verified Direct Owner",
      isSold: false,
      verifiedOwner: true,
      has360: false,
      furnishing,
      floorLevel: "3rd Floor",
      coords: "12.9784° N, 77.6408° E",
      callingHours
    };

    onAddProperty(newProperty);
    onBack();
  };

  return (
    <div className="flex-1 w-full bg-surface pt-16 pb-28 min-w-0 max-w-2xl mx-auto">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(27,36,22,0.05)] pt-safe border-b border-surface-container">
        <div className="h-16 px-gutter-mobile flex items-center justify-between gap-space-xs max-w-2xl mx-auto">
          <div className="flex items-center gap-space-xs">
            <button 
              aria-label="Go back" 
              onClick={onBack}
              className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container active:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
            </button>
            <img 
              alt="Esets Brand Logo" 
              className="h-7 w-auto object-contain" 
              src="https://lh3.googleusercontent.com/aida/AEtjO1XQuJitb0ZaeFEpPEE7bRlZ8NHRS7l9MYJZoOF-4ktjwKDEJaHFmthMrRi92yLk9N3Z_48CDmX8S0aNhbjPx79Oox_CXu8iXG0I0F0nYUUoAHRKfDRmq8MmEd4saiOw9hz4vIGfVCc9UQd2eaVsBqFePN8JD4V1o23q2ytQRmBCtPEieHEiRJM0QLn8TUYXh_dkTv2zmdbl9HfqZKnj5N1VJWXJbnT6sQld12Or6mg"
            />
            <h1 className="font-headline-sm text-headline-sm text-primary tracking-tight truncate max-w-[160px]">
              Post Free
            </h1>
          </div>
          <div className="flex items-center gap-space-xs">
            <div className="inline-flex items-center px-2 py-0.5 rounded bg-primary-container text-secondary-container font-code-spec text-code-spec">
              <span className="font-semibold text-[10px] uppercase tracking-wide">0% Brok.</span>
            </div>
            <img 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDNEqxzKN8N_FTKYy49cYmujcbjsHKlO2JDm3tnzbz-IPGetcxCQ2hY-XGZnuKb2YeHYIY7sNC-ndonG2pqPJtbVXlTJitdzg2ouVetF3eshofzPIue5omHHtKh-GS8fySWsM7O7cwLDUGhPSUjrH-T2w-vP9Ng1q0DP5qmjlLvHjDPe-o4kGlnOtMoOcWIRsC3jSi9nLYPHKO8BUVrmvgiBC7H8mrYYEe-4kFQg"
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-col w-full pb-safe">
        {/* Value Banner */}
        <div className="px-gutter-mobile pt-space-md pb-space-sm">
          <div className="flex items-center gap-space-xs mb-space-xs">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary text-secondary-fixed font-code-spec text-code-spec">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span>PEER-TO-PEER DIRECT</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-code-spec text-code-spec">
              <span className="material-symbols-outlined text-[13px]">lock</span>
              <span>SPAM SHIELD ON</span>
            </span>
          </div>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">
            List Your Property in 2 Minutes — 100% Free, Zero Brokerage.
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
            Direct C2C connection with genuine verified buyers. Keep full privacy with our 1-tap <strong className="text-primary font-semibold">“Sold It” Call Shield</strong>.
          </p>

          {/* 3-Step Dynamic Stepper */}
          <div className="mt-space-md bg-surface-container rounded-xl p-space-sm shadow-sm">
            <div className="grid grid-cols-3 gap-space-xs">
              <button 
                onClick={() => setCurrentStep(1)}
                className={`step-nav flex flex-col items-center py-space-xs px-1 rounded-lg text-center transition-all ${
                  currentStep === 1 
                    ? "bg-surface-container-lowest shadow-sm text-primary" 
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-code-spec text-[11px] mb-1 font-bold ${
                  currentStep === 1 ? "bg-primary text-surface" : "bg-surface-variant text-on-surface"
                }`}>1</div>
                <span className="font-label-md text-label-md truncate w-full">Pricing & Specs</span>
              </button>

              <button 
                onClick={() => setCurrentStep(2)}
                className={`step-nav flex flex-col items-center py-space-xs px-1 rounded-lg text-center transition-all ${
                  currentStep === 2 
                    ? "bg-surface-container-lowest shadow-sm text-primary" 
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-code-spec text-[11px] mb-1 font-bold ${
                  currentStep === 2 ? "bg-primary text-surface" : "bg-surface-variant text-on-surface"
                }`}>2</div>
                <span className="font-label-md text-label-md truncate w-full">Location Pin</span>
              </button>

              <button 
                onClick={() => setCurrentStep(3)}
                className={`step-nav flex flex-col items-center py-space-xs px-1 rounded-lg text-center transition-all ${
                  currentStep === 3 
                    ? "bg-surface-container-lowest shadow-sm text-primary" 
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-code-spec text-[11px] mb-1 font-bold ${
                  currentStep === 3 ? "bg-primary text-surface" : "bg-surface-variant text-on-surface"
                }`}>3</div>
                <span className="font-label-md text-label-md truncate w-full">Media & Shield</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-surface-container-highest h-1 rounded-full mt-space-xs overflow-hidden">
              <div 
                className="bg-secondary h-full transition-all duration-300"
                style={{ width: currentStep === 1 ? '33.3%' : currentStep === 2 ? '66.6%' : '100%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* STEP 1: PRICING & SPECS */}
        {currentStep === 1 && (
          <div className="px-gutter-mobile flex flex-col gap-space-md">
            {/* Deal Type Selector */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-lg text-label-lg text-primary uppercase tracking-wide">Deal Intent</span>
                <span className="font-code-spec text-[10px] text-on-surface-variant">No listing commission</span>
              </div>
              <div className="grid grid-cols-2 gap-space-xs">
                <button
                  type="button"
                  onClick={() => setDealType("Sale")}
                  className={`w-full py-2.5 px-3 rounded-lg text-center font-label-lg text-label-lg transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                    dealType === "Sale" 
                      ? "bg-primary-container text-secondary-container font-bold" 
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">real_estate_agent</span>
                  <span>Sale (Sell Property)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDealType("Rent")}
                  className={`w-full py-2.5 px-3 rounded-lg text-center font-label-lg text-label-lg transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                    dealType === "Rent" 
                      ? "bg-primary-container text-secondary-container font-bold" 
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">vpn_key</span>
                  <span>Rent / Lease</span>
                </button>
              </div>
            </div>

            {/* Property Category */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm">
              <label className="font-label-lg text-label-lg text-primary uppercase tracking-wide">Property Category</label>
              <div className="grid grid-cols-2 gap-space-xs">
                {[
                  { id: "Apartment", label: "Apartment / Flat", icon: "apartment" },
                  { id: "Villa", label: "House / Villa", icon: "villa" },
                  { id: "Plot", label: "Residential Plot", icon: "terrain" },
                  { id: "Commercial", label: "Commercial Space", icon: "storefront" }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2.5 rounded-lg text-left transition-all flex flex-col items-start gap-1 ${
                      category === cat.id 
                        ? "bg-primary text-on-primary font-semibold shadow-xs" 
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                    <span className="font-label-md text-label-md">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Price */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase">Property Headline / Title</label>
                <input 
                  className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-3 rounded-lg focus:outline-none focus:bg-surface-container-lowest transition-colors shadow-inner"
                  placeholder="e.g. Architect-designed corner home with lush garden"
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Price & Unit */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase">Expected Price</label>
                  <span className="font-code-spec text-[11px] text-secondary">Fair price = 4x faster inquiries</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-on-surface-variant font-code-spec text-code-spec">₹</span>
                    <input 
                      className="w-full bg-surface-container-low text-primary font-headline-sm text-headline-sm pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container-lowest transition-colors shadow-inner"
                      type="text" 
                      value={priceNum}
                      onChange={(e) => setPriceNum(e.target.value)}
                    />
                  </div>
                  <div className="flex bg-surface-container-low p-1 rounded-lg">
                    <button 
                      type="button"
                      onClick={() => setPriceUnit("Cr")}
                      className={`px-3 py-2 rounded font-label-md text-label-md transition-all ${
                        priceUnit === "Cr" ? "bg-primary text-on-primary font-bold" : "text-on-surface-variant"
                      }`}
                    >
                      Crores (Cr)
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPriceUnit("L")}
                      className={`px-3 py-2 rounded font-label-md text-label-md transition-all ${
                        priceUnit === "L" ? "bg-primary text-on-primary font-bold" : "text-on-surface-variant"
                      }`}
                    >
                      Lakhs (L)
                    </button>
                  </div>
                </div>

                {/* Market Value Insight */}
                <div className="bg-tertiary-fixed/30 p-2.5 rounded-lg flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1.5 text-on-tertiary-fixed">
                    <span className="material-symbols-outlined text-[16px]">insights</span>
                    <span className="font-code-spec text-[11px]">Locality Radar Value: ₹2.70 – ₹2.95 Cr</span>
                  </div>
                  <span className="font-code-spec text-[10px] text-on-tertiary-fixed font-semibold px-1.5 py-0.5 rounded bg-tertiary-fixed">
                    Sweet Spot
                  </span>
                </div>
              </div>

              {/* Specs: Area & BHK */}
              <div className="grid grid-cols-2 gap-space-xs">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase">Super Built-up</label>
                  <div className="relative">
                    <input 
                      className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-2.5 pr-12 rounded-lg focus:outline-none shadow-inner"
                      type="number"
                      value={superArea}
                      onChange={(e) => setSuperArea(e.target.value)}
                    />
                    <span className="absolute right-3 top-2.5 font-code-spec text-[11px] text-on-surface-variant">sq.ft</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase">Configuration</label>
                  <select 
                    value={bhk}
                    onChange={(e) => setBhk(e.target.value)}
                    className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-2.5 rounded-lg focus:outline-none shadow-inner"
                  >
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4+ BHK</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="w-full py-3 px-4 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(213,129,15,0.35)] active:scale-[0.99] transition-transform"
            >
              <span>Continue to Location Pin (Step 2)</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        )}

        {/* STEP 2: LOCATION PIN */}
        {currentStep === 2 && (
          <div className="px-gutter-mobile flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <span className="font-label-lg text-label-lg text-primary uppercase tracking-wide">Hyper-Local Pin</span>
                <span className="font-code-spec text-[10px] text-tertiary-fixed-dim bg-surface-container px-2 py-0.5 rounded">GPS Ready</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase">District / Micro-Market</label>
                <select 
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-3 rounded-lg focus:outline-none shadow-inner"
                >
                  <option value="South Delhi">South Delhi (DL)</option>
                  <option value="Indiranagar BLR">Indiranagar (BLR)</option>
                  <option value="Bandra West">Bandra West (MUM)</option>
                  <option value="Gachibowli">Gachibowli (HYD)</option>
                  <option value="DLF Phase 5">DLF Phase 5 (GGN)</option>
                  <option value="Koregaon Park">Koregaon Park (PUN)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase">Locality / Colony / Sector</label>
                <input 
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Indiranagar 100ft Road or Greater Kailash 1"
                  className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-3 rounded-lg focus:outline-none shadow-inner"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase">Pincode</label>
                <input 
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="110048"
                  className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-3 rounded-lg focus:outline-none shadow-inner"
                />
              </div>

              {/* Satellite Pin Preview */}
              <div className="rounded-xl overflow-hidden shadow-sm h-40 bg-surface-dim relative">
                <iframe
                  className="w-full h-full filter saturate-[1.1]"
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(locality + ', ' + district)}&t=k&z=15&output=embed`}
                  style={{ border: 0 }}
                  title="Satellite Pin Preview"
                ></iframe>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary/80 backdrop-blur-md text-surface font-code-spec text-[10px]">
                  Satellite Mode (t=k) Preview
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-1/3 py-3 px-3 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="w-2/3 py-3 px-4 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(213,129,15,0.35)]"
              >
                <span>Continue to Media (Step 3)</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: MEDIA & SHIELD */}
        {currentStep === 3 && (
          <div className="px-gutter-mobile flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <span className="font-label-lg text-label-lg text-primary uppercase tracking-wide">Media & Verification</span>
                <span className="font-code-spec text-[10px] text-secondary font-semibold">1-Tap Call Shield</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase">Property Image URL</label>
                <input 
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-3 rounded-lg focus:outline-none shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-space-xs">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase">Owner Name</label>
                  <input 
                    type="text"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-3 rounded-lg focus:outline-none shadow-inner"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase">Phone Number</label>
                  <input 
                    type="text"
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-3 rounded-lg focus:outline-none shadow-inner"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase">Calling Hours Gatekeeper</label>
                <input 
                  type="text"
                  value={callingHours}
                  onChange={(e) => setCallingHours(e.target.value)}
                  placeholder="9:00 AM – 8:30 PM"
                  className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-3 rounded-lg focus:outline-none shadow-inner"
                />
                <span className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">Calls outside these hours will automatically route to WhatsApp chat.</span>
              </div>

              {/* Zero Token Consent */}
              <label className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-container-low cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded accent-primary cursor-pointer"
                />
                <div className="min-w-0 flex-1">
                  <span className="font-label-md text-label-md text-primary font-bold">100% Zero Online Advance Agreement</span>
                  <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">
                    I agree never to ask for online token money, visiting fees, or UPI advances before in-person physical registry deed inspection.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-1/3 py-3 px-3 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-2/3 py-3 px-4 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(213,129,15,0.35)]"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Publish Free Direct Listing</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
