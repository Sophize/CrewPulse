import { MOCK_TIMESHEETS, MOCK_WEEK_SUMMARY } from "@/mock";
import type { TimesheetRow, WeekSummary } from "@/types";

export interface TimesheetsResult {
  rows: TimesheetRow[];
  summary: WeekSummary;
}

export async function getTimesheets(): Promise<TimesheetsResult> {
  return Promise.resolve({
    rows: MOCK_TIMESHEETS,
    summary: MOCK_WEEK_SUMMARY,
  });
}
