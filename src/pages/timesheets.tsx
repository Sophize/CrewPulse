import {
  SimpleGrid,
  Group,
  Button,
  Text,
  Box,
  SegmentedControl,
  Stack,
} from "@mantine/core";
import {
  IconDownload,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconAlertTriangle,
  IconUsers,
} from "@tabler/icons-react";

import { DashboardLayout } from "@/components/layout";
import { PageHeader, StatCard } from "@/components/ui";
import { TimesheetsTable } from "@/features/timesheets/components/TimesheetsTable";

import { MOCK_TIMESHEETS, MOCK_WEEK_SUMMARY } from "@/mock";

// ── Legend for hours colour coding ───────────────────────────────
function HoursLegend() {
  const items = [
    { color: "var(--mantine-color-green-6)", label: "≥ 40h — full week" },
    { color: "var(--mantine-color-orange-6)", label: "35–39h or >9h/day" },
    { color: "var(--mantine-color-red-6)", label: "< 35h — undertime" },
    { color: "var(--mantine-color-dimmed)", label: "No entry submitted" },
  ];
  return (
    <Group gap="md" wrap="wrap">
      {items.map((item) => (
        <Group key={item.label} gap={6} wrap="nowrap">
          <Box
            w={10}
            h={10}
            style={{
              borderRadius: "50%",
              background: item.color,
              flexShrink: 0,
            }}
          />
          <Text size="xs" c="dimmed">
            {item.label}
          </Text>
        </Group>
      ))}
    </Group>
  );
}

// ── Week navigator (static for Phase 3) ──────────────────────────
function WeekNavigator() {
  return (
    <Group gap="xs" wrap="nowrap">
      <Button
        variant="subtle"
        color="gray"
        size="xs"
        px={6}
        leftSection={<IconChevronLeft size={14} stroke={1.5} />}
        aria-label="Previous week"
      >
        Prev
      </Button>
      <Button
        variant="light"
        size="xs"
        leftSection={<IconCalendar size={14} stroke={1.5} />}
      >
        Week 21 · May 19–25
      </Button>
      <Button
        variant="subtle"
        color="gray"
        size="xs"
        px={6}
        rightSection={<IconChevronRight size={14} stroke={1.5} />}
        aria-label="Next week"
      >
        Next
      </Button>
    </Group>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function TimesheetsPage() {
  const summary = MOCK_WEEK_SUMMARY;
  const timesheets = MOCK_TIMESHEETS;

  return (
    <DashboardLayout title="Timesheets" breadcrumbs={[{ label: "Timesheets" }]}>
      <PageHeader
        title="Timesheets"
        subtitle="Per-employee weekly hours breakdown."
        action={
          <Group gap="sm">
            <WeekNavigator />
            <Button
              size="sm"
              variant="light"
              leftSection={<IconDownload size={14} stroke={1.5} />}
            >
              Export CSV
            </Button>
          </Group>
        }
      />

      {/* ── Week summary cards ─────────────────────────────────── */}
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md" mb="lg">
        <StatCard
          label="Week"
          value={summary.weekLabel}
          note="Current active week"
          color="blue"
          icon={IconCalendar}
        />
        <StatCard
          label="Total hours logged"
          value={`${summary.totalHoursLogged}h`}
          note={`Across ${summary.employeeCount} employees`}
          color="teal"
          icon={IconClock}
        />
        <StatCard
          label="Avg hours / person"
          value={`${summary.averageHoursPerEmployee}h`}
          note="Expected: 40h"
          color="blue"
          icon={IconUsers}
        />
        <StatCard
          label="Exceptions"
          value={summary.exceptionCount}
          note="Overtime or undertime"
          color={summary.exceptionCount > 0 ? "orange" : "green"}
          icon={IconAlertTriangle}
        />
      </SimpleGrid>

      {/* ── Timesheets table ───────────────────────────────────── */}
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Text fw={600} size="sm">
            Employee timesheet grid
          </Text>
          <HoursLegend />
        </Group>

        <TimesheetsTable rows={timesheets} isLoading={false} />

        {/* Footer note */}
        <Text size="xs" c="dimmed" ta="right">
          Hours reflect submitted data only. Missing entries shown as —
        </Text>
      </Stack>
    </DashboardLayout>
  );
}
