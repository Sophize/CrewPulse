import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);

    return res.status(405).send("Method not allowed");
  }

  try {
    const user = await getAuthenticatedUser(req);

    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).send("Name is required");
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: name.trim(),
      },
    });

    return res.status(200).send("OK");
  } catch (error) {
    console.error(error);

    return res.status(500).send("Internal server error");
  }
}
