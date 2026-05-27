// pages/uploads.tsx — stub
import { Text } from "@mantine/core";
import { DashboardLayout } from "@/components/layout";

export default function UploadsPage() {
  return (
    <DashboardLayout title="Uploads" breadcrumbs={[{ label: "Uploads" }]}>
      <Text c="dimmed" size="sm">
        Uploads content arrives in Phase 3.
      </Text>
    </DashboardLayout>
  );
}
