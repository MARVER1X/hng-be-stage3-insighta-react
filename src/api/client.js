import axios from 'axios';

/**
 * Insighta API Client Configuration
 * This Axios instance is pre-configured with the base URL, versioning headers,
 * and credential handling required for secure HttpOnly cookie communication.
 */
const API_BASE_URL = 'http://localhost:8000';

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
 * Standardizes error handling by extracting the custom 'message' field from 
 * the backend's error format and surfacing it via standard Error objects.
 */
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Backend returns { status: 'error', message: '...' }
    const message = error.response?.data?.message || 'An unexpected error occurred';
    
    // Log for developer visibility while propagating the error to the caller
    console.error('[API Error]:', message);
    return Promise.reject(new Error(message));
  }
);

export default client;
