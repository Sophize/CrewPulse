import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/utils/api";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ApiResponse } from "@/utils/api";
import { formatTask } from "@/utils/formatters";

const VALID_STATUSES = ["BLOCKED", "IN_PROGRESS", "COMPLETED"] as const;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ReturnType<typeof formatTask>> | string>,
) {
  try {
    try {
      await getAuthenticatedUser(req);
    } catch {
      return res.status(401).send("Couldn't find or decode user token");
    }

    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).send("Method not allowed");
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { taskDescription, status, taskId, projectId } = body;

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

    const completedAtUpdate =
      newStatus === "COMPLETED" ? new Date() : newStatus ? null : undefined;

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
      },
      select: {
        id: true,
        taskDescription: true,
        status: true,
        completedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return sendSuccess(res, formatTask(updated));
  } catch (error) {
    console.error("Task API error:", error);
    return res.status(500).send("Internal server error");
  }
}
