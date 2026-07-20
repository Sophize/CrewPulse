import { Stack } from "@mantine/core";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import { EmployeeStatusCard } from "@/features/dashboard/components/EmployeeStatusCard";
import { LeaveManagementCard } from "@/features/dashboard/components/LeaveManagementCard";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardLayout
        title="My Dashboard"
        breadcrumbs={[{ label: "Dashboard" }]}
      >
        <PageHeader
          title="My Dashboard"
          subtitle="Your timesheet and task status"
        />

        <Stack gap="lg">
          <EmployeeStatusCard />
          <LeaveManagementCard />
        </Stack>
      </DashboardLayout>
    </AuthGuard>
  );
}
