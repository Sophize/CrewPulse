import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/utils/api";
import type { ApiResponse } from "@/utils/api";
import { getAuthenticatedUser } from "@/lib/auth";

interface TaskResponse {
  id: string;
  taskDescription: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const VALID_STATUSES = ["BLOCKED", "IN_PROGRESS", "COMPLETED"] as const;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TaskResponse | null>>,
) {
  try {
    await getAuthenticatedUser(req);

    const { id, taskId } = req.query;
    const projectId = String(id);
    const tId = String(taskId);
    const task = await prisma.task.findFirst({
      where: { id: tId, projectId },
    });

    if (!task) {
      return sendError(res, "Task not found", 404);
    }

    if (req.method === "PATCH") {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { taskDescription, status } = body as {
        taskDescription?: string;
        status?: string;
      };

      if (
        status &&
        !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])
      ) {
        return sendError(res, "Invalid status value", 400);
      }

      const updated = await prisma.task.update({
        where: { id: tId },
        data: {
          ...(taskDescription?.trim()
            ? { taskDescription: taskDescription.trim() }
            : {}),
          ...(status
            ? { status: status as "BLOCKED" | "IN_PROGRESS" | "COMPLETED" }
            : {}),
        },
      });

      return sendSuccess(res, {
        id: updated.id,
        taskDescription: updated.taskDescription,
        status: updated.status,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      });
    }

    if (req.method === "DELETE") {
      await prisma.task.delete({ where: { id: tId } });
      return sendSuccess(res, null);
    }

    res.setHeader("Allow", ["PATCH", "DELETE"]);
    return sendError(res, "Method not allowed", 405);
  } catch (error) {
    console.error("Task API error:", error);
    return sendError(res, "Internal server error", 500);
  }
}
