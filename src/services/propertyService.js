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
import { INITIAL_PROPERTIES } from "../data/mockData";

const COLLECTION_NAME = "properties";
const LOCAL_STORAGE_KEY = "esets_properties_cache_v3";

export const getCachedProperties = () => {
  try {
    localStorage.removeItem("esets_properties_cache");
    localStorage.removeItem("esets_properties_cache_v2");

    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed.some(p => p.id === "prop-rajsamand-dhoinda")) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Local storage read error", e);
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES));
  return INITIAL_PROPERTIES;
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
 * Instantly broadcasts additions, price changes, and 'Sold It' flips across all devices
 */
export const subscribeToProperties = (onUpdate) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const firestoreItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Merge firestore live items with initial verified seed baseline
        const firestoreIds = new Set(firestoreItems.map(p => p.id));
        const merged = [...firestoreItems, ...INITIAL_PROPERTIES.filter(p => !firestoreIds.has(p.id))];

        saveCachedProperties(merged);
        if (onUpdate) onUpdate(merged);
      } else {
        const cached = getCachedProperties();
        if (onUpdate) onUpdate(cached);
      }
    }, (error) => {
      console.warn("Firestore realtime live sync warning (using cached database):", error.message);
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
    if (!snapshot.empty) {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const firestoreIds = new Set(items.map(p => p.id));
      const merged = [...items, ...INITIAL_PROPERTIES.filter(p => !firestoreIds.has(p.id))];
      saveCachedProperties(merged);
      return merged;
    }
  } catch (error) {
    console.warn("Firestore fetch error, falling back to local database:", error.message);
  }
  return getCachedProperties();
};

export const createProperty = async (propertyData, userId) => {
  const newProp = {
    ...propertyData,
    userId: userId || "guest-owner",
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
    newProp.id = "local-" + Date.now();
  }

  const cached = getCachedProperties();
  const updated = [newProp, ...cached.filter(p => p.id !== newProp.id)];
  saveCachedProperties(updated);
  return newProp;
};

export const toggleSoldStatus = async (propertyId, currentStatus) => {
  const newStatus = !currentStatus;

  try {
    if (!propertyId.startsWith("local-") && !propertyId.startsWith("prop-")) {
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
    if (!propertyId.startsWith("local-") && !propertyId.startsWith("prop-")) {
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
