import { useQuery } from "@tanstack/react-query";
import { fetchERDashboard } from "@/api/serviceAPI";

export const useERDashboard = () =>
  useQuery({
    queryKey: ["er-dashboard"],
    queryFn: fetchERDashboard,
    staleTime: 60_000, // 1 min
    refetchInterval: 60_000, // live dashboard
  });
