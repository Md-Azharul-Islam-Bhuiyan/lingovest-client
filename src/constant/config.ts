const LIVE_API_URL = 'https://lingovest-server.vercel.app/api/v1';
const LOCAL_API_URL = 'http://localhost:5000/api/v1';

export const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL_LIVE || import.meta.env.VITE_API_BASE_URL || LIVE_API_URL
  : import.meta.env.VITE_API_BASE_URL_LOCAL || import.meta.env.VITE_API_BASE_URL || LOCAL_API_URL;
