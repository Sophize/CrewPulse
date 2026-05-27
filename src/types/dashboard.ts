import type { DeptStat } from "./timesheet";
import type { UploadRow } from "./upload";

export interface DashboardStats {
  totalEmployees: number;
  updatedCount: number;
  lateCount: number;
  pendingCount: number;
  missingCount: number;
  missingLateCount: number;
  complianceRate: string;
  complianceRateNum: number;
  deptCompliance: DeptStat[];
  recentUploads: UploadRow[];
}
