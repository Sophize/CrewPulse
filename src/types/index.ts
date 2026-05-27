// Single entry point for all shared types.
// Import from "@/types" throughout the app — never import from sub-files
// directly, so re-exporting or restructuring later is painless.

export type { UserRole, User, UserSummary } from "./user";

export type { UploadStatus, Upload, UploadRow } from "./upload";

export type {
  DayHours,
  TimesheetRow,
  WeekSummary,
  DeptStat,
} from "./timesheet";
