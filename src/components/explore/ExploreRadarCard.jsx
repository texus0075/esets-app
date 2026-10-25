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
            {gpsData ? RADAR_CONTENT.gpsActiveStatus : RADAR_CONTENT.defaultStatus}
          </span>
        </div>
        
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {gpsData 
            ? `Current coordinates: ${gpsData.formatted} (accuracy ±${gpsData.accuracy}m). Distances calibrated to real physical topography.`
            : RADAR_CONTENT.defaultDescription
          }
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {RADAR_CONTENT.landmarks.map(lm => (
            <span 
              key={lm.label}
              className="px-2.5 py-1 rounded bg-surface-container-lowest font-code-spec text-[11px] text-on-surface flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[13px] text-secondary">{lm.icon}</span>
              <span>{lm.label}: {lm.distance}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
