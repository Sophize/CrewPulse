import { TaskStatus } from "@prisma/client";

import { fetchJson } from "@/api/client";
import { auth } from "@/firebase/config";

export interface ProjectTask {
  id: string;
  projectName: string;
  taskStatus: TaskStatus;
  assignTask: string;
  meetingTime: string | null;
  meetingPurpose: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectTaskInput {
  projectName: string;
  taskStatus: TaskStatus;
  assignTask: string;
  meetingTime?: Date | null;
  meetingPurpose?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  rows?: T;
  error?: string;
}

async function getAuthHeaders() {
  const token = await auth.currentUser?.getIdToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getProjectTasks(project: string) {
  const headers = await getAuthHeaders();

  const response = await fetchJson<ApiResponse<ProjectTask[]>>(
    `/api/project-tasks?project=${project}`,
    {
      headers,
    },
  );

  if (!response.rows) {
    throw new Error("Failed to fetch tasks");
  }

  return response.rows;
}

export async function createProjectTask(
  input: CreateProjectTaskInput,
) {
  const headers = await getAuthHeaders();

  const response = await fetchJson<ApiResponse<ProjectTask>>(
    "/api/project-tasks",
    {
      method: "POST",
      headers,
      body: JSON.stringify(input),
    },
  );

  if (!response.data) {
    throw new Error("Failed to create task");
  }

  return response.data;
}

export interface ProjectMeeting {
  meetingTime: string | null;
  meetingPurpose: string | null;
}

export async function getProjectMeeting(project: string): Promise<ProjectMeeting> {
  const headers = await getAuthHeaders();

  const response = await fetchJson<{ success: boolean; data: ProjectMeeting }>(
    `/api/project-tasks/meeting?project=${project}`,
    { headers },
  );

  return response.data ?? { meetingTime: null, meetingPurpose: null };
}

export interface SaveMeetingInput {
  projectName: string;
  meetingTime?: Date | null;
  meetingPurpose?: string;
}

export async function saveMeeting(input: SaveMeetingInput) {
  const headers = await getAuthHeaders();

  const response = await fetchJson<ApiResponse<ProjectTask>>(
    "/api/project-tasks/meeting",
    {
      method: "PATCH",
      headers,
      body: JSON.stringify(input),
    },
  );

  if (!response.data) {
    throw new Error("Failed to save meeting");
  }

  return response.data;
}

export async function deleteProjectTask(id: string) {
  const headers = await getAuthHeaders();

  await fetchJson(`/api/project-tasks/${id}`, {
    method: "DELETE",
    headers,
  });
}