import { useQuery } from "@tanstack/react-query";
import { getDashboardAnalytics } from "../api/analytics";

export const useGetDashboardAnalytics = (days: number) => {
  return useQuery({
    queryKey: ["getDashboardAnalytics", days],
    queryFn: () => getDashboardAnalytics(days),
    staleTime: 60 * 1000 * 10,
  });
};
