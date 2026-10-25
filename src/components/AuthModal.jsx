import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import StampLogo from "./StampLogo";

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
        if (!name.trim()) throw new Error("Please enter your full name.");
        await signup(email, password, name, phone);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Google authentication was canceled or blocked.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = (role) => {
    loginAsDemo(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface rounded-3xl max-w-md w-full shadow-2xl border border-surface-container overflow-hidden my-auto text-on-surface animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-surface-container flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <StampLogo className="w-7 h-7" showText={false} />
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                {isSignup ? "Create Free Account" : "Sign In to Esets"}
              </h3>
              <p className="font-body-sm text-[11px] text-on-surface-variant">
                100% Direct C2C Real Estate • Zero Brokerage
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-4">
          
          {/* 1. Fast Google 1-Tap OAuth Button (100% Free, Zero SMS Cost) */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs hover:bg-surface-container-low font-label-md text-label-md font-bold text-primary transition active:scale-98"
          >
            {/* Google Multi-Color SVG Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* 2. Instant 1-Click Demo Profiles */}
          <div className="p-3 rounded-2xl bg-surface-container border border-surface-container-high space-y-2">
            <span className="text-[10.5px] font-code-spec font-bold uppercase text-on-surface-variant tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-secondary">flash_on</span>
              <span>1-Click Instant Test Mode (No Password Needed):</span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn("owner")}
                className="py-2 px-3 rounded-xl bg-primary text-surface font-label-md text-[11.5px] font-bold shadow-xs hover:opacity-95 transition"
              >
                🏡 Verified Owner
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn("buyer")}
                className="py-2 px-3 rounded-xl bg-surface-container-highest text-primary font-label-md text-[11.5px] font-bold shadow-xs hover:bg-surface-dim transition"
              >
                🔍 Direct Buyer
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <hr className="flex-1 border-surface-container" />
            <span className="text-[10px] font-code-spec font-bold text-on-surface-variant uppercase">
              or use email
            </span>
            <hr className="flex-1 border-surface-container" />
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-2.5 rounded-xl bg-error-container text-on-error-container font-body-sm text-[12px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignup && (
              <>
                <div>
                  <label className="font-code-spec text-[10.5px] uppercase font-bold text-on-surface-variant block mb-1">
                    Full Legal Name
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Vikramaditya Rao"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-surface-container text-body-sm text-[13px] focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  />
                </div>
                <div>
                  <label className="font-code-spec text-[10.5px] uppercase font-bold text-on-surface-variant block mb-1">
                    Phone Number (Calling Shield Enabled)
                  </label>
                  <input 
                    type="tel" 
                    placeholder="+91 98800 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-surface-container text-body-sm text-[13px] focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  />
                </div>
              </>
            )}

            <div>
              <label className="font-code-spec text-[10.5px] uppercase font-bold text-on-surface-variant block mb-1">
                Email Address
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
                Password
              </label>
              <input 
                type="password" 
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-surface-container text-body-sm text-[13px] focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-md text-label-md font-bold shadow-xs active:scale-98 transition flex items-center justify-center gap-2"
            >
              <span>{loading ? "Authenticating..." : (isSignup ? "Create Free Account" : "Sign In")}</span>
            </button>
          </form>

          {/* Toggle Login vs Signup */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError("");
              }}
              className="font-body-sm text-[12px] text-secondary font-bold hover:underline"
            >
              {isSignup 
                ? "Already have an account? Sign In" 
                : "Don't have an account? Create one for free"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
