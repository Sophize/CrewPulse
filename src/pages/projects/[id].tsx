import { useRouter } from "next/router";
import { useState } from "react";
import {
  Box,
  Text,
  Textarea,
  Button,
  Table,
  Select,
  Group,
  ActionIcon,
  Paper,
  Loader,
  Alert,
  Badge,
  Tooltip,
} from "@mantine/core";
import {
  IconTrash,
  IconPencil,
  IconAlertCircle,
  IconDeviceFloppy,
} from "@tabler/icons-react";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout";
import { PageHeader } from "@/components/ui";

import {
  useProjects,
  useProjectTasks,
  useCreateProjectTask,
  useUpdateProjectTask,
  useDeleteProjectTask,
} from "@/hooks/useProjectTasks";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusColor(status: string) {
  switch (status) {
    case "COMPLETED":
      return "green";
    case "BLOCKED":
      return "red";
    case "IN_PROGRESS":
    default:
      return "blue";
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "COMPLETED":
      return "Completed";
    case "BLOCKED":
      return "Blocked";
    case "IN_PROGRESS":
    default:
      return "In Progress";
  }
}

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;
  const projectId = String(id || "");

  const { data: projects = [], isLoading: isProjectsLoading } = useProjects();
  const currentProject = projects.find((p) => p.id === projectId);

  const {
    data: tasks = [],
    isLoading: isTasksLoading,
    error,
  } = useProjectTasks(projectId);

  const createMutation = useCreateProjectTask(projectId);
  const updateMutation = useUpdateProjectTask(projectId);
  const deleteMutation = useDeleteProjectTask(projectId);

  const [newTaskText, setNewTaskText] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingStatus, setEditingStatus] = useState<string>("");

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    await createMutation.mutateAsync(newTaskText.trim());
    setNewTaskText("");
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteMutation.mutateAsync(taskId);
  };

  const handleStartEdit = (
    taskId: string,
    currentText: string,
    currentStatus: string,
  ) => {
    setEditingTaskId(taskId);
    setEditingText(currentText);
    setEditingStatus(currentStatus);
  };

  const handleSaveEdit = async (taskId: string) => {
    if (!editingText.trim()) return;
    await updateMutation.mutateAsync({
      taskId,
      updates: { taskDescription: editingText.trim(), status: editingStatus },
    });
    setEditingTaskId(null);
    setEditingText("");
    setEditingStatus("");
  };

  return (
    <AuthGuard>
      <DashboardLayout
        title={currentProject?.name || "Project Details"}
        breadcrumbs={[
          { label: "Project Status" },
          { label: currentProject?.name || "Project" },
        ]}
      >
        <PageHeader
          title={
            currentProject?.name
              ? `Project Status - ${currentProject.name}`
              : "Project Details"
          }
          subtitle={`Manage tasks for ${currentProject?.name || "project"}`}
        />

        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            mb="md"
          >
            Failed to load tasks.
          </Alert>
        )}

        <Paper p="lg" mb="lg" withBorder radius="md">
          <form onSubmit={handleCreateTask}>
            <Text
              fw={500}
              mb="xs"
              size="sm"
              c="dimmed"
              tt="uppercase"
              style={{ letterSpacing: "0.05em" }}
            >
              Task Description
            </Text>
            <Textarea
              placeholder="Enter task description..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.currentTarget.value)}
              minRows={2}
              autosize
              mb="md"
              styles={{
                input: {
                  fontSize: "0.875rem",
                },
              }}
            />
            <Group>
              <Button
                type="submit"
                leftSection={<IconDeviceFloppy size={16} />}
                loading={createMutation.isPending}
                variant="filled"
              >
                Save
              </Button>
            </Group>
          </form>
        </Paper>

        {isTasksLoading || isProjectsLoading ? (
          <Box style={{ textAlign: "center" }} py="xl">
            <Loader size="md" />
          </Box>
        ) : (
          <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
            <Box
              px="md"
              py="sm"
              style={{
                borderBottom: "1px solid var(--mantine-color-default-border)",
              }}
            >
              <Text fw={600} size="sm">
                Task List
              </Text>
            </Box>
            <Table highlightOnHover verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: 130 }}>DATE</Table.Th>
                  <Table.Th>TASK DESCRIPTION</Table.Th>
                  <Table.Th style={{ width: 150 }}>STATUS</Table.Th>
                  <Table.Th style={{ width: 100, textAlign: "right" }}>
                    ACTIONS
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {tasks.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text c="dimmed" ta="center" py="md">
                        No tasks found for this project.
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  tasks.map((task) => (
                    <Table.Tr key={task.id}>
                      {/* Date */}
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {formatDate(task.createdAt)}
                        </Text>
                      </Table.Td>

                      <Table.Td>
                        {editingTaskId === task.id ? (
                          <Textarea
                            value={editingText}
                            onChange={(e) =>
                              setEditingText(e.currentTarget.value)
                            }
                            autosize
                            minRows={1}
                            size="xs"
                            autoFocus
                          />
                        ) : (
                          <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                            {task.taskDescription}
                          </Text>
                        )}
                      </Table.Td>

                      {/* Status */}
                      <Table.Td>
                        {editingTaskId === task.id ? (
                          <Select
                            size="xs"
                            value={editingStatus}
                            onChange={(val) => val && setEditingStatus(val)}
                            data={[
                              { value: "BLOCKED", label: "Blocked" },
                              { value: "IN_PROGRESS", label: "In Progress" },
                              { value: "COMPLETED", label: "Completed" },
                            ]}
                            style={{ width: 140 }}
                          />
                        ) : (
                          <Tooltip
                            label={
                              task.status === "COMPLETED" && task.completedAt
                                ? `Completed on ${formatDate(task.completedAt)}`
                                : statusLabel(task.status)
                            }
                            withArrow
                            disabled={
                              task.status !== "COMPLETED" || !task.completedAt
                            }
                          >
                            <Badge
                              color={statusColor(task.status)}
                              variant="light"
                              size="sm"
                              style={{
                                cursor:
                                  task.status === "COMPLETED"
                                    ? "help"
                                    : "default",
                              }}
                            >
                              {statusLabel(task.status)}
                            </Badge>
                          </Tooltip>
                        )}
                      </Table.Td>

                      <Table.Td>
                        <Group gap={4} justify="flex-end">
                          {editingTaskId === task.id ? (
                            <ActionIcon
                              color="blue"
                              variant="subtle"
                              onClick={() => handleSaveEdit(task.id)}
                              loading={updateMutation.isPending}
                            >
                              <IconDeviceFloppy size={16} />
                            </ActionIcon>
                          ) : (
                            <ActionIcon
                              color="gray"
                              variant="subtle"
                              onClick={() =>
                                handleStartEdit(
                                  task.id,
                                  task.taskDescription,
                                  task.status,
                                )
                              }
                            >
                              <IconPencil size={16} />
                            </ActionIcon>
                          )}
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => handleDeleteTask(task.id)}
                            loading={deleteMutation.isPending}
                            disabled={editingTaskId === task.id}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Paper>
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
