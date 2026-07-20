import { useEffect, useState } from "react";

import { Badge, Loader, Modal, Stack, Text, Divider, Box } from "@mantine/core";
import { formatDate } from "@/lib/formatters";
import type { LeaveType } from "@prisma/client";

type Leave = {
  id: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  reason: string | null;
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

export function LeaveHistoryModal({
  opened,
  onClose,
  userId,
  userName,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [leaves, setLeaves] = useState<Leave[]>([]);

  useEffect(() => {
    if (!opened) return;

    setLoading(true);

    fetch(`/api/leaves/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch leave history");
        }
        return res.json();
      })
      .then((data) => setLeaves(data.rows))
      .catch(() => setLeaves([]))
      .finally(() => setLoading(false));
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
          {leaves.length === 0 ? (
            <Text>No leave history.</Text>
          ) : (
            leaves.map((leave, index) => {
              const meta = LEAVE_META[leave.leaveType];

              return (
                <Box key={leave.id}>
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

                    <Text size="sm">
                      {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                    </Text>

                    {leave.reason && (
                      <Text size="sm" c="dimmed">
                        {leave.reason}
                      </Text>
                    )}
                  </Stack>

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
