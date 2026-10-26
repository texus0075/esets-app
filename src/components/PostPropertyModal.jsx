import React, { useState } from "react";
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
  Building2
} from "lucide-react";
import { LOCATIONS } from "../data/locations";
import { formatIndianPriceToWords } from "../services/indianRealEstateCalculatorService";
import { useAuth } from "../context/AuthContext";

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

  const [imageUrls, setImageUrls] = useState([
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  ]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

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

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl("");
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
            <span className="font-extrabold text-slate-900 block text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-slate-600" /> फोटो और वीडियो टूर
            </span>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 group">
                  <img src={url} alt="prop" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center text-xs opacity-80 hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
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
                + फ़ोटो जोड़ें
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200/80">
              <label className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-red-500" />
                <span>360° या वीडियो टूर लिंक (MP4 / Web Video)</span>
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
