import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/utils/api";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ApiResponse } from "@/utils/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ deleted: boolean }> | string>,
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
    const { meetingId, projectId } = body;

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

    await prisma.meetingSchedule.delete({
      where: { id: String(meetingId) },
    });

    return sendSuccess(res, { deleted: true });
  } catch (error) {
    console.error("Delete meeting API error:", error);
    return res.status(500).send("Internal server error");
  }
}
