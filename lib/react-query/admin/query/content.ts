// ... existing code ...

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createContentItem,
  deleteContentItem,
  deleteFileFromContentItem,
  getAllContents,
  getContentWithKey,
  updateFileContentItem,
} from "../api/content";
import { toast } from "sonner";

export const useGetContentWithKey = (contentKey: string) => {
  return useQuery({
    queryKey: ["getContentWithKey", contentKey],
    queryFn: () => getContentWithKey(contentKey),

    staleTime: 60 * 1000 * 2,
  });
};

export const useCreateContent = () => {
  return useMutation({
    mutationKey: ["createContent"],
    mutationFn: createContentItem,
    onSuccess: (data) => {
      toast.success("Content has been create successfully");
      return data;
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const useUpdateFileContentItem = () => {
  return useMutation({
    mutationKey: ["updateContent"],
    mutationFn: updateFileContentItem,
    onSuccess: (data) => {
      toast.success("Content has been updated successfully");
      return data;
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const useDeleteFileContentFromItem = () => {
  return useMutation({
    mutationKey: ["deleteFileFromContent"],
    mutationFn: deleteFileFromContentItem,
    onSuccess: (data) => {
      toast.success("File has been delete successfully");
      return data;
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const useDeleteContent = (id: string) => {
  return useMutation({
    mutationKey: ["deleteContent", id],
    mutationFn: () => deleteContentItem(id),
    onSuccess: (data) => {
      toast.success("Content has been deleted successfully");
      return data;
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export const useGetAllContents = () => {
  return useQuery({
    queryKey: ["getAllContents"],
    queryFn: getAllContents,
    staleTime: 60 * 2 * 1000,
  });
};
