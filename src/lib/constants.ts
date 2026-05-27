import type { UploadStatus } from "@/types";

export type NavSection = "main" | "admin";

export interface SidebarLink {
  label: string;
  href: string;
  iconName: string;
  section: NavSection;
  badge?: number;
  adminOnly?: boolean;
}

export const SIDEBAR_LINKS: SidebarLink[] = [
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
    adminOnly: false,
  },
];

export const NAV_SECTION_LABELS: Record<NavSection, string> = {
  main: "Main",
  admin: "Admin",
};

export interface StatusConfig {
  color: string;
  label: string;
  lightHex: string;
  textHex: string;
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

export function getRateColor(rate: number): string {
  if (rate >= 80) return "green";
  if (rate >= 60) return "orange";
  return "red";
}

export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const DEFAULT_DEADLINE_TIME = "18:00";
export const DEFAULT_TIMEZONE = "Asia/Kolkata";

export const MISSING_THRESHOLD_DAYS = 3;

export const APP_NAME = "CrewPulse";
export const APP_TAGLINE = "Timesheet platform";
export const APP_INITIALS = "CP";
