import { useMemo } from "react";
import { Group, Text, Box, ThemeIcon, Tooltip } from "@mantine/core";
import { IconCoffee } from "@tabler/icons-react";
import { ALL_HOLIDAYS, Holiday } from "@/constants/holidays";

interface UpcomingHolidayData {
  holiday: Holiday;
  daysUntil: number;
  dateObj: Date;
}

function parseHolidayDate(dateStr: string, year: number): Date {
  return new Date(`${dateStr}, ${year}`);
}

function getNextUpcomingHoliday(): UpcomingHolidayData | null {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const year = today.getFullYear();

  let closest: UpcomingHolidayData | null = null;

  for (const holiday of ALL_HOLIDAYS) {
    const holidayDate = parseHolidayDate(holiday.date, year);

    if (isNaN(holidayDate.getTime()) || holidayDate < today) {
      continue;
    }

    const diffTime = holidayDate.getTime() - today.getTime();
    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (!closest || daysUntil < closest.daysUntil) {
      closest = {
        holiday,
        daysUntil,
        dateObj: holidayDate,
      };
    }
  }

  return closest;
}

export function UpcomingHoliday() {
  const upcoming = useMemo(() => getNextUpcomingHoliday(), []);

  if (!upcoming) return null;

  const { holiday, daysUntil } = upcoming;

  const isOptional = holiday.type === "OPTIONAL";

  const daysLabel =
    daysUntil === 0
      ? "Today!"
      : daysUntil === 1
        ? "Tomorrow"
        : `in ${daysUntil} days`;

  const holidayTypeLabel = isOptional
    ? "Optional Holiday"
    : "Mandatory Holiday";
  const tooltipText = `${holiday.holiday} (${holiday.date}) — ${holidayTypeLabel}`;

  const themeColor = isOptional ? "blue" : "orange";
  const borderColor = isOptional
    ? "var(--mantine-color-blue-light-color, rgba(36, 116, 200, 0.3))"
    : "var(--mantine-color-orange-light-color, rgba(255, 146, 43, 0.3))";
  const bgColor = isOptional
    ? "var(--mantine-color-blue-light)"
    : "var(--mantine-color-orange-light)";

  return (
    <Tooltip label={tooltipText} withArrow position="bottom">
      <Box
        px="sm"
        py={6}
        style={{
          border: `1px solid ${borderColor}`,
          borderRadius: "var(--mantine-radius-md)",
          backgroundColor: bgColor,
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        <Group gap={8} wrap="nowrap">
          <ThemeIcon size="sm" variant="light" color={themeColor} radius="xl">
            <IconCoffee size={16} stroke={2} />
          </ThemeIcon>

          <div>
            <Text
              size="xs"
              fw={300}
              lh={1.0}
              truncate
              style={{ maxWidth: 120 }}
            >
              {holiday.holiday}
            </Text>

            <Text size="xs" c="dimmed" lh={1.2}>
              {daysLabel}
            </Text>
          </div>
        </Group>
      </Box>
    </Tooltip>
  );
}
