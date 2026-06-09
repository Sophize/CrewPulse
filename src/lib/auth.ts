import type { NextApiRequest } from "next";

import { prisma } from "@/lib/prisma";
import { adminAuth } from "@/lib/firebase-admin";

export async function getAuthenticatedUser(req: NextApiRequest) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing authorization token");
  }

  const token = authHeader.replace("Bearer ", "");

  const decodedToken = await adminAuth.verifyIdToken(token);

  const user = await prisma.user.findUnique({
    where: {
      firebaseUid: decodedToken.uid,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
