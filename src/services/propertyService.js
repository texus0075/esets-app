import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";
import { INITIAL_PROPERTIES } from "../data/mockData";

const COLLECTION_NAME = "properties";
const LOCAL_STORAGE_KEY = "esets_properties_cache";

// Helper to get local cache
export const getCachedProperties = () => {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.error("Local storage read error", e);
  }
  // Initialize with rich mock data
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES));
  return INITIAL_PROPERTIES;
};

// Helper to save local cache
export const saveCachedProperties = (props) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(props));
  } catch (e) {
    console.error("Local storage save error", e);
  }
};

// Real-time Firestore Listener (REPO #1: Persistence & Live Sync)
export const subscribeProperties = (onUpdate, onError) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const liveItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Merge with sample catalog so user has a rich marketplace alongside live listings
        const firestoreIds = new Set(liveItems.map(i => i.id));
        const sampleCatalog = INITIAL_PROPERTIES.filter(p => !firestoreIds.has(p.id));
        const combined = [...liveItems, ...sampleCatalog];
        saveCachedProperties(combined);
        onUpdate(combined);
      } else {
        // Fallback to local cache / seed data
        const cached = getCachedProperties();
        onUpdate(cached);
      }
    }, (err) => {
      console.warn("Firestore snapshot listener notice, using offline cache:", err.message);
      onUpdate(getCachedProperties());
      if (onError) onError(err);
    });

    return unsubscribe;
  } catch (err) {
    console.warn("Could not attach firestore listener:", err);
    onUpdate(getCachedProperties());
    return () => {};
  }
};

export const subscribeToProperties = subscribeProperties;

// Fetch all properties (Fallback one-shot fetch)
export const fetchProperties = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const liveItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const firestoreIds = new Set(liveItems.map(i => i.id));
      const sampleCatalog = INITIAL_PROPERTIES.filter(p => !firestoreIds.has(p.id));
      const combined = [...liveItems, ...sampleCatalog];
      saveCachedProperties(combined);
      return combined;
    }
  } catch (error) {
    console.warn("Firestore fetch error, falling back to local database:", error.message);
  }
  return getCachedProperties();
};

// Create a new property listing with permanent persistence
export const createProperty = async (propertyData, userId) => {
  if (!userId || userId === "guest-user") {
    throw new Error("प्रॉपर्टी पब्लिश करने के लिए कृपया पहले लॉगिन करें।");
  }

  const newProp = {
    ...propertyData,
    userId: userId,
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
    console.log("Property successfully written to Cloud Firestore! ID:", docRef.id);
  } catch (error) {
    console.error("Firestore write error:", error);
    throw error;
  }

  // Update local cache
  const cached = getCachedProperties();
  const updated = [newProp, ...cached.filter(p => p.id !== newProp.id)];
  saveCachedProperties(updated);
  return newProp;
};

// Toggle 'Sold It' status in Firestore & Local Cache
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

  // Update local cache
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

// Delete property listing
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
