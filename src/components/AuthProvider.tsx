"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

interface AuthContextValue { user: User | null; loading: boolean; configured: boolean; }
const AuthContext = createContext<AuthContextValue>({ user: null, loading: true, configured: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const loadingTimeout = window.setTimeout(() => setLoading(false), 5000);
    const unsubscribe = onAuthStateChanged(
      getFirebaseAuth(),
      (nextUser) => {
        window.clearTimeout(loadingTimeout);
        setUser(nextUser);
        setLoading(false);
      },
      () => {
        window.clearTimeout(loadingTimeout);
        setLoading(false);
      },
    );

    return () => {
      window.clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ user, loading, configured: isFirebaseConfigured }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
