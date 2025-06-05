import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getSupportTicketById,
  getSupportTickets,
  getSupportTicketsCount,
  getTicketChatMessages,
  sendTicketChatMessage,
  updateTicketStatus,
} from "../api/support-tickets";
import { handleError } from "../../util";
import { toast } from "sonner";

export const fetchTickets = (status: string) => {
  return useQuery({
    queryKey: ["getSupportTickets", status],
    queryFn: () => getSupportTickets(status),
    staleTime: 60 * 1000 * 5,
  });
};

export const fetchTicketsCount = () => {
  return useQuery({
    queryKey: ["getSupportTicketsCount"],
    queryFn: getSupportTicketsCount,
    staleTime: 60 * 1000 * 10,
  });
};

export const fetchTicketById = (id: string) => {
  return useQuery({
    queryKey: ["getSupportTicketById", id],
    queryFn: () => getSupportTicketById(id),
  });
};

export const sendChatSupportMessage = () => {
  return useMutation({
    mutationKey: ["sendChatSupportMessage"],
    mutationFn: sendTicketChatMessage,
    onSuccess: (data) => {
      toast.success("Message sent successfully");

      return data;
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const fecthSupportChatMessage = (id: string) => {
  return useQuery({
    queryKey: ["fecthSupportChatMessage", id],
    queryFn: () => getTicketChatMessages(id),
    staleTime: 60 * 1000 * 3,
  });
};

export const ticketStatusUpdate = () => {
  return useMutation({
    mutationKey: ["ticketStatusUpdate"],
    mutationFn: updateTicketStatus,
    onSuccess: (data) => {
      toast.success("Status updated successfully");

      return data;
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};
