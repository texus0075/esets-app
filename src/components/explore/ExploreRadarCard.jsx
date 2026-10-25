import React from "react";
import { RADAR_CONTENT } from "../../config/siteContent";

export default function ExploreRadarCard({ gpsData }) {
  return (
    <section className="px-margin-mobile mt-4">
      <div className="p-3.5 rounded-xl bg-surface-container flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-secondary">explore</span>
            <span className="font-label-lg text-label-lg text-primary font-bold">
              {RADAR_CONTENT.title}
            </span>
          </div>
          <span className="font-code-spec text-[10px] text-secondary bg-surface-container-lowest px-2 py-0.5 rounded font-bold">
            {gpsData ? "📍 GPS Locked" : "GPS Standby"}
          </span>
        </div>
        
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {gpsData 
            ? `स्थान: ${gpsData.fullName || gpsData.district || 'Current Location'} (${gpsData.formatted})। आपकी सटीक दूरी के अनुसार रियल इंफ्रास्ट्रक्चर की गणना की जाती है।`
            : "ऊपर दिए गए 'Auto GPS' बटन पर क्लिक करके अपने फोन से सटीक लोकेशन और नजदीकी जरूरी सुविधाएं स्कैन करें।"
          }
        </p>

        {gpsData && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="px-2.5 py-1 rounded bg-surface-container-lowest font-code-spec text-[11px] text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-secondary">my_location</span>
              <span>जिला: {gpsData.district || "Local District"}</span>
            </span>
            <span className="px-2.5 py-1 rounded bg-surface-container-lowest font-code-spec text-[11px] text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-secondary">gps_fixed</span>
              <span>शुद्धता: ±{gpsData.accuracy || 15}m</span>
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
