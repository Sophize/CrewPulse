import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/utils/api";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ApiResponse } from "@/utils/api";

export type CreateMeetingResponse = {
  id: string;
  clientTimeZone: string;
  scheduledAt: string;
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
    const { projectId, clientTimeZone, scheduledAt } = body;

    if (!projectId) {
      return res.status(422).send("projectId is required");
    }
    if (!clientTimeZone?.trim()) {
      return res.status(422).send("clientTimeZone is required");
    }
    if (!scheduledAt) {
      return res.status(422).send("scheduledAt is required");
    }

    const meeting = await prisma.meetingSchedule.create({
      data: {
        projectId: String(projectId),
        clientTimeZone: clientTimeZone.trim(),
        scheduledAt: new Date(scheduledAt),
      },
      select: {
        id: true,
        clientTimeZone: true,
        scheduledAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return sendSuccess(
      res,
      {
        ...meeting,
        scheduledAt: meeting.scheduledAt.toISOString(),
        createdAt: meeting.createdAt.toISOString(),
        updatedAt: meeting.updatedAt.toISOString(),
      },
      201,
    );
  } catch (error) {
    console.error("Create meeting API error:", error);
    return res.status(500).send("Internal server error");
  }
}
