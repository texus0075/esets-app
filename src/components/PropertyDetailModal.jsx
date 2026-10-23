import React, { useState } from "react";
import { 
  X, 
  MapPin, 
  BedDouble, 
  Maximize2, 
  PhoneCall, 
  MessageCircle, 
  ShieldCheck, 
  Share2, 
  CheckCircle2, 
  Video, 
  Ban, 
  Building, 
  Calendar,
  AlertTriangle
} from "lucide-react";

export default function PropertyDetailModal({ property, onClose, onToggleSold, currentUserId }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!property) return null;

  const {
    id,
    title,
    category,
    dealType,
    price,
    priceUnit,
    area,
    bhk,
    bathrooms,
    state,
    district,
    locality,
    pincode,
    description,
    images = [],
    videoUrl,
    sellerName,
    sellerPhone,
    sellerType,
    isSold,
    verifiedOwner,
    furnishing,
    postedAt,
    userId
  } = property;

  const isOwner = currentUserId && (userId === currentUserId || currentUserId.startsWith("demo-user-owner"));

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Esets ऐप पर यह प्रॉपर्टी देखें: ${title} (${priceUnit})`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("प्रॉपर्टी लिंक कॉपी हो गया!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider text-white ${
              dealType === "Rent" ? "bg-blue-600" : "bg-emerald-600"
            }`}>
              {dealType === "Rent" ? "किराया (Rent)" : "बिक्री (Sale)"}
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              {category}
            </span>
            {isSold && (
              <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-black text-xs flex items-center gap-1">
                <Ban className="w-3.5 h-3.5" /> सोल्ड आउट (SOLD)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              title="शेयर करें"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          <div className="space-y-3">
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-900">
              {images && images.length > 0 ? (
                <img
                  src={images[activeImageIndex] || images[0]}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  कोई फ़ोटो उपलब्ध नहीं है
                </div>
              )}

              {isSold && (
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                  <div className="bg-rose-600 text-white font-black text-lg px-6 py-2.5 rounded-2xl shadow-xl border-2 border-white tracking-widest flex items-center gap-2">
                    <Ban className="w-6 h-6" />
                    <span>प्रॉपर्टी बिक चुकी है (SOLD OUT)</span>
                  </div>
                </div>
              )}
            </div>

            {images && images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      activeImageIndex === idx ? "border-emerald-600 ring-2 ring-emerald-500/30 scale-105" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {videoUrl && (
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Video className="w-4 h-4" />
                  <span>360° / वीडियो टूर देखें:</span>
                </div>
                <video 
                  controls 
                  className="w-full rounded-xl max-h-60 bg-black object-contain"
                  src={videoUrl}
                >
                  आपका ब्राउज़र वीडियो सपोर्ट नहीं करता।
                </video>
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {priceUnit || `₹${price.toLocaleString("en-IN")}`}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                पोस्ट किया गया: {postedAt || "हाल ही में"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 leading-snug">
              {title}
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-slate-600 mt-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{locality}, <strong className="text-slate-800">{district}</strong>, {state} {pincode ? `(${pincode})` : ""}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-600 block">सुपर एरिया</span>
              <span className="text-sm font-bold text-slate-900">{area ? `${area} sq.ft` : "N/A"}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-600 block">कमरे (Bedrooms)</span>
              <span className="text-sm font-bold text-slate-900">{bhk ? `${bhk} BHK` : "लागू नहीं"}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-600 block">बाथरूम</span>
              <span className="text-sm font-bold text-slate-900">{bathrooms || 1}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-600 block">फर्निशिंग</span>
              <span className="text-sm font-bold text-slate-900">{furnishing || "Unfurnished"}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
              प्रॉपर्टी विवरण (Description)
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100 whitespace-pre-line">
              {description || "ओनर द्वारा कोई अतिरिक्त विवरण नहीं दिया गया है।"}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg shadow-md shadow-emerald-500/20">
                  {sellerName ? sellerName[0] : "O"}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                    {sellerName}
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">
                    {sellerType || "डायरेक्ट ओनर"} • वेरिफाइड लिस्टिंग
                  </span>
                </div>
              </div>

              {isOwner && onToggleSold && (
                <button
                  onClick={() => onToggleSold(id, isSold)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 ${
                    isSold
                      ? "bg-slate-800 text-white hover:bg-slate-900"
                      : "bg-rose-600 hover:bg-rose-700 text-white"
                  }`}
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>{isSold ? "दोबारा एक्टिव करें" : "'Sold It' मार्क करें"}</span>
                </button>
              )}
            </div>

            {isSold ? (
              <div className="p-3 rounded-xl bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold text-center">
                ⛔ यह प्रॉपर्टी बिक चुकी है। सेलर को परेशान न करने के लिए नंबर छुपा दिया गया है।
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={`tel:${sellerPhone}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition active:scale-95"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>सीधा कॉल करें ({sellerPhone})</span>
                </a>

                <a
                  href={`https://wa.me/${sellerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`नमस्ते ${sellerName}, मैंने Esets ऐप पर आपकी प्रॉपर्टी "${title}" देखी है। क्या मैं इसे देखने आ सकता हूँ?`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>व्हाट्सएप पर चैट करें</span>
                </a>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <strong className="block font-bold">सुरक्षा सलाह (Esets Safety Shield):</strong>
              <p>
                कभी भी किसी को बुकिंग या टोकन का ऑनलाइन पेमेंट न करें। हमेशा प्रॉपर्टी पर जाकर मकान मालिक से फेस-टू-फेस मिलें और रजिस्ट्री पेपर्स की फिजिकल कॉपी चेक करें।
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
