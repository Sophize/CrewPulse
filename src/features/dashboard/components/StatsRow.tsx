import { SimpleGrid } from "@mantine/core";
import {
  IconUsers,
  IconCircleCheck,
  IconClock,
  IconAlertTriangle,
} from "@tabler/icons-react";

import { StatCard } from "@/components/ui";
import type { DashboardStats } from "@/types/dashboard";

interface StatsRowProps {
  stats: DashboardStats;
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md">
      <StatCard
        label="Total employees"
        value={stats.totalEmployees}
        note={`${stats.complianceRate} compliance this week`}
        color="blue"
        icon={IconUsers}
      />

      <StatCard
        label="Updated"
        value={stats.updatedCount}
        note="Submitted before deadline"
        color="green"
        icon={IconCircleCheck}
      />

      <StatCard
        label="Pending"
        value={stats.pendingCount}
        note="Awaiting submission today"
        color="orange"
        icon={IconClock}
      />

      <StatCard
        label="Missing / Late"
        value={stats.missingLateCount}
        note={`${stats.missingCount} missing · ${stats.lateCount} late`}
        color="red"
        icon={IconAlertTriangle}
      />
    </SimpleGrid>
  );
}
