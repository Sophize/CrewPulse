import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { LeaveType } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);

    return res.status(405).send("Only POST requests are allowed.");
  }

  try {
    const employee = await getAuthenticatedUser(req);

    const { leaveType, fromDate, toDate, isHalfDay, reason } = req.body;

    if (!leaveType || !fromDate || !toDate) {
      return res
        .status(422)
        .send("Leave type, from date and to date are required.");
    }

    if (!Object.values(LeaveType).includes(leaveType)) {
      return res.status(422).send("Invalid leave type.");
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      return res.status(422).send("Invalid date.");
    }

    if (from > to) {
      return res.status(422).send("From date cannot be after To date.");
    }

    if (isHalfDay && from.getTime() !== to.getTime()) {
      return res
        .status(422)
        .send("Half day leave must start and end on the same date.");
    }

    await prisma.leave.create({
      data: {
        userId: employee.id,
        leaveType,
        fromDate: from,
        toDate: to,
        isHalfDay: isHalfDay === true,
        reason: reason?.trim() || null,
      },
    });

    return res.status(201).send("Leave created successfully.");
  } catch (error) {
    console.error("Leave API error:", error);

    return res.status(500).send("Internal server error");
  }
}
