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
 * Global Audit Logging Interceptors
 * Provides a structured trail of all network activity for debugging and security audits.
 */

// Request Interceptor: Logs outgoing handshake details
client.interceptors.request.use((config) => {
  config.metadata = { startTime: new Date() };
  console.log(
    `%c[API Request] %c${config.method.toUpperCase()} %c${config.url}`,
    'color: #6366f1; font-weight: bold',
    'color: #94a3b8',
    'color: #f8fafc'
  );
  if (config.data) console.log('[Payload]:', config.data);
  return config;
});

// Response Interceptor: Logs completion status and execution duration
client.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata.startTime;
    console.log(
      `%c[API Success] %c${response.status} %c(${duration}ms)`,
      'color: #10b981; font-weight: bold',
      'color: #94a3b8',
      'color: #64748b'
    );
    return response;
  },
  (error) => {
    const duration = error.config?.metadata 
      ? new Date() - error.config.metadata.startTime 
      : 'unknown';
      
    // 401 Unauthorized: Session is invalid or has expired
    if (error.response?.status === 401) {
      console.warn(`%c[Session Expired] %c${duration}ms`, 'color: #f59e0b; font-weight: bold', 'color: #64748b');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Extract error message: Supports custom 'message' field or FastAPI's default 'detail'
    const message = 
      error.response?.data?.message || 
      error.response?.data?.detail || 
      'An unexpected error occurred';
    
    console.error(
      `%c[API Error] %c${error.response?.status || 'Network'} %c(${duration}ms): %c${message}`,
      'color: #ef4444; font-weight: bold',
      'color: #94a3b8',
      'color: #64748b',
      'color: #f8fafc'
    );
    
    return Promise.reject(new Error(message));
  }
);


export default client;
