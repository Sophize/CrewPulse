// components/layout/Sidebar.tsx
//
// Dashboard sidebar rendered inside Mantine's AppShell.Navbar.
// Responsibilities:
//   1. Brand logo mark + name
//   2. Navigation links grouped by section (Main / Admin)
//   3. Active route highlight via useRouter
//   4. User identity footer
//   5. Mobile: rendered inside AppShell.Navbar which becomes
//      a drawer when the burger is toggled
//
// Does NOT manage its own open/close state — that lives in
// DashboardLayout so the TopBar burger can share it.

import { useRouter } from "next/router";
import Link from "next/link";
import {
  AppShell,
  NavLink,
  Stack,
  Group,
  Text,
  Box,
  Avatar,
  Divider,
  ScrollArea,
  Tooltip,
  ThemeIcon,
  rem,
} from "@mantine/core";
import {
  IconLayoutDashboard,
  IconUpload,
  IconCalendar,
  IconShield,
  IconChartBar,
  IconSettings,
  IconLogout,
  IconBuildingSkyscraper,
} from "@tabler/icons-react";

import {
  SIDEBAR_LINKS,
  NAV_SECTION_LABELS,
  APP_NAME,
  APP_TAGLINE,
  type SidebarLink,
} from "@/lib/constants";

// ── Icon map ──────────────────────────────────────────────────────
// Maps iconName strings from SIDEBAR_LINKS to actual Tabler
// icon components. Avoids dynamic imports and keeps the bundle
// tree-shakeable — only icons referenced here are included.
const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number | string; stroke?: number }>
> = {
  "layout-dashboard": IconLayoutDashboard,
  upload: IconUpload,
  calendar: IconCalendar,
  shield: IconShield,
  "chart-bar": IconChartBar,
  settings: IconSettings,
};

function NavIcon({ name, size = 18 }: { name: string; size?: number }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={size} stroke={1.5} />;
}

// ── Logo mark ─────────────────────────────────────────────────────
function LogoMark() {
  return (
    <ThemeIcon
      size={32}
      radius="sm"
      color="blue"
      variant="filled"
      style={{ flexShrink: 0 }}
    >
      <IconBuildingSkyscraper size={18} stroke={1.5} />
    </ThemeIcon>
  );
}

// ── Single nav item ───────────────────────────────────────────────
interface NavItemProps {
  link: SidebarLink;
  isActive: boolean;
  onClick?: () => void;
}

function NavItem({ link, isActive, onClick }: NavItemProps) {
  return (
    <NavLink
      component={Link}
      href={link.href}
      label={link.label}
      leftSection={<NavIcon name={link.iconName} />}
      rightSection={
        link.badge !== undefined ? (
          <Text
            size="xs"
            fw={500}
            c="white"
            bg="red"
            px={6}
            py={1}
            style={{ borderRadius: rem(100), lineHeight: 1.4 }}
          >
            {link.badge}
          </Text>
        ) : undefined
      }
      active={isActive}
      onClick={onClick}
      styles={{
        root: {
          borderRadius: "var(--mantine-radius-sm)",
          fontWeight: isActive ? 500 : 400,
          paddingTop: rem(8),
          paddingBottom: rem(8),
        },
        label: {
          fontSize: rem(13.5),
        },
      }}
    />
  );
}

// ── Section group ─────────────────────────────────────────────────
interface NavSectionProps {
  label: string;
  links: SidebarLink[];
  activeHref: string;
  onLinkClick?: () => void;
}

function NavSection({
  label,
  links,
  activeHref,
  onLinkClick,
}: NavSectionProps) {
  if (links.length === 0) return null;

  return (
    <Stack gap={2}>
      <Text
        size="xs"
        fw={600}
        tt="uppercase"
        c="dimmed"
        px="sm"
        mb={4}
        style={{ letterSpacing: "0.07em" }}
      >
        {label}
      </Text>
      {links.map((link) => (
        <NavItem
          key={link.href}
          link={link}
          isActive={activeHref === link.href}
          onClick={onLinkClick}
        />
      ))}
    </Stack>
  );
}

// ── User footer ───────────────────────────────────────────────────
// Displays a static placeholder until Firebase auth is wired.
// Replace MOCK_CURRENT_USER with the real auth user object later.
function UserFooter() {
  return (
    <Box px="sm" py="sm">
      <Group wrap="nowrap" gap="sm">
        <Avatar size={34} radius="xl" color="blue" variant="filled">
          JD
        </Avatar>
        <Box style={{ flex: 1, overflow: "hidden" }}>
          <Text size="sm" fw={500} truncate>
            James Dorsey
          </Text>
          <Text size="xs" c="dimmed" truncate>
            Administrator
          </Text>
        </Box>
        <Tooltip label="Sign out" position="right" withArrow>
          <Box
            component="button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              borderRadius: "var(--mantine-radius-sm)",
              color: "var(--mantine-color-dimmed)",
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Sign out"
          >
            <IconLogout size={17} stroke={1.5} />
          </Box>
        </Tooltip>
      </Group>
    </Box>
  );
}

// ── Sidebar props ─────────────────────────────────────────────────
export interface SidebarProps {
  /** Controls mobile drawer open state — passed from DashboardLayout */
  opened: boolean;
  /** Called when a nav link is clicked on mobile to close the drawer */
  onClose: () => void;
}

// ── Sidebar ───────────────────────────────────────────────────────
export function Sidebar({ opened: _opened, onClose }: SidebarProps) {
  const router = useRouter();

  // Exact match for active route. Extend to startsWith for nested routes.
  const activeHref = router.pathname;

  // Partition links into their display sections.
  const mainLinks = SIDEBAR_LINKS.filter((l) => l.section === "main");
  const adminLinks = SIDEBAR_LINKS.filter((l) => l.section === "admin");

  return (
    <AppShell.Navbar
      data-layout="sidebar"
      style={{
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid var(--mantine-color-default-border)",
      }}
    >
      {/* ── Logo ──────────────────────────────────────────────── */}
      <Box
        px="sm"
        py="md"
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
          flexShrink: 0,
        }}
      >
        <Group wrap="nowrap" gap="sm">
          <LogoMark />
          <Box>
            <Text size="sm" fw={600} lh={1.2}>
              {APP_NAME}
            </Text>
            <Text size="xs" c="dimmed" lh={1.2}>
              {APP_TAGLINE}
            </Text>
          </Box>
        </Group>
      </Box>

      {/* ── Navigation ────────────────────────────────────────── */}
      <ScrollArea style={{ flex: 1 }} px="xs" py="sm">
        <Stack gap="lg">
          <NavSection
            label={NAV_SECTION_LABELS.main}
            links={mainLinks}
            activeHref={activeHref}
            onLinkClick={onClose}
          />
          <Divider />
          <NavSection
            label={NAV_SECTION_LABELS.admin}
            links={adminLinks}
            activeHref={activeHref}
            onLinkClick={onClose}
          />
        </Stack>
      </ScrollArea>

      {/* ── User footer ───────────────────────────────────────── */}
      <Box
        style={{
          borderTop: "1px solid var(--mantine-color-default-border)",
          flexShrink: 0,
        }}
      >
        <UserFooter />
      </Box>
    </AppShell.Navbar>
  );
}
