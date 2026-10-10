import {
  logout,
  useCurrentUser,
} from '@/redux/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { API_BASE_URL } from '@/constant/config';
import { TUser } from '@/types/commonTypes';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CheckRoleAndLogout = (userRole: string) => {
  const user = useAppSelector(useCurrentUser);
  const { role } = user as TUser;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      // Assuming userRole is passed as lowercase 'admin', 'vendor', 'customer'
      // and user.role might be uppercase 'ADMIN', 'VENDOR', 'CUSTOMER'
      if (role?.toLowerCase() !== userRole?.toLowerCase()) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 200) {
            dispatch(logout());
            navigate('/login');
          } else {
            toast.error('Something went wrong', {
              position: 'top-right',
              duration: 1500,
            });
          }
        } catch (error) {
          console.error('Something went wrong', error);
        }
      }
    };

    performLogout();
  }, [role, navigate, userRole, dispatch]);
};

export default CheckRoleAndLogout;
