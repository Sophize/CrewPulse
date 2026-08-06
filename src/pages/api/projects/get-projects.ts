import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/utils/api";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ApiResponse } from "@/utils/api";

interface ProjectResponse {
  id: string;
  name: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ProjectResponse[]> | string>,
) {
  try {
    await getAuthenticatedUser(req);
  } catch {
    return res.status(401).send("Couldn't find or decode user token");
  }
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).send("Method not allowed");
    }
    const projects = await prisma.project.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
    return sendSuccess(res, projects);
  } catch (error) {
    console.error("Projects API error:", error);
    return res.status(500).send("Internal server error");
  }
}
