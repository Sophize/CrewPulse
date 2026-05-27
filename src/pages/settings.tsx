// pages/settings.tsx
//
// Settings page — static form sections with no backend yet.
// All inputs are controlled but local-state only.
// Phase 4: wire each section to a PATCH /api/settings endpoint.
//
// Sections:
//   1. Profile
//   2. Notifications
//   3. Appearance
//   4. Company configuration
//   5. Security

import { useState } from "react";
import React from "react";
import {
  Stack,
  Paper,
  Text,
  Group,
  TextInput,
  Textarea,
  Switch,
  Select,
  Button,
  Divider,
  ThemeIcon,
  Box,
  Avatar,
  Badge,
  PasswordInput,
  SimpleGrid,
  Alert,
  rem,
} from "@mantine/core";
import {
  IconUser,
  IconBell,
  IconPalette,
  IconBuilding,
  IconShield,
  IconCheck,
  IconInfoCircle,
  IconUpload,
} from "@tabler/icons-react";
import { useMantineColorScheme, useComputedColorScheme } from "@mantine/core";

import { DashboardLayout } from "@/components/layout";
import { PageHeader } from "@/components/ui";

// ── Section wrapper ───────────────────────────────────────────────
// Consistent card layout for every settings section.
function SettingsSection({
  icon,
  color,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ size?: number | string; stroke?: number }>;
  color: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Paper withBorder radius="sm" p={0} style={{ overflow: "hidden" }}>
      {/* Section header */}
      <Box
        px="lg"
        py="md"
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
        }}
      >
        <Group gap="sm">
          <ThemeIcon size={34} radius="sm" color={color} variant="light">
            {icon ? React.createElement(icon, { size: 18, stroke: 1.5 }) : null}
          </ThemeIcon>
          <ThemeIcon
            size={34}
            radius="sm"
            color={color}
            variant="light"
            aria-hidden
          >
            {icon ? React.createElement(icon, { size: 18, stroke: 1.5 }) : null}
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
      {/* Section content */}
      <Box px="lg" py="md">
        {children}
      </Box>
    </Paper>
  );
}

// Fixed version without the broken render pattern above
function Section({
  icon: Icon,
  color,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ size?: number | string; stroke?: number }>;
  color: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Paper withBorder radius="sm" p={0} style={{ overflow: "hidden" }}>
      <Box
        px="lg"
        py="md"
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
        }}
      >
        <Group gap="sm">
          <ThemeIcon size={34} radius="sm" color={color} variant="light">
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
      <Box px="lg" py="md">
        {children}
      </Box>
    </Paper>
  );
}

// ── 1. Profile section ────────────────────────────────────────────
function ProfileSection() {
  const [name, setName] = useState("James Dorsey");
  const [email, setEmail] = useState("james.dorsey@crewpulse.io");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Section
      icon={IconUser}
      color="blue"
      title="Profile"
      description="Your personal information and account details."
    >
      <Stack gap="md">
        {/* Avatar row */}
        <Group gap="md" align="flex-end">
          <Avatar size={64} radius="xl" color="blue" variant="filled">
            JD
          </Avatar>
          <Box>
            <Text size="xs" c="dimmed" mb={6}>
              Profile photo
            </Text>
            <Button
              size="xs"
              variant="light"
              leftSection={<IconUpload size={13} stroke={1.5} />}
            >
              Upload photo
            </Button>
          </Box>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
          <TextInput
            label="Full name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            size="sm"
            type="email"
          />
        </SimpleGrid>

        <TextInput label="Job title" defaultValue="Administrator" size="sm" />

        <Textarea
          label="Bio"
          placeholder="Brief description for your profile…"
          value={bio}
          onChange={(e) => setBio(e.currentTarget.value)}
          size="sm"
          rows={3}
        />

        <Group justify="flex-end">
          <Button
            size="sm"
            onClick={handleSave}
            color={saved ? "green" : "blue"}
            leftSection={
              saved ? <IconCheck size={14} stroke={1.5} /> : undefined
            }
          >
            {saved ? "Saved" : "Save changes"}
          </Button>
        </Group>
      </Stack>
    </Section>
  );
}

