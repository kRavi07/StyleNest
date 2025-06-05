import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  createBlog,
  getBlogs,
  getBlogById,
  publishBlog,
  updateBlog,
  archiveBlog,
  deleteBlog,
} from "../api/blog";
import { PublishBlogProps } from "../../query.type";
import { toast } from "sonner";

export const useCreateBlog = () => {
  return useMutation({
    mutationFn: createBlog,
    mutationKey: ["createBlog"],
    onSuccess: (data) => {
      toast.success("Created successfully");
      return data;
    },
    onError: (error) => {
      console.error("Error creating blog:", error);
      return error;
    },
  });
};

export interface updateProps {
  blogData: PublishBlogProps;
  id: string;
}

export const useUpdateBlog = () => {
  return useMutation({
    mutationFn: updateBlog,
    mutationKey: ["updateBlog"],
    onSuccess: (data) => {
      toast.success("Updated Successfully");
      return data;
    },
    onError: (error) => {
      console.error("Error updating blog:", error);
      return error;
    },
  });
};

// ... existing code ...

export const useGetBlogs = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
    staleTime: 60 * 1000 * 10,
    gcTime: 60 * 10 * 1000,
  });
};

export const useGetBlogById = (id: string): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id),

    staleTime: 60 * 1000 * 5,
  });
};

export const usePublishBlog = () => {
  return useMutation({
    mutationKey: ["publishBlog"],
    mutationFn: (id: string) => publishBlog(id),
    onError: (error) => {
      console.error("Error publishing blog:", error);
      return error;
    },
  });
};

export const useArchiveBlog = () => {
  return useMutation({
    mutationKey: ["archive"],
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      archiveBlog(id, status),
    onSuccess: (data) => {
      toast.success("Blog has archived");
      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteBlog = (id: string) => {
  return useMutation({
    mutationKey: ["delete", id],
    mutationFn: () => deleteBlog(id),
    onSuccess: (data) => {
      toast.success("Blog has been deleted successfully");
      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
