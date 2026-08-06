import { fetchJson, getAuthHeaders, ApiResponse } from "@/api/client";
import type { Project as PrismaProject, Task as PrismaTask } from "@prisma/client";

export type Project = Pick<PrismaProject, "id" | "name">;

export type Task = Omit<PrismaTask, "createdAt" | "updatedAt" | "completedAt"> & {
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export async function getProjects() {
  const headers = await getAuthHeaders();
  const response = await fetchJson<ApiResponse<Project[]>>(
    "/api/projects/get-projects",
    {
      headers,
    },
  );
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch projects");
  }
  return response.data;
}

export async function getProjectTasks(projectId: string) {
  const headers = await getAuthHeaders();
  const response = await fetchJson<ApiResponse<Task[]>>(
    "/api/projects/get-project-tasks",
    { headers, query: { projectId } },
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
  const response = await fetchJson<ApiResponse<Task>>(
    `/api/projects/create-project-task`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ projectId, taskDescription }),
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
  const response = await fetchJson<ApiResponse<Task>>(
    `/api/projects/update-task`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ projectId, taskId, ...updates }),
    },
  );
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to update task");
  }
  return response.data;
}

export async function deleteProjectTask(projectId: string, taskId: string) {
  const headers = await getAuthHeaders();
  const response = await fetchJson<ApiResponse<null>>(
    `/api/projects/delete-task`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ projectId, taskId }),
    },
  );
  if (!response.success) {
    throw new Error(response.error || "Failed to delete task");
  }
}
