import { useEffect, useState } from "react";

import {
  Badge,
  Loader,
  Modal,
  Stack,
  Text,
  Divider,
  Box,
  SimpleGrid,
  Paper,
  Group,
  Button,
  ActionIcon,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { formatDate } from "@/lib/formatters";
import type { LeaveType } from "@prisma/client";
import { getLeaveHistory, cancelLeave } from "@/services/leave.service";
type Leave = {
  id: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  isHalfDay: boolean;
  reason: string | null;
  createdAt?: string | null;
};

type Props = {
  opened: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
};

const LEAVE_META: Record<
  LeaveType,
  {
    label: string;
    color: string;
  }
> = {
  SICK: {
    label: "Sick Leave",
    color: "red",
  },
  CASUAL: {
    label: "Casual Leave",
    color: "yellow",
  },
  VACATION: {
    label: "Vacation",
    color: "blue",
  },
  OPTIONAL: {
    label: "Optional Leave",
    color: "grape",
  },
};

function getLeaveDays(leave: Leave) {
  const from = new Date(leave.fromDate);

  if (leave.isHalfDay) {
    const day = from.getDay();
    const isWeekend = day === 0 || day === 6;

    return isWeekend ? 0 : 0.5;
  }

  const to = new Date(leave.toDate);

  let leaveDays = 0;
  const currentDate = new Date(from);

  while (currentDate <= to) {
    const day = currentDate.getDay();
    const isWeekend = day === 0 || day === 6;

    if (!isWeekend) {
      leaveDays++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return leaveDays;
}

function formatLeaveDays(days: number) {
  return `${days} ${days === 1 ? "day" : "days"}`;
}

export function LeaveHistoryModal({
  opened,
  onClose,
  userId,
  userName,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleCancelLeave = async (leaveId: string) => {
    try {
      setCancellingId(leaveId);

      await cancelLeave(leaveId);

      setLeaves((prev) => prev.filter((l) => l.id !== leaveId));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to cancel leave");
    } finally {
      setCancellingId(null);
    }
  };

  const leaveSummary = leaves.reduce<Record<LeaveType, number>>(
    (summary, leave) => {
      summary[leave.leaveType] += getLeaveDays(leave);

      return summary;
    },
    {
      SICK: 0,
      CASUAL: 0,
      VACATION: 0,
      OPTIONAL: 0,
    },
  );

  useEffect(() => {
    if (!opened) return;

    const loadLeaves = async () => {
      try {
        setLoading(true);

        const data = await getLeaveHistory(userId);

        setLeaves(data.rows);
      } catch {
        setLeaves([]);
      } finally {
        setLoading(false);
      }
    };

    loadLeaves();
  }, [opened, userId]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`${userName} - Leave History`}
      size="lg"
    >
      {loading ? (
        <Stack align="center" py="md">
          <Loader />
        </Stack>
      ) : (
        <Stack>
          {leaves.length > 0 && (
            <>
              <SimpleGrid cols={4}>
                {Object.entries(LEAVE_META).map(([type, meta]) => (
                  <Paper key={type} withBorder p="sm">
                    <Badge
                      color={meta.color}
                      variant="light"
                      size="sm"
                      styles={{
                        label: {
                          textTransform: "none",
                        },
                      }}
                    >
                      {meta.label}
                    </Badge>

                    <Text fw={600} size="lg" mt={4}>
                      {formatLeaveDays(leaveSummary[type as LeaveType])}
                    </Text>
                  </Paper>
                ))}
              </SimpleGrid>

              <Divider />
            </>
          )}
          {leaves.length === 0 ? (
            <Text>No leave history.</Text>
          ) : (
            leaves.map((leave, index) => {
              const meta = LEAVE_META[leave.leaveType];

              return (
                <Box key={leave.id}>
                  <Group justify="space-between" align="center">
                    <Stack gap={4}>
                      <Badge
                        color={meta.color}
                        variant="light"
                        styles={{
                          label: {
                            textTransform: "none",
                          },
                        }}
                      >
                        {meta.label}
                      </Badge>

                      {leave.isHalfDay && (
                        <Text size="xs" c="dimmed">
                          Half Day
                        </Text>
                      )}

                      <Text size="sm">
                        {formatDate(leave.fromDate)} -{" "}
                        {formatDate(leave.toDate)}
                      </Text>

                      {leave.reason && (
                        <Text size="sm" c="dimmed">
                          {leave.reason}
                        </Text>
                      )}
                    </Stack>

                    {new Date(leave.fromDate) > new Date() &&
                      (confirmingId === leave.id ? (
                        <Group gap="xs">
                          <Text size="xs" c="dimmed">
                            Are you sure?
                          </Text>
                          <Button
                            size="compact-xs"
                            color="red"
                            loading={cancellingId === leave.id}
                            onClick={() => handleCancelLeave(leave.id)}
                          >
                            Yes
                          </Button>
                          <Button
                            size="compact-xs"
                            variant="default"
                            onClick={() => setConfirmingId(null)}
                            disabled={cancellingId === leave.id}
                          >
                            No
                          </Button>
                        </Group>
                      ) : (
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          size="md"
                          onClick={() => setConfirmingId(leave.id)}
                        >
                          <IconTrash size={18} />
                        </ActionIcon>
                      ))}
                  </Group>

                  {index < leaves.length - 1 && <Divider my="sm" />}
                </Box>
              );
            })
          )}
        </Stack>
      )}
    </Modal>
  );
}
