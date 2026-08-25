import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/api/queryKeys";
import { getUpcomingLeaves } from "@/services/leave.service";

export function useUpcomingLeaves() {
  return useQuery({
    queryKey: queryKeys.leaves,
    queryFn: getUpcomingLeaves,
  });
}