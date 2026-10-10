import { useGetAllUsersQuery, useGetProfileQuery } from '@/redux/api/authApi';
import { useGetActiveLogoQuery } from '@/redux/api/logoApi';
import {
  logout,
  useCurrentUser,
} from '@/redux/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { TCurrentUser } from '@/types/commonTypes';
import {
  BookOpen,
  Headphones,
  HelpCircle,
  FileText,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Home,
  X,
  Menu,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import ScrollToTop from '../ui/ToTop';
import DashboardHeader from './DashboardHeader';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const userInfo = useAppSelector(useCurrentUser);
  const { role } = (userInfo || {}) as TCurrentUser;
  const userRole = (role || '').toUpperCase();

  const { data: logoData } = useGetActiveLogoQuery(undefined);
  const activeLogoUrl = logoData?.data?.url;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDashboardRoute, setActiveDashboardRoute] = useState('');
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { data } = useGetProfileQuery(undefined);
  const userProfile = data?.data;

  const { data: usersData } = useGetAllUsersQuery('status=PENDING&limit=50');
  const pendingCount = (usersData?.data || []).filter((u: any) => u.status === 'PENDING').length;

  useEffect(() => {
    if (userRole === 'STAFF') {
      navigate('/dashboard/staff/overview', { replace: true });
      return;
    }

    if (userRole === 'USER') {
      navigate('/', { replace: true });
      return;
    }

    if (role && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      dispatch(logout());
      navigate('/login', { replace: true });
      return;
    }

    if (location.pathname === '/dashboard/admin/overview') {
      setActiveDashboardRoute('overview');
    } else if (location.pathname.includes('/dashboard/admin/vocabulary')) {
      setActiveDashboardRoute('vocabulary');
    } else if (location.pathname.includes('/dashboard/admin/reading')) {
      setActiveDashboardRoute('reading');
    } else if (location.pathname.includes('/dashboard/admin/listening')) {
      setActiveDashboardRoute('listening');
    } else if (location.pathname.includes('/dashboard/admin/quizzes')) {
      setActiveDashboardRoute('quizzes');
    } else if (
      location.pathname === '/dashboard/admin/manage-customers' ||
      location.pathname === '/dashboard/admin/manage-learners'
    ) {
      setActiveDashboardRoute('customermanagement');
    } else if (location.pathname === '/dashboard/admin/site-settings') {
      setActiveDashboardRoute('sitesettings');
    } else if (location.pathname === '/dashboard/admin/profile') {
      setActiveDashboardRoute('profile');
    }
  }, [location.pathname, dispatch, role, userRole]);

  const handleLogout = () => {
    toast.success('Logout Successful', {
      position: 'top-right',
      icon: '👋',
      duration: 1500,
    });
    dispatch(logout());
    setIsSidebarOpen(false);
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
        aria-controls="default-sidebar"
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
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        } bg-white border-r border-slate-200 flex flex-col justify-between`}
        aria-label="Sidebar"
      >
        <div className="h-full px-4 py-5 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Logo / Brand Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <Link
                to="/dashboard/admin/overview"
                onClick={closeSidebar}
                className="flex items-center gap-3 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden ${
                  activeLogoUrl
                    ? 'bg-white p-1 border border-slate-200 shadow-orange-500/10'
                    : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-orange-500/20'
                }`}>
                  {activeLogoUrl ? (
                    <img
                      src={activeLogoUrl}
                      alt="DeutschLernen"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <GraduationCap className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-tight">
                    DeutschLernen
                  </h2>
                  <span className="text-[11px] font-semibold text-orange-600 tracking-wider uppercase">
                    Super Admin Panel
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
              {/* SECTION: GERMAN LEARNING MANAGEMENT */}
              <div>
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  German Curriculum
                </p>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/dashboard/admin/vocabulary"
                      onClick={() => {
                        setActiveDashboardRoute('vocabulary');
                        closeSidebar();
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        activeDashboardRoute === 'vocabulary'
                          ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                          : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4" />
                        <span>Vocabulary</span>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                          activeDashboardRoute === 'vocabulary'
                            ? 'bg-orange-600 text-white'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        AI
                      </span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/dashboard/admin/reading"
                      onClick={() => {
                        setActiveDashboardRoute('reading');
                        closeSidebar();
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        activeDashboardRoute === 'reading'
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                          : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4" />
                        <span>Reading Stories</span>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                          activeDashboardRoute === 'reading'
                            ? 'bg-indigo-700 text-white'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        AI
                      </span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/dashboard/admin/listening"
                      onClick={() => {
                        setActiveDashboardRoute('listening');
                        closeSidebar();
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        activeDashboardRoute === 'listening'
                          ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                          : 'text-slate-600 hover:bg-teal-50 hover:text-teal-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Headphones className="w-4 h-4" />
                        <span>Listening Dialogues</span>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                          activeDashboardRoute === 'listening'
                            ? 'bg-teal-700 text-white'
                            : 'bg-teal-100 text-teal-700'
                        }`}
                      >
                        AI
                      </span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/dashboard/admin/quizzes"
                      onClick={() => {
                        setActiveDashboardRoute('quizzes');
                        closeSidebar();
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        activeDashboardRoute === 'quizzes'
                          ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                          : 'text-slate-600 hover:bg-purple-50 hover:text-purple-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-4 h-4" />
                        <span>Quizzes & Tests</span>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                          activeDashboardRoute === 'quizzes'
                            ? 'bg-purple-700 text-white'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        AI
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* SECTION: SYSTEM & OVERVIEW */}
              <div>
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  System Administration
                </p>
                <ul className="space-y-1">
                    <li>
                      <Link
                        to="/dashboard/admin/overview"
                        onClick={() => {
                          setActiveDashboardRoute('overview');
                          closeSidebar();
                        }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                          activeDashboardRoute === 'overview'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Curriculum Overview</span>
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/dashboard/admin/manage-customers"
                        onClick={() => {
                          setActiveDashboardRoute('customermanagement');
                          closeSidebar();
                        }}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                          activeDashboardRoute === 'customermanagement'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Users className="w-4 h-4" />
                          <span>Learners & Users</span>
                        </div>
                        {pendingCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-500 text-white shadow-sm">
                            {pendingCount}
                          </span>
                        )}
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/dashboard/admin/site-settings"
                        onClick={() => {
                          setActiveDashboardRoute('sitesettings');
                          closeSidebar();
                        }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                          activeDashboardRoute === 'sitesettings'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Platform Settings</span>
                      </Link>
                    </li>
                  </ul>
                </div>
            </div>
          </div>

          {/* Bottom user profile & actions */}
          <div className="pt-4 border-t border-slate-100 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Back to Portal</span>
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

export default AdminDashboard;
