import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/utils/api";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ApiResponse } from "@/utils/api";

export type CreateMeetingResponse = {
  id: string;
  projectId: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  meetingTime: string;
  clientTimeZone: string;
  daysOfWeek: number[];
  datesOfMonth: number[];
  createdAt: string;
  updatedAt: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<CreateMeetingResponse> | string>,
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
      projectId,
      frequency,
      meetingTime,
      clientTimeZone,
      daysOfWeek = [],
      datesOfMonth = [],
    } = body;

    if (!projectId) {
      return res.status(422).send("projectId is required");
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

    if (!Array.isArray(daysOfWeek)) {
      return res.status(422).send("daysOfWeek must be an array");
    }

    if (!Array.isArray(datesOfMonth)) {
      return res.status(422).send("datesOfMonth must be an array");
    }

    if (frequency === "WEEKLY" && daysOfWeek.length === 0) {
      return res.status(422).send("Select at least one day");
    }

    if (frequency === "MONTHLY" && datesOfMonth.length === 0) {
      return res.status(422).send("Select at least one date");
    }

    const project = await prisma.project.findUnique({
      where: {
        id: String(projectId),
      },
      select: {
        id: true,
      },
    });

    if (!project) {
      return res.status(404).send("Project not found");
    }

    const schedule = await prisma.meetingSchedule.create({
      data: {
        projectId: String(projectId),
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

    return sendSuccess(
      res,
      {
        ...schedule,
        createdAt: schedule.createdAt.toISOString(),
        updatedAt: schedule.updatedAt.toISOString(),
      },
      201,
    );
  } catch (error) {
    console.error("Create meeting schedule API error:", error);
    return res.status(500).send("Internal server error");
  }
}
