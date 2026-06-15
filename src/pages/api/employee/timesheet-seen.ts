import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).send({
      error: "Method not allowed",
    });
  }

  try {
    const employee = await getAuthenticatedUser(req);

    await prisma.user.update({
      where: {
        id: employee.id,
      },
      data: {
        timesheetUpdatedAt: new Date(),
      },
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    console.error("Timesheet seen API error:", error);
    return res.status(500).send({
      error: "Internal server error",
    });
  }
}
