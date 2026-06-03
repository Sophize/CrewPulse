import { useState, useEffect } from "react";
import {
  Card,
  Stack,
  Group,
  Text,
  SegmentedControl,
  TextInput,
  Button,
  Alert,
  Skeleton,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import type { TaskStatus } from "@prisma/client";

import {
  useEmployeeStatus,
  useUpdateEmployeeStatus,
} from "@/hooks/useEmployeeStatus";
import { getErrorMessage } from "@/api/errors";

const TASK_STATUS_OPTIONS: { label: string; value: TaskStatus }[] = [
  { label: "No Tasks Assigned", value: "NO_TASKS" },
  { label: "Tasks In Progress", value: "IN_PROGRESS" },
  { label: "All Tasks Completed", value: "COMPLETED" },
];

export function EmployeeStatusCard() {
  const statusQuery = useEmployeeStatus();
  const updateMutation = useUpdateEmployeeStatus();

  const [taskStatus, setTaskStatus] = useState<TaskStatus>("NO_TASKS");
  const [currentLearning, setCurrentLearning] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);

  // Prefill form when data loads
  useEffect(() => {
    if (statusQuery.data) {
      setTaskStatus(statusQuery.data.taskStatus);
      setCurrentLearning(statusQuery.data.currentLearning ?? "");
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

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      taskStatus,
      currentLearning: currentLearning || undefined,
    });
    setHasChanges(false);
  };

  function getStatusColor(status: TaskStatus) {
    switch (status) {
      case "NO_TASKS":
        return "gray";

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
          <Text fw={600} size="lg">Employee Status</Text>

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
              label="Currently Learning"
              placeholder="e.g., React, AWS, Leadership"
              value={currentLearning}
              onChange={(e) => handleLearningChange(e.currentTarget.value)}
              disabled={isSaving}
            />

            <Group justify="space-between" align="center">
              {statusQuery.data?.updatedAt && (
                <Text size="xs" c="dimmed">
                  Last saved:{" "}
                  {new Date(statusQuery.data.updatedAt).toLocaleString()}
                </Text>
              )}

              <Button
                onClick={handleSave}
                loading={isSaving}
                disabled={!hasChanges || isSaving}
              >
                Save
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </Card>
  );
}
