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

  const { userId } = req.query;

  if (typeof userId !== "string") {
    return res.status(400).json({
      error: "Invalid user id",
    });
  }

  try {
    const leaves = await prisma.leave.findMany({
      where: {
        userId,
      },
      orderBy: {
        fromDate: "desc",
      },
      select: {
        id: true,
        leaveType: true,
        fromDate: true,
        toDate: true,
        reason: true,
      },
    });

    return res.status(200).json({
      rows: leaves.map((leave) => ({
        id: leave.id,
        leaveType: leave.leaveType,
        fromDate: leave.fromDate.toISOString(),
        toDate: leave.toDate.toISOString(),
        reason: leave.reason,
      })),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}