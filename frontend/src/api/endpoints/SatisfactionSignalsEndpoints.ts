import { useQuery } from "@tanstack/react-query";
import { getSatisfactionSignals } from "@/api/serviceAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSatisfactionSignal } from "@/api/serviceAPI";
import toast from "react-hot-toast";


export function useSatisfactionSignals() {
  return useQuery({
    queryKey: ["all_signals"],
    queryFn: getSatisfactionSignals,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}


export function useCreateSatisfactionSignal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createSatisfactionSignal(data),
    onSuccess: () => {
      toast.success("Satisfaction Signal created successfully");
      queryClient.invalidateQueries({ queryKey: ["all_signals"] });
    },
    onError: (error: any) => {
      toast.error("Failed to save Satisfaction Signal.");
      if (error?.message) toast.error(error.message);
    },
  });
}
