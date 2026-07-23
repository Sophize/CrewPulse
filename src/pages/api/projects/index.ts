import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/utils/api";
import type { ApiResponse } from "@/utils/api";
import { getAuthenticatedUser } from "@/lib/auth";

interface ProjectResponse {
  id: string;
  name: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ProjectResponse[]>>,
) {
  try {
    await getAuthenticatedUser(req);

    if (req.method === "GET") {
      const projects = await prisma.project.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      });

      return sendSuccess(res, projects);
    }

    res.setHeader("Allow", ["GET"]);
    return sendError(res, "Method not allowed", 405);
  } catch (error) {
    console.error("Projects API error:", error);
    return sendError(res, "Internal server error", 500);
  }
}
