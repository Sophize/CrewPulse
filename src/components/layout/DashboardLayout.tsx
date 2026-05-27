// components/layout/DashboardLayout.tsx
//
// Root layout shell for all dashboard pages.
// Composes Mantine AppShell + Sidebar + TopBar.
//
// Usage in a page:
//
//   export default function DashboardPage() {
//     return (
//       <DashboardLayout title="Dashboard">
//         <p>Page content here</p>
//       </DashboardLayout>
//     );
//   }
//
// Responsibilities:
//   • Owns mobile sidebar open/close state
//   • Passes open state + callbacks to Sidebar and TopBar
//   • Renders AppShell with correct navbar/header dimensions
//   • Sets the <title> tag via next/head
//   • Provides the scrollable main content area

import { useState } from "react";
import Head from "next/head";
import { AppShell, Box, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { Sidebar } from "./Sidebar";
import { TopBar, type BreadcrumbItem } from "./TopBar";
import { APP_NAME } from "@/lib/constants";

// ── Layout constants ──────────────────────────────────────────────
// Keep in sync with --sidebar-width and --topbar-height in globals.css.
const SIDEBAR_WIDTH = 240;
const TOPBAR_HEIGHT = 56;
const CONTENT_MAX_WIDTH = 1400; // px — prevents ultra-wide line lengths

// ── DashboardLayout props ─────────────────────────────────────────
export interface DashboardLayoutProps {
  children: React.ReactNode;
  /**
   * Page title shown in TopBar and in the browser <title> tag.
   * Example: "Dashboard" | "Uploads" | "Timesheets"
   */
  title: string;
  /**
   * Breadcrumb trail passed to TopBar. The app name is always
   * prepended automatically — pass only page-specific items.
   * Example: [{ label: "Uploads" }]
   * Example for a detail page: [{ label: "Uploads", href: "/uploads" }, { label: "File #123" }]
   */
  breadcrumbs?: BreadcrumbItem[];
  /**
   * Set to false to remove the default horizontal padding and
   * max-width constraint from the content area. Useful for
   * full-bleed table pages.
   * @default true
   */
  padded?: boolean;
}

// ── DashboardLayout ───────────────────────────────────────────────
export function DashboardLayout({
  children,
  title,
  breadcrumbs,
  padded = true,
}: DashboardLayoutProps) {
  // useDisclosure manages the mobile sidebar drawer state.
  // false = closed (default on mobile).
  const [opened, { toggle, close }] = useDisclosure(false);

  const documentTitle = `${title} — ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{documentTitle}</title>
      </Head>

      <AppShell
        // ── Dimensions ─────────────────────────────────────────
        navbar={{
          width: SIDEBAR_WIDTH,
          breakpoint: "sm", // Sidebar becomes a drawer below sm
          collapsed: {
            mobile: !opened, // Mobile: controlled by burger
            // Desktop: always visible — add collapsed.desktop state
            // here later if you want a collapse toggle on desktop.
          },
        }}
        header={{ height: TOPBAR_HEIGHT }}
        // ── Padding ─────────────────────────────────────────────
        // Mantine AppShell automatically offsets main by the
        // header height and navbar width. We add extra content
        // padding via the inner Box, not here.
        padding={0}
      >
        {/* ── Sidebar ─────────────────────────────────────────── */}
        <Sidebar opened={opened} onClose={close} />

        {/* ── TopBar ──────────────────────────────────────────── */}
        <TopBar
          title={title}
          breadcrumbs={breadcrumbs ?? [{ label: title }]}
          opened={opened}
          onBurgerClick={toggle}
        />

        {/* ── Main content ────────────────────────────────────── */}
        <AppShell.Main
          data-layout="main"
          style={{
            // Full height minus topbar so the content area fills the viewport.
            minHeight: `calc(100vh - ${rem(TOPBAR_HEIGHT)})`,
            backgroundColor: "var(--mantine-color-gray-0)",
          }}
        >
          {/*
            Inner wrapper constrains width and applies consistent
            padding. Setting padded={false} lets pages like a
            full-bleed table opt out.
          */}
          <Box
            px={padded ? "xl" : 0}
            py={padded ? "lg" : 0}
            style={{
              maxWidth: padded ? rem(CONTENT_MAX_WIDTH) : undefined,
              margin: padded ? "0 auto" : undefined,
              height: "100%",
            }}
          >
            {children}
          </Box>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
