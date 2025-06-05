import { createFormData, getAdminToken, handleError } from "../../util";
import axiosInstance, { setAuthToken } from "../axiosInstance";

const token = getAdminToken();

export const getSupportTickets = async (status: string) => {
  try {
    setAuthToken(token);

    const res = await axiosInstance.get(`/admin/getTickets`, {
      params: { status },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getSupportTicketsCount = async () => {
  try {
    const token = getAdminToken();

    setAuthToken(token);

    const res = await axiosInstance.get(`/admin/tickets/count`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getSupportTicketById = async (id: string) => {
  try {
    const token = getAdminToken();

    setAuthToken(token);

    const res = await axiosInstance.get(`/admin/ticket/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getTicketChatMessages = async (id: string) => {
  try {
    const token = getAdminToken();
    setAuthToken(token);
    const res = await axiosInstance.get(`/admin/ticket/chat/messages/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const sendTicketChatMessage = async ({
  id,
  message,
}: {
  id: string;
  message: string;
}) => {
  try {
    const token = getAdminToken();
    setAuthToken(token);
    const res = await axiosInstance.post(
      `/admin/ticket/chat/message/${id}`,
      {
        message,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

//update status of ticket
export const updateTicketStatus = async ({
  id,
  status,
}: {
  id: string;
  status: "Initiated" | "Closed" | "In Progress";
}) => {
  try {
    const token = getAdminToken();
    setAuthToken(token);

    const formData = new FormData();

    formData.append("status", status);

    const res = await axiosInstance.post(
      `/admin/ticket/update/status/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
