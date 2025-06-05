import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

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
