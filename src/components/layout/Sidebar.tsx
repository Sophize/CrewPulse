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
  ScrollArea,
  Tooltip,
  rem,
} from "@mantine/core";
import {
  IconLayoutDashboard,
  IconShield,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import Image from "next/image";

import {
  SIDEBAR_LINKS,
  NAV_SECTION_LABELS,
  APP_NAME,
  APP_TAGLINE,
  type SidebarLink,
} from "@/lib/constants";

import { useAuth } from "@/hooks/useAuth";

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number | string; stroke?: number }>
> = {
  "layout-dashboard": IconLayoutDashboard,
  shield: IconShield,
  settings: IconSettings,
};

function NavIcon({ name, size = 18 }: { name: string; size?: number }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={size} stroke={1.5} />;
}

function LogoMark() {
  return (
    <Image
      src="/favicon.ico"
      alt="CrewPulse"
      width={32}
      height={32}
      style={{
        borderRadius: 8,
        flexShrink: 0,
      }}
    />
  );
}

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

function UserFooter() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <Box px="sm" py="sm">
      <Group wrap="nowrap" gap="sm">
        <Box
          onClick={() => router.push("/settings")}
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
          }}
        >
          <Avatar size={34} radius="xl" color="blue" variant="filled">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </Avatar>

          <Box style={{ overflow: "hidden" }}>
            <Text size="sm" fw={500} truncate>
              {user?.name || "User"}
            </Text>

            <Text size="xs" c="dimmed" truncate>
              {user?.role || "EMPLOYEE"}
            </Text>
          </Box>
        </Box>
        <Tooltip label="Sign out" position="right" withArrow>
          <Box
            component="button"
            onClick={handleLogout}
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

export interface SidebarProps {
  onClose: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter();

  const activeHref = router.pathname;

  const mainLinks = SIDEBAR_LINKS.filter((l) => l.section === "main");

  return (
    <AppShell.Navbar
      data-layout="sidebar"
      style={{
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid var(--mantine-color-default-border)",
      }}
    >
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

      <ScrollArea style={{ flex: 1 }} px="xs" py="sm">
        <Stack gap="lg">
          <NavSection
            label={NAV_SECTION_LABELS.main}
            links={mainLinks}
            activeHref={activeHref}
            onLinkClick={onClose}
          />
        </Stack>
      </ScrollArea>

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
