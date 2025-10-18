import { publicAxios as axios } from "../axiosInstances";
import { UserRegistrationRequest } from "../query.type";
import { handleError } from "../util";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const res = await axios.post(`/auth/login`, {
      email,
      password,
    });

    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const register = async (data: UserRegistrationRequest) => {
  try {
    const res = await axios.post(`/auth/register`, data);
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
