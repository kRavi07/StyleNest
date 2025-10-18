import { useQuery } from "@tanstack/react-query";
import { getDashboardAnalytics, salesReportAnalytics } from "../api/analytics";

export const useGetDashboardAnalytics = (days: number) => {
  return useQuery({
    queryKey: ["getDashboardAnalytics", days],
    queryFn: () => getDashboardAnalytics(days),
    staleTime: 60 * 1000 * 10 * 60 * 1,
  });
};

export const useGetSalesAnalyticsReport = (
  startDate: string,
  endDate: string,
  type: string
) => {
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  startDate = formatDate(new Date(startDate));
  endDate = formatDate(new Date(endDate));

  return useQuery({
    queryKey: ["getAnalytics", startDate, endDate, type],
    queryFn: () => salesReportAnalytics({ startDate, endDate, type }),
    staleTime: 60 * 1000 * 10 * 60 * 1,
  });
};