// ── 2. Notifications section ──────────────────────────────────────
interface NotifPref {
  id: string;
  label: string;
  desc: string;
  on: boolean;
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState<NotifPref[]>([
    {
      id: "missing",
      label: "Missing submissions",
      desc: "Alert when an employee hasn't submitted for 3+ days",
      on: true,
    },
    {
      id: "late",
      label: "Late submissions",
      desc: "Alert when a submission arrives after the deadline",
      on: true,
    },
    {
      id: "deadline",
      label: "Daily deadline reminder",
      desc: "Reminder email 1 hour before the submission deadline",
      on: false,
    },
    {
      id: "weekly",
      label: "Weekly summary report",
      desc: "Receive a summary every Monday morning",
      on: true,
    },
    {
      id: "joined",
      label: "New employee joined",
      desc: "Notify when a new employee is added to the platform",
      on: false,
    },
  ]);

  function toggle(id: string) {
    setPrefs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, on: !p.on } : p)),
    );
  }

  return (
    <Section
      icon={IconBell}
      color="orange"
      title="Notifications"
      description="Choose which events trigger email alerts."
    >
      <Stack gap={0}>
        {prefs.map((pref, i) => (
          <Box key={pref.id}>
            <Group justify="space-between" py="sm" wrap="nowrap">
              <Box style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                  {pref.label}
                </Text>
                <Text size="xs" c="dimmed">
                  {pref.desc}
                </Text>
              </Box>
              <Switch
                checked={pref.on}
                onChange={() => toggle(pref.id)}
                aria-label={pref.label}
              />
            </Group>
            {i < prefs.length - 1 && <Divider style={{ opacity: 0.5 }} />}
          </Box>
        ))}
      </Stack>
    </Section>
  );
}

// ── 3. Appearance section ─────────────────────────────────────────
function AppearanceSection() {
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <Section
      icon={IconPalette}
      color="grape"
      title="Appearance"
      description="Customise how CrewPulse looks on your device."
    >
      <Stack gap="md">
        <Box>
          <Text size="sm" fw={500} mb={8}>
            Theme
          </Text>
          <Group gap="sm">
            {(["light", "dark", "auto"] as const).map((scheme) => (
              <Paper
                key={scheme}
                withBorder
                radius="sm"
                px="lg"
                py="sm"
                style={{
                  cursor: "pointer",
                  borderColor:
                    computed === scheme ||
                    (scheme === "auto" && computed === "light")
                      ? "var(--mantine-color-blue-5)"
                      : undefined,
                }}
                onClick={() => setColorScheme(scheme)}
              >
                <Text size="sm" tt="capitalize">
                  {scheme}
                </Text>
              </Paper>
            ))}
          </Group>
        </Box>

        <Select
          label="Date format"
          defaultValue="dd-mmm-yyyy"
          size="sm"
          w={200}
          data={[
            { value: "dd-mmm-yyyy", label: "27 May 2025" },
            { value: "mm-dd-yyyy", label: "05/27/2025" },
            { value: "yyyy-mm-dd", label: "2025-05-27" },
          ]}
        />

        <Select
          label="Timezone"
          defaultValue="Asia/Kolkata"
          size="sm"
          w={260}
          data={[
            { value: "Asia/Kolkata", label: "IST — Asia/Kolkata" },
            { value: "America/New_York", label: "EST — America/New_York" },
            { value: "Europe/London", label: "GMT — Europe/London" },
            { value: "Asia/Singapore", label: "SGT — Asia/Singapore" },
          ]}
        />
      </Stack>
    </Section>
  );
}

