import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/api/queryKeys";
import { getEmployees } from "@/services/employees.service";

export function useEmployees() {
  return useQuery({
    queryKey: queryKeys.employees,
    queryFn: getEmployees,
  });
}
