import { fetchJson } from "@/api/client";
import { auth } from "@/firebase/config";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function getAuthHeaders() {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("User is not authenticated");
  return { Authorization: `Bearer ${token}` };
}

export interface Project {
  id: string;
  name: string;
}

export interface ProjectTask {
  id: string;
  taskDescription: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export async function getProjects() {
  const headers = await getAuthHeaders();
  const response = await fetchJson<ApiResponse<Project[]>>("/api/projects", {
    headers,
  });
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch projects");
  }
  return response.data;
}

export async function getProjectTasks(projectId: string) {
  const headers = await getAuthHeaders();
  const response = await fetchJson<ApiResponse<ProjectTask[]>>(
    `/api/projects/${projectId}/tasks`,
    { headers },
  );
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch project tasks");
  }
  return response.data;
}

export async function createProjectTask(
  projectId: string,
  taskDescription: string,
) {
  const headers = await getAuthHeaders();
  const response = await fetchJson<ApiResponse<ProjectTask>>(
    `/api/projects/${projectId}/tasks`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ taskDescription }),
    },
  );
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to create task");
  }
  return response.data;
}

export async function updateProjectTask(
  projectId: string,
  taskId: string,
  updates: { taskDescription?: string; status?: string },
) {
  const headers = await getAuthHeaders();
  const response = await fetchJson<ApiResponse<ProjectTask>>(
    `/api/projects/${projectId}/tasks/${taskId}`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify(updates),
    },
  );
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to update task");
  }
  return response.data;
}

export async function deleteProjectTask(
  projectId: string,
  taskId: string,
) {
  const headers = await getAuthHeaders();
  const response = await fetchJson<ApiResponse<null>>(
    `/api/projects/${projectId}/tasks/${taskId}`,
    {
      method: "DELETE",
      headers,
    },
  );
  if (!response.success) {
    throw new Error(response.error || "Failed to delete task");
  }
}
