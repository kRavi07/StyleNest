import { publicAxios as axios } from "../axiosInstances";
import { AddProductProps, UserRegistrationRequest } from "../query.type";
import { handleError, createFormData, getSellerToken } from "../util";

const API_URL = "http://localhost:3000/api/"; // Update with your actual API URL

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });

  return res.data.data;
};

export const useRegister = async (data: UserRegistrationRequest) => {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, data);
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const addProduct = async ({
  product_name,
  discription,
  price,
  quantity,
  category,
  files,
}: AddProductProps) => {
  try {
    const token = getSellerToken();

    const res = await axios.post(
      `${API_URL}/add-product`,
      createFormData(
        [
          "product_name",
          "discription",
          "price",
          "quantity",
          "category",
          "files",
        ],
        [product_name, discription, price, quantity, category, files]
      ),
      {
        headers: {
          "Content-Type": "multipart/form-data",
          token,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    handleError(error);
  }
};
