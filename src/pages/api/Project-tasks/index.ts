import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
      const { projectName, taskStatus, assignTask, meetingTime, meetingPurpose } = req.body;

      const task = await prisma.projectTask.create({
        data: {
          title: assignTask,
          projectName,
          taskStatus,
          assignTask,
          meetingTime: meetingTime ? new Date(meetingTime) : null,
          meetingPurpose,
        },
      });

      return res.status(201).json(task);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);

  return res.status(405).json({
    error: "Method not allowed",
  });
}
