import React, { useEffect, useState, useRef } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { AuthContext } from "./AuthContext";
import { auth } from "../firebase/firebase.config";
import useAxiosSecure from "../hooks/useAxiosSecure";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user data object with selected fields + role
  const [role, setRole] = useState(null); // user role string
  const [loading, setLoading] = useState(true);
  const prevUidRef = useRef(null); // to prevent redundant fetches

  console.log(role);

  const axiosSecure = useAxiosSecure();
  const googleProvider = new GoogleAuthProvider();

  // Helper: normalize Firebase user to plain object with role
  const normalizeUser = (firebaseUser, role) => {
    if (!firebaseUser) return null;
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || "",
      photoURL: firebaseUser.photoURL || "",
      role: role || "user",
    };
  };

  // Fetch role from backend or create user if not exists
  const fetchUserRole = async (firebaseUser) => {
    try {
      const response = await axiosSecure.get(
        `/api/users/by-email/${firebaseUser.email}`
      );

      if (!response.data?.success) {
        throw new Error("User data not found");
      }

      return response.data.user?.role || "user";
    } catch (error) {
      if (error.response?.status === 404) {
        // User not found in DB, create default
        const newUser = {
          email: firebaseUser.email,
          name: firebaseUser.displayName || "",
          image: firebaseUser.photoURL || "",
          role: "user", // Set default role here
          isSubscribed: false,
          uid: firebaseUser.uid,
        };
        const createResponse = await axiosSecure.put(
          `/api/users/email/${firebaseUser.email}`,
          newUser
        );
        return createResponse.data?.user?.role || "user";
      }
      console.error("Failed to fetch user role:", error);
      return "user";
    }
  };

  // Auth state change listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);

      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        prevUidRef.current = null;
        setLoading(false);
        return;
      }

      // Only proceed if user changed
      if (prevUidRef.current !== firebaseUser.uid) {
        prevUidRef.current = firebaseUser.uid;

        try {
          const userRole = await fetchUserRole(firebaseUser);
          const normalizedUser = normalizeUser(firebaseUser, userRole);

          // Update both state variables atomically
          setUser(normalizedUser);
          setRole(userRole);
        } catch (error) {
          console.error("Auth state error:", error);
          // Fallback to default user role
          const normalizedUser = normalizeUser(firebaseUser, "user");
          setUser(normalizedUser);
          setRole("user");
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [axiosSecure]);

  // Auth action methods

  const createUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setRole("user"); // default role after sign up
      return userCredential;
    } finally {
      setLoading(false);
    }
  };

  const signInUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // role update will happen automatically in onAuthStateChanged listener
      return userCredential;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // role update automatic in listener
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
      prevUidRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profile) => {
    if (!auth.currentUser) throw new Error("No authenticated user");
    const updatedUser = await updateProfile(auth.currentUser, profile);
    // After update, sync user data in state
    setUser((prev) => ({ ...prev, ...profile }));
    return updatedUser;
  };

  // Provide context value
  const authInfo = {
    user,
    role,
    loading,
    createUser,
    signInUser,
    googleLogin,
    logOut,
    updateUserProfile,
    setUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
