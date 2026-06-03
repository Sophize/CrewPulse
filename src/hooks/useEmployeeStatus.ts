import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/api/queryKeys";
import {
  getEmployeeStatus,
  updateEmployeeStatus,
} from "@/services/employee.service";

export function useEmployeeStatus() {
  return useQuery({
    queryKey: queryKeys.employeeStatus,
    queryFn: getEmployeeStatus,
  });
}

export function useUpdateEmployeeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEmployeeStatus,
    onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: queryKeys.employeeStatus,
  });

  queryClient.invalidateQueries({
    queryKey: queryKeys.employees,
  });

  queryClient.invalidateQueries({
    queryKey: queryKeys.activityFeed,
  });
},
  });
}
