import type {
  AnalyticsData,
  PeakSubmissionHour,
  WeeklyTrendPoint,
} from "@/types/analytics";
import { getDashboardStats } from "./dashboard.service";

const weeklyTrend: WeeklyTrendPoint[] = [
  { week: "Wk 17", rate: 71, submitted: 71 },
  { week: "Wk 18", rate: 76, submitted: 76 },
  { week: "Wk 19", rate: 68, submitted: 68 },
  { week: "Wk 20", rate: 80, submitted: 80 },
  { week: "Wk 21", rate: 70, submitted: 70 },
];

const peakSubmissionHours: PeakSubmissionHour[] = [
  { hour: "8-9 AM", pct: 22 },
  { hour: "9-10 AM", pct: 45 },
  { hour: "10-11 AM", pct: 18 },
  { hour: "11-12 PM", pct: 8 },
  { hour: "After 6PM", pct: 7 },
];

const previousDepartmentRates: Record<string, number> = {
  Engineering: 80,
  Design: 70,
  Marketing: 68,
  Sales: 48,
};

export async function getAnalytics(): Promise<AnalyticsData> {
  const stats = await getDashboardStats();

  return Promise.resolve({
    stats,
    weeklyTrend,
    peakSubmissionHours,
    previousDepartmentRates,
  });
}
