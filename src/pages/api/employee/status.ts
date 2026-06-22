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
  id: string;
  taskStatus: string;
  currentLearning: string | null;
  learningDetails: string | null;
  learningStatus: string | null;
  currentTask: string | null;
  timesheetUrl: string | null;
  timesheetUpdatedAt: string | null;
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
        id: employee.id,
        taskStatus: employee.taskStatus,
        currentLearning: employee.currentLearning,
        learningDetails: employee.learningDetails,
        learningStatus: employee.learningStatus,
        currentTask: employee.currentTask,
        timesheetUrl: employee.timesheetUrl,
        timesheetUpdatedAt: employee.timesheetUpdatedAt?.toISOString() ?? null,
        updatedAt: employee.updatedAt.toISOString(),
      });
    }

    if (req.method === "PUT") {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const {
        taskStatus,
        currentLearning,
        learningDetails,
        learningStatus,
        currentTask,
      } = body;

      const validation = validateTaskStatus(taskStatus);

      if (!validation.valid) {
        return sendError(res, validation.error!, 400);
      }

      const sanitized = sanitizeLearningString(currentLearning);
      const sanitizedLearningDetails = sanitizeLearningString(learningDetails);
      const sanitizedLearningStatus = sanitizeLearningString(learningStatus);
      const sanitizedCurrentTask = sanitizeLearningString(currentTask);

      const previousStatus = employee.taskStatus;
      const previousLearning = employee.currentLearning;

      const updated = await prisma.user.update({
        where: {
          id: employee.id,
        },
        data: {
          taskStatus: taskStatus as TaskStatus,
          currentLearning: sanitized,
          learningDetails: sanitizedLearningDetails,
          learningStatus: sanitizedLearningStatus,
          currentTask: sanitizedCurrentTask,
          updatedAt: new Date(),
        },
      });

      if (previousStatus !== updated.taskStatus) {
        const statusMessages: Record<TaskStatus, string> = {
          BLOCKED: "has blocked",
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
        id: updated.id,
        taskStatus: updated.taskStatus,
        currentLearning: updated.currentLearning,
        learningDetails: updated.learningDetails,
        learningStatus: updated.learningStatus,
        currentTask: updated.currentTask,
        timesheetUrl: updated.timesheetUrl,
        timesheetUpdatedAt: updated.timesheetUpdatedAt?.toISOString() ?? null,
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
