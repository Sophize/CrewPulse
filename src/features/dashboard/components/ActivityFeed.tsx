import {
  Stack,
  Group,
  Text,
  ThemeIcon,
  Paper,
  Box,
  Anchor,
  Divider,
  Skeleton,
} from "@mantine/core";
import {
  IconUpload,
  IconClock,
  IconAlertCircle,
  IconUserPlus,
  IconCheck,
} from "@tabler/icons-react";
import Link from "next/link";
import type { ActivityEvent, ActivityType } from "@/types";

const EVENT_CONFIG: Record<
  ActivityType,
  {
    icon: React.ComponentType<{ size?: number | string; stroke?: number }>;
    color: string;
  }
> = {
  upload: { icon: IconUpload, color: "green" },
  late: { icon: IconClock, color: "orange" },
  missing: { icon: IconAlertCircle, color: "red" },
  joined: { icon: IconUserPlus, color: "blue" },
  approved: { icon: IconCheck, color: "teal" },
};

function relative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

function EventItem({ event }: { event: ActivityEvent }) {
  const config = EVENT_CONFIG[event.type];
  const Icon = config.icon;

  return (
    <Group gap="sm" wrap="nowrap" align="flex-start">
      <ThemeIcon
        color={config.color}
        variant="light"
        size={32}
        radius="xl"
        style={{ flexShrink: 0, marginTop: 2 }}
        aria-hidden
      >
        <Icon size={15} stroke={1.5} />
      </ThemeIcon>

      <Box style={{ flex: 1, minWidth: 0 }}>
        <Text size="sm" lh={1.4}>
          <Text component="span" fw={500}>
            {event.actor}
          </Text>{" "}
          <Text component="span" c="dimmed">
            {event.message}
          </Text>
        </Text>
        <Text size="xs" c="dimmed" mt={2}>
          {relative(event.timestamp)}
        </Text>
      </Box>
    </Group>
  );
}

interface ActivityFeedProps {
  events: ActivityEvent[];
  isLoading?: boolean;
}

export function ActivityFeed({ events, isLoading = false }: ActivityFeedProps) {
  return (
    <Stack gap={0}>
      <Group justify="space-between" mb="sm">
        <Text fw={600} size="sm">
          Recent activity
        </Text>
        <Anchor
          component={Link}
          href="/admin"
          size="xs"
          c="blue"
          underline="hover"
        >
          View audit log →
        </Anchor>
      </Group>

      <Paper withBorder radius="sm" p="md">
        <Stack gap={0}>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Box key={i}>
                <Group gap="sm" wrap="nowrap" align="flex-start">
                  <Skeleton circle height={32} />
                  <Box style={{ flex: 1 }}>
                    <Skeleton height={14} width="80%" radius="sm" />
                    <Skeleton height={10} width="28%" radius="sm" mt={8} />
                  </Box>
                </Group>
                {i < 4 && <Divider my="sm" style={{ opacity: 0.6 }} />}
              </Box>
            ))
          ) : events.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="md">
              No recent activity.
            </Text>
          ) : (
            events.map((event, i) => (
              <Box key={event.id}>
                <EventItem event={event} />
                {i < events.length - 1 && (
                  <Divider my="sm" style={{ opacity: 0.6 }} />
                )}
              </Box>
            ))
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
