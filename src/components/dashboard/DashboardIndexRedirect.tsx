import { useCurrentUser } from '@/redux/features/authSlice';
import { useAppSelector } from '@/redux/hook';
import { TCurrentUser } from '@/types/commonTypes';
import { Navigate } from 'react-router-dom';

const DashboardIndexRedirect = () => {
  const user = useAppSelector(useCurrentUser);
  const role = ((user as TCurrentUser)?.role || '').toUpperCase();

  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    return <Navigate to="admin/overview" replace />;
  }
  if (role === 'STAFF') {
    return <Navigate to="staff/overview" replace />;
  }
  if (role === 'USER') {
    // No dashboard for regular user
    return <Navigate to="/" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default DashboardIndexRedirect;
