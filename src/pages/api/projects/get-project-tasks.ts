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
  res: NextApiResponse<ApiResponse<TaskResponse[]> | string>,
) {
  try {
    await getAuthenticatedUser(req);
  } catch {
    return res.status(401).send("Couldn't find or decode user token");
  }
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).send("Method not allowed");
    }

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
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })),
    );
  } catch (error) {
    console.error("Get project tasks API error:", error);
    return res.status(500).send("Internal server error");
  }
}
