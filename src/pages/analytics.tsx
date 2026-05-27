// pages/analytics.tsx
//
// Analytics overview — Mantine-only, no chart libraries.
// Simulates charts using Progress bars, Grid layouts, and
// styled Paper components. Recharts/Nivo can drop in Phase 5
// replacing the placeholder sections without changing the page shape.
//
// Layout:
//   [4 KPI cards]
//   [Submission trend (7/12)] [Top stats column (5/12)]
//   [Dept performance table full-width]

import {
  SimpleGrid,
  Grid,
  Paper,
  Text,
  Group,
  Box,
  Progress,
  Badge,
  Stack,
  Divider,
  ThemeIcon,
  rem,
  Table,
  RingProgress,
  Center,
} from "@mantine/core";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconCalendar,
  IconUsers,
  IconClock,
  IconChartBar,
  IconCircleCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";

import { DashboardLayout } from "@/components/layout";
import { PageHeader, StatCard } from "@/components/ui";
import { MOCK_STATS } from "@/mock";
import { getRateColor } from "@/lib/constants";

// ── Mock weekly trend data ────────────────────────────────────────
const WEEKLY_TREND = [
  { week: "Wk 17", rate: 71, submitted: 71 },
  { week: "Wk 18", rate: 76, submitted: 76 },
  { week: "Wk 19", rate: 68, submitted: 68 },
  { week: "Wk 20", rate: 80, submitted: 80 },
  { week: "Wk 21", rate: 70, submitted: 70 }, // current
];

const PEAK_SUBMISSION_HOURS = [
  { hour: "8–9 AM", pct: 22 },
  { hour: "9–10 AM", pct: 45 },
  { hour: "10–11 AM", pct: 18 },
  { hour: "11–12 PM", pct: 8 },
  { hour: "After 6PM", pct: 7 },
];

// ── Submission trend bar chart (Mantine Progress) ─────────────────
function SubmissionTrendChart() {
  const max = Math.max(...WEEKLY_TREND.map((w) => w.rate));

  return (
    <Stack gap={0}>
      <Text fw={600} size="sm" mb="sm">
        Weekly submission rate
      </Text>
      <Paper withBorder radius="sm" p="md">
        <Stack gap="sm">
          {WEEKLY_TREND.map((w, i) => {
            const isCurrent = i === WEEKLY_TREND.length - 1;
            const prev = WEEKLY_TREND[i - 1];
            const delta = prev ? w.rate - prev.rate : 0;
            const color = getRateColor(w.rate);

            return (
              <Box key={w.week}>
                <Group justify="space-between" mb={5} wrap="nowrap">
                  <Group gap="xs" wrap="nowrap">
                    <Text
                      size="xs"
                      fw={isCurrent ? 600 : 400}
                      c={isCurrent ? undefined : "dimmed"}
                      w={42}
                    >
                      {w.week}
                    </Text>
                    {isCurrent && (
                      <Badge size="xs" color="blue" variant="light" radius="sm">
                        Current
                      </Badge>
                    )}
                  </Group>

                  <Group gap={6} wrap="nowrap">
                    {delta !== 0 && (
                      <Group gap={2} wrap="nowrap">
                        {delta > 0 ? (
                          <IconTrendingUp
                            size={11}
                            stroke={2}
                            color="var(--mantine-color-green-6)"
                          />
                        ) : (
                          <IconTrendingDown
                            size={11}
                            stroke={2}
                            color="var(--mantine-color-red-6)"
                          />
                        )}
                        <Text
                          size="xs"
                          c={delta > 0 ? "green" : "red"}
                          fw={500}
                        >
                          {delta > 0 ? "+" : ""}
                          {delta}%
                        </Text>
                      </Group>
                    )}
                    <Text size="xs" fw={500} w={36} ta="right">
                      {w.rate}%
                    </Text>
                  </Group>
                </Group>
                <Progress
                  value={(w.rate / max) * 100}
                  color={color}
                  size={isCurrent ? "md" : "sm"}
                  radius="xs"
                />
              </Box>
            );
          })}
        </Stack>

        <Divider my="md" style={{ opacity: 0.6 }} />

        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            5-week average
          </Text>
          <Text size="xs" fw={600}>
            {Math.round(
              WEEKLY_TREND.reduce((s, w) => s + w.rate, 0) /
                WEEKLY_TREND.length,
            )}
            %
          </Text>
        </Group>
      </Paper>
    </Stack>
  );
}

