import AdminDashboard from '@/components/dashboard/AdminDashboard';
import StaffDashboard from '@/components/dashboard/StaffDashboard';
import { useCurrentUser } from '@/redux/features/authSlice';
import { useAppSelector } from '@/redux/hook';
import { TCurrentUser } from '@/types/commonTypes';
import { Navigate } from 'react-router-dom';

const DashboardLayout = () => {
  const userInfo = useAppSelector(useCurrentUser);
  const { role } = (userInfo || {}) as TCurrentUser;
  const userRole = (role || '').toUpperCase();

  if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
    return <AdminDashboard />;
  } else if (userRole === 'STAFF') {
    return <StaffDashboard />;
  } else if (userRole === 'USER') {
    // Learners access features directly from the main academy pages - no dashboard needed
    return <Navigate to="/" replace={true} />;
  }

  return <Navigate to="/login" replace={true} />;
};

export default DashboardLayout;
