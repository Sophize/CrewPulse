import { fetchJson, getAuthHeaders, ApiResponse } from "@/api/client";
import { MeetingSchedule } from "@prisma/client";

export type MeetingScheduleResponse = Omit<
  MeetingSchedule,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export async function getMeeting(projectId: string) {
  const headers = await getAuthHeaders();
  const response = await fetchJson<ApiResponse<MeetingSchedule[]>>(
    "/api/meetings/get-meeting",
    {
      headers,
      query: { projectId },
    },
  );
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch meetings");
  }
  return response.data;
}

export async function createMeeting(data: {
  projectId: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  meetingTime: string;
  clientTimeZone: string;
  daysOfWeek: number[];
  datesOfMonth: number[];
}) {
  const headers = await getAuthHeaders();
  const response = await fetchJson<ApiResponse<MeetingScheduleResponse>>(
    "/api/meetings/create-meeting",
    {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    },
  );
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to create meeting");
  }
  return response.data;
}

export async function updateMeeting(data: {
  meetingId: string;
  projectId: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  meetingTime: string;
  clientTimeZone: string;
  daysOfWeek: number[];
  datesOfMonth: number[];
}) {
  const headers = await getAuthHeaders();
  const response = await fetchJson<ApiResponse<MeetingScheduleResponse>>(
    "/api/meetings/update-meeting",
    {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    },
  );
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to update meeting");
  }
  return response.data;
}

export async function deleteMeeting(meetingId: string, projectId: string) {
  const headers = await getAuthHeaders();
  const response = await fetchJson<ApiResponse<null>>(
    "/api/meetings/delete-meeting",
    {
      method: "POST",
      headers,
      body: JSON.stringify({ meetingId, projectId }),
    },
  );
  if (!response.success) {
    throw new Error(response.error || "Failed to delete meeting");
  }
}
