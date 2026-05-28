import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);

    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const activity = await prisma.activityEvent.findMany({
      orderBy: {
        createdAt: "desc",
      },

      take: 20,

      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return res.status(200).json(
      activity.map((event) => ({
        id: event.id,
        type: event.type,
        actor: event.user.name,
        message: event.message,
        timestamp: event.createdAt.toISOString(),
      })),
    );
  } catch (error) {
    console.error("Activity API error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}