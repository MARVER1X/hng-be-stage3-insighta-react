import axios from 'axios';

/**
 * Insighta API Client Configuration
 * This Axios instance is pre-configured with the base URL, versioning headers,
 * and credential handling required for secure HttpOnly cookie communication.
 */
const API_BASE_URL = 'https://web-production-1d564.up.railway.app';

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enables the browser to send and receive cookies (Auth Tokens)
  headers: {
    'X-API-Version': '1',
    'Content-Type': 'application/json',
  },
});

/**
 * Global Response Interceptor
 * Standardizes error handling and manages session expiration.
 */
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized: Session is invalid or has expired
    if (error.response?.status === 401) {
      console.warn('[Session Expired]: Redirecting to login...');
      
      // Perform a local logout by redirecting to the login page.
      // This is a robust fallback if the app state gets out of sync with the cookies.
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Extract error message: Supports custom 'message' field or FastAPI's default 'detail'
    const message = 
      error.response?.data?.message || 
      error.response?.data?.detail || 
      'An unexpected error occurred';
    
    // Log for developer visibility while propagating the error to the caller
    console.error('[API Error]:', message);
    return Promise.reject(new Error(message));
  }
);

export default client;
