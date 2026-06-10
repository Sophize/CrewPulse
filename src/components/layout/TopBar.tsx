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
  rem,
  Box,
  Menu,
  Badge,
  Stack,
} from "@mantine/core";
import {
  IconBell,
  IconSearch,
  IconChevronRight,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

export interface BreadcrumbItem {
  label: string;
  href?: string; // Omit for the last (current) item
}

function NotificationBell() {
  // TODO: Replace with notification API data
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

function SearchButton() {
  //Todo : Implement search functionality
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

export interface TopBarProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  opened: boolean;
  onBurgerClick: () => void;
}

export function TopBar({
  title,
  breadcrumbs = [],
  opened,
  onBurgerClick,
}: TopBarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

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
        <Group wrap="nowrap" gap="sm" style={{ flex: 1, minWidth: 0 }}>
          <Burger
            opened={opened}
            onClick={onBurgerClick}
            hiddenFrom="sm"
            size="sm"
            aria-label={opened ? "Close navigation" : "Open navigation"}
          />

          <Box style={{ minWidth: 0 }}>
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

        <Group wrap="nowrap" gap={4}>
          <SearchButton />
          <NotificationBell />

          <Box
            w={1}
            h={20}
            mx={4}
            style={{ background: "var(--mantine-color-default-border)" }}
          />

          <Menu shadow="md" width={260} position="bottom-end">
            <Menu.Target>
              <Avatar
                size={32}
                radius="xl"
                color="blue"
                variant="filled"
                style={{ cursor: "pointer" }}
              >
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </Avatar>
            </Menu.Target>

            <Menu.Dropdown>
              <Box py="sm" px="md">
                <Stack align="center" gap="sm">
                  <Avatar size={56} radius="xl" color="blue" variant="filled">
                    {user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </Avatar>

                  <Text fw={600} size="lg">
                    {user?.name
                      ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                      : "User"}
                  </Text>

                  <Text size="sm" c="dimmed">
                    {user?.email}
                  </Text>

                  <Badge size="sm" variant="light">
                    {user?.role}
                  </Badge>
                </Stack>
              </Box>

              <Menu.Divider />

              <Menu.Item
                leftSection={<IconSettings size={16} />}
                onClick={() => router.push("/settings")}
              >
                Settings
              </Menu.Item>

              <Menu.Item
                color="red"
                leftSection={<IconLogout size={16} />}
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShell.Header>
  );
}
