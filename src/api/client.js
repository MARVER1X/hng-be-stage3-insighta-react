import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for HTTP-only cookies
  headers: {
    'X-API-Version': '1',
    'Content-Type': 'application/json',
  },
});

// Error Interceptor for Global Error Handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the error has a JSON body, we extract the message
    const message = error.response?.data?.message || 'An unexpected error occurred';
    
    // We log the error but also return a rejected promise so components can catch it
    console.error('[API Error]:', message);
    return Promise.reject(new Error(message));
  }
);

export default client;
