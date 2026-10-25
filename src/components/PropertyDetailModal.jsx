import React, { useState } from "react";
import { 
  X, 
  MapPin, 
  BedDouble, 
  Maximize2, 
  PhoneCall, 
  MessageCircle, 
  CheckCircle2, 
  Share2, 
  Video, 
  Ban, 
  Building, 
  Calendar,
  AlertTriangle,
  Compass
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

  // Google Maps Satellite / Hybrid embed URL (Workspace Rule 5)
  const mapQuery = encodeURIComponent(`${locality}, ${district}, ${state}`);
  const satelliteMapUrl = `https://maps.google.com/maps?q=${mapQuery}&t=k&z=16&output=embed`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B2416]/75 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-[#563E28]/20 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#563E28]/15 flex items-center justify-between shrink-0 bg-[#F8F7F4]">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider text-white ${
              dealType === "Rent" ? "bg-[#D5810F]" : "bg-[#87A168]"
            }`}>
              {dealType === "Rent" ? "किराया (Rent)" : "बिक्री (Sale)"}
            </span>
            <span className="text-xs font-bold text-[#563E28] bg-[#EADDD0] px-2.5 py-1 rounded-lg">
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
              className="p-2 rounded-xl bg-white border border-[#563E28]/15 text-[#563E28] hover:text-[#1B2416] transition"
              title="शेयर करें"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-[#563E28]/15 text-[#563E28] hover:text-[#1B2416] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Gallery View */}
          <div className="space-y-3">
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-[#1B2416]">
              {images && images.length > 0 ? (
                <img
                  src={images[activeImageIndex] || images[0]}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#EADDD0]">
                  कोई फ़ोटो उपलब्ध नहीं है
                </div>
              )}

              {isSold && (
                <div className="absolute inset-0 bg-[#1B2416]/70 flex items-center justify-center p-4">
                  <div className="bg-rose-600 text-white font-black text-base sm:text-lg px-6 py-2.5 rounded-2xl shadow-xl border-2 border-white tracking-widest flex items-center gap-2 transform -rotate-1">
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
                      activeImageIndex === idx 
                        ? "border-[#D5810F] ring-2 ring-[#D5810F]/30 scale-105" 
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {videoUrl && (
              <div className="p-4 rounded-2xl bg-[#1B2416] text-white space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D5810F]">
                  <Video className="w-4 h-4" />
                  <span>प्रॉपर्टी वीडियो वॉकथ्रू:</span>
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

          {/* Pricing & Title */}
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <span className="text-3xl font-black text-[#1B2416] tracking-tight">
                {priceUnit || `₹${price.toLocaleString("en-IN")}`}
              </span>
              <span className="text-xs font-semibold text-[#563E28]/70">
                पोस्ट किया गया: {postedAt || "हाल ही में"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#1B2416] leading-snug">
              {title}
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-[#563E28] mt-2">
              <MapPin className="w-4 h-4 text-[#87A168] shrink-0" />
              <span>{locality}, <strong className="text-[#1B2416]">{district}</strong>, {state} {pincode ? `(${pincode})` : ""}</span>
            </div>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#F8F7F4] border border-[#563E28]/15">
              <span className="text-[11px] text-[#563E28]/70 block font-medium">सुपर एरिया</span>
              <span className="text-sm font-bold text-[#1B2416]">{area ? `${area} sq.ft` : "N/A"}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F8F7F4] border border-[#563E28]/15">
              <span className="text-[11px] text-[#563E28]/70 block font-medium">कमरे (BHK)</span>
              <span className="text-sm font-bold text-[#1B2416]">{bhk ? `${bhk} BHK` : "लागू नहीं"}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F8F7F4] border border-[#563E28]/15">
              <span className="text-[11px] text-[#563E28]/70 block font-medium">बाथरूम</span>
              <span className="text-sm font-bold text-[#1B2416]">{bathrooms || 1}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F8F7F4] border border-[#563E28]/15">
              <span className="text-[11px] text-[#563E28]/70 block font-medium">फर्निशिंग</span>
              <span className="text-sm font-bold text-[#1B2416]">{furnishing || "Unfurnished"}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#1B2416] uppercase tracking-wider">
              प्रॉपर्टी विवरण (Description)
            </h4>
            <p className="text-sm text-[#563E28] leading-relaxed bg-[#F8F7F4] p-4 rounded-2xl border border-[#563E28]/15 whitespace-pre-line">
              {description || "ओनर द्वारा कोई अतिरिक्त विवरण नहीं दिया गया है।"}
            </p>
          </div>

          {/* Satellite Map View Embed (Workspace Rule 5) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#1B2416] uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#87A168]" />
                <span>लाइव लोकेशन व आस-पास का सैटेलाइट व्यू (Satellite View)</span>
              </h4>
              <span className="text-[11px] font-semibold text-[#87A168] bg-[#EAF1E4] px-2 py-0.5 rounded-full">
                100% Photorealistic Terrain
              </span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-[#563E28]/20 shadow-xs h-60 bg-[#1B2416] relative">
              <iframe
                title="Property Satellite Location"
                src={satelliteMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="text-[11px] text-[#563E28]/70 italic">
              * यह सीधा इंटरएक्टिव गूगल सैटेलाइट मैप है। आप इसे ज़ूम इन/आउट करके सड़कें, पार्क, मेट्रो और आस-पास की सोसायटियाँ देख सकते हैं।
            </p>
          </div>

          {/* Direct Owner Action Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FEF6EC] to-[#F1F5EE] border border-[#D5810F]/30 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#563E28] to-[#87A168] text-white font-black flex items-center justify-center text-lg shadow-md shadow-[#563E28]/20">
                  {sellerName ? sellerName[0] : "O"}
                </div>
                <div>
                  <h4 className="font-extrabold text-[#1B2416] text-base flex items-center gap-1.5">
                    {sellerName}
                    <CheckCircle2 className="w-4 h-4 text-[#87A168]" />
                  </h4>
                  <span className="text-xs text-[#563E28] font-medium">
                    {sellerType || "डायरेक्ट ओनर"} • 100% वेरिफाइड C2C लिस्टिंग
                  </span>
                </div>
              </div>

              {isOwner && onToggleSold && (
                <button
                  onClick={() => onToggleSold(id, isSold)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 ${
                    isSold
                      ? "bg-[#1B2416] text-white hover:bg-[#3A2818]"
                      : "bg-rose-600 hover:bg-rose-700 text-white"
                  }`}
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>{isSold ? "दोबारा एक्टिव करें" : "'Sold It' मार्क करें (कॉल बंद)"}</span>
                </button>
              )}
            </div>

            {isSold ? (
              <div className="p-3 rounded-xl bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold text-center">
                ⛔ यह प्रॉपर्टी बिक चुकी है। सेलर को बार-बार कॉल से बचाने के लिए नंबर हाइड कर दिया गया है।
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={`tel:${sellerPhone}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#563E28] hover:bg-[#3A2818] text-white font-bold text-sm shadow-md transition active:scale-95"
                >
                  <PhoneCall className="w-4 h-4 text-[#D5810F]" />
                  <span>सीधा कॉल करें ({sellerPhone})</span>
                </a>

                <a
                  href={`https://wa.me/${sellerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`नमस्ते ${sellerName}, मैंने Esets ऐप पर आपकी प्रॉपर्टी "${title}" देखी है। क्या मैं इसे देखने आ सकता हूँ?`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#87A168] hover:bg-[#526B3C] text-white font-bold text-sm shadow-md transition active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>व्हाट्सएप पर चैट करें</span>
                </a>
              </div>
            )}
          </div>

          {/* Safety Reminder */}
          <div className="p-4 rounded-2xl bg-[#FEF6EC] border border-[#D5810F]/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#D5810F] shrink-0 mt-0.5" />
            <div className="text-xs text-[#563E28] space-y-1">
              <strong className="block font-bold text-[#1B2416]">Esets सुरक्षा शील्ड (Anti-Fraud Policy):</strong>
              <p>
                कभी भी किसी को बुकिंग या टोकन का ऑनलाइन एडवांस पेमेंट न करें। हमेशा प्रॉपर्टी पर जाकर मकान मालिक से फेस-टू-फेस मिलें और रजिस्ट्री पेपर्स की फिजिकल कॉपी चेक करें।
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
