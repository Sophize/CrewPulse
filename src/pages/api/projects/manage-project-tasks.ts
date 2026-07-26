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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TaskResponse | TaskResponse[]> | string>
) {
  try {
    try {
      await getAuthenticatedUser(req);
    } catch {
      return res.status(401).send("Couldn't find or decode user token");
    }

    if (req.method === "GET") {
      const projectId = req.query.projectId;

      if (!projectId) {
        return res.status(422).send("projectId is required");
      }

      const project = await prisma.project.findUnique({
        where: { id: String(projectId) },
      });

      if (!project) {
        return res.status(404).send("Project not found");
      }

      const tasks = await prisma.task.findMany({
        where: { projectId: String(projectId) },
        orderBy: { createdAt: "desc" },
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

      return sendSuccess(
        res,
        tasks.map((t) => ({
          id: t.id,
          taskDescription: t.taskDescription,
          status: t.status,
          completedAt: t.completedAt ? t.completedAt.toISOString() : null,
          TaskDescriptionUpdatedAt: t.TaskDescriptionUpdatedAt
            ? t.TaskDescriptionUpdatedAt.toISOString()
            : null,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
        })),
      );
    }

    if (req.method === "POST") {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { taskDescription, projectId } = body;

      if (!projectId) {
        return res.status(422).send("projectId is required");
      }

      const project = await prisma.project.findUnique({
        where: { id: String(projectId) },
      });

      if (!project) {
        return res.status(404).send("Project not found");
      }

      if (!taskDescription?.trim()) {
        return res.status(422).send("Task description is required");
      }

      const task = await prisma.task.create({
        data: {
          taskDescription: taskDescription.trim(),
          projectId: String(projectId),
          status: "IN_PROGRESS",
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

      return sendSuccess(
        res,
        {
          id: task.id,
          taskDescription: task.taskDescription,
          status: task.status,
          completedAt: task.completedAt ? task.completedAt.toISOString() : null,
          TaskDescriptionUpdatedAt: task.TaskDescriptionUpdatedAt
            ? task.TaskDescriptionUpdatedAt.toISOString()
            : null,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
        },
        201,
      );
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).send("Method not allowed");
  } catch (error) {
    console.error("Project tasks API error:", error);
    return res.status(500).send("Internal server error");
  }
}
