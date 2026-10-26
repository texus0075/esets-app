import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp, 
  orderBy 
} from "firebase/firestore";
import { db } from "../firebase";

const INQUIRIES_COLLECTION = "inquiries";
const LOCAL_STORAGE_KEY = "esets_local_inquiries";

/**
 * 1. Submit a direct buyer visit/inquiry request
 */
export async function submitPropertyInquiry(inquiryData) {
  const payload = {
    ...inquiryData,
    createdAt: new Date().toISOString(),
    status: "new"
  };

  // 1. Always save locally immediately for optimistic UI
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([payload, ...existing]));
  } catch (e) {
    console.warn("Local inquiry save error:", e);
  }

  // 2. Save to Firestore if available
  try {
    const colRef = collection(db, INQUIRIES_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...payload,
      serverTime: serverTimestamp()
    });
    return { ...payload, id: docRef.id };
  } catch (err) {
    console.warn("Firestore inquiry sync (offline fallback active):", err);
    return { ...payload, id: `local-${Date.now()}` };
  }
}

/**
 * 2. Get all inquiries for a specific seller
 */
export function getStoredInquiriesForSeller(sellerId) {
  try {
    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
    if (!sellerId) return stored;
    return stored.filter(inq => inq.sellerId === sellerId || inq.sellerPhone === sellerId);
  } catch {
    return [];
  }
}

/**
 * 3. Subscribe to real-time inquiries for a seller
 */
export function subscribeToInquiries(sellerId, callback) {
  // Always invoke immediately with local cached inquiries
  const localData = getStoredInquiriesForSeller(sellerId);
  callback(localData);

  try {
    const colRef = collection(db, INQUIRIES_COLLECTION);
    const q = sellerId 
      ? query(colRef, where("sellerId", "==", sellerId)) 
      : query(colRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const liveInquiries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Merge with local inquiries
        callback(liveInquiries);
      }
    }, (err) => {
      console.warn("Inquiries snapshot listener fallback:", err);
    });

    return unsubscribe;
  } catch (e) {
    console.warn("Inquiries subscription fallback:", e);
    return () => {};
  }
}
