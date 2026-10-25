import React from "react";
import { 
  Home, 
  Building, 
  MapPin, 
  Tag, 
  ArrowUpDown 
} from "lucide-react";

export default function FilterBar({
  dealType,
  setDealType,
  category,
  setCategory,
  sortBy,
  setSortBy,
  selectedDistrict,
  onOpenLocationModal,
  totalResults
}) {
  const categories = [
    { id: "All", label: "सभी प्रकार" },
    { id: "Apartment", label: "फ्लैट / अपार्टमेंट" },
    { id: "House", label: "मकान / कोठी" },
    { id: "Plot", label: "प्लॉट / जमीन" },
    { id: "Commercial", label: "कमर्शियल / दुकान" }
  ];

  return (
    <div className="bg-[#FFFFFF] border-b border-[#563E28]/15 py-3 shadow-xs w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-3">
        
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-[#563E28]/70">एक्टिव लोकेशन:</span>
            {selectedDistrict ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAF1E4] text-[#526B3C] font-bold text-xs border border-[#87A168]/40 shadow-xs">
                <MapPin className="w-3 h-3 text-[#87A168]" />
                <span className="truncate max-w-[130px]">{selectedDistrict}</span>
                <button
                  onClick={() => onOpenLocationModal()}
                  className="text-[#87A168] hover:text-[#526B3C] font-semibold ml-0.5 underline cursor-pointer"
                >
                  (बदलें)
                </button>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F8F7F4] text-[#1B2416] font-semibold text-xs border border-[#563E28]/20">
                पूरा भारत
              </span>
            )}
            <span className="text-xs text-[#563E28]/60">• {totalResults} लिस्टिंग्स</span>
          </div>

          <div className="flex items-center bg-[#F8F7F4] p-1 rounded-xl border border-[#563E28]/15 text-xs font-bold shrink-0">
            <button
              onClick={() => setDealType("All")}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg transition ${
                dealType === "All" 
                  ? "bg-[#563E28] text-white shadow-xs" 
                  : "text-[#563E28]/70 hover:text-[#1B2416]"
              }`}
            >
              सभी
            </button>
            <button
              onClick={() => setDealType("Sale")}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg transition ${
                dealType === "Sale" 
                  ? "bg-[#87A168] text-white shadow-xs" 
                  : "text-[#563E28]/70 hover:text-[#1B2416]"
              }`}
            >
              बिक्री
            </button>
            <button
              onClick={() => setDealType("Rent")}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg transition ${
                dealType === "Rent" 
                  ? "bg-[#D5810F] text-white shadow-xs" 
                  : "text-[#563E28]/70 hover:text-[#1B2416]"
              }`}
            >
              किराया
            </button>
          </div>

        </div>

        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none w-full min-w-0">
          
          <div className="flex items-center gap-1.5 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition border shrink-0 ${
                  category === cat.id
                    ? "bg-[#563E28] text-white border-[#563E28] shadow-xs"
                    : "bg-[#F8F7F4] text-[#563E28]/80 border-[#563E28]/15 hover:border-[#87A168] hover:text-[#1B2416]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 shrink-0 pl-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#563E28]/60 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#F8F7F4] border border-[#563E28]/20 rounded-xl px-2 py-1 text-[11px] sm:text-xs font-semibold text-[#1B2416] focus:outline-none focus:border-[#87A168] cursor-pointer"
            >
              <option value="newest">नई पहले</option>
              <option value="price_low">सस्ती पहले</option>
              <option value="price_high">प्रीमियम पहले</option>
            </select>
          </div>

        </div>

      </div>
    </div>
  );
}
