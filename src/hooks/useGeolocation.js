import { useState, useCallback } from "react";

/**
 * Real-time Hardware GPS Geolocation Hook with Reverse Geocoding.
 * 
 * Fetches physical device coordinates via browser navigator.geolocation,
 * then queries reverse-geocoding to resolve exact human-readable location:
 * City, District, Town/Village, State, and Pincode.
 */
export function useGeolocation() {
  const [gpsData, setGpsData] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const detectLocation = useCallback((onLocationResolved) => {
    if (!navigator.geolocation) {
      alert("GPS Geolocation is not supported by your device or browser.");
      return;
    }

    setIsLocating(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy);

        let detectedName = "";
        let detectedDistrict = "";
        let detectedState = "";
        let fullName = "";

        // 1. Primary Reverse Geocoder: BigDataCloud Client API (fast, zero key required)
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
          );
          if (res.ok) {
            const data = await res.json();
            detectedName = data.locality || data.city || data.principalSubdivision || "My Location";
            detectedDistrict = data.city || data.locality || "";
            detectedState = data.principalSubdivision || "";
            fullName = `${detectedName}${detectedState ? `, ${detectedState}` : ""}`;
          }
        } catch (err) {
          console.warn("Primary geocode error, attempting fallback:", err);
        }

        // 2. Fallback Reverse Geocoder: OpenStreetMap Nominatim
        if (!detectedName) {
          try {
            const res2 = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            if (res2.ok) {
              const data2 = await res2.json();
              const addr = data2.address || {};
              detectedName = addr.city || addr.town || addr.village || addr.suburb || addr.county || "My Location";
              detectedDistrict = addr.state_district || addr.county || addr.city || "";
              detectedState = addr.state || "";
              fullName = `${detectedName}${detectedState ? `, ${detectedState}` : ""}`;
            }
          } catch (err2) {
            console.warn("Secondary geocode error:", err2);
          }
        }

        // Final fallback if offline or API blocked
        if (!detectedName) {
          detectedName = "Current Location";
          fullName = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
        }

        const resolved = {
          lat: lat.toFixed(4),
          lng: lng.toFixed(4),
          accuracy,
          name: detectedName,
          district: detectedDistrict || detectedName,
          state: detectedState,
          fullName: fullName,
          formatted: `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`
        };

        setGpsData(resolved);
        setIsLocating(false);

        if (typeof onLocationResolved === "function") {
          onLocationResolved(resolved);
        }
      },
      (error) => {
        setIsLocating(false);
        let msg = "Could not access device location.";
        if (error.code === 1) {
          msg = "Location permission denied. Please allow location access in your device/browser settings.";
        } else if (error.code === 2) {
          msg = "Position unavailable. Please ensure GPS is enabled on your device.";
        } else if (error.code === 3) {
          msg = "Location request timed out. Please try again.";
        }
        setErrorMsg(msg);
        alert(`⚠️ ${msg}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 30000
      }
    );
  }, []);

  return {
    gpsData,
    isLocating,
    errorMsg,
    detectLocation
  };
}
