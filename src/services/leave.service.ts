import { auth } from "@/firebase/config";

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
