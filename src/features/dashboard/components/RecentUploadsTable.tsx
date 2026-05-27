// features/dashboard/components/RecentUploadsTable.tsx
//
// Compact table showing the 5 most recent upload events.
// Used on the dashboard left column for a quick status sweep.
//
// Columns: Employee · Status · File · Uploaded
//
// Uses Mantine Table (not TanStack Table — too small to need sorting).
// TanStack Table is reserved for the full /uploads page.

import {
  Table,
  Text,
  Group,
  Avatar,
  Anchor,
  Paper,
  Stack,
  Box,
} from "@mantine/core";
import { IconFileSpreadsheet } from "@tabler/icons-react";
import Link from "next/link";

import { StatusBadge, EmptyState, LoadingRows } from "@/components/ui";
import {
  formatRelativeTime,
  formatFileSize,
  getInitials,
} from "@/lib/formatters";
import type { UploadRow } from "@/types";

interface RecentUploadsTableProps {
  uploads: UploadRow[];
  isLoading?: boolean;
}

// ── Table header ──────────────────────────────────────────────────
function TableHead() {
  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Employee</Table.Th>
        <Table.Th>Status</Table.Th>
        <Table.Th visibleFrom="sm">File</Table.Th>
        <Table.Th>Uploaded</Table.Th>
        <Table.Th visibleFrom="md">Size</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
}

// ── Single data row ───────────────────────────────────────────────
function UploadRow({ upload }: { upload: UploadRow }) {
  const hasFile = Boolean(upload.fileName && upload.uploadedAt);

  return (
    <Table.Tr>
      {/* Employee */}
      <Table.Td>
        <Group gap="sm" wrap="nowrap">
          <Avatar size={28} radius="xl" color="blue" variant="light">
            {getInitials(upload.user.name)}
          </Avatar>
          <Text size="sm" fw={500} truncate maw={120}>
            {upload.user.name}
          </Text>
        </Group>
      </Table.Td>

      {/* Status */}
      <Table.Td>
        <StatusBadge status={upload.status} />
      </Table.Td>

      {/* Filename — hidden on mobile */}
      <Table.Td visibleFrom="sm">
        {hasFile ? (
          <Group gap={6} wrap="nowrap">
            <IconFileSpreadsheet
              size={14}
              stroke={1.5}
              style={{ color: "var(--mantine-color-green-6)", flexShrink: 0 }}
            />
            <Text size="xs" c="dimmed" truncate maw={160}>
              {upload.fileName}
            </Text>
          </Group>
        ) : (
          <Text size="xs" c="dimmed">
            —
          </Text>
        )}
      </Table.Td>

      {/* Relative timestamp */}
      <Table.Td>
        <Text size="xs" c="dimmed">
          {hasFile ? formatRelativeTime(upload.uploadedAt) : "—"}
        </Text>
      </Table.Td>

      {/* File size — hidden on tablet */}
      <Table.Td visibleFrom="md">
        <Text size="xs" c="dimmed">
          {formatFileSize(upload.fileSizeBytes)}
        </Text>
      </Table.Td>
    </Table.Tr>
  );
}

// ── Main component ────────────────────────────────────────────────
export function RecentUploadsTable({
  uploads,
  isLoading = false,
}: RecentUploadsTableProps) {
  return (
    <Stack gap={0}>
      {/* Section header */}
      <Group justify="space-between" mb="sm">
        <Text fw={600} size="sm">
          Recent uploads
        </Text>
        <Anchor
          component={Link}
          href="/uploads"
          size="xs"
          c="blue"
          underline="hover"
        >
          View all →
        </Anchor>
      </Group>

      <Paper withBorder radius="sm" style={{ overflow: "hidden" }}>
        <Table highlightOnHover>
          <TableHead />
          <Table.Tbody>
            {isLoading ? (
              <LoadingRows cols={5} rows={5} />
            ) : uploads.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <EmptyState
                    icon={IconFileSpreadsheet}
                    title="No uploads yet"
                    description="Uploads will appear here once employees submit their timesheets."
                  />
                </Table.Td>
              </Table.Tr>
            ) : (
              uploads.map((upload) => (
                <UploadRow key={upload.id} upload={upload} />
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
