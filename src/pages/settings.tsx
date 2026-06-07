import {
  Stack,
  Paper,
  Text,
  Group,
  TextInput,
  Button,
  ThemeIcon,
  Box,
  Select,
} from "@mantine/core";
import { IconUser, IconPalette, IconLogout } from "@tabler/icons-react";

import { DashboardLayout } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ size?: number | string; stroke?: number }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Paper withBorder radius="sm" p={0} style={{ overflow: "hidden" }}>
      <Box
        px="lg"
        py="sm"
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
        }}
      >
        <Group gap="sm">
          <ThemeIcon size={34} radius="sm" color="blue" variant="light">
            <Icon size={18} stroke={1.5} />
          </ThemeIcon>

          <Box>
            <Text fw={600} size="sm">
              {title}
            </Text>
            <Text size="xs" c="dimmed">
              {description}
            </Text>
          </Box>
        </Group>
      </Box>

      <Box px="lg" py="sm">
        {children}
      </Box>
    </Paper>
  );
}

function ProfileSection() {
  const { user } = useAuth();

  return (
    <Section
      icon={IconUser}
      title="Profile"
      description="Basic account information"
    >
      <Stack gap="md">
        <TextInput
          label="Full name"
          value={user?.name ?? ""}
          readOnly
          size="sm"
        />

        <TextInput label="Email" value={user?.email ?? ""} readOnly size="sm" />

        <Box>
          <Text size="sm" fw={500}>
            Role
          </Text>
          <Text size="sm" c="dimmed">
            {user?.role ?? "EMPLOYEE"}
          </Text>
        </Box>
      </Stack>
    </Section>
  );
}

function AppearanceSection() {
  return (
    <Section
      icon={IconPalette}
      title="Appearance"
      description="Customize your experience"
    >
      <Select
        label="Theme"
        size="sm"
        defaultValue="light"
        data={[
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
          { value: "system", label: "System" },
        ]}
      />
    </Section>
  );
}

function AccountSection() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <Section icon={IconLogout} title="Account" description="Session management">
      <Button color="red" variant="light" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </Section>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <DashboardLayout title="Settings" breadcrumbs={[{ label: "Settings" }]}>
        <PageHeader
          title="Settings"
          subtitle="Manage your account preferences"
        />

        <Stack gap="md">
          <ProfileSection />
          <AppearanceSection />
          <AccountSection />
        </Stack>
      </DashboardLayout>
    </AuthGuard>
  );
}
