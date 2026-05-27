import { Alert, Grid, Stack } from "@mantine/core";

import { DashboardLayout } from "@/components/layout";

import { PageHeader } from "@/components/ui";

import { StatsRow } from "@/features/dashboard/components/StatsRow";
import { RecentUploadsTable } from "@/features/dashboard/components/RecentUploadsTable";
import { DeptComplianceBar } from "@/features/dashboard/components/DeptComplianceBar";
import { ActivityFeed } from "@/features/dashboard/components/ActivityFeed";

import { getErrorMessage } from "@/api/errors";
import { useActivityFeed } from "@/hooks/useActivityFeed";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function DashboardPage() {
  const statsQuery = useDashboardStats();
  const activityQuery = useActivityFeed();
  const stats = statsQuery.data;

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

      {(statsQuery.isError || activityQuery.isError) && (
        <Alert color="red" mb="md" title="Unable to load dashboard data">
          {getErrorMessage(statsQuery.error ?? activityQuery.error)}
        </Alert>
      )}

      {stats && <StatsRow stats={stats} />}

      <Grid mt="lg">
        {/* Left: recent uploads — wider column */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <RecentUploadsTable
            uploads={stats?.recentUploads ?? []}
            isLoading={statsQuery.isLoading}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack gap="lg">
            <DeptComplianceBar
              deptStats={stats?.deptCompliance ?? []}
              isLoading={statsQuery.isLoading}
            />
            <ActivityFeed
              events={activityQuery.isLoading ? [] : (activityQuery.data ?? [])}
            />
          </Stack>
        </Grid.Col>
      </Grid>
    </DashboardLayout>
  );
}
