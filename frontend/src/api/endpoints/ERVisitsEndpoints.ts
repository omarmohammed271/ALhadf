import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "../authAPI";
import { createERVisit, getERVisits } from "../serviceAPI";
import toast from "react-hot-toast";


export function useUsers() {
    return useQuery({
      queryKey: ["all_users"],
      queryFn: getUsers,
      staleTime: 5 * 60 * 1000, // cache 5 minutes
      refetchOnWindowFocus: false,
    });
  }

export function useERVisits() {
    return useQuery({
      queryKey: ["all_visits"],
      queryFn: getERVisits,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });
  }

  export function useCreateERVisit() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data: any) => createERVisit(data),
      onSuccess: (data) => {
        toast.success("ER Visit created successfully");
        queryClient.invalidateQueries({ queryKey: ["all_visits"] }); // refresh visits list
      },
      onError: (error: any) => {
        toast.error("Failed to save ER Visit.");
        if (error?.message) toast.error(error.message);
      },
    });
  }