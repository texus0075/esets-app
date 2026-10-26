import React, { useState, useRef } from "react";
import { 
  X, 
  Upload, 
  MapPin, 
  Plus, 
  Check, 
  Video, 
  Image as ImageIcon, 
  Sparkles,
  Phone,
  Building2,
  Camera,
  Trash2,
  Loader2,
  ShieldCheck,
  Link as LinkIcon
} from "lucide-react";
import { LOCATIONS } from "../data/locations";
import { formatIndianPriceToWords } from "../services/indianRealEstateCalculatorService";
import { useAuth } from "../context/AuthContext";
import { compressImageFile, applyWatermarkToCanvas } from "../services/imageAnalyzerService";

export default function PostPropertyModal({ isOpen, onClose, onAddProperty }) {
  const { currentUser } = useAuth();

  const [dealType, setDealType] = useState("Sale");
  const [category, setCategory] = useState("Apartment");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [bhk, setBhk] = useState("2");
  const [bathrooms, setBathrooms] = useState("2");
  const [furnishing, setFurnishing] = useState("Semi-Furnished");
  const [facing, setFacing] = useState("East Facing (Vastu)");
  const [ownership, setOwnership] = useState("Freehold Registry Deed");
  const [propertyStatus, setPropertyStatus] = useState("Ready to Move");

  const [selectedState, setSelectedState] = useState("Delhi");
  const [selectedDistrict, setSelectedDistrict] = useState("South Delhi");
  const [locality, setLocality] = useState("");
  const [pincode, setPincode] = useState("");
  const [description, setDescription] = useState("");

  const [imageUrls, setImageUrls] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState("");
  const fileInputRef = useRef(null);

  const [sellerName, setSellerName] = useState(currentUser?.displayName || "");
  const [sellerPhone, setSellerPhone] = useState(currentUser?.phoneNumber || "+91 98112 34567");

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const getFormattedPrice = () => {
    const num = Number(price);
    if (!num) return "";
    if (dealType === "Rent") {
      return `₹${num.toLocaleString("en-IN")} / माह`;
    }
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (imageUrls.length + files.length > 6) {
      alert("आप एक विज्ञापन के लिए अधिकतम 6 असली फ़ोटो अपलोड कर सकते हैं।");
      return;
    }

    setIsCompressing(true);
    try {
      const processed = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCompressionProgress(`फ़ोटो ${i + 1}/${files.length} कंप्रेस एवं 0% ब्रोकरेज वाटरमार्क हो रही है...`);
        // High quality web worker/canvas compression down to ~40-60KB
        const compressed = await compressImageFile(file, 960, 720, 0.72);
        // Anti-theft watermark protection stamp
        const watermarked = await applyWatermarkToCanvas(
          compressed,
          "ESETS 0% BROKERAGE",
          dealType === "Rent" ? "RENTAL DIRECT" : "FREEHOLD DEED"
        );
        processed.push(watermarked);
      }
      setImageUrls(prev => [...prev, ...processed]);
    } catch (err) {
      console.error("Image processing error:", err);
      alert("फ़ोटो प्रोसेस करने में समस्या आई: " + (err.message || "कृपया दूसरी फ़ोटो चुनें"));
    } finally {
      setIsCompressing(false);
      setCompressionProgress("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl("");
      setShowUrlInput(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !price || !locality.trim() || !sellerPhone.trim()) {
      alert("कृपया सभी आवश्यक फ़ील्ड भरें।");
      return;
    }

    setIsSubmitting(true);

    const propertyData = {
      title: title.trim(),
      category,
      dealType,
      price: Number(price),
      priceUnit: getFormattedPrice(),
      area: Number(area) || 0,
      bhk: category === "Plot" || category === "Commercial" ? 0 : Number(bhk),
      bathrooms: Number(bathrooms) || 1,
      furnishing,
      facing,
      ownership,
      status: propertyStatus,
      state: selectedState,
      district: selectedDistrict,
      locality: locality.trim(),
      pincode: pincode.trim(),
      description: description.trim(),
      images: imageUrls.length > 0 ? imageUrls : [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
      ],
      videoUrl: videoUrl.trim(),
      sellerName: sellerName.trim() || "प्रॉपर्टी ओनर",
      sellerPhone: sellerPhone.trim(),
      sellerType: "Owner",
      postedAt: "अभी-अभी",
      userId: currentUser?.uid || "guest"
    };

    setTimeout(() => {
      onAddProperty(propertyData);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const activeDistricts = LOCATIONS.find(l => l.state === selectedState)?.districts || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">प्रॉपर्टी लिस्ट करें (Free Ad)</h3>
              <p className="text-xs text-slate-500">सीधे खरीदार या किरायेदार से जुड़ें — 0% ब्रोकरेज</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">डील का प्रकार (Deal Type) *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDealType("Sale")}
                  className={`py-2 px-3 rounded-xl font-bold border transition ${
                    dealType === "Sale"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  बेचना है (For Sale)
                </button>
                <button
                  type="button"
                  onClick={() => setDealType("Rent")}
                  className={`py-2 px-3 rounded-xl font-bold border transition ${
                    dealType === "Rent"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  किराये पर देना है (For Rent)
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1.5">प्रॉपर्टी कैटेगरी *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Apartment", "House", "Plot", "Commercial"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition ${
                      category === cat
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {cat === "Apartment" && "अपार्टमेंट / फ्लैट"}
                    {cat === "House" && "मकान / कोठी"}
                    {cat === "Plot" && "प्लॉट / जमीन"}
                    {cat === "Commercial" && "कमर्शियल"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-800 block mb-1">
                विज्ञापन का शीर्षक (Title) *
              </label>
              <input
                type="text"
                required
                placeholder="जैसे: 3 BHK लग्जरी बिल्डर फ्लोर लिफ्ट और पार्किंग के साथ"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                कीमत (₹) * {getFormattedPrice() && <span className="text-emerald-700 font-extrabold ml-1">({getFormattedPrice()})</span>}
              </label>
              <input
                type="number"
                required
                placeholder="जैसे 4500000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold"
              />
              {price && (
                <p className="text-[11px] text-emerald-800 font-bold mt-1">
                  {formatIndianPriceToWords(price)} • 0% ब्रोकरेज
                </p>
              )}
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                सुपर एरिया (Sq. Feet)
              </label>
              <input
                type="number"
                placeholder="जैसे 1200"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              {area && (
                <p className="text-[11px] text-slate-500 font-mono mt-1">
                  ≈ {(Number(area) / 9).toFixed(1)} गज (Gaj)
                </p>
              )}
            </div>
          </div>

          {/* RightHome Vastu, Title & Readiness Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">दिशा (Facing / Vastu)</label>
              <select
                value={facing}
                onChange={(e) => setFacing(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="East Facing (Vastu)">ईस्ट फेसिंग (वास्तु)</option>
                <option value="North-East (ईशान)">नॉर्थ-ईस्ट (ईशान कोण)</option>
                <option value="North Facing">नॉर्थ फेसिंग</option>
                <option value="West Facing">वेस्ट फेसिंग</option>
                <option value="South Facing">साउथ फेसिंग</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">दस्तावेज (Ownership Title)</label>
              <select
                value={ownership}
                onChange={(e) => setOwnership(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="Freehold Registry Deed">फ्रीहोल्ड रजिस्ट्री (Freehold)</option>
                <option value="Society Patta / Lease">सोसायटी पट्टा / लीज</option>
                <option value="Power of Attorney (POA)">पॉवर ऑफ अटॉर्नी (POA)</option>
                <option value="Authority Allotment">प्राधिकरण आवंटन (DDA/JDA)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">स्टेटस (Status)</label>
              <select
                value={propertyStatus}
                onChange={(e) => setPropertyStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="Ready to Move">रेडी टू मूव (Ready to Move)</option>
                <option value="Under Construction">निर्माणाधीन (Under Construction)</option>
                <option value="Immediate Registry">तत्काल रजिस्ट्री उपलब्ध</option>
              </select>
            </div>
          </div>

          {category !== "Plot" && category !== "Commercial" && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">कमरे (BHK)</label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5+ BHK</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">बाथरूम</label>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">फर्निशिंग</label>
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="Fully-Furnished">फुल्ली फर्निश्ड</option>
                  <option value="Semi-Furnished">सेमी फर्निश्ड</option>
                  <option value="Unfurnished">अनफर्निश्ड</option>
                </select>
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
            <span className="font-extrabold text-emerald-950 block text-xs uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" /> लोकेशन और जिला (Location Engine) *
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">राज्य / प्रदेश</label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    const newDistricts = LOCATIONS.find(l => l.state === e.target.value)?.districts || [];
                    if (newDistricts.length > 0) setSelectedDistrict(newDistricts[0]);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-bold"
                >
                  {LOCATIONS.map(l => (
                    <option key={l.state} value={l.state}>{l.state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">जिला (District) *</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-emerald-900"
                >
                  {activeDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">कॉलोनी / लोकैलिटी / लैंडमार्क *</label>
                <input
                  type="text"
                  required
                  placeholder="जैसे सेक्टर 57, रोहिणी सेक्टर 11, मॉल रोड..."
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">पिनकोड</label>
                <input
                  type="text"
                  placeholder="जैसे 110001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              प्रॉपर्टी का पूरा विवरण (Description)
            </label>
            <textarea
              rows={3}
              placeholder="पानी, बिजली, गैस पाइपलाइन, फेसिंग (East/North), पार्किंग आदि की जानकारी लिखें..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" /> असली फ़ोटो अपलोड करें (100% Free Real Storage)
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                {imageUrls.length}/6 फ़ोटो
              </span>
            </div>

            {/* Hidden File Input for Gallery / Camera */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Interactive Upload Box */}
            <div
              onClick={() => !isCompressing && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                isCompressing
                  ? "border-emerald-400 bg-emerald-50/50 cursor-wait"
                  : "border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/30 bg-white"
              }`}
            >
              {isCompressing ? (
                <div className="flex flex-col items-center justify-center py-2 space-y-2">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                  <p className="text-xs font-bold text-emerald-800 animate-pulse">
                    {compressionProgress || "फ़ोटो प्रोसेस हो रही है..."}
                  </p>
                  <span className="text-[10px] text-slate-500 font-medium">
                    (स्वचालित 60KB वेबपी कंप्रेशन और 0% ब्रोकरेज वाटरमार्क स्टैंप)
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
                  <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-slate-800 text-sm">
                    फ़ोटो चुनें (गैलरी से लें या कैमरा से खींचें)
                  </div>
                  <p className="text-slate-500 text-[11px] max-w-sm">
                    सीधे अपने फोन या कंप्यूटर से असली फ़ोटो लगाएं। 0% ब्रोकरेज वाटरमार्क लगकर क्लाउड पर सुरक्षित सेव होगी।
                  </p>
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>0% ब्रोकरेज एंटी-दलाल वाटरमार्क सुरक्षित</span>
                  </div>
                </div>
              )}
            </div>

            {/* Photo Previews */}
            {imageUrls.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 block">
                  अपलोड की गई फ़ोटो (पहली फ़ोटो कवर फ़ोटो बनेगी):
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-xs">
                      <img src={url} alt={`Property upload ${i + 1}`} className="w-full h-full object-cover" />
                      
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 bg-emerald-800/90 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
                          ⭐ कवर फ़ोटो
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(i);
                        }}
                        title="Delete photo"
                        className="absolute top-1 right-1 w-6 h-6 bg-rose-600 text-white rounded-full flex items-center justify-center text-xs shadow hover:bg-rose-700 active:scale-90 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Toggleable URL input fallback */}
            <div className="pt-1">
              {!showUrlInput ? (
                <button
                  type="button"
                  onClick={() => setShowUrlInput(true)}
                  className="text-[11px] font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>या इमेज का वेब URL लिंक जोड़ें</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    placeholder="फोटो का इमेज URL डालें (उदा. https://...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shrink-0"
                  >
                    + जोड़ें
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(false)}
                    className="py-2 px-2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    रद्द
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200/80">
              <label className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-red-500" />
                <span>360° या वीडियो टूर लिंक (MP4 / Web Video - ऐच्छिक)</span>
              </label>
              <input
                type="url"
                placeholder="जैसे: https://www.w3schools.com/html/mov_bbb.mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <label className="font-bold text-slate-800 block mb-1">आपका नाम *</label>
              <input
                type="text"
                required
                placeholder="जैसे राजेश कुमार"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">मोबाइल नंबर (कॉलिंग हेतु) *</label>
              <input
                type="tel"
                required
                placeholder="+91 98112 34567"
                value={sellerPhone}
                onChange={(e) => setSellerPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-emerald-800"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? "पब्लिश हो रहा है..." : "विज्ञापन लाइव पब्लिश करें"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
