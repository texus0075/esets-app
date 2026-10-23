import React from "react";
import { 
  X, 
  Ban, 
  CheckCircle, 
  Trash2, 
  Eye, 
  ExternalLink, 
  PhoneCall, 
  PlusCircle, 
  AlertCircle 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function MyListingsModal({ 
  isOpen, 
  onClose, 
  myProperties, 
  onToggleSold, 
  onDeleteProperty,
  onOpenPostModal 
}) {
  const { currentUser } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>मेरे विज्ञापन और 'Sold It' डैशबोर्ड</span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                {myProperties.length} Ads
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              डील पक्की होने पर <strong>'Sold It'</strong> बटन दबाएं ताकि आपको और फालतू कॉल्स न आएं।
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {myProperties.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">आपने अभी तक कोई विज्ञापन नहीं डाला है</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                अपनी प्रॉपर्टी को 1 मिनट में फ्री में लिस्ट करें और सीधे खरीदारों से फोन पर बात करें।
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenPostModal();
                }}
                className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>नया विज्ञापन डालें</span>
              </button>
            </div>
          ) : (
            myProperties.map((prop) => {
              const displayImage = prop.images && prop.images[0]
                ? prop.images[0]
                : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80";

              return (
                <div 
                  key={prop.id} 
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    prop.isSold 
                      ? "bg-slate-50 border-slate-200 opacity-90" 
                      : "bg-white border-slate-200 hover:border-emerald-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img src={displayImage} alt={prop.title} className="w-full h-full object-cover" />
                      {prop.isSold && (
                        <div className="absolute inset-0 bg-rose-600/70 flex items-center justify-center text-[10px] font-black text-white">
                          SOLD
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-slate-900 text-sm">
                          {prop.priceUnit || `₹${prop.price.toLocaleString("en-IN")}`}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          prop.isSold ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {prop.isSold ? "बिक चुका है (कॉल बंद)" : "लाइव एक्टिव"}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs truncate max-w-sm" title={prop.title}>
                        {prop.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {prop.locality}, {prop.district} • {prop.views || 1} व्यूज
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <button
                      onClick={() => onToggleSold(prop.id, prop.isSold)}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-bold transition shadow-xs ${
                        prop.isSold
                          ? "bg-slate-800 hover:bg-slate-900 text-white"
                          : "bg-rose-600 hover:bg-rose-700 text-white active:scale-95 shadow-rose-600/20"
                      }`}
                      title={prop.isSold ? "विज्ञापन दोबारा लाइव करें" : "कॉल रोकने के लिए 'Sold It' दबाएं"}
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>{prop.isSold ? "दोबारा एक्टिव करें" : "'Sold It' (सोल्ड आउट)"}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm("क्या आप सच में इस विज्ञापन को हमेशा के लिए डिलीट करना चाहते हैं?")) {
                          onDeleteProperty(prop.id);
                        }
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="डिलीट करें"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>💡 <strong>'Sold It'</strong> दबाते ही खरीदारों को यह प्रॉपर्टी बिक चुकी दिखेगी और आपका नंबर हाइड हो जाएगा।</span>
          <button
            onClick={() => {
              onClose();
              onOpenPostModal();
            }}
            className="text-emerald-700 hover:text-emerald-800 font-bold shrink-0 ml-2"
          >
            + नई प्रॉपर्टी जोड़ें
          </button>
        </div>

      </div>
    </div>
  );
}
