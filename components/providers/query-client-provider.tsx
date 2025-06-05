"use client";

import {
    QueryClient,
    QueryClientProvider,
    dehydrate,
    HydrationBoundary,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";

export interface ReactQueryClientProviderProps {
    children: React.ReactNode;
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            throwOnError: false,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

const ReactQueryClientProviders = ({
    children,
}: ReactQueryClientProviderProps) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                {children}
            </HydrationBoundary>

            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default ReactQueryClientProviders;
