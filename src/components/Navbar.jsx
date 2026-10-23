import React from "react";
import { 
  Building2, 
  MapPin, 
  PlusCircle, 
  User, 
  LogOut, 
  Crown, 
  ChevronDown, 
  Layers,
  Search
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ 
  selectedDistrict, 
  onOpenLocationModal, 
  onOpenPostModal, 
  onOpenAuthModal, 
  onOpenSubscriptionModal,
  onOpenMyListings,
  searchTerm,
  setSearchTerm
}) {
  const { currentUser, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                Esets<span className="text-emerald-600">.</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-slate-600 tracking-wider uppercase -mt-1">
                Direct C2C Real Estate
              </span>
            </div>
          </div>

          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-sm font-semibold transition border border-slate-200/80 group max-w-[220px] sm:max-w-xs"
            title="अपनी लोकेशन या जिला बदलें"
          >
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 group-hover:animate-bounce" />
            <div className="text-left truncate">
              <span className="text-[10px] text-slate-600 font-medium block leading-none">लोकेशन / जिला:</span>
              <span className="truncate block font-bold text-slate-900 text-xs sm:text-sm">
                {selectedDistrict || "सभी जिले (All India)"}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-600 shrink-0 ml-auto" />
          </button>

          <div className="hidden md:flex flex-1 max-w-sm relative items-center">
            <Search className="w-4 h-4 text-slate-600 absolute left-3.5" />
            <input
              type="text"
              placeholder="सोसायटी, एरिया या बजट सर्च करें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-slate-800"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 text-xs text-slate-600 hover:text-slate-800"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenSubscriptionModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200 text-xs font-bold transition shadow-xs"
            >
              <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>डीलर सब्सक्रिप्शन</span>
            </button>

            {currentUser && (
              <button
                onClick={onOpenMyListings}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition"
                title="मेरे विज्ञापन और 'Sold It' डैशबोर्ड"
              >
                <Layers className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">मेरे विज्ञापन</span>
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 pl-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs border border-emerald-300">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : "U"}
                  </div>
                  <span className="hidden xl:block text-xs font-bold text-slate-800 max-w-[100px] truncate">
                    {currentUser.displayName}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 transition"
                  title="लॉगआउट करें"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-bold transition"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>लॉगिन</span>
              </button>
            )}

            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>प्रॉपर्टी बेचें / लिस्ट करें</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
