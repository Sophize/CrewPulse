// components/layout/index.ts
//
// Barrel export for the layout layer.
// Pages import from "@/components/layout" — never from sub-files.
//
// Exporting named types alongside components means consumers get
// everything they need from one import:
//   import { DashboardLayout, type DashboardLayoutProps } from "@/components/layout"

export { DashboardLayout } from "./DashboardLayout";
export type { DashboardLayoutProps } from "./DashboardLayout";

export { Sidebar } from "./Sidebar";
export type { SidebarProps } from "./Sidebar";

export { TopBar } from "./TopBar";
export type { TopBarProps, BreadcrumbItem } from "./TopBar";
