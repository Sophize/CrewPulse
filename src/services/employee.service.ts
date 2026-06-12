import { TaskStatus } from "@prisma/client";

import { fetchJson } from "@/api/client";
import { auth } from "@/firebase/config";

export interface EmployeeStatusResponse {
  taskStatus: TaskStatus;
  currentLearning: string | null;
  learningDetails: string | null;
  learningStatus: string | null;
  updatedAt: string;
}

export interface UpdateEmployeeStatusInput {
  taskStatus: TaskStatus;
  currentLearning?: string;
  learningDetails?: string;
  learningStatus?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
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
