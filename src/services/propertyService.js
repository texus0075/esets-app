import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  onSnapshot 
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION_NAME = "properties";
const LOCAL_STORAGE_KEY = "esets_properties_cache_real";

export const getCachedProperties = () => {
  try {
    // Purge deprecated legacy dummy caches
    localStorage.removeItem("esets_properties_cache");
    localStorage.removeItem("esets_properties_cache_v2");
    localStorage.removeItem("esets_properties_cache_v3");
    localStorage.removeItem("esets_custom_properties");

    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Local storage read error", e);
  }
  return [];
};

export const saveCachedProperties = (props) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(props));
  } catch (e) {
    console.error("Local storage save error", e);
  }
};

/**
 * Real-Time Live Firestore Listener (onSnapshot)
 * Live synchronization across all devices and direct owners
 */
export const subscribeToProperties = (onUpdate) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestoreItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      saveCachedProperties(firestoreItems);
      if (onUpdate) onUpdate(firestoreItems);
    }, (error) => {
      console.warn("Firestore sync warning (using cached database):", error.message);
      const cached = getCachedProperties();
      if (onUpdate) onUpdate(cached);
    });
    return unsubscribe;
  } catch (err) {
    console.warn("Failed to attach Firestore realtime listener:", err);
    return () => {};
  }
};

export const fetchProperties = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    saveCachedProperties(items);
    return items;
  } catch (error) {
    console.warn("Firestore fetch error:", error.message);
    return getCachedProperties();
  }
};

export const createProperty = async (propertyData, userId) => {
  const newProp = {
    ...propertyData,
    userId: userId || "direct-owner",
    createdAt: new Date().toISOString(),
    isSold: false,
    views: 1,
    verifiedOwner: true
  };

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...newProp,
      serverTime: serverTimestamp()
    });
    newProp.id = docRef.id;
  } catch (error) {
    console.warn("Firestore write error, saving locally:", error.message);
    newProp.id = "prop-" + Date.now();
  }

  const cached = getCachedProperties();
  const updated = [newProp, ...cached.filter(p => p.id !== newProp.id)];
  saveCachedProperties(updated);
  return newProp;
};

export const toggleSoldStatus = async (propertyId, currentStatus) => {
  const newStatus = !currentStatus;

  try {
    if (!propertyId.startsWith("local-") && !propertyId.startsWith("prop-temp-")) {
      const docRef = doc(db, COLLECTION_NAME, propertyId);
      await updateDoc(docRef, {
        isSold: newStatus,
        soldAt: newStatus ? new Date().toISOString() : null
      });
    }
  } catch (error) {
    console.warn("Firestore update error:", error.message);
  }

  const cached = getCachedProperties();
  const updated = cached.map(p => {
    if (p.id === propertyId) {
      return { ...p, isSold: newStatus };
    }
    return p;
  });
  saveCachedProperties(updated);
  return updated;
};

export const deleteProperty = async (propertyId) => {
  try {
    if (!propertyId.startsWith("local-") && !propertyId.startsWith("prop-temp-")) {
      const docRef = doc(db, COLLECTION_NAME, propertyId);
      await deleteDoc(docRef);
    }
  } catch (error) {
    console.warn("Firestore delete error:", error.message);
  }

  const cached = getCachedProperties();
  const updated = cached.filter(p => p.id !== propertyId);
  saveCachedProperties(updated);
  return updated;
};
