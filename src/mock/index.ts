// Single entry point for all mock data.
// Components import from "@/mock" — never from sub-files directly.
// When real API hooks replace these, only this file and the hooks change.

export {
  MOCK_USERS,
  MOCK_USERS_BY_ID,
  MOCK_EMPLOYEES,
  MOCK_DEPT_MAP,
} from "./users";
export { MOCK_UPLOADS, MOCK_CURRENT_UPLOADS } from "./uploads";
export { MOCK_TIMESHEETS, MOCK_WEEK_SUMMARY } from "./timesheets";

import { MOCK_EMPLOYEES, MOCK_DEPT_MAP } from "./users";
import { MOCK_CURRENT_UPLOADS } from "./uploads";
import type { DashboardStats } from "@/types/dashboard";
import type { DeptStat } from "@/types/timesheet";

// ── Derived summary object ────────────────────────────────────────
// Consumed by the 4-up stats row on Dashboard and Admin pages.
// All values are computed from the mock arrays above so they stay
// consistent — no magic numbers that drift from the real data.

const updatedCount = MOCK_CURRENT_UPLOADS.filter(
  (u) => u.status === "UPDATED",
).length;

const lateCount = MOCK_CURRENT_UPLOADS.filter(
  (u) => u.status === "LATE",
).length;

const pendingCount = MOCK_CURRENT_UPLOADS.filter(
  (u) => u.status === "PENDING",
).length;

const missingCount = MOCK_CURRENT_UPLOADS.filter(
  (u) => u.status === "MISSING",
).length;

const totalEmployees = MOCK_EMPLOYEES.length;

// Compliance = UPDATED only (late is non-compliant).
const complianceRate = Math.round((updatedCount / totalEmployees) * 100);

// Per-department compliance breakdown.
const departments = [...new Set(Object.values(MOCK_DEPT_MAP))].sort();

const deptCompliance: DeptStat[] = departments.map((dept) => {
  const deptUserIds = Object.entries(MOCK_DEPT_MAP)
    .filter(([, d]) => d === dept)
    .map(([id]) => id);

  const total = deptUserIds.length;
  const submitted = MOCK_CURRENT_UPLOADS.filter(
    (u) => deptUserIds.includes(u.userId) && u.status === "UPDATED",
  ).length;

  return {
    department: dept,
    submittedCount: submitted,
    totalCount: total,
    rate: Math.round((submitted / total) * 100),
  };
});

// 5 most recent uploads (for the dashboard recent-uploads panel).
const recentUploads = [...MOCK_CURRENT_UPLOADS]
  .filter((u) => u.uploadedAt !== "")
  .sort(
    (a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  )
  .slice(0, 5);

export const MOCK_STATS: DashboardStats = {
  totalEmployees,
  updatedCount,
  lateCount,
  pendingCount,
  missingCount,
  missingLateCount: missingCount + lateCount,
  complianceRate: `${complianceRate}%`,
  complianceRateNum: complianceRate,
  deptCompliance,
  recentUploads,
};
