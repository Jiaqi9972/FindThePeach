"use client";

import React, { createContext, useState, useEffect } from "react";
import { auth } from "@/config/firebase";

// Create the context
export const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoadingUser(false); // Stop loading when user state is determined
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <UserContext.Provider value={{ user, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};
