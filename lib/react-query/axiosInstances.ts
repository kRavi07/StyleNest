// publicAxios.ts
import axios from "axios";
import { getAuthToken } from "../auth";
import { toast } from "@/hooks/use-toast";

const API_URL = "http://localhost:3000/api/";

const publicAxios = axios.create({
  baseURL: API_URL,
});

publicAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === "Network Error") {
      toast({
        title: "Network error. Check your internet connection.",
        variant: "destructive",
      });
    } else {
      console.log(error.response);
      toast({
        title: error.response.data.error,
        variant: "destructive",
      });
    }
    return Promise.reject(error);
  }
);

const protectedAxios = axios.create({
  baseURL: API_URL,
});

protectedAxios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

protectedAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      toast({
        title:
          error.response.data.error || "Unauthorized! Please log in again.",
        description:
          "Your session has expired or you are not authorized to access this resource.",
        variant: "destructive",
      });

      // Optional: add logout or redirect logic here
    } else if (status === 403) {
      toast({
        title: "Forbidden! You do not have permission to access this resource.",
        description: "Please check your permissions or contact support.",
        variant: "destructive",
      });
    } else if (status === 404) {
      toast({
        title:
          error.response.data.error ||
          "Resource not found! The requested resource could not be found.",
        description:
          "Please check the URL or contact support if you believe this is an error.",
        variant: "destructive",
      });
    } else if (status === 500) {
      toast({
        title:
          error.response.data.error ||
          "Internal Server Error! Something went wrong on our end.",
        description:
          "Please try again later or contact support if the issue persists.",
        variant: "destructive",
      });
    } else if (error.message === "Network Error") {
      toast({
        title: "Network error. Check your internet connection.",
        variant: "destructive",
      });
    } else {
      toast({
        title: error.response.data.error || "An unexpected error occurred.",
        variant: "destructive",
      });
    }

    return Promise.reject(error);
  }
);

export { publicAxios, protectedAxios };
