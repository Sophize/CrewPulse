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
  ActionIcon,
  Tooltip,
  Table,
  Divider,
  Box,
  Modal,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import { IconCalendar, IconDeviceFloppy } from "@tabler/icons-react";
import {
  useProjectTasks,
  useCreateProjectTask,
  useDeleteProjectTask,
  useSaveProjectMeeting,
  useProjectMeeting,
} from "@/hooks/useProjectTasks";

import { IconTrash } from "@tabler/icons-react";
import { TaskStatus } from "@prisma/client";
import {
  TASK_STATUS_OPTIONS,
  getTaskStatusColor,
  getTaskStatusIcon,
} from "@/utils/task";

export default function ProjectStatusPage() {
  const router = useRouter();
  const { id } = router.query;
  const projectId = typeof id === "string" ? id : "";

  const taskQuery = useProjectTasks(projectId);
  const meetingQuery = useProjectMeeting(projectId);

  const createMutation = useCreateProjectTask(projectId);
  const deleteMutation = useDeleteProjectTask(projectId);
  const meetingMutation = useSaveProjectMeeting(projectId);

  const projectName =
    typeof id === "string"
      ? id === "fau"
        ? "FAU"
        : id.charAt(0).toUpperCase() + id.slice(1)
      : "";

  const [taskStatus, setTaskStatus] = useState<TaskStatus>(TaskStatus.BLOCKED);
  const [assignTask, setAssignTask] = useState("");
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

  const handleSaveMeeting = async () => {
    await meetingMutation.mutateAsync({
      projectName: projectId,
      meetingTime,
      meetingPurpose,
    });
  };

  const renderTasksTable = (tasks: any[]) => (
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
        {tasks.map((task) => (
          <Table.Tr key={task.id}>
            <Table.Td>{new Date(task.createdAt).toLocaleDateString()}</Table.Td>
            <Table.Td>{task.assignTask}</Table.Td>
            <Table.Td>
              <Tooltip label={task.taskStatus} withArrow>
                <Box style={{ cursor: "help", display: "inline-flex" }}>
                  {getTaskStatusIcon(task.taskStatus)}
                </Box>
              </Tooltip>
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
              <Text fw={500}>Task Status</Text>

              <div>
                <SegmentedControl
                  fullWidth
                  value={taskStatus}
                  onChange={(value) => setTaskStatus(value as TaskStatus)}
                  data={TASK_STATUS_OPTIONS}
                  color={getTaskStatusColor(taskStatus)}
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
                rightSection={
                  <Tooltip label="Save meeting time" withArrow>
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      loading={meetingMutation.isPending}
                      onClick={handleSaveMeeting}
                    >
                      <IconDeviceFloppy size={16} />
                    </ActionIcon>
                  </Tooltip>
                }
              />

              <Textarea
                label="Meeting Purpose"
                placeholder="e.g. Weekly Sync"
                value={meetingPurpose}
                onChange={(e) => setMeetingPurpose(e.currentTarget.value)}
                minRows={4}
                autosize
                rightSection={
                  <Tooltip label="Save meeting purpose" withArrow>
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      loading={meetingMutation.isPending}
                      onClick={handleSaveMeeting}
                    >
                      <IconDeviceFloppy size={16} />
                    </ActionIcon>
                  </Tooltip>
                }
                rightSectionPointerEvents="all"
              />
            </Stack>
          </Card>
          <Card withBorder mt="lg">
            <Group justify="space-between">
              <Text fw={600}>Assigned Tasks</Text>

              <Button
                variant="light"
                size="xs"
                onClick={() => setHistoryOpened(true)}
              >
                History
              </Button>
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
