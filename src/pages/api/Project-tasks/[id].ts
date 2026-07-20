import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);

    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { id } = req.query;

    await prisma.projectTask.delete({
      where: {
        id: id as string,
      },
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Delete Project Task Error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}