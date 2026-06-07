import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

interface SyncUserRequest {
  firebaseUid: string;
  email: string;
  name?: string;
}

interface SyncUserResponse {
  success: boolean;
  role?: UserRole;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SyncUserResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);

    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { firebaseUid, email, name } = req.body as SyncUserRequest;

    if (!firebaseUid || !email) {
      return res.status(400).json({
        success: false,
        error: "firebaseUid and email are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!existingUser) {
      return res.status(403).json({
        success: false,
        error: "User is not provisioned. Please contact your administrator.",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        firebaseUid,
        name: name?.trim() || existingUser.name,
      },
    });

    return res.status(200).json({
      success: true,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error("[POST /api/auth/sync-user] Error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to sync user",
    });
  }
}
