import type { NextApiRequest, NextApiResponse } from "next";
import type { TaskStatus } from "@prisma/client";

import { prisma } from "../../../lib/prisma";
import { sendSuccess, sendError } from "../../../utils/api";
import type { ApiResponse } from "../../../utils/api";
import {
  validateTaskStatus,
  sanitizeLearningString,
} from "../../../utils/employee";

import { getAuthenticatedUser } from "@/lib/auth";

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
    const employee = await getAuthenticatedUser(req);

    if (req.method === "GET") {
      return sendSuccess(res, {
        taskStatus: employee.taskStatus,
        currentLearning: employee.currentLearning,
        updatedAt: employee.updatedAt.toISOString(),
      });
    }

    if (req.method === "PUT") {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const { taskStatus, currentLearning } = body;

      const validation = validateTaskStatus(taskStatus);

      if (!validation.valid) {
        return sendError(res, validation.error!, 400);
      }

      const sanitized = sanitizeLearningString(currentLearning);

      const previousStatus = employee.taskStatus;
      const previousLearning = employee.currentLearning;

      const updated = await prisma.user.update({
        where: {
          id: employee.id,
        },
        data: {
          taskStatus: taskStatus as TaskStatus,
          currentLearning: sanitized,
          updatedAt: new Date(),
        },
      });

      if (previousStatus !== updated.taskStatus) {
        const statusMessages: Record<TaskStatus, string> = {
          NO_TASKS: "has no tasks assigned",
          IN_PROGRESS: "started working on assigned tasks",
          COMPLETED: "completed all assigned tasks",
        };

        await prisma.activityEvent.create({
          data: {
            userId: employee.id,
            type: "status",
            message: statusMessages[updated.taskStatus],
          },
        });
      }

      if (previousLearning !== updated.currentLearning) {
        await prisma.activityEvent.create({
          data: {
            userId: employee.id,
            type: "learning",
            message: updated.currentLearning
              ? `started learning ${updated.currentLearning}`
              : "cleared learning topic",
          },
        });
      }

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
