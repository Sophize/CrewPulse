import { TaskStatus } from "@prisma/client";

import { fetchJson } from "@/api/client";

export interface EmployeeStatusResponse {
  taskStatus: TaskStatus;
  currentLearning: string | null;
  updatedAt: string;
}

export interface UpdateEmployeeStatusInput {
  taskStatus: TaskStatus;
  currentLearning?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getEmployeeStatus() {
  const response = await fetchJson<
    ApiResponse<EmployeeStatusResponse>
  >("/api/employee/status");

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch employee status");
  }

  return response.data;
}

export async function updateEmployeeStatus(
  input: UpdateEmployeeStatusInput,
) {
  const response = await fetchJson<
    ApiResponse<EmployeeStatusResponse>
  >("/api/employee/status", {
    method: "PUT",
    body: JSON.stringify(input),
  });

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to update employee status");
  }

  return response.data;
}
