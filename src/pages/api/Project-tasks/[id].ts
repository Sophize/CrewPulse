import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    res.setHeader("Allow", ["DELETE", "PATCH"]);

    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { id } = req.query;

    if (req.method === "DELETE") {
      await prisma.projectTask.delete({
        where: {
          id: id as string,
        },
      });

      return res.status(200).json({
        success: true,
      });
    }

    if (req.method === "PATCH") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { taskStatus, assignTask, meetingTime, meetingPurpose } = body;
      
      const updateData: any = {};
      if (taskStatus !== undefined) updateData.taskStatus = taskStatus;
      if (assignTask !== undefined) updateData.assignTask = assignTask;
      if (meetingTime !== undefined) updateData.meetingTime = meetingTime === null ? null : new Date(meetingTime);
      if (meetingPurpose !== undefined) updateData.meetingPurpose = meetingPurpose;

      const updatedTask = await prisma.projectTask.update({
        where: { id: id as string },
        data: updateData,
      });

      return res.status(200).json({
        success: true,
        data: updatedTask,
      });
    }
  } catch (error) {
    console.error("Project Task Error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}