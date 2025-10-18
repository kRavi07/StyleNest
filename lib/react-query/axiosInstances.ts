// publicAxios.ts
import axios from "axios";

// Create public axios instance
const publicAxios = axios.create({
  baseURL: "/api",
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Create protected axios instance
const protectedAxios = axios.create({
  baseURL: "/api",
  timeout: 30000, // 30 second timeout for protected requests
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Maximum time to wait for refresh before giving up (30 seconds)

/*Clear the failed queue due to timeout
function clearQueueOnTimeout() {
  const timeoutError = new Error("Token refresh timeout - please try again");
  processQueue(timeoutError, null);
  handleRefreshFailure();

  // Reset refresh state
  isRefreshing = false;
  refreshPromise = null;
}*/

// Request interceptor for protected axios
/*protectedAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);*/

/* Response interceptor for error handling
protectedAxios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error?.response?.status;
    const errorData = error?.response?.data as { error?: string };

    // Don't show toast for 401 errors as they'll be handled by refresh interceptor
    if (status === 401) {
      return Promise.reject(error);
    }

    switch (status) {
      case 403:
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this resource.",
          variant: "destructive",
        });
        break;
      case 404:
        toast({
          title: errorData?.error || "Resource Not Found",
          description: "The requested resource could not be found.",
          variant: "destructive",
        });
        break;
      case 422:
        toast({
          title: "Validation Error",
          description:
            errorData?.error || "Please check your input and try again.",
          variant: "destructive",
        });
        break;
      case 429:
        toast({
          title: "Too Many Requests",
          description: "Please wait a moment before trying again.",
          variant: "destructive",
        });
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        toast({
          title: "Server Error",
          description:
            "Something went wrong on our end. Please try again later.",
          variant: "destructive",
        });
        break;
      default:
        if (
          error.code === "ECONNABORTED" ||
          error.message === "timeout exceeded"
        ) {
          toast({
            title: "Request timeout. Please try again.",
            variant: "destructive",
          });
        } else if (error.message === "Network Error" || !error.response) {
          toast({
            title: "Network error. Check your internet connection.",
            variant: "destructive",
          });
        } else {
          toast({
            title: errorData?.error || "An unexpected error occurred.",
            variant: "destructive",
          });
        }
    }

    return Promise.reject(error);
  }
);

/* Token refresh interceptor
protectedAxios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only handle 401 errors for token refresh, but skip refresh endpoint itself
    const isRefreshEndpoint = originalRequest?.url?.includes("/auth/refresh");

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      isRefreshEndpoint
    ) {
      return Promise.reject(error);
    }

    // Mark request as retried to prevent infinite loops
    if (originalRequest) {
      originalRequest._retry = true;
    }

    // If already refreshing, queue the request
    if (isRefreshing && refreshPromise) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          if (originalRequest) {
            return protectedAxios(originalRequest);
          }
          return Promise.reject(
            new Error("Original request config is undefined")
          );
        })
        .catch((err) => Promise.reject(err));
    }

    // Start refresh process
    isRefreshing = true;
    refreshPromise = refreshToken();

    // Set timeout to clear queue if refresh takes too long
    refreshTimeoutId = setTimeout(clearQueueOnTimeout, REFRESH_TIMEOUT_MS);

    try {
      await refreshPromise;
      processQueue(null);

      if (originalRequest) {
        return protectedAxios(originalRequest);
      }
      return Promise.reject(new Error("Original request config is undefined"));
    } catch (refreshError) {
      processQueue(refreshError, null);
      handleRefreshFailure();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
      refreshPromise = null;

      // Clear timeout if it's still active
      if (refreshTimeoutId) {
        clearTimeout(refreshTimeoutId);
        refreshTimeoutId = null;
      }
    }
  }
);

// Create a separate axios instance for token refresh to avoid circular dependencies
const refreshAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to refreshAxios to prevent it from triggering refresh logic
refreshAxios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Don't trigger refresh logic for the refresh endpoint itself
    // Just reject the error to let the refresh function handle it
    return Promise.reject(error);
  }
);

// Separate function to handle token refresh
async function refreshToken(): Promise<void> {
  try {
    const response = await refreshAxios.post("auth/refresh", null);

    // If the refresh endpoint returns a new token, handle it
    if (response.data?.token) {
      // Assuming you have a function to store the new token
      // setAuthToken(response.data.token);
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
}

// Handle refresh failure
function handleRefreshFailure(): void {
  toast({
    title: "Session Expired",
    description: "Please log in again to continue.",
    variant: "destructive",
  });

  // Redirect to login page or dispatch logout action
  // This should be handled based on your app's routing/state management
  if (typeof window !== "undefined") {
    // For Next.js, you might want to use router.push('/login')
    window.location.href = "/login";
  }
}

// Cleanup function for memory management
export function cleanup(): void {
  // Clear any pending requests
  failedQueue.forEach((prom) => prom.reject(new Error("Cleanup called")));
  failedQueue = [];

  // Reset refresh state
  isRefreshing = false;
  refreshPromise = null;
}

// Optional: Add request/response logging for development
if (process.env.NODE_ENV === "development") {
  protectedAxios.interceptors.request.use((config) => {
    console.log("🚀 Request:", config.method?.toUpperCase(), config.url);
    return config;
  });

  protectedAxios.interceptors.response.use(
    (response) => {
      console.log("✅ Response:", response.status, response.config.url);
      return response;
    },
    (error) => {
      console.log("❌ Error:", error.response?.status, error.config?.url);
      return Promise.reject(error);
    }
  );
}*/

export { publicAxios, protectedAxios };
