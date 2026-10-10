import Cookies from 'js-cookie';
import { authAccessKey } from '../constant/authkey';

const COOKIE_EXPIRATION_DAYS = 7;

export const setCookie = (
  key: string = authAccessKey,
  value: string | object,
  days: number = COOKIE_EXPIRATION_DAYS
) => {
  const cookieValue = typeof value === 'object' ? JSON.stringify(value) : value;
  Cookies.set(key, cookieValue, {
    expires: days,
    secure: false, // Set to true only in production with HTTPS
    sameSite: 'lax',
  });
};

export const getCookie = <T = string>(key: string): T | null => {
  const cookie = Cookies.get(key);
  if (!cookie) return null;

  try {
    return JSON.parse(cookie) as T; // Try to parse JSON if stored as an object
  } catch {
    return cookie as T; // Return as string if parsing fails
  }
};

export const removeCookie = (key: string) => {
  Cookies.remove(key);
};
