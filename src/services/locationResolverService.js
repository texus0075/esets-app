/**
 * Hyper-Local Indian Location & Pincode Resolver Service
 * 
 * Capabilities:
 * 1. Instant 6-digit Indian Postal Pincode Auto-Scan (free official Postal API)
 * 2. Multi-lingual OpenStreetMap Nominatim Geocoding (Hindi / English)
 * 3. Gemini Vision & Text Geo-Intelligence Cascade
 * 4. Zero Bangalore/Karnataka fallback leaks
 */

import { findStateForDistrict, LOCATIONS } from "../data/locations.js";
import { geohashForLocation, geohashQueryBounds, distanceBetween } from "geofire-common";

/**
 * REPO #3 / Spatial Geohash Engine (geofire-common):
 * Generates official 9-character precision Geohashes for Firestore spatial indexing.
 */
export function calculateGeohash(lat, lng) {
  if (typeof lat !== "number" || typeof lng !== "number" || isNaN(lat) || isNaN(lng)) {
    return null;
  }
  return geohashForLocation([lat, lng]);
}

/**
 * Query Bounding Boxes for Hyper-Local Radius Filtering
 * Returns an array of geohash bounds [start, end] for querying Firestore within radiusInKm.
 */
export function getRadiusGeohashBounds(centerLat, centerLng, radiusInKm = 10) {
  if (typeof centerLat !== "number" || typeof centerLng !== "number") return [];
  const radiusInMeters = radiusInKm * 1000;
  return geohashQueryBounds([centerLat, centerLng], radiusInMeters);
}

/**
 * High-Precision Haversine Distance in Kilometers
 */
export function getExactDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  return distanceBetween([lat1, lon1], [lat2, lon2]);
}

/**
 * Scan 6-digit Indian Postal Pincode
 * Returns { success, state, district, localities, primaryLocality, pincode }
 */
export async function scanIndianPincode(pincode) {
  const cleanPin = (pincode || "").toString().trim().replace(/\D/g, "");
  if (cleanPin.length !== 6) {
    return { success: false, error: "Please enter a valid 6-digit Indian pincode" };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Postal API HTTP ${res.status}`);
    }

    const data = await res.json();
    if (Array.isArray(data) && data[0]?.Status === "Success" && Array.isArray(data[0].PostOffice)) {
      const offices = data[0].PostOffice;
      const district = offices[0]?.District || "";
      const state = offices[0]?.State || "";
      const localities = offices.map(po => po.Name).filter(Boolean);

      return {
        success: true,
        pincode: cleanPin,
        district,
        state,
        localities,
        primaryLocality: localities[0] || district
      };
    } else {
      return { success: false, error: "Pincode not found in official Indian postal registry" };
    }
  } catch (err) {
    console.warn("[LocationResolver] Pincode lookup network warning:", err.message);
    return { success: false, error: "Pincode scan timed out or network unavailable" };
  }
}

/**
 * Geocode Locality + District + State using OpenStreetMap Nominatim
 */
export async function geocodeIndianAddress(locality, district, state) {
  const parts = [locality, district, state, "India"].filter(Boolean);
  if (parts.length === 1) return null; // only "India"

  const query = parts.join(", ");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=3&addressdetails=1&countrycodes=in`,
      {
        signal: controller.signal,
        headers: {
          "Accept-Language": "en,hi",
          "User-Agent": "EsetsRealEstateMarketplace/1.0"
        }
      }
    );
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const results = await res.json();
    if (Array.isArray(results) && results.length > 0) {
      const best = results[0];
      const addr = best.address || {};
      const resolvedDistrict = addr.state_district || addr.county || district;
      const resolvedState = addr.state || state;
      const resolvedPincode = addr.postcode || "";

      return {
        lat: parseFloat(best.lat),
        lon: parseFloat(best.lon),
        displayName: best.display_name,
        district: resolvedDistrict,
        state: resolvedState,
        pincode: resolvedPincode
      };
    }
  } catch (err) {
    console.warn("[LocationResolver] Geocoding exception:", err.message);
  }
  return null;
}

/**
 * Intelligent Satellite URL Builder
 * Never defaults to Karnataka unless Karnataka was explicitly chosen!
 */
export function buildSatelliteMapUrl(locality, district, state) {
  const loc = (locality || "").trim();
  const dist = (district || "").trim();
  const st = (state || findStateForDistrict(dist) || "").trim();

  const queryParts = [loc, dist, st, "India"].filter(Boolean);
  const query = queryParts.join(", ");

  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=k&z=16&output=embed`;
}
