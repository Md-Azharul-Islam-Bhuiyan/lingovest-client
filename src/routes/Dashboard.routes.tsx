import DashboardIndexRedirect from '@/components/dashboard/DashboardIndexRedirect';
import AdminOverview from '@/components/dashboard/admincomponents/AdminOverview';
import AdminProfile from '@/components/dashboard/admincomponents/AdminProfile';
import ManageCustomers from '@/components/dashboard/admincomponents/ManageCustomers';
import AdminSiteSettings from '@/components/dashboard/admincomponents/SiteSettings';
import ManageNews from '@/components/dashboard/admincomponents/ManageNews';
import ManageVocabulary from '@/components/dashboard/admincomponents/ManageVocabulary';
import ManageReading from '@/components/dashboard/admincomponents/ManageReading';
import ManageListening from '@/components/dashboard/admincomponents/ManageListening';
import ManageQuizzes from '@/components/dashboard/admincomponents/ManageQuizzes';
import StaffOverview from '@/components/dashboard/staffcomponents/StaffOverview';
import NotFound from '@/pages/NotFound';

export const dashboardRoutePaths = [
  { index: true, element: <DashboardIndexRedirect /> },

  /* ================= Super Admin Routes ================= */
  { path: 'admin/overview', element: <AdminOverview /> },
  { path: 'admin/profile', element: <AdminProfile /> },
  { path: 'admin/vocabulary', element: <ManageVocabulary /> },
  { path: 'admin/reading', element: <ManageReading /> },
  { path: 'admin/listening', element: <ManageListening /> },
  { path: 'admin/quizzes', element: <ManageQuizzes /> },
  { path: 'admin/manage-customers', element: <ManageCustomers /> },
  { path: 'admin/manage-learners', element: <ManageCustomers /> },
  { path: 'admin/site-settings', element: <AdminSiteSettings /> },
  { path: 'admin/manage-news', element: <ManageNews /> },

  /* ================= Dedicated Staff Routes ================= */
  { path: 'staff/overview', element: <StaffOverview /> },
  { path: 'staff/profile', element: <AdminProfile /> },
  { path: 'staff/vocabulary', element: <ManageVocabulary /> },
  { path: 'staff/reading', element: <ManageReading /> },
  { path: 'staff/listening', element: <ManageListening /> },
  { path: 'staff/quizzes', element: <ManageQuizzes /> },
  { path: 'staff/manage-learners', element: <ManageCustomers /> },

  { path: '*', element: <NotFound /> },
];
