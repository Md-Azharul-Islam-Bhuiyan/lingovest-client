export const API_BASE_URL =
  (import.meta.env.PROD
    ? import.meta.env.VITE_API_BASE_URL_LIVE || import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL_LOCAL
    : import.meta.env.VITE_API_BASE_URL_LOCAL || import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL_LIVE) ||
  'http://localhost:5000/api/v1';
