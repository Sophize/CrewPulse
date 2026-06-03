import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/api/queryKeys";
import { getActivityFeed } from "@/services/activity.service";

export function useActivityFeed() {
  return useQuery({
    queryKey: queryKeys.activityFeed,
    queryFn: getActivityFeed,
  });
}
