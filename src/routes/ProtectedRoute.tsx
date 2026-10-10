import {
  logout,
  useCurrentToken,
} from '@/redux/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { API_BASE_URL } from '@/constant/config';
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector(useCurrentToken);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE_URL}/auth/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data: any) => {
          if (data?.success !== true) {
            dispatch(logout());
          }
        })
        .catch(() => {
          dispatch(logout());
        });
    }
  }, [token, dispatch]);

  if (!token) {
    return <Navigate state={location.pathname} to="/login" replace={true} />;
  }

  return children as JSX.Element;
};

export default ProtectedRoute;
