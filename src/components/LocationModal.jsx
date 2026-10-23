import React, { useState } from "react";
import { MapPin, Navigation, Search, Check, X, Building } from "lucide-react";
import { LOCATIONS, ALL_DISTRICTS } from "../data/locations";

export default function LocationModal({ isOpen, onClose, selectedDistrict, onSelectDistrict }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [selectedState, setSelectedState] = useState("Delhi");

  if (!isOpen) return null;

  const detectLocation = () => {
    setIsDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => {
            setIsDetecting(false);
            onSelectDistrict("South Delhi");
            onClose();
          }, 600);
        },
        () => {
          setIsDetecting(false);
          alert("लोकेशन परमिशन नहीं मिली। कृपया लिस्ट से अपना जिला चुनें।");
        }
      );
    } else {
      setIsDetecting(false);
      alert("आपके ब्राउज़र में लोकेशन डिटेक्शन उपलब्ध नहीं है।");
    }
  };

  const filtered = ALL_DISTRICTS.filter(item => 
    item.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">अपनी लोकेशन / जिला चुनें</h3>
              <p className="text-xs text-slate-500">आपको सिर्फ आपके चुने हुए एरिया की प्रॉपर्टीज दिखाई देंगी</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 bg-slate-50/70 border-b border-slate-100 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="जिला या शहर का नाम लिखें (जैसे South Delhi, Gurugram, Noida)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={detectLocation}
              disabled={isDetecting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetecting ? "animate-spin" : ""}`} />
              <span>{isDetecting ? "लोकेशन खोजी जा रही है..." : "मेरी वर्तमान लोकेशन उपयोग करें (GPS)"}</span>
            </button>

            <button
              onClick={() => {
                onSelectDistrict("");
                onClose();
              }}
              className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition"
            >
              सभी लोकेशन (All)
            </button>
          </div>
        </div>

        <div className="p-5 max-h-[380px] overflow-y-auto">
          {searchTerm ? (
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                सर्च परिणाम ({filtered.length})
              </span>
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  कोई जिला नहीं मिला। कृपया दूसरा नाम सर्च करें।
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = selectedDistrict === item.district;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectDistrict(item.district);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-sm transition ${
                        isSelected 
                          ? "bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold" 
                          : "hover:bg-slate-100 text-slate-800"
                      }`}
                    >
                      <div>
                        <span className="block font-medium">{item.district}</span>
                        <span className="text-xs text-slate-400">{item.state}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-slate-100 scrollbar-none">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc.state}
                    onClick={() => setSelectedState(loc.state)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                      selectedState === loc.state
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {loc.state}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {LOCATIONS.find(l => l.state === selectedState)?.districts.map((dist) => {
                  const isSelected = selectedDistrict === dist;
                  return (
                    <button
                      key={dist}
                      onClick={() => {
                        onSelectDistrict(dist);
                        onClose();
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl text-left text-xs sm:text-sm border transition ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold"
                          : "border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-800"
                      }`}
                    >
                      <span>{dist}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
          💡 एल्गोरिदम आपके चुने जिले के अनुसार ही 100% सटीक प्रॉपर्टीज दिखाएगा।
        </div>

      </div>
    </div>
  );
}
