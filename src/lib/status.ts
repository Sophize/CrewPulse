import type { UploadStatus } from "@/types";
import { STATUS_CONFIG } from "./constants";

export function getStatusColor(status: UploadStatus): string {
  return STATUS_CONFIG[status].color;
}

export function getStatusLabel(status: UploadStatus): string {
  return STATUS_CONFIG[status].label;
}

export function getStatusInfo(status: UploadStatus): {
  color: string;
  label: string;
  lightHex: string;
  textHex: string;
} {
  return STATUS_CONFIG[status];
}

export function isActionRequired(status: UploadStatus): boolean {
  return status === "MISSING" || status === "LATE";
}

export function hasSubmitted(status: UploadStatus): boolean {
  return status === "UPDATED" || status === "LATE";
}

const STATUS_PRIORITY: Record<UploadStatus, number> = {
  MISSING: 0,
  LATE: 1,
  PENDING: 2,
  UPDATED: 3,
};

export function compareByStatus(a: UploadStatus, b: UploadStatus): number {
  return STATUS_PRIORITY[a] - STATUS_PRIORITY[b];
}

export function getStatusDescription(status: UploadStatus): string {
  switch (status) {
    case "UPDATED":
      return "Timesheet submitted before the deadline.";
    case "PENDING":
      return "Deadline not yet passed — submission expected today.";
    case "LATE":
      return "Timesheet submitted after the deadline.";
    case "MISSING":
      return "No timesheet submitted in the last 3 days.";
  }
}
