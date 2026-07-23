import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/api/queryKeys";
import {
  getProjects,
  getProjectTasks,
  createProjectTask,
  updateProjectTask,
  deleteProjectTask,
} from "@/services/project.service";

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: getProjects,
  });
}

export function useProjectTasks(projectId: string) {
  return useQuery({
    queryKey: queryKeys.projectTasks(projectId),
    queryFn: () => getProjectTasks(projectId),
    enabled: !!projectId,
  });
}

export function useCreateProjectTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskDescription: string) =>
      createProjectTask(projectId, taskDescription),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projectTasks(projectId),
      });
    },
  });
}

export function useUpdateProjectTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      updates,
    }: {
      taskId: string;
      updates: { taskDescription?: string; status?: string };
    }) => updateProjectTask(projectId, taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projectTasks(projectId),
      });
    },
  });
}

export function useDeleteProjectTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteProjectTask(projectId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projectTasks(projectId),
      });
    },
  });
}
