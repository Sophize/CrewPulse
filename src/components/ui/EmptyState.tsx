import { Stack, ThemeIcon, Text, Box } from "@mantine/core";
import type { MantineColor } from "@mantine/core";

interface EmptyStateProps {
  /** Tabler icon component. Pass the component itself: icon={IconUsers} */
  icon: React.ComponentType<{ size?: number | string; stroke?: number }>;
  title: string;
  description?: string;
  /** Optional CTA — a Button or Anchor node */
  action?: React.ReactNode;
  /** Icon tint color. Default: "gray" */
  color?: MantineColor;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  color = "gray",
}: EmptyStateProps) {
  return (
    <Box py={48} px={24}>
      <Stack align="center" gap="sm">
        <ThemeIcon
          size={56}
          radius="xl"
          color={color}
          variant="light"
          aria-hidden
        >
          <Icon size={28} stroke={1.5} />
        </ThemeIcon>

        <Stack gap={4} align="center">
          <Text fw={500} size="sm" ta="center">
            {title}
          </Text>
          {description && (
            <Text size="sm" c="dimmed" ta="center" maw={360}>
              {description}
            </Text>
          )}
        </Stack>

        {action}
      </Stack>
    </Box>
  );
}
