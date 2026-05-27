// Pure formatting utilities — no side effects, fully unit-testable.
// Every function takes a primitive and returns a display string.
// Nothing here imports from Mantine or React.

// ── Date formatting ───────────────────────────────────────────────

/**
 * Formats an ISO date string as a short locale date.
 * "2025-05-27T09:12:00.000Z" → "May 27, 2025"
 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Formats an ISO date string as date + time.
 * "2025-05-27T09:12:00.000Z" → "May 27, 2025 · 9:12 AM"
 */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${date} · ${time}`;
}

/**
 * Returns a human-readable relative timestamp for recent events.
 * Anything older than 24 hours falls back to formatDate.
 * "2025-05-27T09:10:00.000Z" (2 min ago) → "2 min ago"
 */
export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return "—";

  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return "just now";

  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;

  return formatDate(iso);
}

/**
 * Formats an ISO date string as just the time component.
 * "2025-05-27T09:12:00.000Z" → "9:12 AM"
 */
export function formatTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ── File size formatting ──────────────────────────────────────────

/**
 * Formats a byte count to a human-readable string.
 * 49152 → "48 KB"
 * 1_048_576 → "1.0 MB"
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes == null || bytes === 0) return "—";

  const units = ["B", "KB", "MB", "GB"] as const;
  let value = bytes;
  let unitIdx = 0;

  while (value >= 1024 && unitIdx < units.length - 1) {
    value /= 1024;
    unitIdx += 1;
  }

  const formatted =
    unitIdx === 0
      ? value.toString()
      : value < 10
        ? value.toFixed(1)
        : Math.round(value).toString();

  return `${formatted} ${units[unitIdx]}`;
}

// ── Name formatting ───────────────────────────────────────────────

/**
 * Extracts initials for avatar components.
 * "Priya Nair" → "PN"
 * "James" → "JA"
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

// ── Number formatting ─────────────────────────────────────────────

/**
 * Formats a decimal number as a percentage string.
 * 0.876 → "88%"
 * 87.6 (already multiplied) → pass asRatio: false → "88%"
 */
export function formatPercent(
  value: number,
  opts: { asRatio?: boolean; decimals?: number } = {},
): string {
  const { asRatio = false, decimals = 0 } = opts;
  const pct = asRatio ? value * 100 : value;
  return `${pct.toFixed(decimals)}%`;
}

/**
 * Formats hours to one decimal place with the unit.
 * 40 → "40.0h"
 * null → "—"
 */
export function formatHours(hours: number | null | undefined): string {
  if (hours == null) return "—";
  return `${hours.toFixed(1)}h`;
}
