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
  createdAt: string;
  updatedAt: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TaskResponse> | string>,
) {
  try {
    await getAuthenticatedUser(req);
  } catch {
    return res.status(401).send("Couldn't find or decode user token");
  }
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).send("Method not allowed");
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
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
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      },
      201,
    );
  } catch (error) {
    console.error("Create project task API error:", error);
    return res.status(500).send("Internal server error");
  }
}
