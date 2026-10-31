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
const CACHE_VERSION_KEY = "esets_cache_version";
const CURRENT_CACHE_VERSION = "v5_clean_sync";

// Helper to get local cache with automatic stale-data eviction
export const getCachedProperties = () => {
  try {
    const version = localStorage.getItem(CACHE_VERSION_KEY);
    if (version !== CURRENT_CACHE_VERSION) {
      // Outdated or dirty cache with old deleted test properties: reset to initial sample catalog
      localStorage.setItem(CACHE_VERSION_KEY, CURRENT_CACHE_VERSION);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES));
      localStorage.removeItem("esets_deleted_property_ids");
      return INITIAL_PROPERTIES;
    }

    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
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

const DELETED_PROPERTIES_KEY = "esets_deleted_property_ids";

export const getDeletedPropertyIds = () => {
  try {
    const raw = localStorage.getItem(DELETED_PROPERTIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const markPropertyDeletedLocally = (id) => {
  try {
    const current = getDeletedPropertyIds();
    if (!current.includes(id)) {
      localStorage.setItem(DELETED_PROPERTIES_KEY, JSON.stringify([...current, id]));
    }
  } catch (e) {
    console.warn("Could not save deleted property key:", e);
  }
};

// Real-time Firestore Listener (REPO #1: Persistence & Live Sync)
export const subscribeProperties = (onUpdate, onError) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const deletedIds = new Set(getDeletedPropertyIds());
      
      // Authoritative live items from Cloud Firestore (empty array if snapshot is empty)
      const liveItems = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(p => !deletedIds.has(p.id) && !p.isDeleted);
      
      // Merge with sample catalog, ensuring no mock ID collides with live items
      const firestoreIds = new Set(liveItems.map(i => i.id));
      const sampleCatalog = INITIAL_PROPERTIES.filter(p => !firestoreIds.has(p.id) && !deletedIds.has(p.id));
      const combined = [...liveItems, ...sampleCatalog];

      // Always update local cache so deleted documents are immediately evicted on all devices
      saveCachedProperties(combined);
      onUpdate(combined);
    }, (err) => {
      console.warn("Firestore snapshot listener notice, using offline cache:", err.message);
      const deletedIds = new Set(getDeletedPropertyIds());
      onUpdate(getCachedProperties().filter(p => !deletedIds.has(p.id)));
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
    const deletedIds = new Set(getDeletedPropertyIds());
    const liveItems = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(p => !deletedIds.has(p.id) && !p.isDeleted);
    const firestoreIds = new Set(liveItems.map(i => i.id));
    const sampleCatalog = INITIAL_PROPERTIES.filter(p => !firestoreIds.has(p.id) && !deletedIds.has(p.id));
    const combined = [...liveItems, ...sampleCatalog];
    saveCachedProperties(combined);
    return combined;
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
    verifiedOwner: true
  };

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newProp);
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

// Boost property listing to Spotlight Featured (Monetization Engine)
export const boostPropertyListing = async (propertyId, planType = "spotlight") => {
  const updates = {
    isFeatured: true,
    verifiedOwner: true
  };

  try {
    if (!propertyId.startsWith("local-") && !propertyId.startsWith("prop-")) {
      const docRef = doc(db, COLLECTION_NAME, propertyId);
      await updateDoc(docRef, updates);
      console.log("Successfully boosted property on Cloud Firestore:", propertyId);
    }
  } catch (error) {
    console.error("Firestore boost error:", error);
    throw error;
  }

  // Update local cache
  const cached = getCachedProperties();
  const updated = cached.map(p => {
    if (p.id === propertyId) {
      return { ...p, ...updates };
    }
    return p;
  });
  saveCachedProperties(updated);
  return updated;
};

// Delete property listing
export const deleteProperty = async (propertyId) => {
  markPropertyDeletedLocally(propertyId);
  try {
    if (!propertyId.startsWith("local-") && !propertyId.startsWith("prop-")) {
      const docRef = doc(db, COLLECTION_NAME, propertyId);
      await deleteDoc(docRef);
      console.log("Successfully deleted property from Cloud Firestore:", propertyId);
    }
  } catch (error) {
    console.error("Firestore delete error:", error.message);
    throw error;
  }

  const cached = getCachedProperties();
  const updated = cached.filter(p => p.id !== propertyId);
  saveCachedProperties(updated);
  return updated;
};
