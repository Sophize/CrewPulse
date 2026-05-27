// Application-wide constants.
// All sidebar links live here — adding a new page means adding one
// entry to SIDEBAR_LINKS, nothing else. No scattered nav arrays.

import type { UploadStatus } from "@/types";

// ── Sidebar navigation ────────────────────────────────────────────

export type NavSection = "main" | "admin";

export interface SidebarLink {
  label: string;
  href: string;
  iconName: string; // Tabler icon name without "ti-" prefix
  section: NavSection;
  badge?: number; // Optional count bubble (e.g. missing employees)
  adminOnly?: boolean; // Filtered out for EMPLOYEE role when auth is added
}

export const SIDEBAR_LINKS: SidebarLink[] = [
  // Main section
  {
    label: "Dashboard",
    href: "/dashboard",
    iconName: "layout-dashboard",
    section: "main",
  },
  {
    label: "Uploads",
    href: "/uploads",
    iconName: "upload",
    section: "main",
  },
  {
    label: "Timesheets",
    href: "/timesheets",
    iconName: "calendar",
    section: "main",
  },

  // Admin section — hidden from employees after auth is wired
  {
    label: "Admin",
    href: "/admin",
    iconName: "shield",
    section: "admin",
    adminOnly: true,
  },
  {
    label: "Analytics",
    href: "/analytics",
    iconName: "chart-bar",
    section: "admin",
    adminOnly: true,
  },
  {
    label: "Settings",
    href: "/settings",
    iconName: "settings",
    section: "admin",
    adminOnly: false, // Available to all roles
  },
];

export const NAV_SECTION_LABELS: Record<NavSection, string> = {
  main: "Main",
  admin: "Admin",
};

// ── Status color map ──────────────────────────────────────────────
// Values are Mantine color keys used in Badge, Progress, and custom
// inline styles throughout the app. Centralised here so a single
// change propagates everywhere.

export interface StatusConfig {
  color: string; // Mantine color key (e.g. "green", "orange")
  label: string; // Human-readable display label
  lightHex: string; // Background hex for custom non-Mantine usage
  textHex: string; // Text hex for custom non-Mantine usage
}

export const STATUS_CONFIG: Record<UploadStatus, StatusConfig> = {
  UPDATED: {
    color: "green",
    label: "Updated",
    lightHex: "#EAF3DE",
    textHex: "#3B6D11",
  },
  PENDING: {
    color: "orange",
    label: "Pending",
    lightHex: "#FAEEDA",
    textHex: "#854F0B",
  },
  LATE: {
    color: "red",
    label: "Late",
    lightHex: "#FCEBEB",
    textHex: "#A32D2D",
  },
  MISSING: {
    color: "gray",
    label: "Missing",
    lightHex: "#F1EFE8",
    textHex: "#5F5E5A",
  },
};

// Department bar chart color progression — used in DeptComplianceBar.
// Maps a 0–100 rate to a Mantine color key for the progress segment.
export function getRateColor(rate: number): string {
  if (rate >= 80) return "green";
  if (rate >= 60) return "orange";
  return "red";
}

// ── Pagination defaults ───────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// ── Date / time ───────────────────────────────────────────────────

// Default deadline time used in status logic and display.
export const DEFAULT_DEADLINE_TIME = "18:00";
export const DEFAULT_TIMEZONE = "Asia/Kolkata";

// How many days without an upload before status becomes MISSING.
export const MISSING_THRESHOLD_DAYS = 3;

// ── App metadata ──────────────────────────────────────────────────

export const APP_NAME = "CrewPulse";
export const APP_TAGLINE = "Timesheet platform";
export const APP_INITIALS = "CP";
