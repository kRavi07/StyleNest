import axiosInstance, { setAuthToken } from "../axiosInstance";
import { getAdminToken, handleError } from "../../util";
import { PublishBlogProps } from "@/lib/react-query/query.type";
import { updateProps } from "../query/blog";

const token = getAdminToken();

export const createBlog = async (blogData: PublishBlogProps) => {
  try {
    setAuthToken(token);

    const formData = new FormData();

    // Append text fields
    formData.append("title", blogData.title);
    formData.append("subtitle", blogData.subtitle || "");
    formData.append("slug", blogData.slug || "");
    formData.append("author", blogData.author || "");
    formData.append("blogContent", blogData.blogContent);

    // Append keywords as a JSON string
    if (blogData.keywords && blogData.keywords.length > 0) {
      formData.append("keywords", JSON.stringify(blogData.keywords));
    }

    if (blogData.coverImage !== undefined) {
      formData.append("cover", blogData.coverImage);
    }

    const response = await axiosInstance.post("/admin/post-blog", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateBlog = async (blogData: updateProps) => {
  try {
    const formData = new FormData();

    // Append text fields
    formData.append("title", blogData.blogData.title);
    formData.append("subtitle", blogData.blogData.subtitle || "");
    formData.append("slug", blogData.blogData.slug || "");
    formData.append("author", blogData.blogData.author || "");
    formData.append("blogContent", blogData.blogData.blogContent);

    // Append keywords as a JSON string
    if (blogData.blogData.keywords && blogData?.blogData?.keywords.length > 0) {
      formData.append("keywords", JSON.stringify(blogData.blogData.keywords));
    }

    if (blogData.blogData.coverImage !== undefined) {
      formData.append("cover", blogData.blogData.coverImage);
    }

    const response = await axiosInstance.post(
      `/admin/blog/update/${blogData.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getBlogs = async () => {
  try {
    setAuthToken(token);
    const response = await axiosInstance.get("/admin/blogs");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBlogById = async (id: string) => {
  try {
    setAuthToken(token);
    const response = await axiosInstance.get(`/admin/blog/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const publishBlog = async (id: string) => {
  try {
    const response = await axiosInstance.post(`/admin/blog/publish/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const archiveBlog = async (id: string, status: boolean) => {
  try {
    const res = await axiosInstance.post(
      `/admin/blog/archive/${id}?status=${status}`
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteBlog = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/admin/blog/delete/${id}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
