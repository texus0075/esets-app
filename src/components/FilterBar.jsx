import React from "react";
import { 
  Home, 
  Building, 
  MapPin, 
  CheckCircle, 
  Tag, 
  ArrowUpDown, 
  SlidersHorizontal 
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
    <div className="bg-white border-b border-slate-200 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">लोकेशन फ़िल्टर:</span>
            {selectedDistrict ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 font-bold text-xs border border-emerald-300">
                <MapPin className="w-3 h-3 text-emerald-700" />
                {selectedDistrict}
                <button
                  onClick={() => onOpenLocationModal()}
                  className="text-emerald-700 hover:text-emerald-950 font-normal ml-1 underline"
                >
                  (बदलें)
                </button>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200">
                पूरा भारत (All India)
              </span>
            )}
            <span className="text-xs text-slate-400">• {totalResults} प्रॉपर्टीज मिलीं</span>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setDealType("All")}
              className={`px-3 py-1.5 rounded-lg transition ${
                dealType === "All"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              सभी (All)
            </button>
            <button
              onClick={() => setDealType("Sale")}
              className={`px-3 py-1.5 rounded-lg transition ${
                dealType === "Sale"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              खरीदना है (For Sale)
            </button>
            <button
              onClick={() => setDealType("Rent")}
              className={`px-3 py-1.5 rounded-lg transition ${
                dealType === "Rent"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              किराये पर (Rent)
            </button>
          </div>

        </div>

        <div className="flex items-center justify-between gap-3 overflow-x-auto pt-1 pb-1 scrollbar-none">
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                  category === cat.id
                    ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="newest">नई लिस्टिंग्स पहले</option>
              <option value="price_low">कीमत: कम से ज्यादा</option>
              <option value="price_high">कीमत: ज्यादा से कम</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
