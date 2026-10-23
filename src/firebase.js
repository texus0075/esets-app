import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBayznci7JUxtMItM8hQdx0gYYOxImz3q8",
  authDomain: "esets-realestate-7a9b.firebaseapp.com",
  projectId: "esets-realestate-7a9b",
  storageBucket: "esets-realestate-7a9b.firebasestorage.app",
  messagingSenderId: "862318633819",
  appId: "1:862318633819:web:c90da8c92e20a235b1707e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
