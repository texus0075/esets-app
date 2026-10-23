import React from "react";
import { 
  MapPin, 
  BedDouble, 
  Maximize2, 
  Video, 
  PhoneCall, 
  MessageCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
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
      className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
        isSold 
          ? "border-slate-300 opacity-80 bg-slate-50/50" 
          : "border-slate-200/90 hover:border-emerald-500/50 hover:shadow-xl shadow-xs"
      }`}
    >
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelect(property)}>
        <img
          src={displayImage}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isSold ? "grayscale-50" : ""
          }`}
          loading="lazy"
        />

        {isSold && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-rose-600 text-white font-black text-sm sm:text-base px-4 py-2 rounded-xl shadow-lg border-2 border-white/80 tracking-wider flex items-center gap-2 transform -rotate-2">
              <Ban className="w-5 h-5" />
              <span>बिक चुका है (SOLD OUT)</span>
            </div>
          </div>
        )}

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wide text-white shadow-sm ${
            dealType === "Rent" ? "bg-blue-600" : "bg-emerald-600"
          }`}>
            {dealType === "Rent" ? "किराये पर (Rent)" : "बिक्री (Sale)"}
          </span>

          {videoUrl && (
            <span className="px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
              <Video className="w-3 h-3 text-red-400 fill-red-400" />
              <span>वीडियो टूर</span>
            </span>
          )}
        </div>

        {images && images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-bold">
            📷 {images.length} फ़ोटो
          </div>
        )}

        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-slate-800 text-[11px] font-bold shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>डायरेक्ट ओनर (0% ब्रोकरेज)</span>
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <span className="text-xl font-black text-slate-900 tracking-tight">
              {priceUnit || `₹${price.toLocaleString("en-IN")}`}
            </span>
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Eye className="w-3 h-3" /> {views || 1} व्यूज
            </span>
          </div>

          <h3 
            onClick={() => onSelect(property)}
            className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-emerald-700 cursor-pointer transition mb-2"
            title={title}
          >
            {title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate font-medium">{locality}, <strong className="text-slate-700">{district}</strong></span>
          </div>

          <div className="flex items-center gap-4 py-2 border-y border-slate-100 text-xs text-slate-600">
            {bhk > 0 && (
              <div className="flex items-center gap-1 font-semibold">
                <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                <span>{bhk} BHK</span>
              </div>
            )}
            {area > 0 && (
              <div className="flex items-center gap-1 font-semibold">
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{area} sq.ft</span>
              </div>
            )}
            <div className="text-[11px] text-slate-400 ml-auto">
              {postedAt || "आज"}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-1">
          {isSold ? (
            <div className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-500 text-center font-bold text-xs border border-slate-200">
              यह प्रॉपर्टी बिक चुकी है (कॉल बंद)
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href={`tel:${sellerPhone}`}
                onClick={(e) => onCallClick(property, e)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>ओनर को कॉल करें</span>
              </a>

              <a
                href={`https://wa.me/${sellerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`नमस्ते, मैंने Esets ऐप पर आपकी प्रॉपर्टी देखी है: "${title}" (${priceUnit})। क्या यह अभी उपलब्ध है?`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 transition"
                title="व्हाट्सएप पर बात करें"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <button
                onClick={() => onSelect(property)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                डिटेल्स
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
