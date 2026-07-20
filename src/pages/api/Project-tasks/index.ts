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
        return res.status(400).json({
          error: "Project name is required",
        });
      }

      const tasks = await prisma.projectTask.findMany({
        where: {
          projectName: project,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json({
        rows: tasks,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  if (req.method === "POST") {
    try {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const {
        projectName,
        taskStatus,
        assignTask,
        meetingTime,
        meetingPurpose,
      } = body;

      const task = await prisma.projectTask.create({
        data: {
          title: assignTask,
          projectName: projectName,
          taskStatus: taskStatus,
          assignTask: assignTask,
          meetingTime: meetingTime ? new Date(meetingTime) : null,
          meetingPurpose: meetingPurpose ?? null,
        },
      });

      return res.status(201).json({
        success: true,
        data: task,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
  res.setHeader("Allow", ["GET", "POST"]);

  return res.status(405).json({
    error: "Method not allowed",
  });
}
