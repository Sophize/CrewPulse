import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Card,
  Stack,
  Group,
  Text,
  SegmentedControl,
  TextInput,
  Textarea,
  Button,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import { IconCalendar } from "@tabler/icons-react";
import {
  useProjectTasks,
  useCreateProjectTask,
  useDeleteProjectTask,
} from "@/hooks/useProjectTasks";

import { Table, ActionIcon, Badge, Divider } from "@mantine/core";

import { IconTrash } from "@tabler/icons-react";
import { TaskStatus } from "@prisma/client";

const TASK_STATUS_OPTIONS = [
  { label: "Blocked", value: "BLOCKED" },
  { label: "Tasks In Progress", value: TaskStatus.IN_PROGRESS },
  { label: "All Tasks Completed", value: "COMPLETED" },
];

export default function ProjectStatusPage() {
  const router = useRouter();
  const { id } = router.query;
  const projectId = typeof id === "string" ? id : "";

  const taskQuery = useProjectTasks(projectId);

  const createMutation = useCreateProjectTask(projectId);

  const deleteMutation = useDeleteProjectTask(projectId);

  const projectName =
    typeof id === "string" ? (id === "fau" ? "FAU" : id.charAt(0).toUpperCase() + id.slice(1)) : "";

  const [taskStatus, setTaskStatus] = useState<TaskStatus>(TaskStatus.BLOCKED);
  const [assignTask, setAssignTask] = useState("");
  const [meetingTime, setMeetingTime] = useState<Date | null>(null);
  const [meetingPurpose, setMeetingPurpose] = useState("");

  // const [isSaving, setIsSaving] = useState(false);

  function getStatusColor(status: string) {
    switch (status) {
      case "BLOCKED":
        return "#dc2626"; // red
      case "IN_PROGRESS":
        return "blue";
      case "COMPLETED":
        return "green";
      default:
        return "gray";
    }
  }

  // const handleSave = () => {
  //   setIsSaving(true);
  //   // Simulate API call
  //   setTimeout(() => {
  //     setIsSaving(false);
  //     if (taskStatus === "COMPLETED") {
  //       setAssignTask("");
  //     }
  //   }, 500);
  // };
  const handleSave = async () => {
    if (!assignTask.trim()) {
      return;
    }

    await createMutation.mutateAsync({
      projectName: projectId,
      taskStatus,
      assignTask,
      meetingTime,
      meetingPurpose,
    });

    setAssignTask("");
    setMeetingPurpose("");
    setMeetingTime(null);
  };

  return (
    <AuthGuard>
      <DashboardLayout
        title={`Project Status - ${projectName}`}
        breadcrumbs={[{ label: "Project Status" }, { label: projectName }]}
      >
        <PageHeader
          title={`Project Status - ${projectName}`}
          subtitle={`Manage tasks and meetings for ${projectName}`}
        />

        <Stack gap="lg">
          <Card withBorder p="md" radius="sm">
            <Stack gap="md">
              <Text fw={500}>Task Status</Text>

              <div>
                <SegmentedControl
                  fullWidth
                  value={taskStatus}
                  onChange={(value) => setTaskStatus(value as TaskStatus)}
                  data={TASK_STATUS_OPTIONS}
                  color={getStatusColor(taskStatus)}
                />
              </div>

              <Group align="flex-end" wrap="nowrap">
                <TextInput
                  label="Assign Task"
                  placeholder="Enter task to assign"
                  value={assignTask}
                  onChange={(e) => setAssignTask(e.currentTarget.value)}
                  style={{ flex: 1 }}
                />
                <Button onClick={handleSave} loading={createMutation.isPending}>
                  Save
                </Button>
              </Group>

              <DateTimePicker
                label="Meeting Time"
                placeholder=""
                leftSection={<IconCalendar size={18} stroke={1.5} />}
                leftSectionPointerEvents="none"
                value={meetingTime}
                onChange={(val) => setMeetingTime(val ? new Date(val) : null)}
                clearable
              />

              <Textarea
                label="Meeting Purpose"
                placeholder="e.g. Weekly Sync"
                value={meetingPurpose}
                onChange={(e) => setMeetingPurpose(e.currentTarget.value)}
                minRows={4}
                autosize
              />
            </Stack>
          </Card>
          <Card withBorder mt="lg">
            <Group justify="space-between">
              <Text fw={600}>Assigned Tasks</Text>

              <Button variant="light" size="xs">
                History
              </Button>
            </Group>

            <Divider my="sm" />

            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Date</Table.Th>

                  <Table.Th>Task</Table.Th>

                  <Table.Th>Status</Table.Th>

                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {taskQuery.data?.map((task) => (
                  <Table.Tr key={task.id}>
                    <Table.Td>{new Date(task.createdAt).toLocaleDateString()}</Table.Td>

                    <Table.Td>{task.assignTask}</Table.Td>

                    <Table.Td>
                      <Badge>{task.taskStatus}</Badge>
                    </Table.Td>

                    <Table.Td>
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => deleteMutation.mutate(task.id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Stack>
      </DashboardLayout>
    </AuthGuard>
  );
}
