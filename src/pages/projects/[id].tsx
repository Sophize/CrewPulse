import { useState } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Table,
  Text,
  Textarea,
  Badge,
  rem,
  Skeleton,
  ActionIcon,
  Group,
  Select,
  Tooltip,
} from "@mantine/core";
import {
  IconDeviceFloppy,
  IconListCheck,
  IconPencil,
  IconTrash,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

import { DashboardLayout } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import {
  useProjectTasks,
  useCreateProjectTask,
  useUpdateProjectTask,
  useDeleteProjectTask,
} from "@/hooks/useProjectTasks";
import { useProjects } from "@/hooks/useProjectTasks";
import { formatDate } from "@/lib/formatters";

const STATUS_META: Record<string, { label: string; color: string }> = {
  BLOCKED: { label: "Blocked", color: "red" },
  IN_PROGRESS: { label: "In Progress", color: "blue" },
  COMPLETED: { label: "Completed", color: "green" },
};

const STATUS_OPTIONS = [
  { value: "BLOCKED", label: "Blocked" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

interface EditState {
  taskId: string;
  taskDescription: string;
  status: string;
}

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;
  const projectId = String(id ?? "");

  const [taskDescription, setTaskDescription] = useState("");
  const [editState, setEditState] = useState<EditState | null>(null);

  const projectsQuery = useProjects();
  const tasksQuery = useProjectTasks(projectId);
  const createTask = useCreateProjectTask(projectId);
  const updateTask = useUpdateProjectTask(projectId);
  const deleteTask = useDeleteProjectTask(projectId);

  const project = projectsQuery.data?.find((p) => p.id === projectId);
  const projectName = project?.name ?? "Project";

  const handleSave = async () => {
    if (!taskDescription.trim()) return;
    try {
      await createTask.mutateAsync(taskDescription.trim());
      setTaskDescription("");
    } catch {}
  };

  const handleEditStart = (task: {
    id: string;
    taskDescription: string;
    status: string;
  }) => {
    setEditState({
      taskId: task.id,
      taskDescription: task.taskDescription,
      status: task.status,
    });
  };

  const handleEditCancel = () => {
    setEditState(null);
  };

  const handleEditSave = async () => {
    if (!editState) return;
    try {
      await updateTask.mutateAsync({
        taskId: editState.taskId,
        updates: {
          taskDescription: editState.taskDescription,
          status: editState.status,
        },
      });
      setEditState(null);
    } catch {}
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask.mutateAsync(taskId);
    } catch {}
  };

  const tasks = tasksQuery.data ?? [];

  const isEditingSaving = updateTask.isPending;
  return (
    <AuthGuard>
      <DashboardLayout
        title={`Project Status - ${projectName}`}
        breadcrumbs={[
          { label: "Project Status", href: "/projects" },
          { label: projectName },
        ]}
      >
        <PageHeader
          title={`Project Status - ${projectName}`}
          subtitle={`Manage tasks for ${projectName}`}
        />

        {tasksQuery.isError && (
          <Alert color="red" mb="md" title="Failed to load tasks">
            Could not fetch tasks for this project. Please try again.
          </Alert>
        )}
        <Paper withBorder radius="md" p="lg" mb="lg">
          <Stack gap="md">
            <Text fw={600} size="sm">
              Task Description
            </Text>

            <Textarea
              placeholder="Enter task description..."
              minRows={4}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.currentTarget.value)}
              disabled={createTask.isPending}
            />

            <Box>
              <Button
                leftSection={<IconDeviceFloppy size={16} stroke={1.5} />}
                loading={createTask.isPending}
                onClick={handleSave}
              >
                Save
              </Button>
            </Box>
          </Stack>
        </Paper>
        <Box>
          <Text fw={600} size="sm" mb="sm">
            Task List
          </Text>

          <Paper withBorder radius="sm" style={{ overflow: "hidden" }}>
            <Table highlightOnHover>
              <Table.Thead
                style={{ background: "var(--mantine-color-gray-0)" }}
              >
                <Table.Tr>
                  <Table.Th>
                    <Text
                      size="xs"
                      fw={600}
                      c="dimmed"
                      tt="uppercase"
                      style={{ letterSpacing: "0.05em" }}
                    >
                      Date
                    </Text>
                  </Table.Th>
                  <Table.Th>
                    <Text
                      size="xs"
                      fw={600}
                      c="dimmed"
                      tt="uppercase"
                      style={{ letterSpacing: "0.05em" }}
                    >
                      Task Description
                    </Text>
                  </Table.Th>
                  <Table.Th>
                    <Text
                      size="xs"
                      fw={600}
                      c="dimmed"
                      tt="uppercase"
                      style={{ letterSpacing: "0.05em" }}
                    >
                      Status
                    </Text>
                  </Table.Th>
                  <Table.Th style={{ width: rem(96) }}>
                    <Text
                      size="xs"
                      fw={600}
                      c="dimmed"
                      tt="uppercase"
                      style={{ letterSpacing: "0.05em" }}
                    >
                      Actions
                    </Text>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {tasksQuery.isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Table.Tr key={i}>
                      <Table.Td>
                        <Skeleton height={16} width={80} />
                      </Table.Td>
                      <Table.Td>
                        <Skeleton height={16} width={200} />
                      </Table.Td>
                      <Table.Td>
                        <Skeleton height={16} width={80} />
                      </Table.Td>
                      <Table.Td>
                        <Skeleton height={16} width={60} />
                      </Table.Td>
                    </Table.Tr>
                  ))
                ) : tasks.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Box py="xl" style={{ textAlign: "center" }}>
                        <IconListCheck
                          size={32}
                          stroke={1}
                          style={{
                            color: "var(--mantine-color-dimmed)",
                            marginBottom: rem(8),
                          }}
                        />
                        <Text size="sm" c="dimmed">
                          No tasks available
                        </Text>
                      </Box>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  tasks.map((task) => {
                    const isEditing = editState?.taskId === task.id;
                    const meta =
                      STATUS_META[task.status] ?? STATUS_META.IN_PROGRESS;
                    return (
                      <Table.Tr key={task.id}>
                        <Table.Td>
                          <Text
                            size="sm"
                            c="dimmed"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {formatDate(task.createdAt)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          {isEditing ? (
                            <Textarea
                              size="xs"
                              value={editState!.taskDescription}
                              onChange={(e) => {
                                const val = e.currentTarget.value;
                                setEditState((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        taskDescription: val,
                                      }
                                    : prev,
                                );
                              }}
                              disabled={isEditingSaving}
                              autosize
                              minRows={1}
                              style={{ minWidth: rem(200) }}
                            />
                          ) : (
                            <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                              {task.taskDescription}
                            </Text>
                          )}
                        </Table.Td>
                        <Table.Td>
                          {isEditing ? (
                            <Select
                              size="xs"
                              data={STATUS_OPTIONS}
                              value={editState!.status}
                              onChange={(val) =>
                                setEditState((prev) =>
                                  prev && val ? { ...prev, status: val } : prev,
                                )
                              }
                              disabled={isEditingSaving}
                              style={{ minWidth: rem(140) }}
                              allowDeselect={false}
                            />
                          ) : task.status === "COMPLETED" ? (
                            <Tooltip
                              label={`Completed on ${formatDate(task.updatedAt)}`}
                              withArrow
                            >
                              <Badge
                                color={meta.color}
                                variant="light"
                                styles={{
                                  label: {
                                    textTransform: "none",
                                    cursor: "pointer",
                                  },
                                }}
                              >
                                {meta.label}
                              </Badge>
                            </Tooltip>
                          ) : (
                            <Badge
                              color={meta.color}
                              variant="light"
                              styles={{ label: { textTransform: "none" } }}
                            >
                              {meta.label}
                            </Badge>
                          )}
                        </Table.Td>
                        <Table.Td>
                          {isEditing ? (
                            <Group gap={4} wrap="nowrap">
                              <Tooltip label="Save changes" withArrow>
                                <ActionIcon
                                  size="sm"
                                  color="green"
                                  variant="light"
                                  loading={isEditingSaving}
                                  onClick={handleEditSave}
                                  aria-label="Save task"
                                >
                                  <IconCheck size={14} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Cancel" withArrow>
                                <ActionIcon
                                  size="sm"
                                  color="gray"
                                  variant="light"
                                  onClick={handleEditCancel}
                                  disabled={isEditingSaving}
                                  aria-label="Cancel edit"
                                >
                                  <IconX size={14} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          ) : (
                            <Group gap={4} wrap="nowrap">
                              <Tooltip label="Edit task" withArrow>
                                <ActionIcon
                                  size="sm"
                                  color="blue"
                                  variant="subtle"
                                  onClick={() => handleEditStart(task)}
                                  aria-label="Edit task"
                                >
                                  <IconPencil size={14} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Delete task" withArrow>
                                <ActionIcon
                                  size="sm"
                                  color="red"
                                  variant="subtle"
                                  loading={
                                    deleteTask.isPending &&
                                    deleteTask.variables === task.id
                                  }
                                  onClick={() => handleDelete(task.id)}
                                  aria-label="Delete task"
                                >
                                  <IconTrash size={14} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    );
                  })
                )}
              </Table.Tbody>
            </Table>
          </Paper>
        </Box>
      </DashboardLayout>
    </AuthGuard>
  );
}
