import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/utils/api";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ApiResponse } from "@/utils/api";
import { MeetingSchedule } from "@prisma/client";

export type UpdateMeetingResponse = Omit<
  MeetingSchedule,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UpdateMeetingResponse> | string>,
) {
  try {
    await getAuthenticatedUser(req);
  } catch {
    return res.status(401).send("Couldn't find user token");
  }

  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).send("Method not allowed");
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const {
      meetingId,
      projectId,
      frequency,
      meetingTime,
      clientTimeZone,
      daysOfWeek = [],
      datesOfMonth = [],
    } = body;

    if (!meetingId || !projectId) {
      return res.status(422).send("meetingId and projectId are required");
    }

    if (!["DAILY", "WEEKLY", "MONTHLY"].includes(frequency)) {
      return res.status(422).send("Invalid frequency");
    }

    if (!meetingTime?.trim()) {
      return res.status(422).send("meetingTime is required");
    }

    if (!clientTimeZone?.trim()) {
      return res.status(422).send("clientTimeZone is required");
    }

    if (frequency === "WEEKLY" && daysOfWeek.length === 0) {
      return res
        .status(422)
        .send("Select at least one day for weekly meetings");
    }

    if (frequency === "MONTHLY" && datesOfMonth.length === 0) {
      return res
        .status(422)
        .send("Select at least one date for monthly meetings");
    }

    const updated = await prisma.meetingSchedule.update({
      where: { id: String(meetingId) },
      data: {
        frequency,
        meetingTime: meetingTime.trim(),
        clientTimeZone: clientTimeZone.trim(),
        daysOfWeek,
        datesOfMonth,
      },
      select: {
        id: true,
        projectId: true,
        frequency: true,
        meetingTime: true,
        clientTimeZone: true,
        daysOfWeek: true,
        datesOfMonth: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return sendSuccess(res, {
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Update meeting schedule API error:", error);
    return res.status(500).send("Internal server error");
  }
}
