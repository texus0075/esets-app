import React, { useState, useEffect, useMemo } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import SafetyBanner from "./components/SafetyBanner";
import FilterBar from "./components/FilterBar";
import PropertyCard from "./components/PropertyCard";
import PropertyDetailModal from "./components/PropertyDetailModal";
import PostPropertyModal from "./components/PostPropertyModal";
import LocationModal from "./components/LocationModal";
import MyListingsModal from "./components/MyListingsModal";
import SubscriptionModal from "./components/SubscriptionModal";
import AuthModal from "./components/AuthModal";
import { 
  fetchProperties, 
  createProperty, 
  toggleSoldStatus, 
  deleteProperty 
} from "./services/propertyService";
import { 
  Building2, 
  MapPin, 
  PlusCircle, 
  Sparkles,
  PhoneCall,
  CheckCircle2,
  ShieldCheck,
  Crown,
  Ban,
  ArrowRight,
  Compass,
  MessageCircle
} from "lucide-react";

function MainContent() {
  const { currentUser } = useAuth();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDistrict, setSelectedDistrict] = useState("South Delhi");
  const [dealType, setDealType] = useState("All");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isMyListingsOpen, setIsMyListingsOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchProperties();
      setProperties(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleAddProperty = async (propertyData) => {
    const newProp = await createProperty(propertyData, currentUser?.uid);
    setProperties(prev => [newProp, ...prev]);
    alert("🎉 आपका विज्ञापन सफलतापूर्वक लाइव पब्लिश हो गया है!");
  };

  const handleToggleSold = async (propertyId, currentStatus) => {
    const updated = await toggleSoldStatus(propertyId, currentStatus);
    setProperties(updated);
    if (selectedProperty && selectedProperty.id === propertyId) {
      setSelectedProperty(prev => ({ ...prev, isSold: !currentStatus }));
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    const updated = await deleteProperty(propertyId);
    setProperties(updated);
    if (selectedProperty && selectedProperty.id === propertyId) {
      setSelectedProperty(null);
    }
  };

  const handleCallClick = (property, e) => {
    if (!currentUser) {
      e.preventDefault();
      setIsAuthModalOpen(true);
    }
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(item => {
      if (selectedDistrict && selectedDistrict !== "" && item.district !== selectedDistrict) {
        return false;
      }
      if (dealType !== "All" && item.dealType !== dealType) {
        return false;
      }
      if (category !== "All" && item.category !== category) {
        return false;
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesLocality = item.locality?.toLowerCase().includes(query);
        const matchesDistrict = item.district?.toLowerCase().includes(query);
        const matchesPrice = item.priceUnit?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLocality && !matchesDistrict && !matchesPrice) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price_low") return a.price - b.price;
      if (sortBy === "price_high") return b.price - a.price;
      return 0;
    });
  }, [properties, selectedDistrict, dealType, category, searchTerm, sortBy]);

  const myProperties = useMemo(() => {
    if (!currentUser) return [];
    return properties.filter(p => p.userId === currentUser.uid || currentUser.isDemo);
  }, [properties, currentUser]);

  const quickDistricts = ["South Delhi", "Gurugram", "West Delhi", "Noida", "Central Delhi"];

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col selection:bg-[#87A168] selection:text-white">
      
      {/* Navbar with Video Concept 3 Tokens */}
      <Navbar
        selectedDistrict={selectedDistrict}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenPostModal={() => {
          if (!currentUser) {
            setIsAuthModalOpen(true);
          } else {
            setIsPostModalOpen(true);
          }
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
        onOpenMyListings={() => setIsMyListingsOpen(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Safety Shield Banner */}
      <SafetyBanner />

      {/* =========================================================================
          HERO SECTION: Video Concept 3 (60-30-10 Warm Earth & Prestige Architecture)
          60% Dominant: Deep Sage/Forest Dark Earth (#1B2416)
          30% Secondary: Walnut Brown & Architectural Warm Ivory Cards
          10% Accent: Radiant Amber Glow (#D5810F) Triggers
         ========================================================================= */}
      <section className="earth-gradient-hero text-white py-10 sm:py-14 px-4 sm:px-6 relative overflow-hidden border-b border-[#563E28]/30">
        
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#87A168]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#D5810F]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          
          {/* Top Live Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#87A168]/20 border border-[#87A168]/40 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#D5810F] shadow-[0_0_8px_#D5810F]" />
            <span className="text-[11px] sm:text-xs font-bold text-[#EAF1E4] tracking-wide uppercase">
              OLX FOR REAL ESTATE • 100% डायरेक्ट C2C • 0% ब्रोकरेज
            </span>
          </div>

          {/* Mobile-First Clamped Headline */}
          <div className="space-y-3 max-w-3xl">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              सीधे मकान मालिक से प्रॉपर्टी खरीदें और बेचें —{" "}
              <span className="text-[#D5810F] drop-shadow-sm">
                ₹0 ब्रोकरेज, नो मिडलमैन कमीशन।
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[#EADDD0] leading-relaxed max-w-2xl">
              बिना किसी डीलर, ब्रोकर या बिचौलिए के। अपना पसंदीदा जिला चुनें, असली ओनर से 1-टैप में सीधे फोन या व्हाट्सएप पर बात करें, और खुद मौके पर जाकर रजिस्ट्री पेपर्स देखकर डील फाइनल करें।
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => {
                if (!currentUser) setIsAuthModalOpen(true);
                else setIsPostModalOpen(true);
              }}
              className="amber-glow-btn flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs sm:text-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>मुफ्त प्रॉपर्टी लिस्ट करें (0% ब्रोकरेज)</span>
            </button>

            <button
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#563E28]/80 hover:bg-[#563E28] text-[#FEF6EC] border border-[#D5810F]/30 font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              <Crown className="w-4 h-4 text-[#D5810F]" />
              <span>डीलर & बिल्डर सब्सक्रिप्शन (₹8,000/माह)</span>
            </button>
          </div>

          {/* Luxury Micro Action Cards (Value & Trust Architecture) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
            
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#87A168]/30 border border-[#87A168]/40 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5 text-[#87A168]" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-[#D5810F]">🟢 सीधा 1-टैप कॉल</div>
                <div className="text-xs font-bold text-white truncate">मालिक से डायरेक्ट बातचीत</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/25 border border-rose-400/40 flex items-center justify-center shrink-0">
                <Ban className="w-5 h-5 text-rose-300" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-rose-300">🛑 'Sold It' कॉल शील्ड</div>
                <div className="text-xs font-bold text-white truncate">डील होते ही कॉल्स बंद</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D5810F]/25 border border-[#D5810F]/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#D5810F]" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-[#EADDD0]">🛡️ 100% एंटी-फ्रॉड</div>
                <div className="text-xs font-bold text-white truncate">नो ऑनलाइन एडवांस टोकन</div>
              </div>
            </div>

          </div>

          {/* Quick District Picker Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#EADDD0]/80 font-medium">पॉपुलर जिले:</span>
            {quickDistricts.map(dist => (
              <button
                key={dist}
                onClick={() => setSelectedDistrict(dist)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition border cursor-pointer ${
                  selectedDistrict === dist
                    ? "bg-[#D5810F] text-white border-[#D5810F] shadow-sm"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                }`}
              >
                {dist}
              </button>
            ))}
            <button
              onClick={() => setSelectedDistrict("")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition border cursor-pointer ${
                selectedDistrict === ""
                  ? "bg-[#D5810F] text-white border-[#D5810F]"
                  : "bg-white/10 hover:bg-white/20 text-[#EADDD0] border-white/20"
              }`}
            >
              पूरा भारत
            </button>
          </div>

        </div>
      </section>

      {/* Filter Bar with Warm Earth System */}
      <FilterBar
        dealType={dealType}
        setDealType={setDealType}
        category={category}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedDistrict={selectedDistrict}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        totalResults={filteredProperties.length}
      />

      {/* Main Property Listings Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#87A168] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-[#563E28]">आपके जिले की प्रॉपर्टीज लोड हो रही हैं...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#563E28]/15 p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
            <div className="w-16 h-16 bg-[#F8F7F4] rounded-2xl flex items-center justify-center mx-auto border border-[#563E28]/10">
              <MapPin className="w-8 h-8 text-[#87A168]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1B2416]">
                {selectedDistrict} में अभी कोई एक्टिव लिस्टिंग नहीं है
              </h3>
              <p className="text-xs text-[#563E28]/80 mt-1">
                आप इस जिले में पहली प्रॉपर्टी लिस्ट कर सकते हैं या दूसरे जिले की प्रॉपर्टीज देख सकते हैं।
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setSelectedDistrict("")}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#563E28] hover:bg-[#3A2818] text-white font-bold text-xs transition"
              >
                पूरे भारत की प्रॉपर्टीज देखें
              </button>
              <button
                onClick={() => {
                  if (!currentUser) setIsAuthModalOpen(true);
                  else setIsPostModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl amber-glow-btn font-bold text-xs"
              >
                इस जिले में प्रॉपर्टी लिस्ट करें
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(0, 1fr))" }}>
            {filteredProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={(p) => setSelectedProperty(p)}
                onCallClick={handleCallClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Unified Multi-Column Footer (Workspace Rule 6) */}
      <footer className="bg-[#1B2416] text-[#EADDD0] border-t border-[#563E28]/40 pt-10 pb-8 px-4 sm:px-6 text-xs">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Column 1: Brand Trust */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#563E28] to-[#87A168] flex items-center justify-center text-white">
                  <Building2 className="w-5 h-5 text-[#FEF6EC]" />
                </div>
                <span className="text-xl font-black text-white">
                  Esets<span className="text-[#D5810F]">.</span>
                </span>
              </div>
              <p className="text-xs text-[#EADDD0]/75 leading-relaxed">
                भारत का पहला निष्पक्ष और समर्पित C2C रियल एस्टेट डायरेक्ट मार्केटप्लेस। खरीदार और मकान मालिक के बीच शून्य ब्रोकरेज व सीधा संपर्क।
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#87A168]/20 text-[#87A168] text-[10px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% C2C Verified Network
              </div>
            </div>

            {/* Column 2: Core Features */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">मुख्य फीचर्स</h4>
              <ul className="space-y-1.5 text-xs text-[#EADDD0]/80">
                <li>• 0% ब्रोकरेज डायरेक्ट कॉलिंग</li>
                <li>• 'Sold It' वन-टैप कॉल स्टॉप शील्ड</li>
                <li>• 360° वीडियो वॉकथ्रू टूर</li>
                <li>• सैटेलाइट लोकेशन व एरिया मैप्स</li>
                <li>• डीलर व बिल्डर प्रो सब्सक्रिप्शन</li>
              </ul>
            </div>

            {/* Column 3: Top Sectors */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">टॉप लोकेशन्स</h4>
              <ul className="space-y-1.5 text-xs text-[#EADDD0]/80">
                <li>• ग्रेटर कैलाश व साउथ दिल्ली</li>
                <li>• गोल्फ कोर्स रोड व गुरुग्राम</li>
                <li>• जनकपुरी व वेस्ट दिल्ली</li>
                <li>• सेक्टर 62 व 150 नोएडा</li>
                <li>• द्वारका एक्सप्रेसवे प्रोजेक्ट्स</li>
              </ul>
            </div>

            {/* Column 4: Contact & Anti-Fraud */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">सुरक्षा व संपर्क</h4>
              <p className="text-xs text-[#EADDD0]/75">
                किसी भी ऑनलाइन एडवांस फ्रॉड से बचें। सिर्फ मौके पर जाकर असली पेपर्स देखकर ही डील करें।
              </p>
              <div className="pt-1">
                <button
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="w-full py-2 px-3 rounded-lg bg-[#563E28] hover:bg-[#3A2818] text-[#FEF6EC] font-bold text-xs border border-[#D5810F]/30 transition"
                >
                  डीलर पार्टनरशिप इंक्वायरी
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[#563E28]/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#EADDD0]/60 text-[11px]">
            <div>
              © 2026 Esets App. All rights reserved. Video Concept 3 Architecture.
            </div>
            <div className="flex items-center gap-4">
              <span>0% Brokerage Guarantee</span>
              <span>•</span>
              <span>Direct C2C Marketplace</span>
              <span>•</span>
              <span>Anti-Fraud Protected</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Interactive Modals */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onToggleSold={handleToggleSold}
        currentUserId={currentUser?.uid}
      />

      <PostPropertyModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onAddProperty={handleAddProperty}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={(district) => setSelectedDistrict(district)}
      />

      <MyListingsModal
        isOpen={isMyListingsOpen}
        onClose={() => setIsMyListingsOpen(false)}
        myProperties={myProperties}
        onToggleSold={handleToggleSold}
        onDeleteProperty={handleDeleteProperty}
        onOpenPostModal={() => setIsPostModalOpen(true)}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
