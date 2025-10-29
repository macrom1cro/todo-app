import axios from "axios";
import TokenManager from "../utils/tokenManager";
import { refreshAuthToken } from "../utils/tokenRefresh";

const api = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let failedQueue: any[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  config => {
    const token = TokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.method?.toLowerCase() === "get") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      if (!TokenManager.hasValidRefreshToken()) {
        TokenManager.clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const tokens = await refreshAuthToken();

        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

        processQueue(null, tokens.accessToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        TokenManager.clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      error.response?.data?.error || error.message || "Network error occurred";

    console.error("API Error:", {
      message,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
    });

    return Promise.reject({
      message,
      status: error.response?.status,
      code: error.code,
      config: error.config,
    });
  }
);

export const createCancelToken = () => {
  return axios.CancelToken.source();
};

export const isCancel = (error: unknown) => {
  return axios.isCancel(error);
};

export default api;
