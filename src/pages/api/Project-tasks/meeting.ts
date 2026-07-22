import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const project = req.query.project as string;

      if (!project) {
        return res.status(400).json({ error: "Project name is required" });
      }
      const record = await prisma.projectTask.findFirst({
        where: {
          projectName: project,
          OR: [
            { meetingTime: { not: null } },
            { meetingPurpose: { not: null } },
          ],
        },
        orderBy: { updatedAt: "desc" },
        select: { meetingTime: true, meetingPurpose: true },
      });

      return res.status(200).json({
        success: true,
        data: {
          meetingTime: record?.meetingTime ?? null,
          meetingPurpose: record?.meetingPurpose ?? null,
        },
      });
    } catch (error) {
      console.error("Get Meeting Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  if (req.method === "PATCH") {
    try {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { projectName, meetingTime, meetingPurpose } = body;

      if (!projectName) {
        return res.status(400).json({ error: "Project name is required" });
      }
      const existingMeeting = await prisma.projectTask.findFirst({
        where: {
          projectName,
          OR: [
            { meetingTime: { not: null } },
            { meetingPurpose: { not: null } },
          ],
        },
        orderBy: { updatedAt: "desc" },
      });

      const target =
        existingMeeting ??
        (await prisma.projectTask.findFirst({
          where: { projectName },
          orderBy: { createdAt: "desc" },
        }));

      if (target) {
        const updated = await prisma.projectTask.update({
          where: { id: target.id },
          data: {
            ...(meetingTime !== undefined && { meetingTime: meetingTime ? new Date(meetingTime) : null }),
            ...(meetingPurpose !== undefined && { meetingPurpose }),
          },
        });
        return res.status(200).json({ success: true, data: updated });
      } else {
        const created = await prisma.projectTask.create({
          data: {
            title: "Meeting",
            projectName,
            taskStatus: "BLOCKED",
            assignTask: "",
            meetingTime: meetingTime ? new Date(meetingTime) : null,
            meetingPurpose: meetingPurpose ?? null,
          },
        });
        return res.status(201).json({ success: true, data: created });
      }
    } catch (error) {
      console.error("Save Meeting Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  res.setHeader("Allow", ["GET", "PATCH"]);
  return res.status(405).json({ error: "Method not allowed" });
}
