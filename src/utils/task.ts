import { TaskStatus } from "@prisma/client";
import { IconForbid2, IconHourglass, IconCheck } from "@tabler/icons-react";
import { createElement } from "react";

export const TASK_STATUS_OPTIONS = [
  { label: "Blocked", value: TaskStatus.BLOCKED },
  { label: "Tasks In Progress", value: TaskStatus.IN_PROGRESS },
  { label: "All Tasks Completed", value: TaskStatus.COMPLETED },
];

export const TASK_STATUS_META: Record<
  TaskStatus,
  { label: string; color: string; icon: "blocked" | "hourglass" | "check" }
> = {
  BLOCKED: {
    label: "blocked",
    color: "red",
    icon: "blocked",
  },
  IN_PROGRESS: {
    label: "In progress",
    color: "blue",
    icon: "hourglass",
  },
  COMPLETED: {
    label: "Completed",
    color: "green",
    icon: "check",
  },
};

export const STATUS_ICON_MAP = {
  blocked: createElement(IconForbid2, { size: 20, color: "red" }),
  hourglass: createElement(IconHourglass, { size: 20, color: "orange" }),
  check: createElement(IconCheck, { size: 20, color: "green" }),
};

export const TASK_STATUS_ORDER: Record<TaskStatus, number> = {
  BLOCKED: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
};

export function getTaskStatusColor(status: TaskStatus | string) {
  switch (status) {
    case TaskStatus.BLOCKED:
    case "BLOCKED":
      return "#dc2626"; // red
    case TaskStatus.IN_PROGRESS:
    case "IN_PROGRESS":
      return "blue";
    case TaskStatus.COMPLETED:
    case "COMPLETED":
      return "green";
    default:
      return "gray";
  }
}

export function getTaskStatusIcon(status: TaskStatus | string) {
  const key = TASK_STATUS_META[status as TaskStatus]?.icon ?? "blocked";
  return STATUS_ICON_MAP[key];
}
