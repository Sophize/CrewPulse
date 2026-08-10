import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/api/queryKeys";
import {
  getMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} from "@/services/meeting.service";

export function useMeetings(projectId: string) {
  return useQuery({
    queryKey: queryKeys.meetingSchedules(projectId),
    queryFn: () => getMeetings(projectId),
    enabled: !!projectId,
  });
}

export function useCreateMeeting(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      clientTimeZone: string;
      scheduledAt: string;
    }) => createMeeting({ projectId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.meetingSchedules(projectId),
      });
    },
  });
}

export function useUpdateMeeting(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      meetingId: string;
      clientTimeZone?: string;
      scheduledAt?: string;
    }) => updateMeeting({ projectId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.meetingSchedules(projectId),
      });
    },
  });
}

export function useDeleteMeeting(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (meetingId: string) => deleteMeeting(meetingId, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.meetingSchedules(projectId),
      });
    },
  });
}
