import { useQuery } from "@tanstack/react-query";
import {
  getAllRequirementMessages,
  getRequirementMessage,
} from "../api/requirement";

export const useGetAllRequirementMessages = () => {
  return useQuery({
    queryKey: ["getAllRequirementMessages"],
    queryFn: () => getAllRequirementMessages(),
  });
};

export const useGetRequirementMessage = (id: string) => {
  return useQuery({
    queryKey: ["getRequirementMessage"],
    queryFn: () => getRequirementMessage(id),
  });
};
