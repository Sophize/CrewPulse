import { Paper, Text, Group, ThemeIcon, Box, rem } from "@mantine/core";
import type { MantineColor } from "@mantine/core";

interface StatCardProps {
  label: string;
  value: string | number;

  note?: string;

  color?: MantineColor;

  icon?: React.ComponentType<{ size?: number | string; stroke?: number }>;
}

export function StatCard({
  label,
  value,
  note,
  color = "blue",
  icon: Icon,
}: StatCardProps) {
  return (
    <Paper
      withBorder
      p="md"
      radius="sm"
      style={{
        borderLeft: `3px solid var(--mantine-color-${color}-6)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        <Box>
          <Text
            size="xs"
            fw={500}
            tt="uppercase"
            c="dimmed"
            mb={4}
            style={{ letterSpacing: "0.05em" }}
          >
            {label}
          </Text>

          <Text
            size="xl"
            fw={700}
            lh={1}
            mb={note ? 6 : 0}
            style={{ fontSize: rem(28) }}
          >
            {value}
          </Text>

          {note && (
            <Text size="xs" c="dimmed" mt={4}>
              {note}
            </Text>
          )}
        </Box>

        {Icon && (
          <ThemeIcon
            color={color}
            variant="light"
            size={44}
            radius="md"
            aria-hidden
          >
            <Icon size={22} stroke={1.5} />
          </ThemeIcon>
        )}
      </Group>
    </Paper>
  );
}
