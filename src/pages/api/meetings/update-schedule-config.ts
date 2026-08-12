import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/utils/api";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ApiResponse } from "@/utils/api";

export type MeetingScheduleConfigResponse = {
  projectId: string;
  automatic: boolean;
  dayOfWeek: number;
  meetingTime: string;
  clientTimeZone: string;
  createdAt: string;
  updatedAt: string;
};

function getNextMeetingDate(dayOfWeek: number, meetingTime: string, timeZone: string): Date {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(now);

  const getPart = (type: string) => parts.find((part) => part.type === type)?.value ?? "";

  const year = Number(getPart("year"));
  const month = Number(getPart("month"));
  const day = Number(getPart("day"));
  const hour = Number(getPart("hour"));
  const minute = Number(getPart("minute"));

  const currentLocalDate = new Date(Date.UTC(year, month - 1, day));

  const currentDayOfWeek = currentLocalDate.getUTCDay();

  let daysUntilMeeting = (dayOfWeek - currentDayOfWeek + 7) % 7;

  const [meetingHour, meetingMinute] = meetingTime.split(":").map(Number);

  if (
    daysUntilMeeting === 0 &&
    (hour > meetingHour || (hour === meetingHour && minute >= meetingMinute))
  ) {
    daysUntilMeeting = 7;
  }

  currentLocalDate.setUTCDate(currentLocalDate.getUTCDate() + daysUntilMeeting);

  const targetYear = currentLocalDate.getUTCFullYear();
  const targetMonth = currentLocalDate.getUTCMonth() + 1;
  const targetDay = currentLocalDate.getUTCDate();

  const localDateTime = Date.UTC(
    targetYear,
    targetMonth - 1,
    targetDay,
    meetingHour,
    meetingMinute,
  );

  let utcTimestamp = localDateTime;

  for (let i = 0; i < 3; i++) {
    const target = new Date(utcTimestamp);

    const targetParts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(target);

    const getTargetPart = (type: string) =>
      targetParts.find((part) => part.type === type)?.value ?? "";

    const formattedAsUtc = Date.UTC(
      Number(getTargetPart("year")),
      Number(getTargetPart("month")) - 1,
      Number(getTargetPart("day")),
      Number(getTargetPart("hour")),
      Number(getTargetPart("minute")),
      Number(getTargetPart("second")),
    );

    const offset = formattedAsUtc - localDateTime;

    utcTimestamp = localDateTime - offset;
  }

  return new Date(utcTimestamp);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<MeetingScheduleConfigResponse> | string>,
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

    const { projectId, automatic, dayOfWeek, meetingTime, clientTimeZone } = body;

    if (!projectId) {
      return res.status(422).send("projectId is required");
    }

    if (typeof automatic !== "boolean") {
      return res.status(422).send("automatic is required");
    }

    if (typeof dayOfWeek !== "number" || dayOfWeek < 0 || dayOfWeek > 6) {
      return res.status(422).send("dayOfWeek must be between 0 and 6");
    }

    if (!meetingTime?.trim()) {
      return res.status(422).send("meetingTime is required");
    }

    if (!clientTimeZone?.trim()) {
      return res.status(422).send("clientTimeZone is required");
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

    const config = await prisma.meetingScheduleConfig.upsert({
      where: {
        projectId: String(projectId),
      },
      update: {
        automatic,
        dayOfWeek,
        meetingTime: meetingTime.trim(),
        clientTimeZone: clientTimeZone.trim(),
      },
      create: {
        projectId: String(projectId),
        automatic,
        dayOfWeek,
        meetingTime: meetingTime.trim(),
        clientTimeZone: clientTimeZone.trim(),
      },
      select: {
        projectId: true,
        automatic: true,
        dayOfWeek: true,
        meetingTime: true,
        clientTimeZone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    /*
     * When automatic scheduling is enabled,
     * create the next upcoming meeting if one
     * doesn't already exist.
     */
    if (automatic) {
      const nextMeeting = getNextMeetingDate(
        config.dayOfWeek,
        config.meetingTime,
        config.clientTimeZone,
      );

      const existingMeeting = await prisma.meetingSchedule.findFirst({
        where: {
          projectId: String(projectId),
          scheduledAt: {
            gte: new Date(),
          },
        },
        select: {
          id: true,
        },
      });

      if (!existingMeeting) {
        await prisma.meetingSchedule.create({
          data: {
            projectId: String(projectId),
            clientTimeZone: config.clientTimeZone,
            scheduledAt: nextMeeting,
          },
        });
      }
    }

    return sendSuccess(res, {
      ...config,
      createdAt: config.createdAt.toISOString(),
      updatedAt: config.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Update meeting schedule config API error:", error);

    return res.status(500).send("Internal server error");
  }
}
