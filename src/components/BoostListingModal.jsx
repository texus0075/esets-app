import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  CreditCard,
  Crown
} from "lucide-react";

export default function BoostListingModal({
  isOpen,
  onClose,
  property,
  onActivateBoost
}) {
  if (!isOpen || !property) return null;

  const [selectedPlan, setSelectedPlan] = useState("spotlight");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmBoost = async () => {
    setIsProcessing(true);
    try {
      await onActivateBoost(property.id, selectedPlan);
      alert("🎉 बधाई! आपकी प्रॉपर्टी अब 30 दिनों के लिए 'Spotlight Featured' में अपग्रेड हो गई है। यह सर्च रिजल्ट्स में सबसे ऊपर दिखेगी!");
      onClose();
    } catch (err) {
      alert("बूस्ट सक्रिय करने में समस्या आई: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-surface rounded-3xl border border-surface-container-high shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Golden Gradient Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-white shadow-inner mb-2.5">
            <Crown className="w-6 h-6 text-amber-200 fill-amber-300" />
          </div>

          <h3 className="font-headline-sm text-xl font-bold">
            प्रॉपर्टी को बूस्ट करें (5x ज्यादा कॉल्स)
          </h3>
          <p className="text-xs text-amber-100 mt-1 max-w-xs mx-auto">
            सर्च रिजल्ट्स में अपनी प्रॉपर्टी को सबसे ऊपर लाएं और तेजी से डील क्लोज करें।
          </p>
        </div>

        {/* Selected Property Preview Mini Card */}
        <div className="p-4 bg-surface-container-lowest border-b border-surface-container flex items-center gap-3">
          <div className="w-16 h-14 rounded-xl overflow-hidden bg-surface-container shrink-0">
            <img 
              src={property.images?.[0] || ""} 
              alt={property.title} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-headline-sm text-sm font-bold text-primary truncate">
              {property.title}
            </div>
            <div className="text-xs text-on-surface-variant truncate">
              {property.locality}, {property.district} • {property.priceUnit}
            </div>
          </div>
        </div>

        {/* Plan Selection */}
        <div className="p-5 space-y-3">
          {/* Plan 1: Spotlight Featured */}
          <div
            onClick={() => setSelectedPlan("spotlight")}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
              selectedPlan === "spotlight"
                ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md"
                : "border-surface-container bg-surface-container-low hover:border-slate-300"
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
              selectedPlan === "spotlight"
                ? "border-amber-600 bg-amber-600 text-white"
                : "border-slate-400"
            }`}>
              {selectedPlan === "spotlight" && <div className="w-2 h-2 rounded-full bg-white"></div>}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-primary flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Spotlight Featured Boost
                </span>
                <span className="font-headline-sm text-sm font-extrabold text-amber-700 dark:text-amber-400">
                  ₹299 <span className="text-[10px] text-on-surface-variant font-normal">/ 30 दिन</span>
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                • शहर के सभी सर्च रिजल्ट्स में <b>सबसे ऊपर पिन</b> रहेगी<br />
                • चमकदार <b>गोल्डन बॉर्डर</b> और <b>⭐ FEATURED</b> बैज<br />
                • 5 गुना ज्यादा डायरेक्ट खरीदारों के कॉल्स और विज़िट्स
              </p>
            </div>
          </div>

          {/* Plan 2: Gold Verified Owner */}
          <div
            onClick={() => setSelectedPlan("verified_gold")}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
              selectedPlan === "verified_gold"
                ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md"
                : "border-surface-container bg-surface-container-low hover:border-slate-300"
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
              selectedPlan === "verified_gold"
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-slate-400"
            }`}>
              {selectedPlan === "verified_gold" && <div className="w-2 h-2 rounded-full bg-white"></div>}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-primary flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  100% Registry Verified Badge
                </span>
                <span className="font-headline-sm text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                  ₹199 <span className="text-[10px] text-on-surface-variant font-normal">/ लाइफटाइम</span>
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                • <b>🛡️ 100% फ्रीहोल्ड रजिस्ट्री बैज</b> डिस्प्ले होगा<br />
                • फर्जी दलालों से सुरक्षा और खरीदारों का 80% ज्यादा भरोसा
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-surface-container-lowest border-t border-surface-container flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-surface-container text-on-surface-variant font-bold text-xs hover:bg-surface-container transition"
          >
            रद्द करें
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleConfirmBoost}
            className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-amber-600/20 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>{isProcessing ? "सक्रिय हो रहा है..." : "बूस्ट तुरंत एक्टिवेट करें"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
