import type { UploadStatus } from "./upload";
import type { UserSummary } from "./user";

export interface DayHours {
  date: string; // ISO date string "2025-05-19"
  hours: number | null;
}

export interface TimesheetRow {
  userId: string;
  user: UserSummary;
  department: string;
  weekStart: string;
  weekEnd: string;
  weekLabel: string;
  days: DayHours[];
  totalHours: number | null;
  status: UploadStatus;
}

export interface WeekSummary {
  weekLabel: string;
  totalHoursLogged: number;
  averageHoursPerEmployee: number;
  exceptionCount: number;
  employeeCount: number;
}

export interface DeptStat {
  department: string;
  submittedCount: number;
  totalCount: number;
  rate: number;
}
