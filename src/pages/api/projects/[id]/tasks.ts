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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TaskResponse | TaskResponse[]>>,
) {
  try {
    await getAuthenticatedUser(req);

    const { id } = req.query;
    const projectId = String(id);
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return sendError(res, "Project not found", 404);
    }

    if (req.method === "GET") {
      const tasks = await prisma.task.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
      });

      return sendSuccess(
        res,
        tasks.map((t) => ({
          id: t.id,
          taskDescription: t.taskDescription,
          status: t.status,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
        })),
      );
    }

    if (req.method === "POST") {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { taskDescription } = body;

      if (!taskDescription?.trim()) {
        return sendError(res, "Task description is required", 400);
      }

      const task = await prisma.task.create({
        data: {
          taskDescription: taskDescription.trim(),
          projectId,
          status: "IN_PROGRESS",
        },
      });

      return sendSuccess(
        res,
        {
          id: task.id,
          taskDescription: task.taskDescription,
          status: task.status,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
        },
        201,
      );
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return sendError(res, "Method not allowed", 405);
  } catch (error) {
    console.error("Project tasks API error:", error);
    return sendError(res, "Internal server error", 500);
  }
}
