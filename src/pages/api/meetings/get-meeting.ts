import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/utils/api";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ApiResponse } from "@/utils/api";
import { MeetingSchedule } from "@prisma/client";

export type MeetingScheduleResponse = Omit<
  MeetingSchedule,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<MeetingScheduleResponse[]> | string>,
) {
  try {
    await getAuthenticatedUser(req);
  } catch {
    return res.status(401).send("Couldn't find user token");
  }

  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).send("Method not allowed");
    }

    const { projectId } = req.query;

    if (!projectId) {
      return res.status(422).send("projectId is required");
    }

    const schedules = await prisma.meetingSchedule.findMany({
      where: {
        projectId: String(projectId),
      },
      orderBy: {
        createdAt: "desc",
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
      schedules.map((schedule) => ({
        ...schedule,
        createdAt: schedule.createdAt.toISOString(),
        updatedAt: schedule.updatedAt.toISOString(),
      })),
    );
  } catch (error) {
    console.error("Get meeting schedules API error:", error);
    return res.status(500).send("Internal server error");
  }
}
