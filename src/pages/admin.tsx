import {
  Alert,
  Grid,
  Stack,
  Paper,
  Text,
  Group,
  SimpleGrid,
  ThemeIcon,
  Box,
  Divider,
  Button,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconUsers,
  IconAlertTriangle,
  IconChartBar,
  IconDatabase,
  IconMail,
  IconRefresh,
  IconDownload,
  IconBell,
  IconClock,
  IconUserPlus,
  IconShieldCheck,
} from "@tabler/icons-react";

import { DashboardLayout } from "@/components/layout";
import { PageHeader, StatCard } from "@/components/ui";
import { EmployeesTable } from "@/features/admin/components/EmployeesTable";
import { DeptComplianceCard } from "@/features/admin/components/DeptComplianceCard";

import { getErrorMessage } from "@/api/errors";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useEmployees } from "@/hooks/useEmployees";

function QuickActionsPanel() {
  const actions = [
    { icon: IconMail, label: "Send reminder to all pending", color: "orange" },
    { icon: IconDownload, label: "Export this week's report", color: "blue" },
    { icon: IconRefresh, label: "Recompute all statuses", color: "teal" },
    { icon: IconBell, label: "Configure deadline alerts", color: "grape" },
  ];

  return (
    <Stack gap={0}>
      <Text fw={600} size="sm" mb="sm">
        Quick actions
      </Text>
      <Paper withBorder radius="sm" p="xs">
        <Stack gap={2}>
          {actions.map((action, i) => (
            <Box key={i}>
              <Group
                gap="sm"
                px="xs"
                py={10}
                style={{
                  cursor: "pointer",
                  borderRadius: "var(--mantine-radius-sm)",
                }}
                className="hover-bg"
              >
                <ThemeIcon
                  size={30}
                  radius="sm"
                  color={action.color}
                  variant="light"
                >
                  <action.icon size={15} stroke={1.5} />
                </ThemeIcon>
                <Text size="sm">{action.label}</Text>
              </Group>
              {i < actions.length - 1 && <Divider style={{ opacity: 0.5 }} />}
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}

interface AdminEvent {
  icon: React.ComponentType<{ size?: number | string; stroke?: number }>;
  color: string;
  message: string;
  time: string;
}

const ADMIN_EVENTS: AdminEvent[] = [
  {
    icon: IconUserPlus,
    color: "blue",
    message: "Sofia Ricci joined the platform",
    time: "26d ago",
  },
  {
    icon: IconAlertTriangle,
    color: "red",
    message: "Divya Sharma flagged as missing",
    time: "9h ago",
  },
  {
    icon: IconClock,
    color: "orange",
    message: "Sneha Iyer submitted late",
    time: "1h ago",
  },
  {
    icon: IconShieldCheck,
    color: "green",
    message: "Admin James Dorsey logged in",
    time: "Today",
  },
  {
    icon: IconRefresh,
    color: "teal",
    message: "Status computation ran successfully",
    time: "9:00 AM",
  },
];

function AdminActivityPanel() {
  return (
    <Stack gap={0}>
      <Text fw={600} size="sm" mb="sm">
        System activity
      </Text>
      <Paper withBorder radius="sm" p="md" style={{ flex: 1 }}>
        <Stack gap={0}>
          {ADMIN_EVENTS.map((evt, i) => (
            <Box key={i}>
              <Group gap="sm" wrap="nowrap" align="flex-start">
                <ThemeIcon
                  size={28}
                  radius="xl"
                  color={evt.color}
                  variant="light"
                  style={{ flexShrink: 0 }}
                >
                  <evt.icon size={13} stroke={1.5} />
                </ThemeIcon>
                <Box style={{ flex: 1 }}>
                  <Text size="sm">{evt.message}</Text>
                  <Text size="xs" c="dimmed">
                    {evt.time}
                  </Text>
                </Box>
              </Group>
              {i < ADMIN_EVENTS.length - 1 && (
                <Divider my="sm" style={{ opacity: 0.5 }} />
              )}
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}

export default function AdminPage() {
  const employeesQuery = useEmployees();
  const statsQuery = useDashboardStats();
  const employeeRows = employeesQuery.data?.rows ?? [];
  const employeeSummary = employeesQuery.data;
  const stats = statsQuery.data;

  return (
    <DashboardLayout title="Admin" breadcrumbs={[{ label: "Admin" }]}>
      <PageHeader
        title="Admin"
        subtitle="Manage employees, monitor compliance, and configure the platform."
        action={
          <Button
            size="sm"
            leftSection={<IconDownload size={14} stroke={1.5} />}
            variant="light"
          >
            Export report
          </Button>
        }
      />

      {(employeesQuery.isError || statsQuery.isError) && (
        <Alert color="red" mb="md" title="Unable to load admin data">
          {getErrorMessage(employeesQuery.error ?? statsQuery.error)}
        </Alert>
      )}

      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md" mb="lg">
        <StatCard
          label="Total users"
          value={employeeSummary?.totalUsers ?? 0}
          note={`${employeeSummary?.adminCount ?? 0} admins · ${employeeSummary?.employeeCount ?? 0} employees`}
          color="blue"
          icon={IconUsers}
        />
        <StatCard
          label="Pending actions"
          value={stats?.missingLateCount ?? 0}
          note="Require attention now"
          color="red"
          icon={IconAlertTriangle}
        />
        <StatCard
          label="Compliance rate"
          value={stats?.complianceRate ?? "—"}
          note="↑ 4% from last week"
          color="green"
          icon={IconChartBar}
        />
        <StatCard
          label="Storage used"
          value="2.4 GB"
          note="of 10 GB limit · 24%"
          color="grape"
          icon={IconDatabase}
        />
      </SimpleGrid>

      <Box mb="xl">
        <Group justify="space-between" mb="sm">
          <Text fw={600} size="sm">
            All employees
          </Text>
          <Group gap="xs">
            <Tooltip label="Send reminders to pending employees" withArrow>
              <ActionIcon variant="light" color="orange" size="md">
                <IconMail size={15} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Export CSV" withArrow>
              <ActionIcon variant="light" color="blue" size="md">
                <IconDownload size={15} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
        <EmployeesTable
          rows={employeeRows}
          isLoading={employeesQuery.isLoading}
        />
      </Box>

      <Grid mb="lg">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DeptComplianceCard deptStats={stats?.deptCompliance ?? []} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            <QuickActionsPanel />
            <AdminActivityPanel />
          </Stack>
        </Grid.Col>
      </Grid>
    </DashboardLayout>
  );
}
