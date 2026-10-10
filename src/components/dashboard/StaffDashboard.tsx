import {
  logout,
  useCurrentUser,
} from '@/redux/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useGetAllUsersQuery } from '@/redux/api/authApi';
import { useGetActiveLogoQuery } from '@/redux/api/logoApi';
import { TCurrentUser } from '@/types/commonTypes';
import {
  BookOpen,
  Headphones,
  HelpCircle,
  FileText,
  LayoutDashboard,
  LogOut,
  Home,
  X,
  Menu,
  ShieldCheck,
  User,
  Users,
  Clock,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ScrollToTop from '../ui/ToTop';
import DashboardHeader from './DashboardHeader';

const StaffDashboard = () => {
  const userInfo = useAppSelector(useCurrentUser);
  const { role } = (userInfo || {}) as TCurrentUser;
  const userRole = (role || '').toUpperCase();

  const { data: logoData } = useGetActiveLogoQuery(undefined);
  const activeLogoUrl = logoData?.data?.url;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDashboardRoute, setActiveDashboardRoute] = useState('overview');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: usersData } = useGetAllUsersQuery('status=PENDING&limit=50');
  const pendingCount = (usersData?.data || []).filter((u: any) => u.status === 'PENDING').length;

  useEffect(() => {
    // Staff dashboard is strictly for STAFF and SUPER_ADMIN
    if (role && userRole !== 'STAFF' && userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
      toast.error('Unauthorized dashboard access');
      navigate('/');
      return;
    }

    if (location.pathname === '/dashboard/staff/overview') {
      setActiveDashboardRoute('overview');
    } else if (location.pathname.includes('/dashboard/staff/manage-learners')) {
      setActiveDashboardRoute('manage-learners');
    } else if (location.pathname.includes('/dashboard/staff/vocabulary')) {
      setActiveDashboardRoute('vocabulary');
    } else if (location.pathname.includes('/dashboard/staff/reading')) {
      setActiveDashboardRoute('reading');
    } else if (location.pathname.includes('/dashboard/staff/listening')) {
      setActiveDashboardRoute('listening');
    } else if (location.pathname.includes('/dashboard/staff/quizzes')) {
      setActiveDashboardRoute('quizzes');
    } else if (location.pathname.includes('/dashboard/staff/profile')) {
      setActiveDashboardRoute('profile');
    }
  }, [location.pathname, role, userRole, navigate]);

  const handleLogout = () => {
    toast.success('Logged out successfully', {
      position: 'top-right',
      icon: '👋',
      duration: 1500,
    });
    dispatch(logout());
    setIsSidebarOpen(false);
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <ScrollToTop />

      {/* Mobile Drawer Toggle */}
      <button
        aria-controls="staff-sidebar"
        type="button"
        className="inline-flex items-center p-2.5 m-2 text-sm text-slate-600 rounded-xl sm:hidden bg-white shadow-sm border border-slate-200 hover:bg-slate-100"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Toggle Sidebar</span>
        <Menu className="w-5 h-5 text-slate-700" />
      </button>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 sm:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        id="staff-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        } bg-white border-r border-slate-200 flex flex-col justify-between`}
        aria-label="Staff Sidebar"
      >
        <div className="h-full px-4 py-5 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Logo / Brand Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <Link
                to="/dashboard/staff/overview"
                onClick={closeSidebar}
                className="flex items-center gap-3 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden ${
                  activeLogoUrl
                    ? 'bg-white p-1 border border-slate-200 shadow-emerald-500/10'
                    : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/20'
                }`}>
                  {activeLogoUrl ? (
                    <img
                      src={activeLogoUrl}
                      alt="DeutschLernen"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ShieldCheck className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-tight">
                    DeutschLernen
                  </h2>
                  <span className="text-[11px] font-bold text-emerald-600 tracking-wider uppercase">
                    Staff Editorial Portal
                  </span>
                </div>
              </Link>

              <button
                className="sm:hidden text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                onClick={closeSidebar}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Sections */}
            <div className="mt-6 space-y-6">
              <div>
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Staff Workspace
                </p>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/dashboard/staff/overview"
                      onClick={() => {
                        setActiveDashboardRoute('overview');
                        closeSidebar();
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        activeDashboardRoute === 'overview'
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                          : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Staff Overview</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/dashboard/staff/manage-learners"
                      onClick={() => {
                        setActiveDashboardRoute('manage-learners');
                        closeSidebar();
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        activeDashboardRoute === 'manage-learners'
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                          : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4" />
                        <span>Learner Requests</span>
                      </div>
                      {pendingCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-500 text-white shadow-sm">
                          {pendingCount}
                        </span>
                      )}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Curriculum Review
                </p>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/dashboard/staff/vocabulary"
                      onClick={() => {
                        setActiveDashboardRoute('vocabulary');
                        closeSidebar();
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        activeDashboardRoute === 'vocabulary'
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                          : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Vocabulary Review</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/dashboard/staff/reading"
                      onClick={() => {
                        setActiveDashboardRoute('reading');
                        closeSidebar();
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        activeDashboardRoute === 'reading'
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                          : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Reading Stories</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/dashboard/staff/listening"
                      onClick={() => {
                        setActiveDashboardRoute('listening');
                        closeSidebar();
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        activeDashboardRoute === 'listening'
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                          : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <Headphones className="w-4 h-4" />
                      <span>Listening Dialogues</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/dashboard/staff/quizzes"
                      onClick={() => {
                        setActiveDashboardRoute('quizzes');
                        closeSidebar();
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        activeDashboardRoute === 'quizzes'
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                          : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Quizzes & Drills</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Account
                </p>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/dashboard/staff/profile"
                      onClick={() => {
                        setActiveDashboardRoute('profile');
                        closeSidebar();
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        activeDashboardRoute === 'profile'
                          ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                          : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>Staff Profile</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="pt-4 border-t border-slate-100 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Back to Academy</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="sm:ml-64 flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffDashboard;
