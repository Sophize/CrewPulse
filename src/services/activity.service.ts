import type { ActivityEvent } from "@/types";

const MOCK_EVENTS: ActivityEvent[] = [
  {
    id: "evt_001",
    type: "upload",
    message: "uploaded Week 21 timesheet",
    actor: "Priya Nair",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "evt_002",
    type: "upload",
    message: "uploaded Week 21 timesheet",
    actor: "Ravi Kumar",
    timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
  },
  {
    id: "evt_003",
    type: "late",
    message: "submitted 1h 20m after deadline",
    actor: "Sneha Iyer",
    timestamp: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
  },
  {
    id: "evt_004",
    type: "upload",
    message: "uploaded Week 21 timesheet",
    actor: "Carlos Vega",
    timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "evt_005",
    type: "missing",
    message: "marked missing - no upload in 3 days",
    actor: "Divya Sharma",
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "evt_006",
    type: "missing",
    message: "marked missing - no upload in 3 days",
    actor: "Sofia Ricci",
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "evt_007",
    type: "joined",
    message: "joined the platform",
    actor: "Sofia Ricci",
    timestamp: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function getActivityFeed(): Promise<ActivityEvent[]> {
  return Promise.resolve(MOCK_EVENTS);
}
