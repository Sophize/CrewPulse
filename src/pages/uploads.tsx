import { useCallback, useMemo } from "react";
import { Alert, Box, Button, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import {
  IconAlertTriangle,
  IconCloudUpload,
  IconDatabase,
  IconDownload,
  IconFileSpreadsheet,
} from "@tabler/icons-react";

import { DashboardLayout } from "@/components/layout";
import { PageHeader, StatCard } from "@/components/ui";
import { UploadDropzone } from "@/features/uploads/components/UploadDropzone";
import { UploadsTable } from "@/features/uploads/components/UploadsTable";
import { getErrorMessage } from "@/api/errors";
import {
  getCurrentUploadWeekLabel,
  useCreateUpload,
  useUploads,
} from "@/hooks/useUploads";
import { formatFileSize } from "@/lib/formatters";
import type { UploadRow } from "@/types";

const CURRENT_WEEK_LABEL = getCurrentUploadWeekLabel();

function getStorageUsed(rows: UploadRow[]) {
  return rows.reduce((total, row) => total + (row.fileSizeBytes ?? 0), 0);
}

export default function UploadsPage() {
  const uploadsQuery = useUploads();
  const createUploadMutation = useCreateUpload();
  const uploads = useMemo(() => uploadsQuery.data ?? [], [uploadsQuery.data]);

  const stats = useMemo(() => {
    const updatedCount = uploads.filter((row) => row.status === "UPDATED").length;
    const pendingCount = uploads.filter((row) => row.status === "PENDING").length;
    const attentionCount = uploads.filter(
      (row) => row.status === "LATE" || row.status === "MISSING",
    ).length;
    const fileCount = uploads.filter((row) => row.fileName).length;

    return {
      total: uploads.length,
      updatedCount,
      pendingCount,
      attentionCount,
      storageUsed: formatFileSize(getStorageUsed(uploads)),
      fileCount,
    };
  }, [uploads]);

  const handleUpload = useCallback(
    (file: File, metadata: { name: string; size: number }) => {
      void file;
      createUploadMutation.mutate({
        name: metadata.name,
        size: metadata.size,
      });
    },
    [createUploadMutation],
  );

  return (
    <DashboardLayout
      title="Uploads"
      breadcrumbs={[{ label: "Uploads" }]}
    >
      <PageHeader
        title="Uploads"
        subtitle="Upload weekly timesheets, review submission status, and monitor file history."
        action={
          <Button
            size="sm"
            variant="light"
            leftSection={<IconDownload size={14} stroke={1.5} />}
          >
            Export CSV
          </Button>
        }
      />

      <Stack gap="lg">
        {(uploadsQuery.isError || createUploadMutation.isError) && (
          <Alert color="red" title="Unable to update uploads">
            {getErrorMessage(uploadsQuery.error ?? createUploadMutation.error)}
          </Alert>
        )}

        <Box>
          <Group justify="space-between" mb="sm" align="flex-end">
            <Box>
              <Text fw={600} size="sm">
                Upload workflow
              </Text>
              <Text size="xs" c="dimmed">
                Accepted formats: XLSX and CSV. New uploads are added as pending
                records for this session.
              </Text>
            </Box>
          </Group>
          <UploadDropzone onUpload={handleUpload} />
        </Box>

        <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md">
          <StatCard
            label="Total records"
            value={stats.total}
            note={`${stats.fileCount} files uploaded`}
            color="blue"
            icon={IconFileSpreadsheet}
          />
          <StatCard
            label="Updated"
            value={stats.updatedCount}
            note={`Completed for ${CURRENT_WEEK_LABEL}`}
            color="green"
            icon={IconCloudUpload}
          />
          <StatCard
            label="Pending"
            value={stats.pendingCount}
            note="Awaiting review or submission"
            color="orange"
            icon={IconAlertTriangle}
          />
          <StatCard
            label="Storage used"
            value={stats.storageUsed}
            note={`${stats.attentionCount} records need attention`}
            color="grape"
            icon={IconDatabase}
          />
        </SimpleGrid>

        <Box>
          <Group justify="space-between" mb="sm">
            <Text fw={600} size="sm">
              Upload history
            </Text>
            <Text size="xs" c="dimmed">
              {CURRENT_WEEK_LABEL}
            </Text>
          </Group>
          <UploadsTable rows={uploads} isLoading={uploadsQuery.isLoading} />
        </Box>
      </Stack>
    </DashboardLayout>
  );
}
