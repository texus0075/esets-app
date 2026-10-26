import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

/**
 * REPO #6 / Zero-Cost Free Interactive Map Engine (Leaflet ⭐ 42k+ / react-leaflet ⭐ 5.3k+)
 * 
 * Capabilities:
 * 1. 100% Free OpenStreetMap CartoDB Tiles (Zero Google Maps API bills)
 * 2. High-DPI Retina Display support
 * 3. Custom Esets price pill marker
 */

// Custom Pin Icon using SVG to avoid default Leaflet missing png asset bug
const createCustomIcon = (priceUnit = "₹", isSold = false) => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        background: ${isSold ? "#e11d48" : "#166534"};
        color: white;
        padding: 4px 8px;
        border-radius: 9999px;
        font-weight: 800;
        font-size: 11px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        border: 2px solid white;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
        transform: translate(-50%, -100%);
      ">
        <span>📍</span>
        <span>${isSold ? "SOLD" : priceUnit}</span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

export default function PropertyLeafletMap({ 
  lat = 28.5355, 
  lng = 77.2410, 
  zoom = 14, 
  title = "Property Location", 
  priceUnit = "₹", 
  locality = "",
  district = "",
  isSold = false,
  height = "260px"
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ height }} className="bg-slate-100 rounded-2xl animate-pulse" />;

  const position = [lat, lng];

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
      <MapContainer 
        center={position} 
        zoom={zoom} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position} icon={createCustomIcon(priceUnit, isSold)}>
          <Popup>
            <div className="p-1 text-slate-800 text-xs">
              <strong className="block font-bold mb-1">{title}</strong>
              <p className="text-[11px] text-slate-500">{locality}, {district}</p>
              <span className="inline-block mt-1.5 font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {priceUnit}
              </span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
