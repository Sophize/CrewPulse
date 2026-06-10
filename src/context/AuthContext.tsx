import React, { createContext, useEffect, useState, useCallback } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/firebase/config";
import { useQueryClient } from "@tanstack/react-query";

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
  updateUserName: (name: string) => void;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const data: {
          role?: "ADMIN" | "EMPLOYEE";
          name?: string;
        } = await response.json();
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name:
            data.name ??
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          await syncUserWithDatabase(firebaseUser);
        } else {
          queryClient.clear();
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, [syncUserWithDatabase, queryClient]);

  const logout = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      queryClient.clear();
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed");
      throw err;
    }
  }, [queryClient]);

  const updateUserName = useCallback((name: string) => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            name,
          }
        : null,
    );
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    logout,
    updateUserName,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
