export interface FormattableTask {
  id: string;
  taskDescription: string;
  status: string;
  completedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export function formatTask(task: FormattableTask) {
  return {
    id: task.id,
    taskDescription: task.taskDescription,
    status: task.status,
    completedAt: task.completedAt
      ? typeof task.completedAt === "string"
        ? task.completedAt
        : task.completedAt.toISOString()
      : null,
    createdAt:
      typeof task.createdAt === "string"
        ? task.createdAt
        : task.createdAt.toISOString(),
    updatedAt:
      typeof task.updatedAt === "string"
        ? task.updatedAt
        : task.updatedAt.toISOString(),
  };
}
