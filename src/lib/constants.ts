export type NavSection = "main" | "admin";

export interface SidebarLink {
  label: string;
  href: string;
  iconName: string;
  section: NavSection;
  badge?: number;
  adminOnly?: boolean;
  hasChildren?: boolean;
}

export const SIDEBAR_LINKS: SidebarLink[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    iconName: "layout-dashboard",
    section: "main",
  },
  {
    label: "Employees",
    href: "/employees",
    iconName: "shield",
    section: "main",
  },
  {
    label: "Project Status",
    href: "/projects",
    iconName: "folder",
    section: "main",
    hasChildren: true,
  },
  {
    label: "Settings",
    href: "/settings",
    iconName: "settings",
    section: "admin",
  },
];

export const NAV_SECTION_LABELS: Record<NavSection, string> = {
  main: "Main",
  admin: "Admin",
};

export const APP_NAME = "CrewPulse";
export const APP_TAGLINE = "Time visibility dashboard";
