/**
 * Axios instance shared by every real-backend API module.
 *
 * - Injects the JWT bearer token from localStorage on each request.
 * - Normalises backend errors into a consistent ApiError shape.
 * - On 401 responses, clears the session and bounces to /login.
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const TOKEN_KEY = 'civigo.token';
export const USER_KEY = 'civigo.user';

export class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('civicpulse.token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401 && !window.location.pathname.includes('/login')) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('civicpulse.token');
        localStorage.removeItem('civicpulse.user');
        window.location.assign('/login');
      }
      let message = data?.message || data?.error || data?.detail;
      if (!message && typeof data === 'object' && data !== null) {
        const firstVal = Object.values(data)[0];
        if (Array.isArray(firstVal) && firstVal.length > 0) message = firstVal[0];
        else if (typeof firstVal === 'string') message = firstVal;
      }
      if (!message && typeof data === 'string' && !data.includes('<!doctype') && data.length < 200) {
        message = data;
      }
      if (!message) {
        message = status >= 500 ? 'Server temporarily unavailable. Please try again shortly.' : 'Something went wrong. Please try again.';
      }
      return Promise.reject(new ApiError(status, message, data?.details || null));
    }
    if (error.request) {
      return Promise.reject(new ApiError(0, 'Unable to reach the server. Check your connection.'));
    }
    return Promise.reject(new ApiError(0, error.message));
  },
);

export default client;
