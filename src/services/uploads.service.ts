import {
  MOCK_CURRENT_UPLOADS,
  MOCK_DEPT_MAP,
  MOCK_EMPLOYEES,
  MOCK_UPLOADS,
} from "@/mock";
import type { UploadRow } from "@/types";

export interface CreateUploadInput {
  name: string;
  size: number;
}

const FALLBACK_EMPLOYEE = MOCK_EMPLOYEES[0]!;

export function getCurrentUploadWeekLabel(): string {
  return MOCK_CURRENT_UPLOADS[0]?.weekLabel ?? "Current week";
}

export async function getUploads(): Promise<UploadRow[]> {
  return Promise.resolve(MOCK_UPLOADS);
}

export async function createUpload(input: CreateUploadInput): Promise<UploadRow> {
  const newUpload: UploadRow = {
    id: `local_${Date.now()}`,
    fileName: input.name,
    uploadedAt: new Date().toISOString(),
    status: "PENDING",
    userId: FALLBACK_EMPLOYEE.id,
    user: {
      id: FALLBACK_EMPLOYEE.id,
      name: FALLBACK_EMPLOYEE.name,
      email: FALLBACK_EMPLOYEE.email,
      role: FALLBACK_EMPLOYEE.role,
    },
    department: MOCK_DEPT_MAP[FALLBACK_EMPLOYEE.id] ?? "Unknown",
    weekLabel: getCurrentUploadWeekLabel(),
    fileSizeBytes: input.size,
  };

  return Promise.resolve(newUpload);
}
