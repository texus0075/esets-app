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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#563E28]/15 shadow-xs w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#563E28] to-[#87A168] flex items-center justify-center text-white shadow-md shadow-[#563E28]/20 shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#FEF6EC]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1B2416] flex items-center gap-0.5">
                Esets<span className="text-[#D5810F]">.</span>
              </span>
              <span className="hidden sm:block text-[10px] font-bold text-[#563E28]/80 tracking-wider uppercase -mt-1">
                Direct C2C Real Estate
              </span>
            </div>
          </div>

          {/* Location Selector Pill */}
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#F8F7F4] hover:bg-[#EADDD0]/50 text-[#1B2416] text-xs sm:text-sm font-semibold transition border border-[#563E28]/20 group max-w-[125px] sm:max-w-xs shrink"
            title="अपनी लोकेशन या जिला बदलें"
          >
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#87A168] shrink-0 group-hover:animate-bounce" />
            <div className="text-left truncate min-w-0">
              <span className="hidden sm:block text-[10px] text-[#563E28]/70 font-medium leading-none">लोकेशन / जिला:</span>
              <span className="truncate block font-bold text-[#1B2416] text-xs">
                {selectedDistrict || "सभी जिले"}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-[#563E28]/70 shrink-0 ml-auto hidden sm:block" />
          </button>

          {/* Quick Search */}
          <div className="hidden lg:flex flex-1 max-w-sm relative items-center">
            <Search className="w-4 h-4 text-[#563E28]/60 absolute left-3.5" />
            <input
              type="text"
              placeholder="सोसायटी, एरिया या बजट सर्च करें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8F7F4] border border-[#563E28]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#87A168]/30 focus:border-[#87A168] transition text-[#1B2416]"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 text-xs text-[#563E28]/60 hover:text-[#1B2416]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={onOpenSubscriptionModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FEF6EC] hover:bg-[#FEF6EC]/90 text-[#563E28] border border-[#D5810F]/30 text-xs font-bold transition shadow-xs"
            >
              <Crown className="w-3.5 h-3.5 text-[#D5810F] fill-[#D5810F]" />
              <span>डीलर सब्सक्रिप्शन</span>
            </button>

            {currentUser && (
              <button
                onClick={onOpenMyListings}
                className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#F8F7F4] hover:bg-[#EADDD0]/50 text-[#1B2416] text-xs sm:text-sm font-semibold transition border border-[#563E28]/15"
                title="मेरे विज्ञापन और 'Sold It' डैशबोर्ड"
              >
                <Layers className="w-3.5 h-3.5 text-[#87A168]" />
                <span className="hidden sm:inline">मेरे विज्ञापन</span>
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EAF1E4] text-[#526B3C] font-bold flex items-center justify-center text-xs border border-[#87A168]/40">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : "U"}
                  </div>
                  <span className="hidden xl:block text-xs font-bold text-[#1B2416] max-w-[100px] truncate">
                    {currentUser.displayName}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-[#563E28]/50 hover:text-rose-600 transition"
                  title="लॉगआउट करें"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-[#1B2416] hover:bg-[#F8F7F4] text-xs sm:text-sm font-bold transition"
              >
                <User className="w-3.5 h-3.5 text-[#563E28]" />
                <span>लॉगिन</span>
              </button>
            )}

            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl amber-glow-btn text-white font-bold text-xs sm:text-sm transition active:scale-95 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">लिस्ट करें</span>
              <span className="xs:hidden">लिस्ट</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
