import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/api/queryKeys";
import {
  createUpload,
  getCurrentUploadWeekLabel,
  getUploads,
  type CreateUploadInput,
} from "@/services/uploads.service";
import type { UploadRow } from "@/types";

export function useUploads() {
  return useQuery({
    queryKey: queryKeys.uploads,
    queryFn: getUploads,
  });
}

export function useCreateUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUploadInput) => createUpload(input),
    onSuccess: (upload) => {
      queryClient.setQueryData<UploadRow[]>(queryKeys.uploads, (current) => [
        upload,
        ...(current ?? []),
      ]);
    },
  });
}

export { getCurrentUploadWeekLabel };
