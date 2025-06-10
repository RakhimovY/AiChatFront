import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh the token
          const session = await getSession();
          if (session?.refreshToken) {
            // Call your refresh token endpoint
            const response = await axios.post('/api/auth/refresh', {
              refreshToken: session.refreshToken,
            });

            const { accessToken } = response.data;

            // Update the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          } else {
            // No refresh token available, sign out
            await signOut({ redirect: true, callbackUrl: "/auth/login" });
            return Promise.reject(error);
          }
        } catch (refreshError) {
          // If refresh fails, log out and redirect to login
          await signOut({ redirect: true, callbackUrl: "/auth/login" });
          return Promise.reject(refreshError);
        }
      } else {
        // This request has already been retried and still got 401, sign out
        await signOut({ redirect: true, callbackUrl: "/auth/login" });
        return Promise.reject(error);
      }
    }

    // Handle other errors
    if (error.response?.data?.error) {
      error.message = error.response.data.error;
    }

    return Promise.reject(error);
  }
);


export default api;
