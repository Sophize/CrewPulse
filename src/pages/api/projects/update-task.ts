import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/utils/api";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ApiResponse } from "@/utils/api";

interface TaskResponse {
  id: string;
  taskDescription: string;
  status: string;
  completedAt?: string | null;
  TaskDescriptionUpdatedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

const VALID_STATUSES = ["BLOCKED", "IN_PROGRESS", "COMPLETED"] as const;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TaskResponse | null> | string>,
) {
  try {
    try {
      await getAuthenticatedUser(req);
    } catch {
      return res.status(401).send("Couldn't find or decode user token");
    }

    if (req.method === "POST") {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { action, taskDescription, status, taskId, projectId } = body;

      if (!taskId || !projectId) {
        return res.status(422).send("taskId and projectId are required");
      }

      const tId = String(taskId);
      const pId = String(projectId);

      const existingTask = await prisma.task.findFirst({
        where: { id: tId, projectId: pId },
        select: {
          id: true,
          taskDescription: true,
        },
      });

      if (!existingTask) {
        return res.status(404).send("Task not found");
      }

      if (action === "DELETE") {
        await prisma.task.delete({ where: { id: tId } });
        return sendSuccess(res, null);
      }

      if (
        status &&
        !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])
      ) {
        return res.status(422).send("Invalid status value");
      }

      const newStatus = status as
        | "BLOCKED"
        | "IN_PROGRESS"
        | "COMPLETED"
        | undefined;
      const descriptionChanged =
        taskDescription !== undefined &&
        taskDescription.trim() !== existingTask.taskDescription;

      const completedAtUpdate =
        newStatus === "COMPLETED" ? new Date() : newStatus ? null : undefined;

      const taskDescUpdatedAt = descriptionChanged ? new Date() : undefined;

      const updated = await prisma.task.update({
        where: { id: tId },
        data: {
          ...(taskDescription?.trim()
            ? { taskDescription: taskDescription.trim() }
            : {}),
          ...(newStatus ? { status: newStatus } : {}),
          ...(completedAtUpdate !== undefined
            ? { completedAt: completedAtUpdate }
            : {}),
          ...(taskDescUpdatedAt !== undefined
            ? { TaskDescriptionUpdatedAt: taskDescUpdatedAt }
            : {}),
        },
        select: {
          id: true,
          taskDescription: true,
          status: true,
          completedAt: true,
          TaskDescriptionUpdatedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return sendSuccess(res, {
        id: updated.id,
        taskDescription: updated.taskDescription,
        status: updated.status,
        completedAt: updated.completedAt
          ? updated.completedAt.toISOString()
          : null,
        TaskDescriptionUpdatedAt: updated.TaskDescriptionUpdatedAt
          ? updated.TaskDescriptionUpdatedAt.toISOString()
          : null,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      });
    }

    res.setHeader("Allow", ["POST"]);
    return res.status(405).send("Method not allowed");
  } catch (error) {
    console.error("Task API error:", error);
    return res.status(500).send("Internal server error");
  }
}
