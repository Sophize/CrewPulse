import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Alert,
  Loader,
  Center,
  Group,
  ThemeIcon,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconMail,
  IconLock,
  IconBuildingSkyscraper,
} from "@tabler/icons-react";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "@/firebase/config";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();

  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    try {
      if (!email.trim()) {
        throw new Error("Email is required");
      }

      if (!password) {
        throw new Error("Password is required");
      }

      await signInWithEmailAndPassword(auth, email.trim(), password);

      router.replace("/dashboard");
    } catch (err) {
      let errorMessage = "Failed to sign in";

      if (err instanceof Error) {
        if (err.message.includes("auth/user-not-found")) {
          errorMessage = "User not found. Please contact your administrator.";
        } else if (err.message.includes("auth/wrong-password")) {
          errorMessage = "Incorrect password.";
        } else if (err.message.includes("auth/invalid-email")) {
          errorMessage = "Invalid email address.";
        } else if (err.message.includes("auth/user-disabled")) {
          errorMessage = "This account has been disabled.";
        } else if (err.message.includes("auth/too-many-requests")) {
          errorMessage = "Too many login attempts. Please try again later.";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  return (
    <Container size={420} my={40}>
      <Stack gap="lg">
        <Group justify="center" gap="sm">
          <ThemeIcon size={40} radius="md" color="blue" variant="filled">
            <IconBuildingSkyscraper size={20} stroke={1.5} />
          </ThemeIcon>

          <Stack gap={0}>
            <Text fw={700} size="lg">
              CrewPulse
            </Text>

            <Text size="xs" c="dimmed">
              Employee Activity & Timesheet Management Platform
            </Text>
          </Stack>
        </Group>

        <Paper withBorder shadow="sm" p={30} radius="md">
          <Stack gap="lg">
            <div>
              <Text size="lg" fw={500} mb="xs">
                Welcome back
              </Text>

              <Text size="sm" c="dimmed">
                Sign in to continue
              </Text>
            </div>

            {error && (
              <Alert
                color="red"
                title="Login Failed"
                icon={<IconAlertCircle size={16} />}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <Stack gap="md">
                <TextInput
                  label="Email Address"
                  placeholder="you@sophize.com"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  leftSection={<IconMail size={16} />}
                  disabled={isLoading}
                  required
                />

                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  leftSection={<IconLock size={16} />}
                  disabled={isLoading}
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  loading={isLoading}
                  disabled={isLoading || !email.trim() || !password}
                >
                  Sign In
                </Button>
              </Stack>
            </form>

            <Text size="sm" ta="center" c="dimmed">
              Access to CrewPulse is managed by your administrator.
            </Text>
          </Stack>
        </Paper>

        <Text size="xs" ta="center" c="dimmed">
          Secured with Firebase Authentication
        </Text>
      </Stack>
    </Container>
  );
}
