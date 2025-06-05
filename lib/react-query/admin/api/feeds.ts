import axios from "axios";
import axiosInstance, { setAuthToken } from "../axiosInstance";
import { getAdminToken, handleError } from "../../util";
import { FeedInfoTable, FeedsProps } from "../../query.type";

const token = getAdminToken();
export const AddFeed = async ({ title, content, feedDocument }: FeedsProps) => {
  try {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    if (feedDocument !== undefined) {
      for (var i = 0; i < feedDocument.length; i++) {
        formData.append("files", feedDocument[i]);
      }
    }

    setAuthToken(token);
    const res = await axiosInstance.post("/admin/add-feed", formData, {
      headers: {
        "Content-Type": "mutlipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.log(error);
    handleError(error);
  }
};

export const UpdateFeed = async ({
  FeedID,
  Title,
  Content,
  FeedDocument,
}: FeedInfoTable) => {
  try {
    const formData = new FormData();

    formData.append("title", Title);
    formData.append("content", Content);
    if (FeedDocument !== undefined) {
      for (var i = 0; i < FeedDocument.length; i++) {
        formData.append("files", FeedDocument[i]);
      }
    }

    setAuthToken(token);
    const res = await axiosInstance.post(
      `/admin/update-feed?id=${FeedID}`,
      formData,
      {
        headers: {
          "Content-Type": "mutlipart/form-data",
        },
      }
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
