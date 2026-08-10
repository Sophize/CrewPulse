import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/utils/api";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ApiResponse } from "@/utils/api";

export type MeetingResponse = {
  id: string;
  clientTimeZone: string;
  scheduledAt: string;
  scheduledAtIST: string;
  createdAt: string;
  updatedAt: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<MeetingResponse[]> | string>,
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

    const project = await prisma.project.findUnique({
      where: { id: String(projectId) },
      select: { id: true },
    });

    if (!project) {
      return res.status(404).send("Project not found");
    }

    const meetings = await prisma.meetingSchedule.findMany({
      where: { projectId: String(projectId) },
      orderBy: { scheduledAt: "asc" },
      select: {
        id: true,
        clientTimeZone: true,
        scheduledAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const formatted = meetings.map((m) => ({
      id: m.id,
      clientTimeZone: m.clientTimeZone,
      scheduledAt: m.scheduledAt.toISOString(),
      scheduledAtIST: m.scheduledAt.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    }));

    return sendSuccess(res, formatted);
  } catch (error) {
    console.error("Get meetings API error:", error);
    return res.status(500).send("Internal server error");
  }
}
