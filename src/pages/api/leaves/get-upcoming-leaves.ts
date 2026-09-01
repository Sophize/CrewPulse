import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "GET") {
        return res.status(405).send("Only GET requests are allowed.");
    }

    try {
        await getAuthenticatedUser(req);

        const now = new Date();
        const today = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
        );

        const leaves = await prisma.leave.findMany({
            where: {
                toDate: { gte: today },
            },
            orderBy: {
                fromDate: "asc",
            },
            select: {
                id: true,
                leaveType: true,
                fromDate: true,
                toDate: true,
                isHalfDay: true,
                reason: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return res.status(200).json(leaves);
    } catch (error) {
        console.error("Get upcoming leaves API error:", error);

        if (
            error instanceof Error &&
            error.message.toLowerCase().includes("token")
        ) {
            return res.status(401).send("Couldn't find or decode user token.");
        }

        return res.status(500).send("Internal server error");
    }
}