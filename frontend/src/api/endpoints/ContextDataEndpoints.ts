import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getContextData, createContextData } from "@/api/serviceAPI";

// ------------------------
// Fetch Context Data
// ------------------------
export function useContextData() {
  return useQuery({
    queryKey: ["context_data"],
    queryFn: getContextData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// ------------------------
// Create Context Data
// ------------------------
export function useCreateContextData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createContextData(data),
    onSuccess: () => {
      toast.success("Context Data created successfully");
      queryClient.invalidateQueries({ queryKey: ["context_data"] });
    },
    onError: (error: any) => {
      toast.error("Failed to save Context Data.");
      if (error?.message) toast.error(error.message);
    },
  });
}
