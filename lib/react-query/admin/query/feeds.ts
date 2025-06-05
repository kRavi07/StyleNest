import { useMutation } from "@tanstack/react-query";
import { AddFeed, UpdateFeed } from "../api/feeds";
import { toast } from "sonner";
import { error } from "console";

export const useAddFeeds = () => {
  return useMutation({
    mutationKey: ["addFeeds"],
    mutationFn: AddFeed,

    onSuccess: (data) => {
      toast.success("Feed has been added successfully");
    },

    onError: (error) => {
      console.log(error);
      toast.error(error?.message);
    },
  });
};

export const updateFeed = () => {
  return useMutation({
    mutationKey: ["updateFeeds"],
    mutationFn: UpdateFeed,
    onSuccess: (data) => {
      toast.success("Feed has been updated successfully");
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};
