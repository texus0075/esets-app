import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import StampLogo from "./StampLogo";

export default function AuthModal({ isOpen, onClose }) {
  const { login, signup, loginWithGoogle, loginWithDirectDetails } = useAuth();
  
  const [authMethod, setAuthMethod] = useState("direct"); // "direct" | "google" | "email"
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("owner"); // "owner" | "buyer"
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailSignup, setIsEmailSignup] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // 1. Direct Owner/Buyer Verification with Real Mobile Number
  const handleDirectSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("कृपया अपना नाम दर्ज करें।");
      return;
    }
    const cleanPhone = phone.trim().replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("कृपया सही 10-अंकों का मोबाइल नंबर दर्ज करें।");
      return;
    }

    try {
      loginWithDirectDetails(name.trim(), `+91 ${cleanPhone.slice(-10)}`, role);
      onClose();
    } catch (err) {
      setError(err.message || "लॉगिन करने में त्रुटि।");
    }
  };

  // 2. Google OAuth Sign-In
  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      console.error(err);
      if (err.code === "auth/configuration-not-found") {
        setError("Firebase Console में Google Provider अभी एक्टिवेट नहीं हुआ है। कृपया नीचे अपना नाम और मोबाइल नंबर डालकर तुरंत लॉगिन करें।");
        setAuthMethod("direct");
      } else if (err.code === "auth/popup-blocked") {
        setError("ब्राउज़र ने पॉपअप ब्लॉक कर दिया है। कृपया पॉपअप की अनुमति दें।");
      } else {
        setError(err.message || "Google ऑथेंटिकेशन पूरा नहीं हो सका।");
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. Email / Password
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isEmailSignup) {
        if (!name.trim()) throw new Error("कृपया अपना पूरा नाम लिखें।");
        await signup(email, password, name, phone);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      console.error(err);
      if (err.code === "auth/configuration-not-found") {
        setError("Firebase Console में Email Provider एक्टिवेट नहीं है। कृपया मोबाइल नंबर से डायरेक्ट लॉगिन करें।");
        setAuthMethod("direct");
      } else {
        setError(err.message || "लॉगिन विफल रहा।");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface rounded-3xl max-w-md w-full shadow-2xl border border-surface-container overflow-hidden my-auto text-on-surface animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 pb-4 border-b border-surface-container flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <StampLogo className="w-8 h-8" showText={false} />
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                लॉगिन / साइन-अप
              </h3>
              <p className="font-body-sm text-[11.5px] text-on-surface-variant">
                100% डायरेक्ट ओनर-टू-बायर • 0% ब्रोकरेज
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface active:scale-95 transition"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-4">
          
          {/* Method Selector Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-surface-container border border-surface-container-high">
            <button
              type="button"
              onClick={() => { setAuthMethod("direct"); setError(""); }}
              className={`py-2 px-3 rounded-lg font-label-md text-[12px] font-bold transition flex items-center justify-center gap-1.5 ${
                authMethod === "direct" 
                  ? "bg-primary text-surface shadow-xs" 
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>मोबाइल / नाम</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod("google"); setError(""); }}
              className={`py-2 px-3 rounded-lg font-label-md text-[12px] font-bold transition flex items-center justify-center gap-1.5 ${
                authMethod === "google" 
                  ? "bg-primary text-surface shadow-xs" 
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">account_circle</span>
              <span>Google / Email</span>
            </button>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-3 rounded-xl bg-error-container text-on-error-container font-body-sm text-[12px] flex items-start gap-2 leading-relaxed">
              <span className="material-symbols-outlined text-[18px] shrink-0 text-error">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: Direct Real Mobile & Name Entry */}
          {authMethod === "direct" && (
            <form onSubmit={handleDirectSubmit} className="space-y-3.5">
              <div>
                <label className="font-code-spec text-[10.5px] uppercase font-bold text-on-surface-variant block mb-1">
                  आपका पूरा असली नाम (Full Legal Name) *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="उदा. राहुल शर्मा"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface border border-surface-container text-body-sm text-[13.5px] focus:outline-none focus:ring-2 focus:ring-secondary/40"
                />
              </div>

              <div>
                <label className="font-code-spec text-[10.5px] uppercase font-bold text-on-surface-variant block mb-1">
                  मोबाइल नंबर (Direct Calling / WhatsApp) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-code-spec text-[12.5px] font-bold text-on-surface-variant">
                    +91
                  </span>
                  <input 
                    type="tel" 
                    required
                    maxLength={10}
                    placeholder="98XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-12 pr-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface border border-surface-container text-body-sm text-[13.5px] font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  />
                </div>
              </div>

              <div>
                <label className="font-code-spec text-[10.5px] uppercase font-bold text-on-surface-variant block mb-1.5">
                  आपकी भूमिका (Select Role)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("owner")}
                    className={`py-2 px-3 rounded-xl border text-[12px] font-bold flex items-center justify-center gap-1.5 transition ${
                      role === "owner"
                        ? "bg-secondary-container text-on-secondary-fixed border-secondary font-bold shadow-xs"
                        : "bg-surface-container-low border-surface-container text-on-surface-variant"
                    }`}
                  >
                    <span>🏠</span>
                    <span>प्रॉपर्टी ओनर</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("buyer")}
                    className={`py-2 px-3 rounded-xl border text-[12px] font-bold flex items-center justify-center gap-1.5 transition ${
                      role === "buyer"
                        ? "bg-secondary-container text-on-secondary-fixed border-secondary font-bold shadow-xs"
                        : "bg-surface-container-low border-surface-container text-on-surface-variant"
                    }`}
                  >
                    <span>🔍</span>
                    <span>खरीदार / बायर</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-primary text-surface font-label-md text-[13px] font-bold shadow-md hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2 mt-2"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>सत्यापित करें और लॉगिन करें</span>
              </button>
            </form>
          )}

          {/* TAB 2: Google 1-Tap OAuth & Email */}
          {authMethod === "google" && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs hover:bg-surface-container-low font-label-md text-label-md font-bold text-primary transition active:scale-98"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{loading ? "कनेक्ट हो रहा है..." : "Continue with Google"}</span>
              </button>

              <div className="flex items-center gap-2">
                <hr className="flex-1 border-surface-container" />
                <span className="text-[10px] font-code-spec font-bold text-on-surface-variant uppercase">
                  ईमेल द्वारा
                </span>
                <hr className="flex-1 border-surface-container" />
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-3">
                {isEmailSignup && (
                  <div>
                    <label className="font-code-spec text-[10.5px] uppercase font-bold text-on-surface-variant block mb-1">
                      पूरा नाम
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="आपका नाम"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-surface-container text-body-sm text-[13px] focus:outline-none focus:ring-2 focus:ring-secondary/40"
                    />
                  </div>
                )}

                <div>
                  <label className="font-code-spec text-[10.5px] uppercase font-bold text-on-surface-variant block mb-1">
                    ईमेल पता
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-surface-container text-body-sm text-[13px] focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  />
                </div>

                <div>
                  <label className="font-code-spec text-[10.5px] uppercase font-bold text-on-surface-variant block mb-1">
                    पासवर्ड
                  </label>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-surface-container text-body-sm text-[13px] focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-md text-label-md font-bold shadow-md hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isEmailSignup ? "person_add" : "login"}
                  </span>
                  <span>{loading ? "प्रोसेस हो रहा है..." : (isEmailSignup ? "अकाउंट बनाएं" : "ईमेल से लॉगिन")}</span>
                </button>

                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => setIsEmailSignup(!isEmailSignup)}
                    className="text-[11.5px] font-label-md text-on-surface-variant hover:text-primary transition"
                  >
                    {isEmailSignup ? "पहले से अकाउंट है? लॉगिन करें" : "नया अकाउंट बनाना है? यहाँ क्लिक करें"}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
