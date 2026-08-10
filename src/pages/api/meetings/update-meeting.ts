import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/utils/api";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ApiResponse } from "@/utils/api";

export type UpdateMeetingResponse = {
  id: string;
  clientTimeZone: string;
  scheduledAt: string;
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
    const { meetingId, projectId, clientTimeZone, scheduledAt } = body;

    if (!meetingId || !projectId) {
      return res.status(422).send("meetingId and projectId are required");
    }

    const existing = await prisma.meetingSchedule.findFirst({
      where: { id: String(meetingId), projectId: String(projectId) },
      select: { id: true },
    });

    if (!existing) {
      return res.status(404).send("Meeting not found");
    }

    const updated = await prisma.meetingSchedule.update({
      where: { id: String(meetingId) },
      data: {
        ...(clientTimeZone?.trim()
          ? { clientTimeZone: clientTimeZone.trim() }
          : {}),
        ...(scheduledAt ? { scheduledAt: new Date(scheduledAt) } : {}),
      },
      select: {
        id: true,
        clientTimeZone: true,
        scheduledAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return sendSuccess(res, {
      ...updated,
      scheduledAt: updated.scheduledAt.toISOString(),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Update meeting API error:", error);
    return res.status(500).send("Internal server error");
  }
}
