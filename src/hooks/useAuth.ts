// src/hooks/useAuth.ts
//
// Custom hook to access authentication context.
// Must be used within AuthProvider.
//
// Usage:
// const { user, isLoading, isAuthenticated, logout } = useAuth();

import { useContext } from "react";
import { AuthContext, type AuthContextType } from "@/context/AuthContext";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  
  return context;
}