import {
  Paper,
  Stack,
  Group,
  Text,
  Progress,
  Badge,
  ThemeIcon,
  Box,
  Divider,
} from "@mantine/core";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
} from "@tabler/icons-react";

import { getRateColor } from "@/lib/constants";
import type { DeptStat } from "@/types";

const DEPT_TRENDS: Record<string, number> = {
  Engineering: +5,
  Design: +2,
  Marketing: -8,
  Sales: -3,
};

function TrendIcon({ dept }: { dept: string }) {
  const delta = DEPT_TRENDS[dept] ?? 0;
  if (delta > 0)
    return (
      <Group gap={2} wrap="nowrap">
        <IconTrendingUp
          size={12}
          stroke={2}
          color="var(--mantine-color-green-6)"
        />
        <Text size="xs" c="green" fw={500}>
          +{delta}%
        </Text>
      </Group>
    );
  if (delta < 0)
    return (
      <Group gap={2} wrap="nowrap">
        <IconTrendingDown
          size={12}
          stroke={2}
          color="var(--mantine-color-red-6)"
        />
        <Text size="xs" c="red" fw={500}>
          {delta}%
        </Text>
      </Group>
    );
  return (
    <Group gap={2} wrap="nowrap">
      <IconMinus size={12} stroke={2} color="var(--mantine-color-dimmed)" />
      <Text size="xs" c="dimmed">
        0%
      </Text>
    </Group>
  );
}

function DeptRow({ stat }: { stat: DeptStat }) {
  const color = getRateColor(stat.rate);

  return (
    <Box>
      <Group justify="space-between" mb={5} wrap="nowrap">
        <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          <ThemeIcon size={22} radius="sm" color={color} variant="light">
            <Box
              w={8}
              h={8}
              style={{
                borderRadius: "50%",
                background: `var(--mantine-color-${color}-6)`,
              }}
            />
          </ThemeIcon>
          <Text size="sm" fw={500} truncate>
            {stat.department}
          </Text>
        </Group>

        <Group gap="md" wrap="nowrap" style={{ flexShrink: 0 }}>
          <TrendIcon dept={stat.department} />
          <Text size="xs" c="dimmed" w={48} ta="right">
            {stat.submittedCount}/{stat.totalCount}
          </Text>
          <Badge
            color={color}
            variant="light"
            size="sm"
            radius="sm"
            w={48}
            ta="center"
          >
            {stat.rate}%
          </Badge>
        </Group>
      </Group>

      <Progress
        value={stat.rate}
        color={color}
        size="xs"
        radius="xs"
        aria-label={`${stat.department}: ${stat.rate}% compliance`}
      />
    </Box>
  );
}

interface DeptComplianceCardProps {
  deptStats: DeptStat[];
}

export function DeptComplianceCard({ deptStats }: DeptComplianceCardProps) {
  const sorted = [...deptStats].sort((a, b) => b.rate - a.rate);
  const overall =
    deptStats.length > 0
      ? Math.round(deptStats.reduce((s, d) => s + d.rate, 0) / deptStats.length)
      : 0;

  return (
    <Stack gap={0}>
      <Text fw={600} size="sm" mb="sm">
        Department compliance
      </Text>

      <Paper withBorder radius="sm" p="md" style={{ height: "100%" }}>
        <Group
          justify="space-between"
          mb="md"
          pb="md"
          style={{
            borderBottom: "1px solid var(--mantine-color-default-border)",
          }}
        >
          <Box>
            <Text
              size="xs"
              c="dimmed"
              tt="uppercase"
              fw={500}
              style={{ letterSpacing: "0.05em" }}
            >
              Overall
            </Text>
            <Text size="xl" fw={700} lh={1.2}>
              {overall}%
            </Text>
          </Box>
          <Badge
            color={getRateColor(overall)}
            variant="light"
            size="lg"
            radius="md"
          >
            {overall >= 80
              ? "On track"
              : overall >= 60
                ? "Attention needed"
                : "Action required"}
          </Badge>
        </Group>

        <Stack gap="md">
          {sorted.map((stat, i) => (
            <Box key={stat.department}>
              <DeptRow stat={stat} />
              {i < sorted.length - 1 && (
                <Divider mt="md" style={{ opacity: 0.5 }} />
              )}
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
