import { CreateContentItemProps } from "../../query.type";
import { handleError } from "../../util";
import axiosInstance from "../axiosInstance";

export const getContentWithKey = async (contentKey: string) => {
  try {
    const res = await axiosInstance.get(`/content/get-by-key/${contentKey}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const createContentItem = async (data: CreateContentItemProps) => {
  try {
    const formData = new FormData();

    if (data.contentKey != null && data.contentKey != "") {
      formData.append("contentKey", data.contentKey);
    }

    if (data.type != null && data.type != "") {
      formData.append("type", data.type);
    }

    if (data.type === "file") {
      if (
        Array.isArray(data.content) &&
        data.content.every((item) => item instanceof File)
      ) {
        data.content.forEach((item) => formData.append("content", item));
      } else {
        throw new Error("For content type file only file is allowed");
      }
    } else if (data.content !== "") {
      formData.append("content", data.content);
    }

    if (data.description) {
      formData.append("description", data.description);
    }

    const response = await axiosInstance.post(
      "/admin/content/create",
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

export const toggleContentItemStatus = async (id: string) => {
  try {
    const response = await axiosInstance.post(
      `/admin/content/toggle-status/${id}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateFileContentItem = async (data: CreateContentItemProps) => {
  try {
    const formData = new FormData();
    data.content.forEach((file: File) => {
      formData.append("content", file);
    });
    const response = await axiosInstance.post(
      `/admin/content/update-file-content/${data.contentKey}`,
      formData
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

interface fileDeleteProps {
  contentItemId: string;
  index: number;
}

export const deleteFileFromContentItem = async (data: fileDeleteProps) => {
  try {
    const response = await axiosInstance.post(
      `/admin/content/delete-file-content/${data.contentItemId}/${data.index}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteContentItem = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/admin/content/delete/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllContents = async () => {
  try {
    const res = await axiosInstance.get("/admin/contents");
    return res.data;
  } catch (error) {}
};
