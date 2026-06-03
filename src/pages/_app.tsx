import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";

import {
  MantineProvider,
  createTheme,
  type MantineColorsTuple,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

import "@/styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";

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

const theme = createTheme({
  colors: {
    blue: brandBlue,
  },

  primaryColor: "blue",
  black: "#121212",
  primaryShade: { light: 6, dark: 5 },

  defaultRadius: "sm",

  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontFamilyMonospace:
    "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",

  headings: {
    fontWeight: "500",
    sizes: {
      h1: { fontSize: "1.5rem" },
      h2: { fontSize: "1.25rem" },
      h3: { fontSize: "1.125rem" },
      h4: { fontSize: "1rem" },
    },
  },

  components: {
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

    Paper: {
      defaultProps: {
        shadow: "sm",
        withBorder: true,
      },
    },

    Badge: {
      defaultProps: {
        variant: "light",
        radius: "sm",
      },
    },

    Table: {
      defaultProps: {
        striped: false,
        highlightOnHover: true,
        withTableBorder: true,
        withColumnBorders: false,
      },
    },

    Notifications: {
      defaultProps: {
        position: "top-right",
        limit: 5,
        autoClose: 4000,
      },
    },
  },
});

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,

        gcTime: 5 * 60 * 1000,

        retry: (failureCount, error: unknown) => {
          const status = (error as { status?: number })?.status;
          if (status && status >= 400 && status < 500) return false;
          return failureCount < 2;
        },

        refetchOnWindowFocus: true,
      },
      mutations: {
        onError:
          process.env.NODE_ENV === "development"
            ? (error) => console.error("[mutation error]", error)
            : undefined,
      },
    },
  });
}

export default function CrewPulseApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <>
      <Head>
        <title>CrewPulse</title>
        <meta
          name="description"
          content="Employee Activity & Timesheet Management Platform"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <ModalsProvider>
            <Notifications />

            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </>
  );
}
