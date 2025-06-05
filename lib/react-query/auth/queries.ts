import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { addProduct, login } from "./api";
import { useAuth } from "@/hooks/store/auth";
import { handleError } from "../util";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const { login: authLogin } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: login,

    onSuccess: (data) => {
      toast.success("Login successful");

      const user = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      };
      authLogin(data.token, user);
      router.push("/admin");

      return data;
    },
  });
};

export const useAddProduct = () => {
  return useMutation({
    mutationKey: ["addProduct"],
    mutationFn: addProduct,

    onSuccess: (data) => {
      toast.success("Product has been added successfully");
      return data;
    },

    onError: (error) => {
      toast.error(error?.message);
    },
  });
};