// ── 4. Company configuration ──────────────────────────────────────
function CompanySection() {
  return (
    <Section
      icon={IconBuilding}
      color="teal"
      title="Company configuration"
      description="Submission deadlines, working days, and platform-wide settings."
    >
      <Stack gap="md">
        <Alert
          icon={<IconInfoCircle size={16} stroke={1.5} />}
          color="blue"
          variant="light"
          radius="sm"
        >
          Changes here affect all employees. Only admins can modify company
          settings.
        </Alert>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
          <TextInput label="Company name" defaultValue="Acme Corp" size="sm" />
          <TextInput
            label="Platform subdomain"
            defaultValue="acme.crewpulse.io"
            size="sm"
            disabled
            rightSection={
              <Badge size="xs" color="gray" variant="light">
                Read-only
              </Badge>
            }
            rightSectionWidth={rem(80)}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
          <TextInput
            label="Daily submission deadline"
            defaultValue="18:00"
            description="HH:MM in company timezone"
            size="sm"
          />
          <Select
            label="Missing threshold"
            defaultValue="3"
            description="Days before marking as missing"
            size="sm"
            data={[
              { value: "1", label: "1 day" },
              { value: "2", label: "2 days" },
              { value: "3", label: "3 days" },
              { value: "5", label: "5 days" },
              { value: "7", label: "7 days" },
            ]}
          />
        </SimpleGrid>

        <Box>
          <Text size="sm" fw={500} mb={8}>
            Working days
          </Text>
          <Group gap="xs">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
              const isWeekday = !["Sat", "Sun"].includes(day);
              return (
                <Badge
                  key={day}
                  color={isWeekday ? "blue" : "gray"}
                  variant={isWeekday ? "light" : "outline"}
                  radius="sm"
                  size="lg"
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  {day}
                </Badge>
              );
            })}
          </Group>
        </Box>

        <Group justify="flex-end">
          <Button size="sm" variant="light">
            Save company settings
          </Button>
        </Group>
      </Stack>
    </Section>
  );
}

// ── 5. Security section ───────────────────────────────────────────
function SecuritySection() {
  return (
    <Section
      icon={IconShield}
      color="red"
      title="Security"
      description="Password, two-factor authentication, and session management."
    >
      <Stack gap="md">
        <Box>
          <Text size="sm" fw={600} mb="xs">
            Change password
          </Text>
          <Stack gap="sm" maw={400}>
            <PasswordInput
              label="Current password"
              size="sm"
              placeholder="••••••••"
            />
            <PasswordInput
              label="New password"
              size="sm"
              placeholder="Min. 8 characters"
            />
            <PasswordInput
              label="Confirm password"
              size="sm"
              placeholder="Repeat new password"
            />
            <Group>
              <Button size="sm" variant="light" color="red">
                Update password
              </Button>
            </Group>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Text size="sm" fw={600} mb={4}>
            Two-factor authentication
          </Text>
          <Text size="xs" c="dimmed" mb="sm">
            Add an extra layer of security to your account.
          </Text>
          <Group gap="sm" align="center">
            <Badge color="red" variant="light" size="sm">
              Not enabled
            </Badge>
            <Button size="xs" variant="light" color="blue">
              Enable 2FA
            </Button>
          </Group>
        </Box>

        <Divider />

        <Box>
          <Text size="sm" fw={600} mb={4}>
            Active sessions
          </Text>
          <Text size="xs" c="dimmed" mb="sm">
            You are signed in on 1 device.
          </Text>
          <Paper withBorder radius="sm" p="sm" maw={400}>
            <Group justify="space-between">
              <Box>
                <Text size="sm" fw={500}>
                  Chrome · macOS
                </Text>
                <Text size="xs" c="dimmed">
                  Bengaluru, India · Active now
                </Text>
              </Box>
              <Badge color="green" variant="light" size="xs">
                Current
              </Badge>
            </Group>
          </Paper>
          <Button size="xs" variant="subtle" color="red" mt="sm">
            Sign out all other sessions
          </Button>
        </Box>
      </Stack>
    </Section>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function SettingsPage() {
  return (
    <DashboardLayout title="Settings" breadcrumbs={[{ label: "Settings" }]}>
      <PageHeader
        title="Settings"
        subtitle="Manage your account, notifications, and company configuration."
      />

      <Stack gap="lg" maw={760}>
        <ProfileSection />
        <NotificationsSection />
        <AppearanceSection />
        <CompanySection />
        <SecuritySection />
      </Stack>
    </DashboardLayout>
  );
}
