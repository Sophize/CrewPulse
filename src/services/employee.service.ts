import { TaskStatus } from "@prisma/client";

import { fetchJson, getAuthHeaders } from "@/api/client";
export interface EmployeeStatusResponse {
  id: string;
  taskStatus: TaskStatus;
  currentLearning: string | null;
  learningDetails: string | null;
  learningStatus: string | null;
  currentTask: string | null;
  timesheetUrl: string | null;
  timesheetUpdatedAt: string | null;
  updatedAt: string;
}

export interface UpdateEmployeeStatusInput {
  taskStatus: TaskStatus;
  currentLearning?: string;
  learningDetails?: string;
  learningStatus?: string;
  currentTask?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getEmployeeStatus() {
  const headers = await getAuthHeaders();

  const response = await fetchJson<ApiResponse<EmployeeStatusResponse>>(
    "/api/employee/status",
    {
      headers,
    },
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch employee status");
  }

  return response.data;
}

export async function updateEmployeeStatus(input: UpdateEmployeeStatusInput) {
  const headers = await getAuthHeaders();
  const response = await fetchJson<ApiResponse<EmployeeStatusResponse>>(
    "/api/employee/status",
    {
      method: "PUT",
      headers,
      body: JSON.stringify(input),
    },
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to update employee status");
  }

  return response.data;
}
