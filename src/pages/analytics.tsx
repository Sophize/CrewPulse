import {
  Alert,
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
  Table,
  RingProgress,
  Center,
} from "@mantine/core";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconCalendar,
  IconClock,
  IconChartBar,
  IconCircleCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";

import { DashboardLayout } from "@/components/layout";
import { PageHeader, StatCard } from "@/components/ui";
import { getErrorMessage } from "@/api/errors";
import { useAnalytics } from "@/hooks/useAnalytics";
import { getRateColor } from "@/lib/constants";
import type { DashboardStats } from "@/types/dashboard";
import type { PeakSubmissionHour, WeeklyTrendPoint } from "@/types/analytics";

function SubmissionTrendChart({
  weeklyTrend,
}: {
  weeklyTrend: WeeklyTrendPoint[];
}) {
  const max = Math.max(...weeklyTrend.map((w) => w.rate), 1);

  return (
    <Stack gap={0}>
      <Text fw={600} size="sm" mb="sm">
        Weekly submission rate
      </Text>
      <Paper withBorder radius="sm" p="md">
        <Stack gap="sm">
          {weeklyTrend.map((w, i) => {
            const isCurrent = i === weeklyTrend.length - 1;
            const prev = weeklyTrend[i - 1];
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
              weeklyTrend.reduce((s, w) => s + w.rate, 0) /
                Math.max(weeklyTrend.length, 1),
            )}
            %
          </Text>
        </Group>
      </Paper>
    </Stack>
  );
}

function ComplianceRing({
  rate,
  stats,
}: {
  rate: number;
  stats: DashboardStats;
}) {
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
              value: stats.updatedCount,
              color: "green",
            },
            {
              label: "Pending",
              value: stats.pendingCount,
              color: "orange",
            },
            { label: "Late", value: stats.lateCount, color: "red" },
            { label: "Missing", value: stats.missingCount, color: "gray" },
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

function PeakHoursPanel({
  peakSubmissionHours,
}: {
  peakSubmissionHours: PeakSubmissionHour[];
}) {
  const max = Math.max(...peakSubmissionHours.map((h) => h.pct), 1);

  return (
    <Stack gap={0}>
      <Text fw={600} size="sm" mb="sm">
        Peak submission hours
      </Text>
      <Paper withBorder radius="sm" p="md">
        <Stack gap="sm">
          {peakSubmissionHours.map((h) => (
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

function DeptPerformanceTable({
  stats,
  previousDepartmentRates,
}: {
  stats: DashboardStats;
  previousDepartmentRates: Record<string, number>;
}) {
  const sorted = [...stats.deptCompliance].sort((a, b) => b.rate - a.rate);

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
            {sorted.map((dept) => {
              const prev =
                previousDepartmentRates[dept.department] ?? dept.rate;
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

export default function AnalyticsPage() {
  const analyticsQuery = useAnalytics();
  const analytics = analyticsQuery.data;
  const stats = analytics?.stats;
  const complianceNum = stats?.complianceRateNum ?? 0;

  return (
    <DashboardLayout title="Analytics" breadcrumbs={[{ label: "Analytics" }]}>
      <PageHeader
        title="Analytics"
        subtitle="Submission trends, department performance, and compliance metrics."
      />

      {analyticsQuery.isError && (
        <Alert color="red" mb="md" title="Unable to load analytics">
          {getErrorMessage(analyticsQuery.error)}
        </Alert>
      )}

      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md" mb="lg">
        <StatCard
          label="Compliance rate"
          value={stats?.complianceRate ?? "—"}
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
          value={stats ? `${stats.updatedCount}/${stats.totalEmployees}` : "—"}
          note="Before 6 PM deadline"
          color="teal"
          icon={IconCalendar}
        />
        <StatCard
          label="At-risk employees"
          value={stats?.missingLateCount ?? 0}
          note="Missing or late this week"
          color="red"
          icon={IconAlertTriangle}
        />
      </SimpleGrid>

      <Grid mb="lg">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <SubmissionTrendChart weeklyTrend={analytics?.weeklyTrend ?? []} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack gap="md">
            {stats && <ComplianceRing rate={complianceNum} stats={stats} />}
            <PeakHoursPanel
              peakSubmissionHours={analytics?.peakSubmissionHours ?? []}
            />
          </Stack>
        </Grid.Col>
      </Grid>

      {stats && (
        <DeptPerformanceTable
          stats={stats}
          previousDepartmentRates={analytics?.previousDepartmentRates ?? {}}
        />
      )}

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
