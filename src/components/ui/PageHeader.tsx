import { Group, Stack, Text, Box, Divider } from "@mantine/core";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
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
