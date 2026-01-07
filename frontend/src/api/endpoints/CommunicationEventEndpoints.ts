import { useQuery } from "@tanstack/react-query";
import { getCommunicationEvents } from "@/api/serviceAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommunicationEvent } from "@/api/serviceAPI";
import toast from "react-hot-toast";

export function useCommunicationEvents() {
  return useQuery({
    queryKey: ["comm_events"],
    queryFn: getCommunicationEvents,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateCommunicationEvent() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data: any) => createCommunicationEvent(data),
      onSuccess: () => {
        toast.success("Communication Event created successfully");
        queryClient.invalidateQueries({ queryKey: ["comm_events"] });
      },
      onError: (error: any) => {
        toast.error("Failed to save Communication Event.");
        if (error?.message) toast.error(error.message);
      },
    });
}