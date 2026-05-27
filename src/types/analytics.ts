import type { DashboardStats } from "./dashboard";

export interface WeeklyTrendPoint {
  week: string;
  rate: number;
  submitted: number;
}

export interface PeakSubmissionHour {
  hour: string;
  pct: number;
}

export interface AnalyticsData {
  stats: DashboardStats;
  weeklyTrend: WeeklyTrendPoint[];
  peakSubmissionHours: PeakSubmissionHour[];
  previousDepartmentRates: Record<string, number>;
}
