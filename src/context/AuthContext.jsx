import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Purge legacy fake dummy user keys
  useEffect(() => {
    localStorage.removeItem("esets_user");
    localStorage.removeItem("esets_user_v2");
    localStorage.removeItem("esets_user_v3");
  }, []);

  // Real User State (null by default if guest / unauthenticated)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("esets_auth_user_real");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync with Firebase Auth state
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const formatted = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split("@")[0] || "Property Owner",
            photoURL: user.photoURL || null,
            phoneNumber: user.phoneNumber || null,
            role: "owner",
            verified: true
          };
          setCurrentUser(formatted);
          localStorage.setItem("esets_auth_user_real", JSON.stringify(formatted));
        }
      });
      return unsubscribe;
    } catch (e) {
      console.warn("Firebase Auth listener note:", e);
    }
  }, []);

  // Email / Password Signup
  const signup = async (email, password, displayName, phone) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(res.user, { displayName });
    }
    const newUser = {
      uid: res.user.uid,
      email: res.user.email,
      displayName: displayName || email.split("@")[0],
      photoURL: null,
      phoneNumber: phone || null,
      role: "owner",
      verified: true
    };
    setCurrentUser(newUser);
    localStorage.setItem("esets_auth_user_real", JSON.stringify(newUser));
    return newUser;
  };

  // Email / Password Login
  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = {
      uid: res.user.uid,
      email: res.user.email,
      displayName: res.user.displayName || email.split("@")[0],
      photoURL: res.user.photoURL || null,
      phoneNumber: res.user.phoneNumber || null,
      role: "owner",
      verified: true
    };
    setCurrentUser(user);
    localStorage.setItem("esets_auth_user_real", JSON.stringify(user));
    return user;
  };

  // Google 1-Tap OAuth Sign-In
  const loginWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    const user = {
      uid: res.user.uid,
      email: res.user.email,
      displayName: res.user.displayName || "Google User",
      photoURL: res.user.photoURL || null,
      phoneNumber: res.user.phoneNumber || null,
      role: "owner",
      verified: true
    };
    setCurrentUser(user);
    localStorage.setItem("esets_auth_user_real", JSON.stringify(user));
    return user;
  };

  // Direct Owner / Buyer Registration (No fake data: saves real details entered by user)
  const loginWithDirectDetails = (name, phone, role = "owner") => {
    const trimmedName = (name || "").trim();
    const trimmedPhone = (phone || "").trim();
    if (!trimmedName) throw new Error("Please enter your name.");
    if (!trimmedPhone) throw new Error("Please enter your mobile number.");

    const directUser = {
      uid: `usr-direct-${Date.now()}`,
      displayName: trimmedName,
      email: `${trimmedPhone.replace(/\D/g, "")}@direct.esets.in`,
      phoneNumber: trimmedPhone,
      photoURL: null,
      role: role,
      verified: true
    };
    setCurrentUser(directUser);
    localStorage.setItem("esets_auth_user_real", JSON.stringify(directUser));
    return directUser;
  };

  const logout = async () => {
    localStorage.removeItem("esets_auth_user_real");
    localStorage.removeItem("esets_user_v3");
    localStorage.removeItem("esets_user");
    try {
      await signOut(auth);
    } catch (err) {
      console.log("Firebase signout error:", err);
    }
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      signup,
      login,
      loginWithGoogle,
      loginWithDirectDetails,
      logout,
      loading,
      isAuthModalOpen,
      openAuthModal: () => setIsAuthModalOpen(true),
      closeAuthModal: () => setIsAuthModalOpen(false)
    }}>
      {children}
    </AuthContext.Provider>
  );
};
