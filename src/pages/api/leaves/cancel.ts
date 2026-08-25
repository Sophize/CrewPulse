import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST requests are allowed.");
  }

  try {
    const employee = await getAuthenticatedUser(req);
    const { leaveId } = req.body;

    if (!leaveId) {
      return res.status(422).send("Leave ID is required.");
    }

    const leave = await prisma.leave.findUnique({
      where: {
        id: leaveId,
      },
      select: {
        userId: true,
        fromDate: true,
      },
    });

    if (!leave) {
      return res.status(422).send("Leave not found.");
    }

    if (leave.userId !== employee.id) {
      return res.status(403).send("You can only cancel your own leaves.");
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const leaveStartDate = new Date(leave.fromDate);
    leaveStartDate.setHours(0, 0, 0, 0);

    if (leaveStartDate <= currentDate) {
      return res.status(422).send("You can only cancel future leaves.");
    }

    await prisma.leave.delete({
      where: {
        id: leaveId,
      },
    });

    return res.status(200).send("Leave cancelled successfully.");
  } catch (error) {
    console.error("Cancel Leave API error:", error);

    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("token")
    ) {
      return res.status(401).send("Couldn't find or decode user token.");
    }

    return res.status(500).send("Internal server error");
  }
}
