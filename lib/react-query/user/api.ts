import axios, { AxiosRequestConfig } from "axios";
import { createFormData, getUserToken, handleError } from "../util";
import { RegisterFormProps } from "@/app/auth/register/RegisterForm";
import { API_URL } from "@/lib/configs/constants";

export const sendProductEnquiry = async (data: any) => {
  try {
    //modify quantity from string to integer
    data.quantity = parseInt(data.quantity);

    console.log(data);
    const userToken = getUserToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: userToken,
      },
    };

    const res = await axios.post(`${API_URL}/product-enquiry`, data, config);
    return res.data;
  } catch (error) {
    throw new Error("SOmething went wrong");
  }
};

export const updateUserDetails = async ({
  mobileno,
  user_name,
  email,
  user_address,
}: RegisterFormProps) => {
  try {
    const res = await axios.post(
      `${API_URL}/update-user`,
      createFormData(
        ["mobileno", "user_name", "email", "user_address"],
        [mobileno, user_name, email, user_address]
      )
    );
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const getUserEnquiries = async () => {
  try {
    const userToken = getUserToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: userToken,
      },
    };
    const res = await axios.get(`${API_URL}/get-enquiry`, config);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const loadUser = async () => {
  try {
    const token = getUserToken();

    const res = await axios.get(`${API_URL}/load-user`, {
      headers: {
        token: token,
      },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateProfile = async (data: any) => {
  try {
    const token = getUserToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    };
    const res = await axios.put(`${API_URL}/user/update-profile`, data, config);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const postReview = async (data: any) => {
  try {
    const token = getUserToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    };

    const res = await axios.post(`${API_URL}/post-review`, data, config);

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
