import { useState, useEffect } from "react";
import {
  Card,
  Stack,
  Group,
  Text,
  SegmentedControl,
  TextInput,
  Textarea,
  Button,
  Alert,
  Skeleton,
  Divider,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import type { TaskStatus } from "@prisma/client";

import {
  useEmployeeStatus,
  useUpdateEmployeeStatus,
} from "@/hooks/useEmployeeStatus";
import { getErrorMessage } from "@/api/errors";
import { auth } from "@/firebase/config";

const TASK_STATUS_OPTIONS: { label: string; value: TaskStatus }[] = [
  { label: "Blocked", value: "BLOCKED" },
  { label: "Tasks In Progress", value: "IN_PROGRESS" },
  { label: "All Tasks Completed", value: "COMPLETED" },
];

export function EmployeeStatusCard() {
  const statusQuery = useEmployeeStatus();
  const updateMutation = useUpdateEmployeeStatus();

  const [taskStatus, setTaskStatus] = useState<TaskStatus>("BLOCKED");
  const [currentLearning, setCurrentLearning] = useState<string>("");
  const [learningDetails, setLearningDetails] = useState("");
  const [learningStatus, setLearningStatus] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);
  const [markingSeen, setMarkingSeen] = useState(false);
  const [updatingTimesheet, setUpdatingTimesheet] = useState(false);
  const [timesheetUrl, setTimesheetUrl] = useState<string | null>(null);
  const [currentTask, setCurrentTask] = useState("");

  useEffect(() => {
    if (statusQuery.data) {
      setTaskStatus(statusQuery.data.taskStatus);
      setCurrentLearning(statusQuery.data.currentLearning ?? "");
      setLearningDetails(statusQuery.data.learningDetails ?? "");
      setLearningStatus(statusQuery.data.learningStatus ?? "");
      setCurrentTask(statusQuery.data.currentTask ?? "");
      setTimesheetUrl(statusQuery.data.timesheetUrl ?? null);
      setHasChanges(false);
    }
  }, [statusQuery.data]);

  const handleTaskStatusChange = (value: string) => {
    setTaskStatus(value as TaskStatus);
    setHasChanges(true);
  };

  const handleLearningChange = (value: string) => {
    setCurrentLearning(value);
    setHasChanges(true);
  };

  const handleLearningDetailsChange = (value: string) => {
    setLearningDetails(value);
    setHasChanges(true);
  };

  const handleLearningStatusChange = (value: string) => {
    setLearningStatus(value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    const effectiveStatus = !currentTask.trim() ? "BLOCKED" : taskStatus;
    await updateMutation.mutateAsync({
      taskStatus: effectiveStatus,
      currentLearning: currentLearning || undefined,
      learningDetails: learningDetails || undefined,
      learningStatus: learningStatus || undefined,
      currentTask: currentTask || undefined,
    });
    setHasChanges(false);
  };

  const handleMarkSeen = async () => {
    try {
      setMarkingSeen(true);

      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        throw new Error("User is not authenticated");
      }

      await fetch("/api/admin/seen", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      statusQuery.refetch();
    } finally {
      setMarkingSeen(false);
    }
  };

  const handleUpdateTimesheet = async () => {
    try {
      setUpdatingTimesheet(true);

      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        throw new Error("User is not authenticated");
      }

      await fetch("/api/employee/timesheet-seen", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      statusQuery.refetch();
    } finally {
      setUpdatingTimesheet(false);
    }
  };

  function getStatusColor(status: TaskStatus) {
    switch (status) {
      case "BLOCKED":
        return " #dc2626";

      case "IN_PROGRESS":
        return "blue";

      case "COMPLETED":
        return "green";

      default:
        return "gray";
    }
  }

  const activeColor = getStatusColor(taskStatus);
  const isLoading = statusQuery.isLoading;
  const isSaving = updateMutation.isPending;
  const hasError = statusQuery.isError || updateMutation.isError;

  const errorMessage = getErrorMessage(
    statusQuery.error ?? updateMutation.error,
  );

  const noEmployeeFound =
    statusQuery.isError && errorMessage.includes("No employee");

  if (noEmployeeFound) {
    return (
      <Card withBorder p="md" radius="sm">
        <Stack gap="md">
          <Text fw={600} size="lg">
            Employee Status
          </Text>

          <Alert color="blue" title="Coming Soon">
            Employee profile will become available once authentication and
            employee onboarding are implemented.
          </Alert>
        </Stack>
      </Card>
    );
  }

  return (
    <Card withBorder p="md" radius="sm">
      <Stack gap="md">
        <Text fw={500}>Employee Status</Text>

        {hasError && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
            {getErrorMessage(statusQuery.error ?? updateMutation.error)}
          </Alert>
        )}

        {isLoading ? (
          <Stack gap="md">
            <Skeleton height={36} />
            <Skeleton height={36} />
          </Stack>
        ) : (
          <>
            <div>
              <Text size="sm" fw={500} mb="xs">
                Task Status
              </Text>
              <SegmentedControl
                fullWidth
                value={taskStatus}
                onChange={handleTaskStatusChange}
                data={TASK_STATUS_OPTIONS}
                color={activeColor}
              />
            </div>
            <TextInput
              label="Current Task"
              placeholder="What is the current task?"
              value={currentTask}
              onChange={(event) => {
                setCurrentTask(event.currentTarget.value);
                setHasChanges(true);
              }}
              disabled={isSaving}
            />
            <Divider
              my="sm"
              label={
                <Text fw={600} size="md" c="dark">
                  Learning
                </Text>
              }
              labelPosition="center"
            />{" "}
            <TextInput
              label="Currently Learning"
              placeholder="e.g., React, AWS, Leadership"
              value={currentLearning}
              onChange={(e) => handleLearningChange(e.currentTarget.value)}
              disabled={isSaving}
            />
            <TextInput
              label="Learning Status"
              placeholder="e.g. Completed React Hooks, currently learning React Query"
              value={learningStatus}
              onChange={(e) =>
                handleLearningStatusChange(e.currentTarget.value)
              }
            />
            <Textarea
              label="Learning Details"
              placeholder="Describe what you are learning..."
              minRows={4}
              autosize
              value={learningDetails}
              onChange={(e) =>
                handleLearningDetailsChange(e.currentTarget.value)
              }
              disabled={isSaving}
            />
            <Group justify="space-between" align="center">
              {statusQuery.data?.updatedAt && (
                <Text size="xs" c="dimmed">
                  Last saved:{" "}
                  {new Date(statusQuery.data.updatedAt).toLocaleString()}
                </Text>
              )}

              <Group>
                {timesheetUrl && (
                  <Button
                    variant="light"
                    color="teal"
                    onClick={handleUpdateTimesheet}
                    loading={updatingTimesheet}
                  >
                    Updated Timesheet
                  </Button>
                )}

                <Button
                  variant="light"
                  onClick={handleMarkSeen}
                  loading={markingSeen}
                >
                  Seen During Standup Call
                </Button>

                <Button
                  onClick={handleSave}
                  loading={isSaving}
                  disabled={!hasChanges || isSaving}
                >
                  Save
                </Button>
              </Group>
            </Group>
          </>
        )}
      </Stack>
    </Card>
  );
}
