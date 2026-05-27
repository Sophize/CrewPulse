import type { UserSummary } from "./user";

export type UploadStatus = "UPDATED" | "PENDING" | "LATE" | "MISSING";

export interface Upload {
  id: string;
  fileName: string;
  uploadedAt: string; // ISO 8601 string
  status: UploadStatus;
  userId: string;
  user: UserSummary;
}

export interface UploadRow extends Upload {
  department: string;
  weekLabel: string;
  fileSizeBytes?: number;
}
