import { Group, Stack, Text, Box, Divider } from "@mantine/core";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /**
   * Right-side slot for action buttons, filters, or date pickers.
   * Rendered in a Group — pass multiple elements as a fragment.
   */
  action?: React.ReactNode;
  /**
   * Whether to render the bottom divider.
   * Default: true
   */
  withDivider?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  action,
  withDivider = true,
}: PageHeaderProps) {
  return (
    <Box mb="lg">
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Stack gap={2}>
          <Text component="h1" size="xl" fw={600} lh={1.2} m={0}>
            {title}
          </Text>
          {subtitle && (
            <Text size="sm" c="dimmed">
              {subtitle}
            </Text>
          )}
        </Stack>

        {action && (
          <Group gap="sm" wrap="nowrap" style={{ flexShrink: 0 }}>
            {action}
          </Group>
        )}
      </Group>

      {withDivider && <Divider mt="md" />}
    </Box>
  );
}
