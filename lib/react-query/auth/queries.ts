import { useMutation } from "@tanstack/react-query";
import { login, register } from "./api";

export const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: login,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
    mutationKey: ["register"],
  });
};
