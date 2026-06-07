import { useEffect } from "react";
import { useRouter } from "next/router";
import { Center, Loader } from "@mantine/core";

import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function AuthGuard({ children, adminOnly = false }: AuthGuardProps) {
  const router = useRouter();

  const { isLoading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (adminOnly && user?.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, user, adminOnly, router]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (adminOnly && user?.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
