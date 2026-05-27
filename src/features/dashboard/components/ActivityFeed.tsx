// features/dashboard/components/ActivityFeed.tsx
//
// Chronological list of recent system events.
// Each event has a type-driven icon + color, a description, and a
// relative timestamp.
//
// Mock events are defined inline for Phase 3.
// Phase 4 will replace them with a useQuery hook that hits
// GET /api/audit-logs?limit=10.

import {
  Stack,
  Group,
  Text,
  ThemeIcon,
  Paper,
  Box,
  Anchor,
  Divider,
} from "@mantine/core";
import {
  IconUpload,
  IconClock,
  IconAlertCircle,
  IconUserPlus,
  IconCheck,
} from "@tabler/icons-react";
import Link from "next/link";

// ── Activity event shape ──────────────────────────────────────────
type ActivityType = "upload" | "late" | "missing" | "joined" | "approved";

interface ActivityEvent {
  id: string;
  type: ActivityType;
  message: string;
  actor: string; // employee name or "System"
  timestamp: string; // ISO string
}

// ── Static mock events ────────────────────────────────────────────
// Replace this array with the real API response in Phase 4.
const MOCK_EVENTS: ActivityEvent[] = [
  {
    id: "evt_001",
    type: "upload",
    message: "uploaded Week 21 timesheet",
    actor: "Priya Nair",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2m ago
  },
  {
    id: "evt_002",
    type: "upload",
    message: "uploaded Week 21 timesheet",
    actor: "Ravi Kumar",
    timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(), // 14m ago
  },
  {
    id: "evt_003",
    type: "late",
    message: "submitted 1h 20m after deadline",
    actor: "Sneha Iyer",
    timestamp: new Date(Date.now() - 80 * 60 * 1000).toISOString(), // 1h 20m ago
  },
  {
    id: "evt_004",
    type: "upload",
    message: "uploaded Week 21 timesheet",
    actor: "Carlos Vega",
    timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(), // 2.5h ago
  },
  {
    id: "evt_005",
    type: "missing",
    message: "marked missing — no upload in 3 days",
    actor: "Divya Sharma",
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(), // 9h ago (system)
  },
  {
    id: "evt_006",
    type: "missing",
    message: "marked missing — no upload in 3 days",
    actor: "Sofia Ricci",
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "evt_007",
    type: "joined",
    message: "joined the platform",
    actor: "Sofia Ricci",
    timestamp: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(), // 26d ago
  },
];

// ── Event type config ─────────────────────────────────────────────
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

// ── Relative time helper (no external dep) ────────────────────────
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

// ── Single event item ─────────────────────────────────────────────
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

// ── Main component ────────────────────────────────────────────────
interface ActivityFeedProps {
  /** Override events — used for testing or future API integration */
  events?: ActivityEvent[];
}

export function ActivityFeed({ events = MOCK_EVENTS }: ActivityFeedProps) {
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
          {events.map((event, i) => (
            <Box key={event.id}>
              <EventItem event={event} />
              {i < events.length - 1 && (
                <Divider my="sm" style={{ opacity: 0.6 }} />
              )}
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
