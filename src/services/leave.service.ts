import { auth } from "@/firebase/config";
import { Prisma } from "@prisma/client";
import { getAuthHeaders } from "@/api/client";

export async function getLeaveHistory(userId: string) {
  const res = await fetch(`/api/leaves/${userId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch leave history");
  }

  return res.json();
}

export async function cancelLeave(leaveId: string) {
  const token = await auth.currentUser?.getIdToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await fetch("/api/leaves/cancel", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ leaveId }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
}

export type UpcomingLeave = Prisma.LeaveGetPayload<{
  select: {
    id: true;
    leaveType: true;
    fromDate: true;
    toDate: true;
    isHalfDay: true;
    reason: true;
    user: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

export async function getUpcomingLeaves(): Promise<UpcomingLeave[]> {
  const headers = await getAuthHeaders();

  const res = await fetch("/api/leaves/get-upcoming-leaves", {
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch upcoming leaves");
  }

  return res.json();
}