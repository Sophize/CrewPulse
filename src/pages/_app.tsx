// pages/_app.tsx
//
// Root application wrapper — Pages Router.
//
// Responsibility: global providers only. No UI chrome here —
// layout is handled by DashboardLayout which individual pages
// opt into. This keeps auth-less pages (future login page) free
// of the dashboard shell.

import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";

// Mantine core
import {
  MantineProvider,
  createTheme,
  type MantineColorsTuple,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

// Mantine CSS — must come before your globals so your overrides win
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

// Project globals
import "@/styles/globals.css";

// TanStack Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ── Brand color tuple ─────────────────────────────────────────────
// Mantine requires exactly 10 shades (index 0–9).
// These match the blue ramp from lib/constants.ts.
const brandBlue: MantineColorsTuple = [
  "#E6F1FB", // 0 — lightest
  "#CCE3F7", // 1
  "#B5D4F4", // 2
  "#85B7EB", // 3
  "#378ADD", // 4
  "#2474C8", // 5
  "#185FA5", // 6 — primary
  "#0C447C", // 7
  "#073060", // 8
  "#042C53", // 9 — darkest
];

// ── Mantine theme ─────────────────────────────────────────────────
const theme = createTheme({
  // Brand color registered as "blue" so <Badge color="blue"> just works.
  colors: {
    blue: brandBlue,
  },

  // Primary color key — affects Button, Badge, NavLink active state, etc.
  primaryColor: "blue",
  primaryShade: { light: 6, dark: 5 },

  // Default border radius for all components.
  defaultRadius: "sm",

  // Font — system stack is intentional for an internal enterprise tool.
  // It renders crisply on all OSes without a web font request.
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontFamilyMonospace:
    "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",

  // Heading sizes used in PageHeader and section titles.
  headings: {
    fontWeight: "500",
    sizes: {
      h1: { fontSize: "1.5rem" },
      h2: { fontSize: "1.25rem" },
      h3: { fontSize: "1.125rem" },
      h4: { fontSize: "1rem" },
    },
  },

  // Component-level overrides — keeps variant config centralised.
  components: {
    // NavLink: remove default left border, tighten padding
    NavLink: {
      defaultProps: {
        variant: "subtle",
      },
      styles: {
        root: {
          borderRadius: "var(--mantine-radius-sm)",
        },
      },
    },

    // Paper: consistent surface elevation for cards
    Paper: {
      defaultProps: {
        shadow: "none",
        withBorder: true,
      },
    },

    // Badge: tighter padding for table cells
    Badge: {
      defaultProps: {
        variant: "light",
        radius: "sm",
      },
    },

    // Table: subtler striping and borders
    Table: {
      defaultProps: {
        striped: false,
        highlightOnHover: true,
        withTableBorder: true,
        withColumnBorders: false,
      },
    },

    // Notifications: top-right position
    Notifications: {
      defaultProps: {
        position: "top-right",
        limit: 5,
        autoClose: 4000,
      },
    },
  },
});

// ── QueryClient factory ───────────────────────────────────────────
// Created with useState so it survives HMR without re-initialising.
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 30 seconds — avoids hammering
        // the API on rapid navigation between pages.
        staleTime: 30 * 1000,

        // Keep inactive query data in cache for 5 minutes.
        gcTime: 5 * 60 * 1000,

        // Don't retry on 4xx errors (auth / not-found) — only on network
        // failures. Avoids hammering a bad endpoint 3 times.
        retry: (failureCount, error: unknown) => {
          const status = (error as { status?: number })?.status;
          if (status && status >= 400 && status < 500) return false;
          return failureCount < 2;
        },

        // Refetch when the user tabs back in — keeps dashboard fresh.
        refetchOnWindowFocus: true,
      },
      mutations: {
        // Surface mutation errors in the console during development.
        onError:
          process.env.NODE_ENV === "development"
            ? (error) => console.error("[mutation error]", error)
            : undefined,
      },
    },
  });
}

// ── App component ─────────────────────────────────────────────────
export default function CrewPulseApp({ Component, pageProps }: AppProps) {
  // useState ensures the QueryClient is created once per browser session.
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <>
      <Head>
        {/* Default title — individual pages override via next/head */}
        <title>CrewPulse</title>
        <meta
          name="description"
          content="Enterprise timesheet management platform"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          {/*
            ModalsProvider wraps the app so any component can open a
            Mantine modal via the `modals` object from @mantine/modals
            without prop-drilling an open/close handler.
          */}
          <ModalsProvider>
            {/*
              Notifications renders the portal — must be inside
              MantineProvider so it inherits the theme.
            */}
            <Notifications />

            {/*
              Component is the current page. Each page that needs the
              dashboard shell wraps itself in <DashboardLayout>.
              Pages that don't (future login page) render standalone.
            */}
            <Component {...pageProps} />
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </>
  );
}
