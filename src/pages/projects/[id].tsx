import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Card,
  Stack,
  Group,
  Text,
  Textarea,
  Button,
  ActionIcon,
  Tooltip,
  Table,
  Divider,
  Box,
  Modal,
  NativeSelect,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import {
  IconCalendar,
  IconDeviceFloppy,
  IconTrash,
  IconEdit,
  IconHourglass,
  IconCheck,
  IconForbid2,
} from "@tabler/icons-react";
import {
  useProjectTasks,
  useCreateProjectTask,
  useDeleteProjectTask,
  useProjectMeeting,
  useUpdateProjectTask,
} from "@/hooks/useProjectTasks";

import { TaskStatus } from "@prisma/client";

export default function ProjectStatusPage() {
  const router = useRouter();
  const { id } = router.query;
  const projectId = typeof id === "string" ? id : "";

  const taskQuery = useProjectTasks(projectId);
  const meetingQuery = useProjectMeeting(projectId);

  const createMutation = useCreateProjectTask(projectId);
  const deleteMutation = useDeleteProjectTask(projectId);
  const updateMutation = useUpdateProjectTask(projectId);
  const projectName =
    typeof id === "string"
      ? id === "fau"
        ? "FAU"
        : id.charAt(0).toUpperCase() + id.slice(1)
      : "";

  const [taskStatus, setTaskStatus] = useState<TaskStatus>(
    TaskStatus.IN_PROGRESS,
  );
  const [assignTask, setAssignTask] = useState("");
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editTaskStatus, setEditTaskStatus] = useState<TaskStatus>(
    TaskStatus.IN_PROGRESS,
  );
  const [editAssignTask, setEditAssignTask] = useState("");
  const [editMeetingTime, setEditMeetingTime] = useState<Date | null>(null);
  const [editMeetingPurpose, setEditMeetingPurpose] = useState("");

  const [meetingTime, setMeetingTime] = useState<Date | null>(null);
  const [meetingPurpose, setMeetingPurpose] = useState("");
  const [historyOpened, setHistoryOpened] = useState(false);
  useEffect(() => {
    setMeetingTime(
      meetingQuery.data?.meetingTime
        ? new Date(meetingQuery.data.meetingTime)
        : null,
    );
    setMeetingPurpose(meetingQuery.data?.meetingPurpose ?? "");
  }, [meetingQuery.data]);

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

  const renderTasksTable = (tasks: any[]) => (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Date</Table.Th>
          <Table.Th>Task</Table.Th>
          <Table.Th>Meeting Time</Table.Th>
          <Table.Th>Meeting Purpose</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {tasks.map((task) => (
          <Table.Tr key={task.id}>
            <Table.Td>{new Date(task.createdAt).toLocaleDateString()}</Table.Td>
            <Table.Td>
              {editingRow === task.id ? (
                <Textarea
                  value={editAssignTask}
                  onChange={(e) => setEditAssignTask(e.currentTarget.value)}
                  autosize
                  minRows={1}
                />
              ) : (
                <Text style={{ whiteSpace: "pre-wrap" }} size="sm">
                  {task.assignTask}
                </Text>
              )}
            </Table.Td>
            <Table.Td>
              {editingRow === task.id ? (
                <DateTimePicker
                  value={editMeetingTime}
                  onChange={setEditMeetingTime}
                  clearable
                />
              ) : (
                <Text size="sm">
                  {task.meetingTime
                    ? new Date(task.meetingTime).toLocaleString()
                    : "-"}
                </Text>
              )}
            </Table.Td>
            <Table.Td>
              {editingRow === task.id ? (
                <Textarea
                  value={editMeetingPurpose}
                  onChange={(e) => setEditMeetingPurpose(e.currentTarget.value)}
                  autosize
                  minRows={1}
                />
              ) : (
                <Text style={{ whiteSpace: "pre-wrap" }} size="sm">
                  {task.meetingPurpose || "-"}
                </Text>
              )}
            </Table.Td>
            <Table.Td>
              {editingRow === task.id ? (
                <NativeSelect
                  data={[
                    { label: "In Progress", value: TaskStatus.IN_PROGRESS },
                    { label: "Completed", value: TaskStatus.COMPLETED },
                  ]}
                  value={editTaskStatus}
                  onChange={(event) =>
                    setEditTaskStatus(event.currentTarget.value as TaskStatus)
                  }
                  size="xs"
                  style={{ width: 140 }}
                />
              ) : (
                <Tooltip
                  label={
                    task.taskStatus === "COMPLETED"
                      ? `Completed on: ${new Date(task.updatedAt).toLocaleDateString()}`
                      : task.taskStatus
                  }
                  withArrow
                >
                  <Box style={{ cursor: "help", display: "inline-flex" }}>
                    {task.taskStatus === "IN_PROGRESS" ? (
                      <IconHourglass size={20} color="orange" />
                    ) : task.taskStatus === "COMPLETED" ? (
                      <IconCheck size={20} color="green" />
                    ) : (
                      <IconForbid2 size={20} color="red" />
                    )}
                  </Box>
                </Tooltip>
              )}
            </Table.Td>
            <Table.Td>
              <Group gap="xs" wrap="nowrap">
                {editingRow === task.id ? (
                  <>
                    <ActionIcon
                      color="green"
                      variant="light"
                      onClick={() => {
                        updateMutation.mutate(
                          {
                            id: task.id,
                            taskStatus: editTaskStatus,
                            assignTask: editAssignTask,
                            meetingTime: editMeetingTime,
                            meetingPurpose: editMeetingPurpose,
                          },
                          {
                            onError: (err) =>
                              console.error("Update failed", err),
                            onSuccess: () => setEditingRow(null),
                          },
                        );
                      }}
                    >
                      <IconDeviceFloppy size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="gray"
                      variant="light"
                      onClick={() => setEditingRow(null)}
                    >
                      <IconForbid2 size={16} />
                    </ActionIcon>
                  </>
                ) : (
                  <>
                    <ActionIcon
                      color="blue"
                      variant="light"
                      onClick={() => {
                        setEditingRow(task.id);
                        setEditTaskStatus(task.taskStatus);
                        setEditAssignTask(task.assignTask);
                        setEditMeetingTime(
                          task.meetingTime ? new Date(task.meetingTime) : null,
                        );
                        setEditMeetingPurpose(task.meetingPurpose || "");
                      }}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() => deleteMutation.mutate(task.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </>
                )}
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
        {tasks.length === 0 && (
          <Table.Tr>
            <Table.Td colSpan={4}>
              <Text c="dimmed" size="sm" ta="center" py="md">
                No tasks available
              </Text>
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );

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
              <Group align="flex-end" wrap="nowrap">
                <Textarea
                  label="Client Requirements"
                  placeholder="Enter task to assign"
                  value={assignTask}
                  onChange={(e) => setAssignTask(e.currentTarget.value)}
                  autosize
                  minRows={3}
                  maxRows={6}
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
              {taskQuery.data && taskQuery.data.length > 5 && (
                <Button
                  variant="light"
                  size="xs"
                  onClick={() => setHistoryOpened(true)}
                >
                  More
                </Button>
              )}
            </Group>

            <Divider my="sm" />

            {renderTasksTable(taskQuery.data?.slice(0, 5) || [])}
          </Card>
        </Stack>

        <Modal
          opened={historyOpened}
          onClose={() => setHistoryOpened(false)}
          title={<Text fw={600}>Task History - {projectName}</Text>}
          size="lg"
        >
          {renderTasksTable(taskQuery.data || [])}
        </Modal>
      </DashboardLayout>
    </AuthGuard>
  );
}
