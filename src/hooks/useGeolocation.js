import { useState, useCallback } from "react";

/**
 * Custom hook to interface with the device's physical GPS hardware.
 * Provides latitude, longitude, accuracy, status, and feedback notifications.
 */
export function useGeolocation() {
  const [gpsData, setGpsData] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("GPS Geolocation is not supported by your current browser or device.");
      return;
    }

    setIsLocating(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const lat = position.coords.latitude.toFixed(4);
        const lng = position.coords.longitude.toFixed(4);
        const accuracy = Math.round(position.coords.accuracy);

        const data = {
          lat,
          lng,
          accuracy,
          formatted: `${lat}° N, ${lng}° E`,
          timestamp: new Date().toLocaleTimeString()
        };

        setGpsData(data);
        alert(
          `📍 Real GPS Acquired:\nLatitude: ${lat}°\nLongitude: ${lng}°\nAccuracy: ±${accuracy} meters\n\nDirect listings sorted by closest physical proximity.`
        );
      },
      (error) => {
        setIsLocating(false);
        let msg = "Could not obtain device location.";
        if (error.code === 1) {
          msg = "Location permission denied. Please allow location access in your device settings.";
        } else if (error.code === 2) {
          msg = "Position unavailable. Please enable device GPS.";
        } else if (error.code === 3) {
          msg = "GPS request timed out.";
        }
        setErrorMsg(msg);
        alert(`⚠️ ${msg}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
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
