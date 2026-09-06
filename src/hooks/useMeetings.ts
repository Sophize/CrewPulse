import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/api/queryKeys";
import {
  getMeeting,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} from "@/services/meeting.service";

export function useMeetings(projectId: string) {
  return useQuery({
    queryKey: queryKeys.meetingSchedules(projectId),
    queryFn: () => getMeeting(projectId),
    enabled: !!projectId,
  });
}

export function useCreateMeeting(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      frequency: "DAILY" | "WEEKLY" | "MONTHLY";
      meetingTime: string;
      clientTimeZone: string;
      daysOfWeek: number[];
      datesOfMonth: number[];
    }) =>
      createMeeting({
        projectId,
        ...data,
      }),

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
      frequency: "DAILY" | "WEEKLY" | "MONTHLY";
      meetingTime: string;
      clientTimeZone: string;
      daysOfWeek: number[];
      datesOfMonth: number[];
    }) =>
      updateMeeting({
        projectId,
        ...data,
      }),

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
