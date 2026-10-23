import React, { useState } from "react";
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  CheckCircle, 
  Sparkles 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ isOpen, onClose }) {
  const { login, signup, loginWithGoogle, loginAsDemo } = useAuth();
  
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        if (!name.trim()) throw new Error("कृपया अपना नाम लिखें");
        await signup(email, password, name, phone);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "लॉगिन करने में समस्या हुई। कृपया दोबारा प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = (role) => {
    loginAsDemo(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {isSignup ? "नया अकाउंट बनाएं" : "Esets में लॉगिन करें"}
            </h3>
            <p className="text-xs text-slate-500">प्रॉपर्टी लिस्ट करने या ओनर से बात करने के लिए</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 flex items-center justify-center text-slate-600 transition shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <span className="text-[11px] font-extrabold uppercase text-emerald-900 tracking-wider block flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> तुरंत टेस्ट करने के लिए 1-क्लिक लॉगिन:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemo("owner")}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs"
              >
                🏠 ओनर (मकान मालिक)
              </button>
              <button
                type="button"
                onClick={() => handleDemo("buyer")}
                className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs"
              >
                🔍 बायर (खरीदार)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 my-2">
            <hr className="flex-1 border-slate-200" />
            <span className="text-[11px] font-bold text-slate-400 uppercase">या ईमेल से जारी रखें</span>
            <hr className="flex-1 border-slate-200" />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
            {isSignup && (
              <>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">पूरा नाम *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="जैसे राजेश कुमार"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">मोबाइल नंबर (कॉलिंग हेतु)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      placeholder="+91 98112 34567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">ईमेल एड्रेस *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">पासवर्ड *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? "लोड हो रहा है..." : isSignup ? "साइन अप करें" : "लॉगिन करें"}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError("");
              }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition"
            >
              {isSignup ? "पहले से अकाउंट है? लॉगिन करें" : "नया अकाउंट बनाना चाहते हैं? यहाँ क्लिक करें"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