// ── Compliance ring ───────────────────────────────────────────────
function ComplianceRing({ rate }: { rate: number }) {
  const color = getRateColor(rate);
  return (
    <Stack gap={0}>
      <Text fw={600} size="sm" mb="sm">
        Current week compliance
      </Text>
      <Paper withBorder radius="sm" p="md">
        <Center>
          <RingProgress
            size={140}
            thickness={14}
            roundCaps
            label={
              <Center>
                <Stack gap={0} align="center">
                  <Text size="xl" fw={700} lh={1}>
                    {rate}%
                  </Text>
                  <Text size="xs" c="dimmed">
                    compliance
                  </Text>
                </Stack>
              </Center>
            }
            sections={[{ value: rate, color }]}
          />
        </Center>
        <Divider my="sm" style={{ opacity: 0.6 }} />
        <Stack gap={6}>
          {[
            {
              label: "Updated",
              value: MOCK_STATS.updatedCount,
              color: "green",
            },
            {
              label: "Pending",
              value: MOCK_STATS.pendingCount,
              color: "orange",
            },
            { label: "Late", value: MOCK_STATS.lateCount, color: "red" },
            { label: "Missing", value: MOCK_STATS.missingCount, color: "gray" },
          ].map((item) => (
            <Group key={item.label} justify="space-between">
              <Group gap={6}>
                <Box
                  w={8}
                  h={8}
                  style={{
                    borderRadius: "50%",
                    background: `var(--mantine-color-${item.color}-6)`,
                    flexShrink: 0,
                  }}
                />
                <Text size="xs" c="dimmed">
                  {item.label}
                </Text>
              </Group>
              <Text size="xs" fw={500}>
                {item.value}
              </Text>
            </Group>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}

// ── Peak submission hours ─────────────────────────────────────────
function PeakHoursPanel() {
  const max = Math.max(...PEAK_SUBMISSION_HOURS.map((h) => h.pct));

  return (
    <Stack gap={0}>
      <Text fw={600} size="sm" mb="sm">
        Peak submission hours
      </Text>
      <Paper withBorder radius="sm" p="md">
        <Stack gap="sm">
          {PEAK_SUBMISSION_HOURS.map((h) => (
            <Box key={h.hour}>
              <Group justify="space-between" mb={4}>
                <Text size="xs" c="dimmed">
                  {h.hour}
                </Text>
                <Text size="xs" fw={500}>
                  {h.pct}%
                </Text>
              </Group>
              <Progress
                value={(h.pct / max) * 100}
                color="blue"
                size="xs"
                radius="xs"
              />
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}

// ── Department performance table ──────────────────────────────────
function DeptPerformanceTable() {
  const stats = MOCK_STATS;
  const sorted = [...stats.deptCompliance].sort((a, b) => b.rate - a.rate);

  const MOCK_PREV: Record<string, number> = {
    Engineering: 80,
    Design: 70,
    Marketing: 68,
    Sales: 48,
  };

  return (
    <Stack gap={0}>
      <Text fw={600} size="sm" mb="sm">
        Department performance
      </Text>
      <Paper withBorder radius="sm" style={{ overflow: "hidden" }}>
        <Table highlightOnHover>
          <Table.Thead style={{ background: "var(--mantine-color-gray-0)" }}>
            <Table.Tr>
              {[
                "Department",
                "Submitted",
                "Total",
                "Rate",
                "vs Last week",
                "Trend",
              ].map((h) => (
                <Table.Th key={h}>
                  <Text
                    size="xs"
                    fw={600}
                    c="dimmed"
                    tt="uppercase"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {h}
                  </Text>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sorted.map((dept, i) => {
              const prev = MOCK_PREV[dept.department] ?? dept.rate;
              const delta = dept.rate - prev;
              const color = getRateColor(dept.rate);

              return (
                <Table.Tr key={dept.department}>
                  <Table.Td>
                    <Group gap="xs">
                      <ThemeIcon
                        size={20}
                        radius="sm"
                        color={color}
                        variant="light"
                      >
                        <Box
                          w={6}
                          h={6}
                          style={{
                            borderRadius: "50%",
                            background: `var(--mantine-color-${color}-6)`,
                          }}
                        />
                      </ThemeIcon>
                      <Text size="sm" fw={500}>
                        {dept.department}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{dept.submittedCount}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {dept.totalCount}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Progress
                        value={dept.rate}
                        color={color}
                        size="xs"
                        w={60}
                        radius="xs"
                      />
                      <Badge
                        color={color}
                        variant="light"
                        size="sm"
                        radius="sm"
                      >
                        {dept.rate}%
                      </Badge>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" c="dimmed">
                      {prev}%
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4} wrap="nowrap">
                      {delta > 0 ? (
                        <>
                          <IconTrendingUp
                            size={13}
                            stroke={2}
                            color="var(--mantine-color-green-6)"
                          />
                          <Text size="xs" c="green" fw={500}>
                            +{delta}%
                          </Text>
                        </>
                      ) : delta < 0 ? (
                        <>
                          <IconTrendingDown
                            size={13}
                            stroke={2}
                            color="var(--mantine-color-red-6)"
                          />
                          <Text size="xs" c="red" fw={500}>
                            {delta}%
                          </Text>
                        </>
                      ) : (
                        <Text size="xs" c="dimmed">
                          —
                        </Text>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const stats = MOCK_STATS;
  const complianceNum = stats.complianceRateNum;

  return (
    <DashboardLayout title="Analytics" breadcrumbs={[{ label: "Analytics" }]}>
      <PageHeader
        title="Analytics"
        subtitle="Submission trends, department performance, and compliance metrics."
      />

      {/* ── KPI cards ──────────────────────────────────────────── */}
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md" mb="lg">
        <StatCard
          label="Compliance rate"
          value={stats.complianceRate}
          note="↑ 4% from last week"
          color="green"
          icon={IconCircleCheck}
        />
        <StatCard
          label="Avg submission time"
          value="9:18 AM"
          note="Deadline: 6:00 PM"
          color="blue"
          icon={IconClock}
        />
        <StatCard
          label="On-time submissions"
          value={`${stats.updatedCount}/${stats.totalEmployees}`}
          note="Before 6 PM deadline"
          color="teal"
          icon={IconCalendar}
        />
        <StatCard
          label="At-risk employees"
          value={stats.missingLateCount}
          note="Missing or late this week"
          color="red"
          icon={IconAlertTriangle}
        />
      </SimpleGrid>

      {/* ── Trend + compliance ring ─────────────────────────────── */}
      <Grid mb="lg">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <SubmissionTrendChart />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack gap="md">
            <ComplianceRing rate={complianceNum} />
            <PeakHoursPanel />
          </Stack>
        </Grid.Col>
      </Grid>

      {/* ── Department table ────────────────────────────────────── */}
      <DeptPerformanceTable />

      {/* Chart library placeholder banner */}
      <Paper
        withBorder
        radius="sm"
        p="md"
        mt="lg"
        style={{
          background: "var(--mantine-color-blue-0)",
          borderColor: "var(--mantine-color-blue-2)",
          borderStyle: "dashed",
        }}
      >
        <Group gap="sm">
          <ThemeIcon color="blue" variant="light" size={32}>
            <IconChartBar size={16} stroke={1.5} />
          </ThemeIcon>
          <Box>
            <Text size="sm" fw={500}>
              Recharts integration planned for Phase 5
            </Text>
            <Text size="xs" c="dimmed">
              Line charts for trend history, bar charts for department
              comparison, and area charts for cumulative submissions will be
              added here. Progress bars above are functional placeholders.
            </Text>
          </Box>
        </Group>
      </Paper>
    </DashboardLayout>
  );
}
