import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/utils/api";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ApiResponse } from "@/utils/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null> | string>,
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
    const { taskId, projectId } = body;

    if (!taskId || !projectId) {
      return res.status(422).send("taskId and projectId are required");
    }

    const tId = String(taskId);
    const pId = String(projectId);

    const existingTask = await prisma.task.findFirst({
      where: { id: tId, projectId: pId },
      select: { id: true },
    });

    if (!existingTask) {
      return res.status(404).send("Task not found");
    }

    await prisma.task.delete({
      where: { id: tId },
    });

    return sendSuccess(res, null);
  } catch (error) {
    console.error("Delete task API error:", error);
    return res.status(500).send("Internal server error");
  }
}
