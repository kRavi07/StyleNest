import { useQuery } from "@tanstack/react-query";
import { loadAdmin } from "../api/auth";

export const useLoadAdmin = () => {
  return useQuery({
    queryKey: ["loadAdmin"],
    queryFn: () => loadAdmin(),
    staleTime: 60 * 1000 * 2,
    retry: 1,
  });
};
