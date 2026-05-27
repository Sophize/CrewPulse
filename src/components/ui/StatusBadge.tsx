// components/ui/StatusBadge.tsx
//
// Single-responsibility: maps an UploadStatus value to a
// consistently styled Mantine Badge.
//
// Used in: RecentUploadsTable, UploadsTable, TimesheetsTable,
//          EmployeesTable — anywhere a status column appears.
//
// Add new statuses by extending STATUS_CONFIG in lib/constants.ts
// and adding the variant here. No other file needs to change.

import { Badge, type BadgeProps } from "@mantine/core";
import type { UploadStatus } from "@/types";
import { getStatusLabel, getStatusColor } from "@/lib/status";

interface StatusBadgeProps {
  status: UploadStatus;
  /** Override Mantine size. Default: "sm" */
  size?: BadgeProps["size"];
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  return (
    <Badge
      color={getStatusColor(status)}
      variant="light"
      size={size}
      radius="sm"
    >
      {getStatusLabel(status)}
    </Badge>
  );
}
