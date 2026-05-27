// features/dashboard/components/DeptComplianceBar.tsx
//
// Horizontal bar chart showing submission compliance rate per department.
// Uses Mantine Progress — no chart library needed at this stage.
//
// Color coding:
//   ≥ 80%  → green  (on track)
//   ≥ 60%  → orange (needs attention)
//   < 60%  → red    (action required)

import { Stack, Group, Text, Progress, Paper, Badge, Box } from "@mantine/core";

import { getRateColor } from "@/lib/constants";
import type { DeptStat } from "@/types";

// ── Single department row ─────────────────────────────────────────
interface DeptRowProps {
  stat: DeptStat;
}

function DeptRow({ stat }: DeptRowProps) {
  const color = getRateColor(stat.rate);

  return (
    <Box>
      <Group justify="space-between" mb={6} wrap="nowrap">
        <Text size="sm" fw={500} truncate>
          {stat.department}
        </Text>
        <Group gap="xs" wrap="nowrap" style={{ flexShrink: 0 }}>
          <Text size="xs" c="dimmed">
            {stat.submittedCount}/{stat.totalCount}
          </Text>
          <Badge color={color} variant="light" size="xs" radius="sm">
            {stat.rate}%
          </Badge>
        </Group>
      </Group>

      <Progress
        value={stat.rate}
        color={color}
        size="sm"
        radius="xs"
        aria-label={`${stat.department} compliance: ${stat.rate}%`}
      />
    </Box>
  );
}

// ── Main component ────────────────────────────────────────────────
interface DeptComplianceBarProps {
  deptStats: DeptStat[];
  isLoading?: boolean;
}

export function DeptComplianceBar({
  deptStats,
  isLoading = false,
}: DeptComplianceBarProps) {
  // Sort by rate descending so best departments appear first.
  const sorted = [...deptStats].sort((a, b) => b.rate - a.rate);

  return (
    <Stack gap={0}>
      <Text fw={600} size="sm" mb="sm">
        Compliance by department
      </Text>

      <Paper withBorder radius="sm" p="md">
        {isLoading ? (
          // Skeleton placeholder matching the real layout
          <Stack gap="md">
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i}>
                <Group justify="space-between" mb={6}>
                  <Box
                    h={14}
                    w={`${60 + (i % 3) * 15}%`}
                    style={{
                      background: "var(--mantine-color-gray-2)",
                      borderRadius: 4,
                    }}
                  />
                  <Box
                    h={14}
                    w={36}
                    style={{
                      background: "var(--mantine-color-gray-2)",
                      borderRadius: 4,
                    }}
                  />
                </Group>
                <Box
                  h={8}
                  style={{
                    background: "var(--mantine-color-gray-2)",
                    borderRadius: 4,
                  }}
                />
              </Box>
            ))}
          </Stack>
        ) : sorted.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="md">
            No department data available.
          </Text>
        ) : (
          <Stack gap="md">
            {sorted.map((stat) => (
              <DeptRow key={stat.department} stat={stat} />
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
