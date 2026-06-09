import { Alert, Grid, Box, Text, Button } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";

import { DashboardLayout } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import { EmployeesTable } from "@/features/admin/components/EmployeesTable";
import { ActivityFeed } from "@/features/dashboard/components/ActivityFeed";

import { getErrorMessage } from "@/api/errors";
import { useEmployees } from "@/hooks/useEmployees";
import { useActivityFeed } from "@/hooks/useActivityFeed";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AdminPage() {
  const employeesQuery = useEmployees();
  const activityQuery = useActivityFeed();

  const employeeRows = employeesQuery.data?.rows ?? [];

  return (
    <AuthGuard adminOnly>
      <DashboardLayout title="Team Overview" breadcrumbs={[{ label: "Admin" }]}>
        <PageHeader
          title="Team Overview"
          subtitle="See what everyone is working on right now."
          action={
            <Button
              size="sm"
              leftSection={<IconRefresh size={14} stroke={1.5} />}
              variant="light"
              color="gray"
              onClick={() => {
                employeesQuery.refetch();
                activityQuery.refetch();
              }}
            >
              Refresh
            </Button>
          }
        />

        {(employeesQuery.isError || activityQuery.isError) && (
          <Alert color="red" mb="md" title="Unable to load data">
            {getErrorMessage(employeesQuery.error ?? activityQuery.error)}
          </Alert>
        )}

        <Grid mb="lg">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Box>
              <Text fw={600} size="sm" mb="sm">
                Employees
              </Text>
              <EmployeesTable
                rows={employeeRows}
                isLoading={employeesQuery.isLoading}
              />
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ActivityFeed
              events={activityQuery.isLoading ? [] : (activityQuery.data ?? [])}
              isLoading={activityQuery.isLoading}
            />
          </Grid.Col>
        </Grid>
      </DashboardLayout>
    </AuthGuard>
  );
}
