import Head from "next/head";
import { AppShell, Box, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { Sidebar } from "./Sidebar";
import { TopBar, type BreadcrumbItem } from "./TopBar";
import { APP_NAME } from "@/lib/constants";

const SIDEBAR_WIDTH = 240;
const TOPBAR_HEIGHT = 56;
const CONTENT_MAX_WIDTH = 1400;

export interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  padded?: boolean;
}

export function DashboardLayout({
  children,
  title,
  breadcrumbs,
  padded = true,
}: DashboardLayoutProps) {
  const [opened, { toggle, close }] = useDisclosure(false);

  const documentTitle = `${title} — ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{documentTitle}</title>
      </Head>

      <AppShell
        navbar={{
          width: SIDEBAR_WIDTH,
          breakpoint: "sm",
          collapsed: {
            mobile: !opened,
          },
        }}
        header={{ height: TOPBAR_HEIGHT }}
        padding={0}
      >
        <Sidebar opened={opened} onClose={close} />

        <TopBar
          title={title}
          breadcrumbs={breadcrumbs ?? [{ label: title }]}
          opened={opened}
          onBurgerClick={toggle}
        />

        <AppShell.Main
          data-layout="main"
          style={{
            minHeight: `calc(100vh - ${rem(TOPBAR_HEIGHT)})`,
            // backgroundColor: "var(--mantine-color-gray-0)",
            backgroundColor: "var(--mantine-color-body)",
          }}
        >
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
