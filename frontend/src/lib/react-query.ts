import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60 * 1, // 1 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 3,
    },
  },
});