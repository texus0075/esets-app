import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to handle Progressive Web App (PWA) and TWA installation.
 * Intercepts the native beforeinstallprompt event and triggers the install banner.
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const triggerInstall = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        "📲 How to Install Esets on Mobile:\n\n• Android Chrome: Tap browser menu (⋮) -> 'Install App' or 'Add to Home screen'\n• iPhone Safari: Tap Share (⬆) -> 'Add to Home Screen'\n• Play Store APK: Direct TWA package ready for Google Play Store upload."
      );
    }
  }, [deferredPrompt]);

  return {
    isInstallable,
    triggerInstall
  };
}
