import React from "react";
import { ShieldAlert, CheckCircle2, PhoneCall, Users, AlertTriangle } from "lucide-react";

export default function SafetyBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border-y border-amber-200/80 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-slate-800 text-xs sm:text-sm">
        
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-amber-900 block sm:inline mr-2">
              ⚠️ सुरक्षा नियम (100% सेफ C2C डीलिंग):
            </span>
            <span className="text-slate-700 font-medium">
              किसी को भी ऑनलाइन टोकन या एडवांस न भेजें। हमेशा प्रॉपर्टी पर जाकर ओनर से फेस-टू-फेस मिलें और पेपर्स देखकर ही डील करें।
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 font-semibold text-xs text-slate-600 bg-white/70 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200/70">
          <span className="flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> केवल फेस-टू-फेस
          </span>
          <span className="flex items-center gap-1 text-blue-700">
            <PhoneCall className="w-3.5 h-3.5 text-blue-600" /> डायरेक्ट कॉलिंग
          </span>
          <span className="flex items-center gap-1 text-rose-700">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> 0% ऑनलाइन एडवांस
          </span>
        </div>

      </div>
    </div>
  );
}
