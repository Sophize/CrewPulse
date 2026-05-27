// pages/index.tsx
//
// Root route — immediately redirects to /dashboard.
// Once auth is added, this becomes the auth gate:
//   - Authenticated   → redirect to /dashboard
//   - Unauthenticated → redirect to /login

import { useEffect } from "react";
import { useRouter } from "next/router";
import { Center, Loader } from "@mantine/core";

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <Center h="100vh">
      <Loader size="sm" />
    </Center>
  );
}
