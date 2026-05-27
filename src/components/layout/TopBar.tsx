// components/layout/TopBar.tsx
//
// Dashboard top navigation bar rendered inside Mantine's AppShell.Header.
// Responsibilities:
//   1. Mobile burger button (controls sidebar drawer open state)
//   2. Page title + breadcrumb (title-driven — each page passes its own)
//   3. Notification bell (static badge — real count wired later)
//   4. Color scheme toggle (light / dark / auto)
//   5. User avatar with dropdown stub
//
// TopBar is a pure presentational component — it owns no state of
// its own. State lives in DashboardLayout and is passed as props.

import {
  AppShell,
  Group,
  Burger,
  Text,
  ActionIcon,
  Avatar,
  Tooltip,
  Breadcrumbs,
  Anchor,
  Indicator,
  useMantineColorScheme,
  useComputedColorScheme,
  rem,
  Box,
} from "@mantine/core";
import {
  IconBell,
  IconSearch,
  IconSun,
  IconMoon,
  IconChevronRight,
} from "@tabler/icons-react";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

// ── Breadcrumb types ──────────────────────────────────────────────
export interface BreadcrumbItem {
  label: string;
  href?: string; // Omit for the last (current) item
}

// ── Color scheme toggle ───────────────────────────────────────────
function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const isDark = computed === "dark";

  return (
    <Tooltip
      label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      withArrow
      position="bottom"
    >
      <ActionIcon
        variant="subtle"
        color="gray"
        size="md"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={() => setColorScheme(isDark ? "light" : "dark")}
      >
        {isDark ? (
          <IconSun size={18} stroke={1.5} />
        ) : (
          <IconMoon size={18} stroke={1.5} />
        )}
      </ActionIcon>
    </Tooltip>
  );
}

// ── Notification bell ─────────────────────────────────────────────
function NotificationBell() {
  // Static badge count — replace with real unread count from useQuery later.
  //   const UNREAD_COUNT = 3;
  const UNREAD_COUNT: number = 3;

  return (
    <Tooltip label="Notifications" withArrow position="bottom">
      <Indicator
        color="red"
        size={16}
        label={UNREAD_COUNT > 9 ? "9+" : UNREAD_COUNT}
        disabled={UNREAD_COUNT === 0}
        styles={{ indicator: { fontSize: rem(10), fontWeight: 600 } }}
      >
        <ActionIcon
          variant="subtle"
          color="gray"
          size="md"
          aria-label={`${UNREAD_COUNT} unread notifications`}
        >
          <IconBell size={18} stroke={1.5} />
        </ActionIcon>
      </Indicator>
    </Tooltip>
  );
}

// ── Search trigger ────────────────────────────────────────────────
function SearchButton() {
  return (
    <Tooltip label="Search (⌘K)" withArrow position="bottom">
      <ActionIcon
        variant="subtle"
        color="gray"
        size="md"
        aria-label="Open search"
      >
        <IconSearch size={18} stroke={1.5} />
      </ActionIcon>
    </Tooltip>
  );
}

// ── TopBar props ──────────────────────────────────────────────────
export interface TopBarProps {
  /** Page title displayed in the header — e.g. "Dashboard" */
  title: string;
  /**
   * Breadcrumb trail. The TopBar always prepends the app name.
   * Pass the page-specific items only.
   * Example: [{ label: "Uploads" }]
   */
  breadcrumbs?: BreadcrumbItem[];
  /** Mobile sidebar open state — passed from DashboardLayout */
  opened: boolean;
  /** Toggles mobile sidebar — passed from DashboardLayout */
  onBurgerClick: () => void;
}

// ── TopBar ────────────────────────────────────────────────────────
export function TopBar({
  title,
  breadcrumbs = [],
  opened,
  onBurgerClick,
}: TopBarProps) {
  // Full breadcrumb: [App name] / [page items...]
  const fullBreadcrumbs: BreadcrumbItem[] = [
    { label: APP_NAME, href: "/dashboard" },
    ...breadcrumbs,
  ];

  return (
    <AppShell.Header
      data-layout="topbar"
      style={{
        borderBottom: "1px solid var(--mantine-color-default-border)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <Group h="100%" px="md" justify="space-between" wrap="nowrap">
        {/* ── Left: burger + title ─────────────────────────────── */}
        <Group wrap="nowrap" gap="sm" style={{ flex: 1, minWidth: 0 }}>
          {/* Burger only visible on mobile (hiddenFrom="sm" in AppShell) */}
          <Burger
            opened={opened}
            onClick={onBurgerClick}
            hiddenFrom="sm"
            size="sm"
            aria-label={opened ? "Close navigation" : "Open navigation"}
          />

          {/* Title + breadcrumb stack */}
          <Box style={{ minWidth: 0 }}>
            {/* Breadcrumb — hidden on very small screens */}
            {fullBreadcrumbs.length > 1 && (
              <Breadcrumbs
                separator={<IconChevronRight size={12} stroke={1.5} />}
                separatorMargin={4}
                visibleFrom="sm"
                styles={{
                  root: { flexWrap: "nowrap", gap: 0 },
                  breadcrumb: { fontSize: rem(12) },
                }}
              >
                {fullBreadcrumbs.map((crumb, i) => {
                  const isLast = i === fullBreadcrumbs.length - 1;
                  return isLast ? (
                    <Text key={crumb.label} size="xs" c="dimmed" fw={400}>
                      {crumb.label}
                    </Text>
                  ) : (
                    <Anchor
                      key={crumb.label}
                      component={Link}
                      href={crumb.href ?? "#"}
                      size="xs"
                      c="dimmed"
                      underline="hover"
                    >
                      {crumb.label}
                    </Anchor>
                  );
                })}
              </Breadcrumbs>
            )}

            {/* Page title */}
            <Text
              fw={600}
              size="sm"
              lh={fullBreadcrumbs.length > 1 ? 1.2 : undefined}
              truncate
            >
              {title}
            </Text>
          </Box>
        </Group>

        {/* ── Right: actions ───────────────────────────────────── */}
        <Group wrap="nowrap" gap={4}>
          <SearchButton />
          <ColorSchemeToggle />
          <NotificationBell />

          {/* Vertical divider */}
          <Box
            w={1}
            h={20}
            mx={4}
            style={{ background: "var(--mantine-color-default-border)" }}
          />

          {/* User avatar — dropdown stub for now */}
          <Tooltip label="Account" withArrow position="bottom-end">
            <Avatar
              size={32}
              radius="xl"
              color="blue"
              variant="filled"
              style={{ cursor: "pointer" }}
              aria-label="Open account menu"
            >
              JD
            </Avatar>
          </Tooltip>
        </Group>
      </Group>
    </AppShell.Header>
  );
}
