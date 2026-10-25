import React from "react";
import { 
  MapPin, 
  BedDouble, 
  Maximize2, 
  Video, 
  PhoneCall, 
  MessageCircle, 
  CheckCircle2, 
  Ban 
} from "lucide-react";

export default function PropertyCard({ property, onSelect, onCallClick }) {
  const {
    id,
    title,
    price,
    priceUnit,
    area,
    bhk,
    state,
    district,
    locality,
    images,
    videoUrl,
    sellerName,
    sellerPhone,
    sellerType,
    isSold,
    verifiedOwner,
    dealType,
    postedAt,
    views
  } = property;

  const displayImage = images && images.length > 0 
    ? images[0] 
    : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";

  return (
    <div 
      className={`group rounded-2xl transition-all duration-200 overflow-hidden flex flex-col walnut-card ${
        isSold 
          ? "opacity-75 bg-[#F8F7F4] border-stone-300" 
          : "hover:shadow-xl shadow-xs"
      }`}
      style={{ minWidth: 0 }}
    >
      {/* Property Thumbnail with 60-30-10 Badges */}
      <div 
        className="relative aspect-16/10 overflow-hidden bg-[#EAE2D8] cursor-pointer" 
        onClick={() => onSelect(property)}
      >
        <img
          src={displayImage}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isSold ? "grayscale-60" : ""
          }`}
          style={{ height: "190px", objectFit: "cover", width: "100%" }}
          loading="lazy"
        />

        {/* Sold It Status Overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-[#1B2416]/65 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-rose-600 text-white font-black text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg border-2 border-white/90 tracking-wider flex items-center gap-1.5 transform -rotate-2">
              <Ban className="w-4 h-4" />
              <span>बिक चुका है (SOLD OUT)</span>
            </div>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wide text-white shadow-sm ${
            dealType === "Rent" ? "bg-[#D5810F]" : "bg-[#87A168]"
          }`}>
            {dealType === "Rent" ? "किराये पर (Rent)" : "बिक्री (Sale)"}
          </span>

          {videoUrl && (
            <span className="px-2 py-0.5 rounded-lg bg-[#1B2416]/85 backdrop-blur-xs text-[#FEF6EC] text-[10px] font-bold flex items-center gap-1 shadow-sm">
              <Video className="w-3 h-3 text-[#D5810F]" />
              <span>वीडियो</span>
            </span>
          )}
        </div>

        {images && images.length > 1 && (
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#1B2416]/75 backdrop-blur-xs text-white text-[10px] font-bold">
            📷 {images.length} फ़ोटो
          </div>
        )}

        <div className="absolute bottom-2.5 left-2.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-[#1B2416] text-[10px] font-bold shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#87A168]" />
            <span>0% ब्रोकरेज • डायरेक्ट</span>
          </span>
        </div>
      </div>

      {/* Property Details Body */}
      <div className="p-4 flex-1 flex flex-col justify-between" style={{ minWidth: 0 }}>
        <div>
          {/* Price & Post Time */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="text-xl font-black text-[#1B2416] tracking-tight">
              {priceUnit || `₹${price.toLocaleString("en-IN")}`}
            </span>
            <span className="text-[11px] font-medium text-[#563E28]/70">
              {postedAt || "हाल ही में"}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(property)}
            className="font-bold text-[#1B2416] text-sm leading-snug line-clamp-2 hover:text-[#87A168] transition cursor-pointer mb-2"
          >
            {title}
          </h3>

          {/* Location Line */}
          <div className="flex items-center gap-1 text-xs text-[#563E28]/80 mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#87A168] shrink-0" />
            <span className="truncate">
              {locality}, <strong className="text-[#1B2416]">{district}</strong>
            </span>
          </div>

          {/* Key Specs Pill Bar */}
          <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-[#563E28]/10 text-[#563E28]/85 mb-3">
            <div className="flex items-center gap-1 truncate">
              <Maximize2 className="w-3.5 h-3.5 text-[#87A168] shrink-0" />
              <span>{area ? `${area} sq.ft` : "N/A"}</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <BedDouble className="w-3.5 h-3.5 text-[#87A168] shrink-0" />
              <span>{bhk ? `${bhk} BHK` : "लागू नहीं"}</span>
            </div>
          </div>
        </div>

        {/* Action Triggers: Direct Owner Contact Cards */}
        <div className="pt-1">
          {isSold ? (
            <div className="w-full py-2 px-3 rounded-xl bg-stone-100 text-[#563E28]/60 text-center font-bold text-xs">
              🚫 यह प्रॉपर्टी सोल्ड हो चुकी है
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${sellerPhone}`}
                onClick={(e) => onCallClick(property, e)}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#563E28] hover:bg-[#3A2818] text-white text-xs font-bold transition shadow-xs active:scale-95 text-center"
                title="सीधा मालिक को कॉल करें"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#D5810F]" />
                <span className="truncate">सीधा कॉल</span>
              </a>

              <a
                href={`https://wa.me/${sellerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`नमस्ते ${sellerName}, मैंने Esets पर आपकी प्रॉपर्टी "${title}" देखी है। क्या यह अभी उपलब्ध है?`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#87A168] hover:bg-[#526B3C] text-white text-xs font-bold transition shadow-xs active:scale-95 text-center"
                title="मालिक से व्हाट्सएप पर बात करें"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="truncate">व्हाट्सएप</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
