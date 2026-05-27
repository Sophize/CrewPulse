import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/api/queryKeys";
import { getTimesheets } from "@/services/timesheets.service";

export function useTimesheets() {
  return useQuery({
    queryKey: queryKeys.timesheets,
    queryFn: getTimesheets,
  });
}
