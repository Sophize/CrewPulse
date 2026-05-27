import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/api/queryKeys";
import { getAnalytics } from "@/services/analytics.service";

export function useAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics,
    queryFn: getAnalytics,
  });
}
