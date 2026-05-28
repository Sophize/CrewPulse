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
    label: "Admin",
    href: "/admin",
    iconName: "shield",
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

export function getRateColor(rate: number): string {
  if (rate >= 80) return "green";
  if (rate >= 60) return "orange";
  return "red";
}

export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const DEFAULT_DEADLINE_TIME = "18:00";
export const DEFAULT_TIMEZONE = "Asia/Kolkata";

export const APP_NAME = "CrewPulse";
export const APP_TAGLINE = "Time visibility dashboard";
export const APP_INITIALS = "CP";
