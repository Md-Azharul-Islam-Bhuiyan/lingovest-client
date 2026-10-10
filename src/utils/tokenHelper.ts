import { jwtDecode } from 'jwt-decode';

export type TDecodedUser = {
  _id: string; // Map userId to _id for Shopora compatibility
  userId: string;
  email: string;
  role: string;
  emailVerified?: boolean;
  iat: number;
  exp: number;
};

// Decode JWT and get user details
export const decodeToken = (token: string | null): TDecodedUser | null => {
  if (!token) return null;
  try {
    const decoded = jwtDecode<TDecodedUser>(token);
    return {
      ...decoded,
      _id: decoded.userId, // Duplicate userId into _id
    };
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
};
