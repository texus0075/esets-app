import React, { useState } from "react";
import { 
  X, 
  Crown, 
  Check, 
  Zap, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles 
} from "lucide-react";

export default function SubscriptionModal({ isOpen, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState("silver");
  const [isJoined, setIsJoined] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        <div className="p-6 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-inner">
                <Crown className="w-7 h-7 fill-white/80" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest font-extrabold text-amber-200">
                  Esets Business Pro
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  डीलर & बिल्डर मंथली सब्सक्रिप्शन
                </h3>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-200" />
              <span>कम्युनिटी प्रोग्रेस: <strong>2,480 / 3,000</strong> एक्टिव मेंबर्स</span>
            </div>
            <span className="bg-white text-amber-900 px-2 py-0.5 rounded-full font-bold text-[10px]">
              शुरुआती मेंबर्स हेतु फ्री प्रीव्यू
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800">
          <p className="text-xs sm:text-sm text-slate-600">
            यदि आप एक प्रॉपर्टी डीलर या ब्रोकर हैं, तो साधारण लिस्टिंग के बजाय <strong>सब्सक्रिप्शन प्लान</strong> लें ताकि आपकी प्रॉपर्टीज लाखों खरीदारों को सबसे पहले दिखाई दें।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => setSelectedPlan("silver")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                selectedPlan === "silver"
                  ? "border-amber-500 bg-amber-50/40 shadow-md ring-2 ring-amber-500/20"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md">
                  सिल्वर डीलर प्लान
                </span>
                {selectedPlan === "silver" && <Check className="w-4 h-4 text-amber-600" />}
              </div>

              <div className="mb-3">
                <span className="text-2xl font-black text-slate-900">₹8,000</span>
                <span className="text-xs text-slate-500 font-semibold"> / महीना</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>महीने में <strong>25 प्रॉपर्टीज</strong> तक लिस्टिंग</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>'वेरिफाइड डीलर'</strong> ब्लू टिक बैज</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>जिले के सर्च रिजल्ट में <strong>टॉप रैंकिंग</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>डायरेक्ट व्हाट्सएप और कॉलिंग लीड्स</span>
                </li>
              </ul>
            </div>

            <div 
              onClick={() => setSelectedPlan("gold")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                selectedPlan === "gold"
                  ? "border-yellow-600 bg-yellow-50/50 shadow-md ring-2 ring-yellow-600/20"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                सबसे लोकप्रिय
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-yellow-800 bg-yellow-100 px-2.5 py-0.5 rounded-md">
                  गोल्ड एंटरप्राइज प्लान
                </span>
                {selectedPlan === "gold" && <Check className="w-4 h-4 text-yellow-700" />}
              </div>

              <div className="mb-3">
                <span className="text-2xl font-black text-slate-900">₹15,000</span>
                <span className="text-xs text-slate-500 font-semibold"> / महीना</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>अनलिमिटेड</strong> प्रॉपर्टीज लिस्टिंग</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>'गोल्ड डीलर'</strong> प्रीमियम बैज</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>360° वीडियो टूर और होम स्क्रीन बैनर</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>डेडिकेटेड 24x7 अकाउंट मैनेजर</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            <div className="text-xs text-slate-600">
              <strong className="block text-slate-800 font-bold">शुरुआती 3,000 मेंबर्स के लिए खास ऑफर:</strong>
              अभी जुड़ने वाले पहले डीलर्स को 1 महीने का प्रो एक्सेस बिना किसी शुल्क के दिया जा रहा है।
            </div>
          </div>

          <div className="pt-2">
            {isJoined ? (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-center font-bold text-xs">
                🎉 बधाई! आपका प्रो डीलर सब्सक्रिप्शन एक्टिवेट हो गया है।
              </div>
            ) : (
              <button
                onClick={() => setIsJoined(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-black text-sm shadow-md shadow-amber-600/25 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {selectedPlan === "silver" ? "₹8,000 / माह प्लान चुनें (Start Free Trial)" : "₹15,000 / माह गोल्ड प्लान चुनें (Start Free Trial)"}
                </span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
