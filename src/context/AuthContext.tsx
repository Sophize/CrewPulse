// src/context/AuthContext.tsx
//
// Authentication context for managing user state across the app.
// Provides current user, loading state, and auth functions.
//
// Architecture:
// - Listens to Firebase auth state changes
// - Syncs user with PostgreSQL via API
// - Provides context to entire app via AuthProvider

import React, { createContext, useEffect, useState, useCallback } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/firebase/config";

// ── Type definitions ────────────────────────────────────────
export interface AuthUser {
  uid: string;
  email: string | null;
  name: string | null;
  role: "ADMIN" | "EMPLOYEE";
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  error: string | null;
}

// ── Create context ──────────────────────────────────────────
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// ── Props type ──────────────────────────────────────────────
interface AuthProviderProps {
  children: React.ReactNode;
}

// ── Provider component ──────────────────────────────────────
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Sync Firebase user with PostgreSQL ──────────────────
  const syncUserWithDatabase = useCallback(
    async (firebaseUser: FirebaseUser) => {
      try {
        const response = await fetch("/api/auth/sync-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to sync user");
        }

        const data: { role?: "ADMIN" | "EMPLOYEE" } = await response.json();
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name:
            firebaseUser.displayName ??
            firebaseUser.email?.split("@")[0] ??
            null,
          role: data.role || "EMPLOYEE",
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sync failed");
      }
    },
    [],
  );

  // ── Listen to Firebase auth state changes ───────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          await syncUserWithDatabase(firebaseUser);
        } else {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, [syncUserWithDatabase]);

  // ── Logout function ─────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed");
      throw err;
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
