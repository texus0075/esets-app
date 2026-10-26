import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { subscribeToInquiries } from "../../services/inquiryService";

export default function MyListingsView({
  myProperties,
  onSelectProperty,
  onToggleSold,
  onDeleteProperty,
  onNavigateToPost,
  isGlobalCallShieldActive
}) {
  const activeCount = myProperties.filter(p => !p.isSold && !isGlobalCallShieldActive).length;
  const soldCount = myProperties.filter(p => p.isSold || isGlobalCallShieldActive).length;
  const totalViews = myProperties.reduce((sum, p) => sum + (p.views || 0), 0);
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("portfolio"); // 'portfolio' | 'inquiries'
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const unsub = subscribeToInquiries(currentUser?.uid, (data) => {
      setInquiries(data || []);
    });
    return () => unsub();
  }, [currentUser]);

  return (
    <main className="flex-1 w-full bg-surface pt-16 pb-24 min-w-0 max-w-2xl mx-auto px-margin-mobile">
      <div className="py-4 space-y-4">
        
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline-lg-mobile text-[1.4rem] text-primary font-bold">
              My Published Properties
            </h1>
            <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">
              Direct owner dashboard. Manage status, phone masking, and live listings.
            </p>
          </div>
          <button
            onClick={onNavigateToPost}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-md text-label-md font-bold shadow-xs active:scale-95 transition"
          >
            <span className="material-symbols-outlined text-[17px]">add_circle</span>
            <span>Post New</span>
          </button>
        </div>

        {/* 3 Summary Analytics Cards */}
        <div className="grid grid-cols-3 gap-2">
          {/* Card 1: Active Live */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-on-surface-variant font-code-spec text-[10.5px]">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
              <span>LIVE ACTIVE</span>
            </div>
            <div className="mt-2 font-headline-sm text-[22px] font-bold text-primary">
              {activeCount}
            </div>
            <span className="text-[10px] text-on-surface-variant">Receiving calls</span>
          </div>

          {/* Card 2: Sold Out */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-error font-code-spec text-[10.5px]">
              <span className="material-symbols-outlined text-[14px]">phone_disabled</span>
              <span>SOLD / SHIELD</span>
            </div>
            <div className="mt-2 font-headline-sm text-[22px] font-bold text-primary">
              {soldCount}
            </div>
            <span className="text-[10px] text-on-surface-variant">Calls blocked</span>
          </div>

          {/* Card 3: Total Views */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-secondary font-code-spec text-[10.5px]">
              <span className="material-symbols-outlined text-[14px]">visibility</span>
              <span>TOTAL VIEWS</span>
            </div>
            <div className="mt-2 font-headline-sm text-[22px] font-bold text-primary">
              {totalViews}
            </div>
            <span className="text-[10px] text-on-surface-variant">Direct buyer taps</span>
          </div>
        </div>

        {/* Sub-Tab Navigation: Portfolio vs Inquiries */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-surface-container-low border border-surface-container text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("portfolio")}
            className={`py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === "portfolio"
                ? "bg-primary text-surface shadow-xs"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">real_estate_agent</span>
            <span>Active Listings ({myProperties.length})</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab("inquiries")}
            className={`py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === "inquiries"
                ? "bg-primary text-surface shadow-xs"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
            <span>Buyer Inquiries ({inquiries.length})</span>
          </button>
        </div>

        {/* Section 1: Inquiries Leads Feed */}
        {activeTab === "inquiries" && (
          <div className="space-y-3 pt-1 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-code-spec text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                Direct Buyer Site-Visit Requests ({inquiries.length})
              </span>
            </div>

            {inquiries.length === 0 ? (
              <div className="p-8 rounded-2xl bg-surface-container-lowest border border-surface-container text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-4xl text-secondary">mark_chat_unread</span>
                <h3 className="font-headline-sm text-sm font-bold text-primary">No Inquiries Yet</h3>
                <p className="font-body-sm text-xs text-on-surface-variant max-w-xs">
                  Whenever a buyer schedules a site visit on any of your listings, their contact details and visit time will appear here.
                </p>
              </div>
            ) : (
              inquiries.map((inq, idx) => (
                <div 
                  key={inq.id || idx}
                  className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center font-bold text-xs">
                        {inq.buyerName?.charAt(0)?.toUpperCase() || "B"}
                      </div>
                      <div>
                        <span className="font-headline-sm text-sm font-bold text-primary block leading-tight">
                          {inq.buyerName || "Prospective Buyer"}
                        </span>
                        <span className="font-code-spec text-[10px] text-on-surface-variant">
                          Requested for: {inq.propertyTitle || "Your Property"}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-code-spec text-[10px] font-bold">
                      {inq.status || "NEW LEAD"}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between text-xs font-code-spec">
                    <div className="flex items-center gap-1.5 text-primary">
                      <span className="material-symbols-outlined text-[15px] text-secondary">event</span>
                      <span>{inq.visitDate || "Anytime"} • {inq.visitTime || "Morning"}</span>
                    </div>
                    <span className="text-[10.5px] text-on-surface-variant font-bold">
                      📞 {inq.buyerPhone || "Phone masked"}
                    </span>
                  </div>

                  {/* Twin Contact Action Buttons for Seller */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`tel:${inq.buyerPhone?.replace(/\s+/g, '')}`}
                      className="py-2 px-3 rounded-xl bg-secondary text-surface font-label-md text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-on-secondary-fixed transition"
                    >
                      <span className="material-symbols-outlined text-[15px]">call</span>
                      <span>Call Buyer</span>
                    </a>
                    <a
                      href={`https://wa.me/${inq.buyerPhone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${inq.buyerName}, thank you for scheduling a visit for my property on Esets. Looking forward to meeting you on ${inq.visitDate}!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-primary-container text-tertiary-fixed font-label-md text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:opacity-90 transition"
                    >
                      <span className="material-symbols-outlined text-[15px]">chat</span>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Section 2: Active Portfolio Listings */}
        {activeTab === "portfolio" && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <span className="font-code-spec text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Your Active Portfolio ({myProperties.length})
            </span>
          </div>

          {myProperties.map(property => {
            const isSold = property.isSold || isGlobalCallShieldActive;
            const mainImg = property.images && property.images.length > 0 ? property.images[0] : "";

            return (
              <div 
                key={property.id}
                className={`p-3 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-3 transition ${
                  isSold ? "opacity-90 bg-surface-dim" : ""
                }`}
              >
                {/* Top Row: Thumbnail + Details */}
                <div 
                  onClick={() => onSelectProperty(property)}
                  className="flex gap-3 cursor-pointer"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-surface-container shrink-0">
                    <img 
                      src={mainImg} 
                      alt={property.title} 
                      className={`w-full h-full object-cover ${isSold ? "grayscale" : ""}`}
                    />
                    {isSold && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white bg-error px-1.5 py-0.5 rounded">
                          SOLD
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-headline-sm text-[16px] text-primary font-bold">
                          {property.priceUnit}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-code-spec font-bold uppercase ${
                          isSold ? "bg-error-container text-error" : "bg-primary-container text-secondary-container"
                        }`}>
                          {isSold ? "Deal Closed" : "Live Active"}
                        </span>
                      </div>
                      <h3 className="font-label-md text-[13px] font-semibold text-primary truncate mt-0.5">
                        {property.title}
                      </h3>
                      <p className="font-body-sm text-[11.5px] text-on-surface-variant truncate">
                        {property.locality}, {property.district}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[10.5px] font-code-spec text-on-surface-variant">
                      <span>{property.bhk} BHK • {property.area} sq.ft</span>
                      <span>•</span>
                      <span>👁️ {property.views || 1} views</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Actions Bar */}
                <div className="pt-2 border-t border-surface-container flex items-center justify-between gap-2">
                  {/* Toggle Sold / Active Button */}
                  <button
                    onClick={() => onToggleSold(property.id, property.isSold)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-label-md text-[12px] font-bold transition shadow-xs ${
                      property.isSold
                        ? "bg-primary-container text-secondary-container hover:opacity-90"
                        : "bg-error text-on-error hover:bg-error/90"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {property.isSold ? "refresh" : "gpp_bad"}
                    </span>
                    <span>{property.isSold ? "Reactivate (Take Live)" : "Mark as Sold (Stop Calls)"}</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to permanently delete this listing?")) {
                        onDeleteProperty(property.id);
                      }
                    }}
                    aria-label="Delete Listing"
                    className="p-2 rounded-xl bg-surface-container hover:bg-error-container text-on-surface-variant hover:text-error transition"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {myProperties.length === 0 && (
            <div className="p-8 text-center bg-surface-container rounded-2xl border border-surface-container-high space-y-3">
              <span className="material-symbols-outlined text-[44px] text-secondary">real_estate_agent</span>
              <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                No Properties Published Yet
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mx-auto">
                Sell or rent your residential flat, villa, or plot directly to genuine buyers with 0% brokerage and verified title deed protection.
              </p>
              <button
                onClick={onNavigateToPost}
                className="mt-2 px-5 py-2.5 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-md font-bold shadow-xs active:scale-95 transition"
              >
                Post Your Property Now (100% Free)
              </button>
            </div>
          )}
        </div>
        )}

      </div>
    </main>
  );
}
