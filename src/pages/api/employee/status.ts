import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { sendSuccess, sendError } from "../../../utils/api";
import {
  validateTaskStatus,
  sanitizeLearningString,
} from "../../../utils/employee";
import type { ApiResponse } from "../../../utils/api";
import type { TaskStatus } from "@prisma/client";

interface StatusResponse {
  taskStatus: string;
  currentLearning: string | null;
  updatedAt: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<StatusResponse>>,
) {
  try {
    const employee = await prisma.user.findFirst({
      where: { role: "EMPLOYEE" },
      orderBy: { createdAt: "asc" },
    });

    if (!employee) {
      return sendError(res, "No employee found in database", 404);
    }

    if (req.method === "GET") {
      const user = await prisma.user.findUnique({
        where: { id: employee.id },
      });

      if (!user) {
        return sendError(res, "User not found", 404);
      }

      return sendSuccess(res, {
        taskStatus: user.taskStatus,
        currentLearning: user.currentLearning,
        updatedAt: user.updatedAt.toISOString(),
      });
    }

    if (req.method === "PUT") {
      const { taskStatus, currentLearning } = req.body;

      const validation = validateTaskStatus(taskStatus);
      if (!validation.valid) {
        return sendError(res, validation.error!, 400);
      }

      const sanitized = sanitizeLearningString(currentLearning);

      const updated = await prisma.user.update({
        where: { id: employee.id },
        data: {
          taskStatus: taskStatus as TaskStatus,
          currentLearning: sanitized,
          updatedAt: new Date(),
        },
      });

      await prisma.activityEvent.create({
    data: {
      userId: employee.id,
      type: "status",
      message: `${employee.name} updated their status`,
    },
  });

      return sendSuccess(res, {
        taskStatus: updated.taskStatus,
        currentLearning: updated.currentLearning,
        updatedAt: updated.updatedAt.toISOString(),
      });
    }

    res.setHeader("Allow", ["GET", "PUT"]);
    return sendError(res, "Method not allowed", 405);
  } catch (error) {
    console.error("Employee status API error:", error);
    return sendError(res, "Internal server error", 500);
  }
}
