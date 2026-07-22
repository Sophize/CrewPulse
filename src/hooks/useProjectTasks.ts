import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/api/queryKeys";
import {
  createProjectTask,
  deleteProjectTask,
  updateProjectTask,
  getProjectTasks,
  getProjectMeeting,
  saveMeeting,
} from "@/services/projectTasks.service";

export function useProjectTasks(project: string) {
  return useQuery({
    queryKey: queryKeys.projectTasks(project),
    queryFn: () => getProjectTasks(project),
    enabled: !!project,
  });
}

export function useProjectMeeting(project: string) {
  return useQuery({
    queryKey: ["project-meeting", project],
    queryFn: () => getProjectMeeting(project),
    enabled: !!project,
  });
}

export function useCreateProjectTask(project: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProjectTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projectTasks(project),
      });
    },
  });
}

export function useDeleteProjectTask(project: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projectTasks(project),
      });
    },
  });
}

export function useSaveProjectMeeting(project: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveMeeting,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projectTasks(project),
      });
      queryClient.invalidateQueries({
        queryKey: ["project-meeting", project],
      });
    },
  });
}

export function useUpdateProjectTask(project: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...input }: { id: string; taskStatus?: import("@prisma/client").TaskStatus; assignTask?: string; meetingTime?: Date | null; meetingPurpose?: string; }) => updateProjectTask(id, input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projectTasks(project),
      });
    },
  });
}
