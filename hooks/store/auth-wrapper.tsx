"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useLoadSeller } from "@/lib/react-query/auth/queries";

import { toast } from "sonner";
import { useLoadUser } from "@/lib/react-query/user/query";
import { useAuth } from "./auth";

type AuthWrapperProps = {
    children: React.ReactNode;
};

const UserAuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
    const router = useRouter();

    const { isAuthenticated, token, logout } = useAuth((state: any) => state);

    const { data, isSuccess, isLoading, isError, error } = useLoadUser();

    if (!isAuthenticated || !token || token === "") {
        router.push("/auth/login");
        return null;
    }

    if (isLoading && !isSuccess) {
        return <div >Loading...</div>;
    }

    if (isError && error) {
        logout();
        toast.warning("Please login again");
        router.push("/auth/login");
    }

    if (isSuccess) {
        return <>{children}</>;
    } else {
        return null;
    }
};

export default UserAuthWrapper;
