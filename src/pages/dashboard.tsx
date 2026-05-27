import { Grid, Stack } from "@mantine/core";
import { IconCalendar } from "@tabler/icons-react";

import { DashboardLayout } from "@/components/layout";

import { PageHeader } from "@/components/ui";

import { StatsRow } from "@/features/dashboard/components/StatsRow";
import { RecentUploadsTable } from "@/features/dashboard/components/RecentUploadsTable";
import { DeptComplianceBar } from "@/features/dashboard/components/DeptComplianceBar";
import { ActivityFeed } from "@/features/dashboard/components/ActivityFeed";

import { MOCK_STATS, MOCK_CURRENT_UPLOADS } from "@/mock";

export default function DashboardPage() {
  const stats = MOCK_STATS;
  const uploads = MOCK_CURRENT_UPLOADS;

  return (
    <DashboardLayout title="Dashboard" breadcrumbs={[{ label: "Dashboard" }]}>
      <PageHeader
        title="Dashboard"
        subtitle="Week 21 · May 19 – 25, 2025"
        action={
          // Placeholder — will become a week-picker in Phase 4
          <></>
        }
      />

      {/* ── Stats row ─────────────────────────────────────────── */}
      <StatsRow stats={stats} />

      {/* ── Main content grid ─────────────────────────────────── */}
      <Grid mt="lg">
        {/* Left: recent uploads — wider column */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <RecentUploadsTable uploads={stats.recentUploads} isLoading={false} />
        </Grid.Col>

        {/* Right: dept compliance + activity feed stacked */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack gap="lg">
            <DeptComplianceBar
              deptStats={stats.deptCompliance}
              isLoading={false}
            />
            <ActivityFeed />
          </Stack>
        </Grid.Col>
      </Grid>
    </DashboardLayout>
  );
}
