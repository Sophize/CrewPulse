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
        lastSeenAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      rows: employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
        email: employee.email,
        taskStatus: employee.taskStatus,
        currentLearning: employee.currentLearning ?? "",
        learningDetails: employee.learningDetails ?? "",
        learningStatus: employee.learningStatus ?? "",
        lastSeenAt: employee.lastSeenAt?.toISOString() ?? null,
        updatedAt: employee.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Employees API error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
