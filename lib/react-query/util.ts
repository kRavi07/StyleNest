import { isAxiosError } from "axios";
import { toast } from "sonner";

import axios from "axios";

/**
 * Handles API errors for Axios requests.
 * @param error - The error object caught in the Axios request.
 * @returns A string message describing the error.
 */
export const handleError = (error: unknown): string => {
  // Check if the error is an Axios error
  if (axios.isAxiosError(error)) {
    // Handle response errors (server-side)
    if (error.response) {
      const { status, data } = error.response;

      // Extract specific error message if available
      if (data && typeof data === "object" && "message" in data) {
        return String(data.message);
      }

      // Fallback to status code and default error message
      return `Error ${status}: ${
        data?.error || data?.title || "An unexpected error occurred."
      }`;
    }

    // Handle request errors (e.g., no response received)
    if (error.request) {
      return "No response from server. Please check your network connection.";
    }

    // Handle any other Axios error
    return error.message || "An unexpected error occurred with the request.";
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    return error.message;
  }

  // Generic fallback for unknown errors
  return "An unexpected error occurred. Please try again later.";
};

export const createFormData = (key: string[], value: any[]) => {
  let formData = new FormData();
  key.forEach((k, i) => {
    formData.append(k, value[i]);
  });
  return formData;
};

export const getSellerToken = () => {
  try {
    const data = localStorage.getItem("bizGrowth-seller");
    if (data !== null) {
      return JSON.parse(data).state.token;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};

export const getAdminToken = () => {
  try {
    const data = localStorage.getItem("bizGrowth-admin");
    if (data !== null) {
      return JSON.parse(data).state.token;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};

export const getUserToken = () => {
  try {
    const data = localStorage.getItem("bizGrowth");
    if (data !== null) {
      return JSON.parse(data).state.token;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};
