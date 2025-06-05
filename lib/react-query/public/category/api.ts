import axios from "axios";
import { handleError } from "../../util";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
export const fetchCategory = async () => {
  try {
    const res = await axios.get(`${API_URL}/admin/category`);

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getCategoriesList = async () => {
  try {
    const res = await axios.get(`${API_URL}/categories`);

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

//get featured category
export const getFeaturedCategory = async () => {
  try {
    const res = await axios.get(`${API_URL}/featured-category`);

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
