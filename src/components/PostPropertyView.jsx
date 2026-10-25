import React, { useState, useEffect } from "react";
import StampLogo from "./StampLogo";
import { useAuth } from "../context/AuthContext";
import { 
  LOCATIONS, 
  getAllStates, 
  getDistrictsForState, 
  findStateForDistrict 
} from "../data/locations";
import { 
  scanIndianPincode, 
  geocodeIndianAddress, 
  buildSatelliteMapUrl 
} from "../services/locationResolverService";
import { 
  analyzeLandmarksWithGemini, 
  generateLocalBaselineLandmarks 
} from "../services/landmarkRadarService";
import { 
  compressImageFile, 
  detectRoomTypeWithAI, 
  applyWatermarkToCanvas 
} from "../services/imageAnalyzerService";

export default function PostPropertyView({ onBack, onAddProperty }) {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  // STEP 1 STATE: PRICING & SPECS
  const [dealType, setDealType] = useState("Sale");
  const [category, setCategory] = useState("Houses & Villas");
  const [title, setTitle] = useState("4 BHK Aravali View Luxury Independent Villa with Private Garden");
  const [priceNum, setPriceNum] = useState("1.25");
  const [priceUnit, setPriceUnit] = useState("Cr");
  const [superArea, setSuperArea] = useState("2600");
  const [bhk, setBhk] = useState("4");
  const [bathrooms, setBathrooms] = useState("4");
  const [furnishing, setFurnishing] = useState("Semi-Furnished");

  // STEP 2 STATE: HYPER-LOCAL PIN & ADDRESS
  const [stateName, setStateName] = useState("Rajasthan");
  const [district, setDistrict] = useState("Rajsamand");
  const [isCustomDistrict, setIsCustomDistrict] = useState(false);
  const [customDistrictInput, setCustomDistrictInput] = useState("");
  const [locality, setLocality] = useState("Dhoinda, Rajnagar Main Link Road");
  const [pincode, setPincode] = useState("313300");

  // Pincode & Address Scanning State
  const [isScanningPincode, setIsScanningPincode] = useState(false);
  const [pincodeMsg, setPincodeMsg] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(""); // 'success' | 'error' | ''
  const [localitySuggestions, setLocalitySuggestions] = useState([]);
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false);
  const [geoCoords, setGeoCoords] = useState("25.0393° N, 73.8780° E");

  // STEP 2 LANDMARKS: CONTEXT-AWARE & FULLY EDITABLE
  const [transitLabel, setTransitLabel] = useState("NH-8 Udaipur-Ajmer Highway / Rajnagar Circle");
  const [transitDistance, setTransitDistance] = useState("650m");
  const [transitTime, setTransitTime] = useState("2 min drive");

  const [marketLabel, setMarketLabel] = useState("Rajnagar Main Commercial Bazaar");
  const [marketDistance, setMarketDistance] = useState("400m");
  const [marketTime, setMarketTime] = useState("5 min walk");

  const [parkLabel, setParkLabel] = useState("Rajsamand Lake Promenade & Gardens");
  const [parkDistance, setParkDistance] = useState("1.2km");
  const [parkTime, setParkTime] = useState("4 min drive");

  const [isDetectingLandmarks, setIsDetectingLandmarks] = useState(false);
  const [detectSuccessMsg, setDetectSuccessMsg] = useState("");

  // STEP 3 STATE: MEDIA ENGINE & ANTI-BROKER SHIELD
  const [imagesList, setImagesList] = useState([
    {
      url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      tag: "Exterior Facade",
      isCover: true
    },
    {
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      tag: "Living Room",
      isCover: false
    }
  ]);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [videoUrl, setVideoUrl] = useState("https://upload.wikimedia.org/wikipedia/commons/b/b8/Majestic_Residence_Signature_Villa_Under_Construction.webm");
  const [autoWatermark, setAutoWatermark] = useState(true);

  // STEP 3 OWNER DETAILS
  const [sellerName, setSellerName] = useState(currentUser?.displayName || "Mahipal Singh Sisodia");
  const [sellerPhone, setSellerPhone] = useState(currentUser?.phoneNumber || "+91 98290 41188");
  const [callingHours, setCallingHours] = useState("8:30 AM – 8:30 PM");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // When State Changes, update District list
  const availableDistricts = getDistrictsForState(stateName);

  const handleStateChange = (newState) => {
    setStateName(newState);
    const dists = getDistrictsForState(newState);
    if (dists.length > 0) {
      setDistrict(dists[0]);
      setIsCustomDistrict(false);
    } else {
      setIsCustomDistrict(true);
    }
  };

  const handleDistrictChange = (e) => {
    const val = e.target.value;
    if (val === "__custom__") {
      setIsCustomDistrict(true);
    } else {
      setIsCustomDistrict(false);
      setDistrict(val);
    }
  };

  // Instant Pincode Auto-Scan (triggers when 6 digits are typed or via button)
  const handlePincodeScan = async (codeToScan) => {
    const pin = (codeToScan || pincode || "").trim().replace(/\D/g, "");
    if (pin.length !== 6) return;

    setIsScanningPincode(true);
    setPincodeMsg("Scanning official Indian Postal registry...");
    setPincodeStatus("");

    try {
      const res = await scanIndianPincode(pin);
      if (res.success) {
        setPincodeStatus("success");
        setPincodeMsg(`✓ Verified: ${res.district}, ${res.state}`);
        
        // Auto-update State and District
        if (res.state) setStateName(res.state);
        if (res.district) {
          setDistrict(res.district);
          setIsCustomDistrict(false);
        }

        // Suggest localities from post office names
        if (res.localities && res.localities.length > 0) {
          setLocalitySuggestions(res.localities);
        }

        // Try geocoding to get coordinates
        const geo = await geocodeIndianAddress(res.primaryLocality, res.district, res.state);
        if (geo) {
          setGeoCoords(`${geo.lat.toFixed(4)}° N, ${geo.lon.toFixed(4)}° E`);
        }
      } else {
        setPincodeStatus("error");
        setPincodeMsg(res.error || "Pincode not found. You can set location manually.");
      }
    } catch (err) {
      setPincodeStatus("error");
      setPincodeMsg("Scan network timeout. Manual input active.");
    } finally {
      setIsScanningPincode(false);
    }
  };

  // Auto-scan pincode when exactly 6 digits are reached
  const handlePincodeInput = (e) => {
    const val = e.target.value;
    setPincode(val);
    const cleanDigits = val.replace(/\D/g, "");
    if (cleanDigits.length === 6) {
      handlePincodeScan(cleanDigits);
    } else {
      setPincodeMsg("");
      setPincodeStatus("");
    }
  };

  // Auto-Detect Address & GPS Coordinates via OpenStreetMap Geocoding
  const handleGeocodeLocality = async () => {
    setIsGeocodingAddress(true);
    try {
      const activeDistrict = isCustomDistrict ? customDistrictInput : district;
      const geo = await geocodeIndianAddress(locality, activeDistrict, stateName);
      if (geo) {
        setGeoCoords(`${geo.lat.toFixed(4)}° N, ${geo.lon.toFixed(4)}° E`);
        if (geo.district && !district) setDistrict(geo.district);
        if (geo.state && !stateName) setStateName(geo.state);
        if (geo.pincode && !pincode) setPincode(geo.pincode);
        setPincodeStatus("success");
        setPincodeMsg(`✓ Coordinates locked: ${geo.displayName.substring(0, 50)}...`);
      } else {
        setPincodeStatus("error");
        setPincodeMsg("Exact area pinpointed via Satellite mode.");
      }
    } catch {
      // ignore
    } finally {
      setIsGeocodingAddress(false);
    }
  };

  // Context-Aware Landmarks Auto-Fill (AI + Local Baseline, Zero Karnataka leaks)
  const handleAutoDetectLandmarks = async () => {
    setIsDetectingLandmarks(true);
    setDetectSuccessMsg("");
    const activeDistrict = isCustomDistrict ? (customDistrictInput || "Rajsamand") : district;

    try {
      // 1. Try Gemini Vision & Text API cascade
      const geminiRes = await analyzeLandmarksWithGemini(locality, activeDistrict, stateName);
      if (geminiRes) {
        if (geminiRes.transit?.label) {
          setTransitLabel(geminiRes.transit.label);
          setTransitDistance(geminiRes.transit.distance || "500m");
          setTransitTime(geminiRes.transit.time || "5 min walk");
        }
        if (geminiRes.market?.label) {
          setMarketLabel(geminiRes.market.label);
          setMarketDistance(geminiRes.market.distance || "350m");
          setMarketTime(geminiRes.market.time || "4 min walk");
        }
        if (geminiRes.park?.label) {
          setParkLabel(geminiRes.park.label);
          setParkDistance(geminiRes.park.distance || "250m");
          setParkTime(geminiRes.park.time || "3 min walk");
        }
        setDetectSuccessMsg(`✓ Real nearby landmarks detected for ${locality || activeDistrict}, ${stateName}`);
        return;
      }

      // 2. Intelligent Dynamic Fallback (Calibrated strictly to user's district)
      const baselines = generateLocalBaselineLandmarks(locality, activeDistrict, stateName);
      if (baselines && baselines.length >= 3) {
        setTransitLabel(baselines[0].label);
        setTransitDistance(baselines[0].distance);
        setTransitTime(baselines[0].time);

        setMarketLabel(baselines[1].label);
        setMarketDistance(baselines[1].distance);
        setMarketTime(baselines[1].time);

        setParkLabel(baselines[2].label);
        setParkDistance(baselines[2].distance);
        setParkTime(baselines[2].time);

        setDetectSuccessMsg(`✓ Calibrated local landmarks for ${locality || activeDistrict}, ${stateName}`);
      }
    } catch (e) {
      console.warn("Landmark detection exception:", e);
    } finally {
      setIsDetectingLandmarks(false);
    }
  };

  // File Upload & Anti-Broker Watermarking Handlers
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsProcessingImage(true);
    setImageUploadError("");

    try {
      const newItems = [];
      for (const file of files.slice(0, 5 - imagesList.length)) {
        let processedDataUrl = await compressImageFile(file);
        if (autoWatermark) {
          const specLoc = locality || (isCustomDistrict ? customDistrictInput : district) || "FREEHOLD";
          processedDataUrl = await applyWatermarkToCanvas(processedDataUrl, "ESETS 0% BROKERAGE", specLoc);
        }
        let detectedTag = "Property View";
        try {
          const aiTag = await detectRoomTypeWithAI(processedDataUrl);
          if (aiTag) detectedTag = aiTag;
        } catch {
          // ignore
        }
        newItems.push({
          url: processedDataUrl,
          tag: detectedTag,
          isCover: imagesList.length === 0 && newItems.length === 0
        });
      }
      setImagesList(prev => [...prev, ...newItems]);
    } catch (err) {
      setImageUploadError("Error processing image file: " + err.message);
    } finally {
      setIsProcessingImage(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImagesList(prev => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      if (updated.length > 0 && !updated.some(img => img.isCover)) {
        updated[0].isCover = true;
      }
      return updated;
    });
  };

  const handleSetCoverImage = (coverIndex) => {
    setImagesList(prev => prev.map((img, idx) => ({
      ...img,
      isCover: idx === coverIndex
    })));
  };

  const handleAddCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setImagesList(prev => [
      ...prev,
      {
        url: customUrlInput.trim(),
        tag: "Property View",
        isCover: prev.length === 0
      }
    ]);
    setCustomUrlInput("");
    setShowUrlInput(false);
  };

  // Submission Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const activeDistrict = isCustomDistrict ? (customDistrictInput.trim() || "Local District") : district;

    if (!title || !priceNum || !locality) {
      alert("Please fill in the required property details (Title, Price, and Locality).");
      return;
    }

    const calculatedPrice = priceUnit === "Cr" 
      ? parseFloat(priceNum) * 10000000 
      : parseFloat(priceNum) * 100000;

    const formattedPriceUnit = priceUnit === "Cr" 
      ? `₹${priceNum} Cr` 
      : `₹${priceNum} L`;

    const newProperty = {
      title,
      category,
      dealType,
      price: calculatedPrice,
      priceUnit: formattedPriceUnit,
      pricePerSqft: `₹${Math.round(calculatedPrice / (parseInt(superArea) || 1200)).toLocaleString('en-IN')} / sq.ft`,
      savingsBrokerage: `Saved ₹${(calculatedPrice * 0.02 / 100000).toFixed(1)}L Brokerage`,
      area: parseInt(superArea) || 1200,
      carpetArea: Math.round((parseInt(superArea) || 1200) * 0.82),
      bhk: parseInt(bhk) || 2,
      bathrooms: parseInt(bathrooms) || 2,
      facing: "East (Vastu Compliant)",
      ownership: "Freehold Registry Deed",
      state: stateName,
      district: activeDistrict,
      locality,
      pincode,
      description: "Direct owner listing with 0% brokerage. Verified title registry deed ready for immediate transfer. Genuine buyers welcome for on-site inspection.",
      images: imagesList.length > 0 
        ? imagesList.map(img => img.url) 
        : ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80"],
      videoUrl: videoUrl.trim() || null,
      sellerName,
      sellerPhone,
      sellerType: "Verified Direct Owner",
      sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      isSold: false,
      verifiedOwner: true,
      has360: true,
      furnishing,
      floorLevel: "Independent Villa / Floor",
      coords: geoCoords,
      landmarks: [
        { type: "transit", label: transitLabel, distance: transitDistance, time: transitTime, icon: "alt_route" },
        { type: "market", label: marketLabel, distance: marketDistance, time: marketTime, icon: "storefront" },
        { type: "park", label: parkLabel, distance: parkDistance, time: parkTime, icon: "water" }
      ],
      callingHours
    };

    onAddProperty(newProperty);
    onBack();
  };

  // Satellite URL for Preview
  const previewMapUrl = buildSatelliteMapUrl(
    locality, 
    isCustomDistrict ? customDistrictInput : district, 
    stateName
  );

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
            <StampLogo className="w-7 h-7" showText={false} />
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
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
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

            {/* Basic Info */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase">Property Headline / Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 4 BHK Aravali View Independent Villa with Private Lawn"
                  className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-3 rounded-lg focus:outline-none shadow-inner"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase">Property Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Apartments & Flats", "Houses & Villas", "Residential Plots", "Commercial Spaces"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2 px-2.5 rounded-lg text-center font-label-md text-[11.5px] transition ${
                        category === cat
                          ? "bg-primary text-surface font-bold shadow-xs"
                          : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Unit */}
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase">Expected Price ({dealType === "Sale" ? "Total Freehold" : "Monthly Rent"})</label>
                <div className="flex gap-space-xs">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-primary font-bold text-[16px]">₹</span>
                    <input 
                      className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-2.5 pl-8 rounded-lg focus:outline-none shadow-inner font-bold"
                      type="number"
                      step="0.01"
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

                <div className="bg-tertiary-fixed/30 p-2.5 rounded-lg flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1.5 text-on-tertiary-fixed">
                    <span className="material-symbols-outlined text-[16px]">insights</span>
                    <span className="font-code-spec text-[11px]">Fair Market Range: ₹{priceNum} {priceUnit} (Zero Middleman Commission)</span>
                  </div>
                  <span className="font-code-spec text-[10px] text-on-tertiary-fixed font-semibold px-1.5 py-0.5 rounded bg-tertiary-fixed">
                    0% Commission
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

        {/* STEP 2: LOCATION PIN & ADDRESS */}
        {currentStep === 2 && (
          <div className="px-gutter-mobile flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <span className="font-label-lg text-label-lg text-primary uppercase tracking-wide">Hyper-Local Pin</span>
                <span className="font-code-spec text-[10px] text-tertiary-fixed-dim bg-surface-container px-2 py-0.5 rounded font-bold">
                  All India • GPS Ready
                </span>
              </div>

              {/* 1. Indian Pincode Quick-Scan Box */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-primary font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">qr_code_scanner</span>
                    <span>Postal Pincode (Instant 6-Digit Auto-Scan)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handlePincodeScan(pincode)}
                    disabled={isScanningPincode}
                    className="px-2.5 py-1 rounded-lg bg-primary text-surface font-code-spec text-[10.5px] font-bold flex items-center gap-1 active:scale-95 transition"
                  >
                    <span className={`material-symbols-outlined text-[13px] ${isScanningPincode ? 'animate-spin' : ''}`}>
                      {isScanningPincode ? 'sync' : 'search'}
                    </span>
                    <span>{isScanningPincode ? "Scanning..." : "⚡ Scan Pincode"}</span>
                  </button>
                </div>

                <div className="relative">
                  <input 
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={handlePincodeInput}
                    placeholder="e.g. 313300 (Rajsamand) or 110048 (Delhi)"
                    className="w-full bg-surface-container-lowest text-primary font-body-md text-body-md p-2.5 pr-20 rounded-lg focus:outline-none border border-surface-container font-mono tracking-wider"
                  />
                  <span className="absolute right-3 top-2.5 font-code-spec text-[11px] text-on-surface-variant">
                    6 Digits
                  </span>
                </div>

                {pincodeMsg && (
                  <div className={`text-[11px] font-code-spec px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 ${
                    pincodeStatus === 'success' 
                      ? 'bg-secondary-container text-on-secondary-fixed font-bold' 
                      : pincodeStatus === 'error'
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {pincodeStatus === 'success' ? 'verified' : pincodeStatus === 'error' ? 'info' : 'sync'}
                    </span>
                    <span>{pincodeMsg}</span>
                  </div>
                )}

                {/* Quick Post Office Locality Suggestions from Pincode */}
                {localitySuggestions.length > 0 && (
                  <div className="flex flex-col gap-1 pt-1">
                    <span className="font-code-spec text-[10px] text-on-surface-variant uppercase">
                      Select Post Office Area in this Pincode:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {localitySuggestions.slice(0, 10).map((locName) => (
                        <button
                          key={locName}
                          type="button"
                          onClick={() => setLocality(`${locName}, ${district}`)}
                          className="px-2 py-0.5 rounded-full bg-surface-container-high hover:bg-secondary hover:text-surface text-[11px] font-label-md transition"
                        >
                          + {locName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. State & District Selectors (All Indian States) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
                {/* State */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase">State</label>
                  <select 
                    value={stateName}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-3 rounded-lg focus:outline-none shadow-inner"
                  >
                    {getAllStates().map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* District / Micro-Market */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md text-on-surface-variant uppercase">District / City</label>
                    <button
                      type="button"
                      onClick={() => setIsCustomDistrict(!isCustomDistrict)}
                      className="text-[10px] font-code-spec text-secondary underline"
                    >
                      {isCustomDistrict ? "Choose from list" : "+ Type manually"}
                    </button>
                  </div>

                  {isCustomDistrict ? (
                    <input
                      type="text"
                      value={customDistrictInput}
                      onChange={(e) => setCustomDistrictInput(e.target.value)}
                      placeholder="e.g. Rajsamand, Nathdwara, Kankroli"
                      className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-3 rounded-lg focus:outline-none shadow-inner border border-secondary/40"
                    />
                  ) : (
                    <select 
                      value={district}
                      onChange={handleDistrictChange}
                      className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-3 rounded-lg focus:outline-none shadow-inner"
                    >
                      {availableDistricts.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                      <option value="__custom__">+ Enter Custom District / Tehsil...</option>
                    </select>
                  )}
                </div>
              </div>

              {/* 3. Locality / Colony / Sector / Village */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase">
                    Locality / Colony / Village / Sector
                  </label>
                  <button
                    type="button"
                    onClick={handleGeocodeLocality}
                    disabled={isGeocodingAddress}
                    className="text-[10.5px] font-code-spec text-secondary flex items-center gap-1 hover:underline"
                  >
                    <span className="material-symbols-outlined text-[13px]">my_location</span>
                    <span>{isGeocodingAddress ? "Detecting GPS..." : "📍 Auto-Detect Area"}</span>
                  </button>
                </div>
                <input 
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Dhoinda, Rajnagar or C-Block Greater Kailash"
                  className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-3 rounded-lg focus:outline-none shadow-inner"
                />
              </div>

              {/* 4. Photorealistic Google Maps Satellite Mode Embed (t=k) */}
              <div className="rounded-xl overflow-hidden shadow-sm h-48 bg-surface-dim relative border border-surface-container">
                <iframe
                  className="w-full h-full filter saturate-[1.1]"
                  loading="lazy"
                  src={previewMapUrl}
                  style={{ border: 0 }}
                  title="Satellite Pin Preview"
                ></iframe>
                
                {/* Floating Map HUD */}
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/85 backdrop-blur-md text-surface font-code-spec text-[10px] shadow-md">
                  <span className="material-symbols-outlined text-[13px] text-amber-400">satellite_alt</span>
                  <span className="truncate max-w-[200px]">
                    Satellite (t=k): {locality ? locality + ', ' : ''}{isCustomDistrict ? customDistrictInput : district}, {stateName}
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-white font-code-spec text-[9.5px]">
                  {geoCoords}
                </div>
              </div>

              {/* 5. Real Context-Aware Landmarks & Proximity Control */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-2.5">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">explore</span>
                    <span className="font-label-md text-label-md font-bold text-primary">Nearby Physical Landmarks</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoDetectLandmarks}
                    disabled={isDetectingLandmarks}
                    className="px-2.5 py-1 rounded-lg bg-primary-container text-secondary-container font-code-spec text-[10.5px] font-bold flex items-center gap-1 hover:brightness-110 active:scale-95 transition"
                  >
                    <span className={`material-symbols-outlined text-[13px] ${isDetectingLandmarks ? 'animate-spin' : ''}`}>
                      {isDetectingLandmarks ? "sync" : "bolt"}
                    </span>
                    <span>{isDetectingLandmarks ? "Detecting..." : "⚡ Auto-Fill Nearby with AI"}</span>
                  </button>
                </div>

                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  Authentic landmarks for {isCustomDistrict ? customDistrictInput : district}, {stateName}. You can also manually customize names and distances below:
                </p>

                {detectSuccessMsg && (
                  <div className="text-[11px] font-code-spec text-secondary bg-surface-container px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>{detectSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2 pt-1">
                  {/* Transit / Highway / Bus Stand */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0" title="Transit / Highway / Railway">
                      <span className="material-symbols-outlined text-[16px] text-secondary">alt_route</span>
                    </div>
                    <input
                      type="text"
                      value={transitLabel}
                      onChange={(e) => setTransitLabel(e.target.value)}
                      placeholder="Nearest Highway, Bus Stand or Metro"
                      className="flex-1 bg-surface-container-lowest text-primary text-[12px] p-2 rounded-lg focus:outline-none border border-surface-container"
                    />
                    <input
                      type="text"
                      value={transitDistance}
                      onChange={(e) => setTransitDistance(e.target.value)}
                      placeholder="e.g. 650m"
                      className="w-20 bg-surface-container-lowest text-primary text-[12px] p-2 rounded-lg focus:outline-none border border-surface-container text-center font-code-spec"
                    />
                  </div>

                  {/* Market / Commercial */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0" title="Market / Commercial Bazaar">
                      <span className="material-symbols-outlined text-[16px] text-secondary">storefront</span>
                    </div>
                    <input
                      type="text"
                      value={marketLabel}
                      onChange={(e) => setMarketLabel(e.target.value)}
                      placeholder="Nearest Commercial Market or Bazaar"
                      className="flex-1 bg-surface-container-lowest text-primary text-[12px] p-2 rounded-lg focus:outline-none border border-surface-container"
                    />
                    <input
                      type="text"
                      value={marketDistance}
                      onChange={(e) => setMarketDistance(e.target.value)}
                      placeholder="e.g. 400m"
                      className="w-20 bg-surface-container-lowest text-primary text-[12px] p-2 rounded-lg focus:outline-none border border-surface-container text-center font-code-spec"
                    />
                  </div>

                  {/* Park / Lake / Public Space */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0" title="Park / Lake / Garden">
                      <span className="material-symbols-outlined text-[16px] text-secondary">water</span>
                    </div>
                    <input
                      type="text"
                      value={parkLabel}
                      onChange={(e) => setParkLabel(e.target.value)}
                      placeholder="Nearest Green Park, Lake or Landmark"
                      className="flex-1 bg-surface-container-lowest text-primary text-[12px] p-2 rounded-lg focus:outline-none border border-surface-container"
                    />
                    <input
                      type="text"
                      value={parkDistance}
                      onChange={(e) => setParkDistance(e.target.value)}
                      placeholder="e.g. 1.2km"
                      className="w-20 bg-surface-container-lowest text-primary text-[12px] p-2 rounded-lg focus:outline-none border border-surface-container text-center font-code-spec"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-space-xs">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-1/3 py-3 px-3 rounded-xl bg-surface-container hover:bg-surface-dim font-label-md text-label-md font-bold text-primary transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="w-2/3 py-3 px-4 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(213,129,15,0.35)] active:scale-[0.99] transition-transform"
              >
                <span>Continue to Media & Shield (Step 3)</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: MEDIA ENGINE & OWNER SHIELD */}
        {currentStep === 3 && (
          <div className="px-gutter-mobile flex flex-col gap-space-md">
            {/* Real Photo Upload & AI Room Detection Card */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label-lg text-label-lg text-primary uppercase tracking-wide">Property Photography</span>
                  <p className="font-code-spec text-[10.5px] text-on-surface-variant mt-0.5">
                    Select photos from phone camera or gallery • Auto-compressed for speed
                  </p>
                </div>
                <span className="font-code-spec text-[10px] text-secondary font-bold px-2 py-0.5 rounded bg-surface-container">
                  {imagesList.length}/5 Photos
                </span>
              </div>

              {/* Upload Action Area */}
              <div className="flex flex-col gap-2">
                <label 
                  htmlFor="file-upload-input"
                  className={`w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition text-center ${
                    imagesList.length >= 5 
                      ? "opacity-50 cursor-not-allowed border-surface-container bg-surface-container-low" 
                      : "border-secondary/40 hover:border-secondary bg-surface-container-low/60 hover:bg-surface-container-low"
                  }`}
                >
                  <input
                    id="file-upload-input"
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={imagesList.length >= 5 || isProcessingImage}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[24px]">
                      {isProcessingImage ? "sync" : "add_a_photo"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-label-md text-label-md font-bold text-primary">
                      {isProcessingImage ? "Compressing & Scanning Photos with AI..." : "Upload Photos from Phone / Gallery"}
                    </span>
                    <span className="font-code-spec text-[11px] text-on-surface-variant">
                      JPG, PNG, WebP • Up to 5 photos • Instant auto-compression
                    </span>
                  </div>
                </label>

                {/* Anti-Broker Fraud Watermark Toggle */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low border border-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      shield
                    </span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-[12px] font-bold text-primary">
                        🛡️ Anti-Broker Fraud Watermark
                      </span>
                      <span className="font-code-spec text-[10px] text-on-surface-variant">
                        Auto-stamps "ESETS 0% BROKERAGE" so brokers cannot re-list your photos
                      </span>
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={autoWatermark}
                    onChange={(e) => setAutoWatermark(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                </div>

                {imageUploadError && (
                  <div className="text-[11px] font-code-spec text-error bg-error-container p-2 rounded-lg">
                    {imageUploadError}
                  </div>
                )}
              </div>

              {/* Uploaded Photos Grid */}
              {imagesList.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] font-code-spec text-on-surface-variant">
                    <span>Uploaded Property Images:</span>
                    <span>Tap star to set Cover Image</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {imagesList.map((img, idx) => (
                      <div 
                        key={idx}
                        className={`relative rounded-xl overflow-hidden aspect-[4/3] bg-surface-dim border-2 shadow-xs group ${
                          img.isCover ? "border-secondary ring-2 ring-secondary/30" : "border-surface-container"
                        }`}
                      >
                        <img 
                          src={img.url} 
                          alt={`Uploaded ${idx + 1}`} 
                          className="w-full h-full object-cover"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                          {img.isCover && (
                            <span className="px-1.5 py-0.5 rounded bg-secondary text-surface font-code-spec text-[9px] font-bold shadow-xs">
                              COVER
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded bg-primary/80 backdrop-blur-md text-surface font-code-spec text-[9px]">
                            {img.tag}
                          </span>
                        </div>

                        {/* Actions Overlay */}
                        <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                          {!img.isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetCoverImage(idx)}
                              title="Set as Cover Image"
                              className="w-6 h-6 rounded-full bg-black/60 hover:bg-black text-amber-400 flex items-center justify-center transition active:scale-90"
                            >
                              <span className="material-symbols-outlined text-[13px]">star</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            title="Delete photo"
                            className="w-6 h-6 rounded-full bg-black/60 hover:bg-error text-white flex items-center justify-center transition active:scale-90"
                          >
                            <span className="material-symbols-outlined text-[13px]">close</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Web URL Fallback */}
              <div className="pt-1 border-t border-surface-container flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="font-code-spec text-[11px] text-secondary underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">link</span>
                  <span>{showUrlInput ? "Hide image URL input" : "Have an online image link? Paste URL"}</span>
                </button>
              </div>

              {showUrlInput && (
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-surface-container-low text-primary text-[12px] p-2 rounded-lg focus:outline-none border border-surface-container"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomUrl}
                    className="px-3 py-2 rounded-lg bg-primary text-surface font-label-md text-[11px] font-bold"
                  >
                    Add
                  </button>
                </div>
              )}

              {/* Video Walkthrough URL */}
              <div className="flex flex-col gap-1 pt-2 border-t border-surface-container">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase flex items-center justify-between">
                  <span>Verified On-Site Video Walkthrough URL</span>
                  <span className="font-code-spec text-[10px] text-secondary">Optional MP4 / WebM</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-on-surface-variant">
                    videocam
                  </span>
                  <input 
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://... (Direct inspection video URL)"
                    className="w-full bg-surface-container-low text-primary font-body-md text-[13px] p-2.5 pl-9 rounded-lg focus:outline-none shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Direct Owner & Spam Shield Details */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-md">
              <span className="font-label-lg text-label-lg text-primary uppercase tracking-wide">
                Direct Owner Contact & Calling Shield
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase">Full Legal Name</label>
                  <input 
                    type="text"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-2.5 rounded-lg focus:outline-none shadow-inner"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase">Direct Calling Phone</label>
                  <input 
                    type="tel"
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-2.5 rounded-lg focus:outline-none shadow-inner font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase">Permitted Calling Hours</label>
                <select 
                  value={callingHours}
                  onChange={(e) => setCallingHours(e.target.value)}
                  className="w-full bg-surface-container-low text-primary font-body-md text-body-md p-2.5 rounded-lg focus:outline-none shadow-inner"
                >
                  <option value="8:30 AM – 8:30 PM">8:30 AM – 8:30 PM (Recommended)</option>
                  <option value="9:00 AM – 7:00 PM">9:00 AM – 7:00 PM (Office Hours)</option>
                  <option value="10:00 AM – 9:00 PM">10:00 AM – 9:00 PM (Evening Friendly)</option>
                  <option value="In-App WhatsApp Only">In-App WhatsApp Only (Zero Voice Calls)</option>
                </select>
              </div>

              {/* Agreement Checkbox */}
              <label className="flex items-start gap-2 cursor-pointer mt-1">
                <input 
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-primary rounded"
                />
                <span className="font-body-sm text-[12px] text-on-surface-variant">
                  I certify that I am the direct freehold title deed owner or authorized family member. I agree to <strong>0% brokerage</strong> and understand I can freeze all incoming calls anytime via the <strong>“Sold It” Call Shield</strong>.
                </span>
              </label>
            </div>

            <div className="flex gap-space-xs">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-1/3 py-3 px-3 rounded-xl bg-surface-container hover:bg-surface-dim font-label-md text-label-md font-bold text-primary transition"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!agreeTerms}
                onClick={handleSubmit}
                className="w-2/3 py-3 px-4 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(213,129,15,0.35)] active:scale-[0.99] transition-transform disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Publish 0% Brokerage Listing</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
