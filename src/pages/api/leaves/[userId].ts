import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);

    return res.status(405).send("Only GET requests are allowed.");
  }

  const { userId } = req.query;

  if (typeof userId !== "string") {
    return res.status(422).send("Invalid user id.");
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
        isHalfDay: true,
        reason: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      rows: leaves.map((leave) => ({
        id: leave.id,
        leaveType: leave.leaveType,
        fromDate: leave.fromDate.toISOString(),
        toDate: leave.toDate.toISOString(),
        isHalfDay: leave.isHalfDay,
        reason: leave.reason,
        createdAt: leave.createdAt ? leave.createdAt.toISOString() : null,
      })),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send("Internal server error");
  }
}
