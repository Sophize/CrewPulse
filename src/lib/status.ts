// Status helper functions consumed by StatusBadge, table cells,
// and any other component that needs to render an UploadStatus.
// Kept separate from constants.ts so tree-shaking works cleanly —
// importing formatters doesn't pull in the full STATUS_CONFIG object.

import type { UploadStatus } from "@/types";
import { STATUS_CONFIG } from "./constants";

/**
 * Returns the Mantine color key for a given status.
 * Used as the `color` prop on <Badge>, <Progress>, etc.
 *
 * getStatusColor("UPDATED") → "green"
 * getStatusColor("LATE")    → "red"
 */
export function getStatusColor(status: UploadStatus): string {
  return STATUS_CONFIG[status].color;
}

/**
 * Returns the human-readable display label for a status.
 *
 * getStatusLabel("UPDATED") → "Updated"
 * getStatusLabel("MISSING") → "Missing"
 */
export function getStatusLabel(status: UploadStatus): string {
  return STATUS_CONFIG[status].label;
}

/**
 * Returns both color and label together — convenience for
 * components that need both in a single destructure.
 *
 * const { color, label } = getStatusInfo("LATE");
 */
export function getStatusInfo(status: UploadStatus): {
  color: string;
  label: string;
  lightHex: string;
  textHex: string;
} {
  return STATUS_CONFIG[status];
}

/**
 * Returns true for statuses that require admin attention.
 * Used to highlight rows or show action buttons.
 */
export function isActionRequired(status: UploadStatus): boolean {
  return status === "MISSING" || status === "LATE";
}

/**
 * Returns true if the employee has submitted for this period
 * (regardless of whether it was on time).
 */
export function hasSubmitted(status: UploadStatus): boolean {
  return status === "UPDATED" || status === "LATE";
}

/**
 * Sorts an array of statuses in display priority order:
 * MISSING → LATE → PENDING → UPDATED
 *
 * Useful for defaulting table sort to show problem employees first.
 */
const STATUS_PRIORITY: Record<UploadStatus, number> = {
  MISSING: 0,
  LATE: 1,
  PENDING: 2,
  UPDATED: 3,
};

export function compareByStatus(a: UploadStatus, b: UploadStatus): number {
  return STATUS_PRIORITY[a] - STATUS_PRIORITY[b];
}

/**
 * Returns a short description for tooltips or aria-labels.
 *
 * getStatusDescription("MISSING") →
 *   "No timesheet submitted in the last 3 days."
 */
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
