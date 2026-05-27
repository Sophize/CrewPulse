// Timesheet types are not yet in the Prisma schema — they will be
// added in a future migration. These types define the shape the UI
// expects so components can be built now without blocking on the DB.

import type { UploadStatus } from "./upload";
import type { UserSummary } from "./user";

// Hours logged for a single working day.
// null means no entry exists (not 0 — distinguishes absence from zero).
export interface DayHours {
  date: string; // ISO date string "2025-05-19"
  hours: number | null;
}

// One row in the timesheets table — one employee, one week.
export interface TimesheetRow {
  userId: string;
  user: UserSummary;
  department: string;
  weekStart: string; // ISO date string — Monday of the week
  weekEnd: string; // ISO date string — Sunday of the week
  weekLabel: string; // Human-readable: "May 19 – 25"
  days: DayHours[]; // Always 5 entries: Mon–Fri
  totalHours: number | null;
  status: UploadStatus;
}

// Aggregated stats for the week summary cards.
export interface WeekSummary {
  weekLabel: string;
  totalHoursLogged: number;
  averageHoursPerEmployee: number;
  exceptionCount: number; // employees over 45h or under 35h
  employeeCount: number;
}

// Per-department submission breakdown used in bar/progress charts.
export interface DeptStat {
  department: string;
  submittedCount: number;
  totalCount: number;
  rate: number; // 0–100, pre-computed for display
}
