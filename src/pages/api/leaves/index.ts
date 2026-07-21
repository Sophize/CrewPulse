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

    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const employee = await getAuthenticatedUser(req);

    const { leaveType, fromDate, toDate, reason } = req.body;

    if (!leaveType || !fromDate || !toDate) {
      return res.status(400).json({
        error: "Leave type, from date and to date are required.",
      });
    }

    if (!Object.values(LeaveType).includes(leaveType)) {
      return res.status(400).json({
        error: "Invalid leave type.",
      });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      return res.status(400).json({
        error: "Invalid date.",
      });
    }

    if (from > to) {
      return res.status(400).json({
        error: "From date cannot be after To date.",
      });
    }

    const leave = await prisma.leave.create({
      data: {
        userId: employee.id,
        leaveType,
        fromDate: from,
        toDate: to,
        reason: reason?.trim() || null,
      },
    });

    return res.status(201).json(leave);
  } catch (error) {
    console.error("Leave API error:", error);

    return res.status(500).json({
        error: "Internal server error",
    });
  }
}