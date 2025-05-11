import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add a request interceptor to add the authorization header
api.interceptors.request.use(async (config) => {
  // Get the session
  const session = await getSession();

  // If there's a session with an access token, add it to the headers
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If the error is unauthorized (401) and we have a session, it might be due to token expiration
    if (error.response?.status === 401) {
      // Check if this is a chat API request
      const isChatRequest = error.config?.url?.includes('/chat/');

      if (isChatRequest) {
        // For chat requests, don't sign out automatically
        console.error('Authentication error in chat request:', error);
        // Let the component handle the error
      } else {
        // For other requests, sign out the user and redirect to login page
        await signOut({ redirect: true, callbackUrl: '/auth/login' });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
