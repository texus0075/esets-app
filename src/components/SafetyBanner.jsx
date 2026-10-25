import React from "react";
import { ShieldAlert, CheckCircle2, PhoneCall, AlertTriangle } from "lucide-react";

export default function SafetyBanner() {
  return (
    <div className="bg-[#FEF6EC] border-b border-[#D5810F]/25 py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs sm:text-sm">
        
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#D5810F] text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-[#563E28] mr-2">
              ⚠️ सुरक्षा नियम (100% सुरक्षित C2C डीलिंग):
            </span>
            <span className="text-[#563E28]/85 font-medium">
              किसी को भी कभी ऑनलाइन टोकन या एडवांस पैसे न भेजें। सीधे साइट पर जाकर मालिक से मिलें और रजिस्ट्री पेपर्स देखकर ही डील करें।
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 font-bold text-xs bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#563E28]/15 shadow-xs">
          <span className="flex items-center gap-1 text-[#526B3C]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#87A168]" /> केवल फेस-टू-फेस
          </span>
          <span className="flex items-center gap-1 text-[#563E28]">
            <PhoneCall className="w-3.5 h-3.5 text-[#563E28]" /> डायरेक्ट ओनर कॉल
          </span>
          <span className="flex items-center gap-1 text-rose-700">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> 0% ऑनलाइन एडवांस
          </span>
        </div>

      </div>
    </div>
  );
}
