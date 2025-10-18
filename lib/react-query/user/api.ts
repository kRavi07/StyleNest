import axios from "axios";
import { getUserToken, handleError } from "../util";
import { CartItem } from "@/hooks/store/cart/use-cart";
import { protectedAxios } from "../axiosInstances";
import { Address } from "@/types";

export const syncCart = async (cartItems: CartItem[]) => {
  try {
    const res = await protectedAxios.post(`/cart/sync`, cartItems, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const loadUser = async () => {
  try {
    const res = await axios.get(`/auth/me`);
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const addAddress = async (data: Address) => {
  try {
    const res = await protectedAxios.post(`/address`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getAddresses = async () => {
  try {
    const res = await protectedAxios.get(`/address`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const deleteAddress = async (addressId: string) => {
  try {
    const res = await protectedAxios.delete(`/address?addressId=${addressId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const updateAddress = async (data: Address) => {
  try {
    const res = await protectedAxios.put(`/address`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getProfile = async () => {
  try {
    const res = await protectedAxios.get(`/auth/me`);
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
export const updateProfile = async (data: { field: string; value: string }) => {
  try {
    const res = await axios.put(`/auth/me`, {
      [data.field]: data.value,
    });
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
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

    const res = await axios.post(`/post-review`, data, config);

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
