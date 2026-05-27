import { MOCK_STATS } from "@/mock";
import type { DashboardStats } from "@/types/dashboard";

export async function getDashboardStats(): Promise<DashboardStats> {
  return Promise.resolve(MOCK_STATS);
}
