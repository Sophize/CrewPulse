import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);

    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const now = new Date();

    const today = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    const employees = await prisma.user.findMany({
      orderBy: {
        updatedAt: "desc",
      },

      select: {
        id: true,
        name: true,
        email: true,
        taskStatus: true,
        currentLearning: true,
        learningDetails: true,
        learningStatus: true,
        currentTask: true,
        timesheetUrl: true,
        timesheetUpdatedAt: true,
        lastSeenAt: true,
        updatedAt: true,

        leaves: {
          where: {
            fromDate: {
              lte: today,
            },
            toDate: {
              gte: today,
            },
          },
          orderBy: {
            fromDate: "desc",
          },
          take: 1,
          select: {
            leaveType: true,
            fromDate: true,
            toDate: true,
            reason: true,
          },
        },
      },
    });

    return res.status(200).json({
      rows: employees.map((employee) => {
        const activeLeave = employee.leaves[0] ?? null;

        return {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          taskStatus: employee.taskStatus,
          currentLearning: employee.currentLearning ?? "",
          learningDetails: employee.learningDetails ?? "",
          learningStatus: employee.learningStatus ?? "",
          currentTask: employee.currentTask ?? "",
          timesheetUrl: employee.timesheetUrl,
          timesheetUpdatedAt:
            employee.timesheetUpdatedAt?.toISOString() ?? null,
          lastSeenAt: employee.lastSeenAt?.toISOString() ?? null,
          updatedAt: employee.updatedAt.toISOString(),

          leave: activeLeave
            ? {
                leaveType: activeLeave.leaveType,
                fromDate: activeLeave.fromDate.toISOString(),
                toDate: activeLeave.toDate.toISOString(),
                reason: activeLeave.reason,
              }
            : null,
        };
      }),
    });
  } catch (error) {
    console.error("Employees API error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
