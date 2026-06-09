import type { ActivityEvent } from "@/types";

export async function getActivityFeed(): Promise<ActivityEvent[]> {
  const res = await fetch("/api/activity");

  if (!res.ok) {
    throw new Error("Failed to fetch activity");
  }

  return res.json();
}
