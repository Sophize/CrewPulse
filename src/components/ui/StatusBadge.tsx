import { Badge, type BadgeProps } from "@mantine/core";
import type { UploadStatus } from "@/types";
import { getStatusLabel, getStatusColor } from "@/lib/status";

interface StatusBadgeProps {
  status: UploadStatus;
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
