import { API_URL } from "@/lib/configs/constants";
import axios from "axios";

// Create a new Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Function to set token in the headers
export const setAuthToken = (token: string) => {
  axiosInstance.defaults.headers.common["token"] = token;
};

export default axiosInstance;
