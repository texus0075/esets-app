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
  SlidersHorizontal, 
  Search, 
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Users
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white">
      
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

      <SafetyBanner />

      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/60 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>100% डायरेक्ट कस्टमर-टू-कस्टमर (C2C) • 0% ब्रोकरेज</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {selectedDistrict ? (
                <span><strong>{selectedDistrict}</strong> में सीधे मालिकों की प्रॉपर्टीज</span>
              ) : (
                <span>भारत भर में सीधे मालिकों की प्रॉपर्टीज</span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              बिना किसी बिचौलिए या ब्रोकरेज के — मालिक से सीधा फोन पर संपर्क करें और मौके पर जाकर बात करें।
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-sm transition active:scale-95"
            >
              <span>डीलर सब्सक्रिप्शन (₹8,000/माह)</span>
            </button>

            <button
              onClick={() => {
                if (!currentUser) setIsAuthModalOpen(true);
                else setIsPostModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>प्रॉपर्टी लिस्ट करें</span>
            </button>
          </div>
        </div>
      </section>

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-600">आपके जिले की प्रॉपर्टीज लोड हो रही हैं...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <MapPin className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {selectedDistrict} में अभी कोई एक्टिव लिस्टिंग नहीं है
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                आप इस जिले में पहली प्रॉपर्टी लिस्ट कर सकते हैं या दूसरे जिले की प्रॉपर्टीज देख सकते हैं।
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setSelectedDistrict("")}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                पूरे भारत की प्रॉपर्टीज देखें
              </button>
              <button
                onClick={() => {
                  if (!currentUser) setIsAuthModalOpen(true);
                  else setIsPostModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                इस जिले में प्रॉपर्टी लिस्ट करें
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span className="font-black text-slate-900 text-sm">Esets</span>
            <span>— डायरेक्ट C2C रियल एस्टेट मार्केटप्लेस</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>🛡️ 100% नो एडवांस फ्रॉड प्रोटेक्शन</span>
            <span>📍 हाइपर-लोकल डिस्ट्रिक्ट एल्गोरिदम</span>
            <span>✅ 'Sold It' कॉल स्टॉप सुरक्षा</span>
          </div>
          <div className="text-slate-400">
            © 2026 Esets App. All rights reserved.
          </div>
        </div>
      </footer>

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
