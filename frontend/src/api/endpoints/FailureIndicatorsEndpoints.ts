// hooks/useFailureIndicators.ts
import { useQuery } from "@tanstack/react-query";
import { getFailureIndicators } from "@/api/serviceAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFailureIndicator } from "@/api/serviceAPI";
import toast from "react-hot-toast";


export function useFailureIndicators() {
  return useQuery({
    queryKey: ["failures"],
    queryFn: getFailureIndicators,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}


export function useCreateFailureIndicator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createFailureIndicator(data),
    onSuccess: () => {
      toast.success("Failure Indicator created successfully");
      queryClient.invalidateQueries({ queryKey: ["failures"] });
    },
    onError: (error: any) => {
      toast.error("Failed to save Failure Indicator.");
      if (error?.message) toast.error(error.message);
    },
  });
}
