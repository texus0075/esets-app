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
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedDemoUser = localStorage.getItem("esets_demo_user");
    if (savedDemoUser) {
      setCurrentUser(JSON.parse(savedDemoUser));
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split("@")[0] || "User",
          photoURL: user.photoURL || null,
          phoneNumber: user.phoneNumber || "+91 98100 12345",
          isDemo: false
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, displayName, phone) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(res.user, { displayName });
    }
    const updatedUser = {
      uid: res.user.uid,
      email: res.user.email,
      displayName: displayName || email.split("@")[0],
      phoneNumber: phone || "+91 98100 12345",
      isDemo: false
    };
    setCurrentUser(updatedUser);
    return updatedUser;
  };

  const login = async (email, password) => {
    localStorage.removeItem("esets_demo_user");
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    localStorage.removeItem("esets_demo_user");
    return signInWithPopup(auth, googleProvider);
  };

  const loginAsDemo = (role = "owner") => {
    const demoUser = {
      uid: "demo-user-" + (role === "owner" ? "owner-101" : "buyer-202"),
      displayName: role === "owner" ? "राजेश कुमार (Owner)" : "अमित शर्मा (Buyer)",
      email: role === "owner" ? "rajesh.owner@esets.in" : "amit.buyer@esets.in",
      phoneNumber: "+91 98765 43210",
      photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      isDemo: true,
      role: role,
      plan: role === "owner" ? "pro_agent" : "free"
    };
    localStorage.setItem("esets_demo_user", JSON.stringify(demoUser));
    setCurrentUser(demoUser);
  };

  const logout = async () => {
    localStorage.removeItem("esets_demo_user");
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
      loginAsDemo,
      logout,
      loading
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
