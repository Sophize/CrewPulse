import { auth } from "@/firebase/config";

export async function updateProfile(data: { name: string; timesheetUrl: string | null }) {
  const token = await auth.currentUser?.getIdToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch("/api/user/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }
}