import { useGetProfileQuery } from '@/redux/api/authApi';
import { logout, useCurrentUser } from '@/redux/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { TCurrentUser } from '@/types/commonTypes';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { FiSearch, FiBell, FiChevronDown, FiUser, FiLogOut, FiHome, FiSettings } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import demoUserImage from '../../assets/images/babul.png';

const DashboardHeader = () => {
  const userInfo = useAppSelector(useCurrentUser);
  const { role } = (userInfo || {}) as TCurrentUser;
  const { data } = useGetProfileQuery(undefined);
  const userProfile = data?.data;
  const location = useLocation();
  const dispatch = useAppDispatch();

  const userImage = userProfile?.profileImage || demoUserImage;
  const userName = userProfile?.name || 'User';

  const handleLogout = () => {
    toast.success('Logout Successful', {
      position: 'top-right',
      icon: '👏',
      duration: 1500,
    });
    dispatch(logout());
  };
  
  // Format the title based on the route
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop() || '';
    if (path === 'overview') return 'Dashboard Overview';
    return path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#f8f6f2] p-4 lg:px-8 lg:py-6 sticky top-0 z-30 w-full mb-4 lg:mb-0">
      {/* <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight hidden lg:block">
        {getPageTitle()}
      </h1> */}
      <div className="flex items-center gap-4 w-full lg:w-auto ml-auto">
        <div className="relative flex-1 lg:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold" />
          <input 
            type="text" 
            placeholder="Search stock, order, etc" 
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-orange/50 bg-white text-sm shadow-sm"
          />
        </div>
        <button className="p-2.5 bg-white rounded-lg shadow-sm border border-slate-100 relative group hidden sm:block">
          <FiBell className="text-slate-600 group-hover:text-orange transition-colors" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-lg border border-white"></span>
        </button>
        <div className="pl-4 border-l border-slate-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl border-2 border-orange/20 hover:border-orange/40 bg-white hover:bg-orange/5 transition-all focus:outline-none shadow-sm cursor-pointer select-none group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange overflow-hidden border-2 border-white shadow-sm ring-2 ring-orange/20 shrink-0">
                  <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-black text-slate-800 leading-tight truncate max-w-[120px]">
                    {userName}
                  </p>
                  <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-orange/10 text-orange uppercase tracking-wider mt-0.5">
                    {role || 'USER'}
                  </span>
                </div>
                <FiChevronDown className="text-slate-400 hidden md:block transition-transform duration-300 group-hover:text-orange" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-slate-100 bg-white z-50">
              {/* Profile Card Header */}
              <div className="px-3 py-2.5 border-b border-orange/10 bg-gradient-to-r from-orange/10 via-amber-50 to-orange/5 rounded-xl mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-white shadow-sm shrink-0">
                    <img src={userImage} alt={userName} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-slate-800 truncate flex items-center gap-1">
                      {userName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{userProfile?.email || userInfo?.email}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange text-white uppercase tracking-wider">
                    {role || 'USER'}
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                    Active Session 🟢
                  </span>
                </div>
              </div>

              {/* Navigation Actions */}
              <DropdownMenuItem asChild>
                <Link
                  to={`/dashboard/${role?.toLowerCase()}/profile`}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 rounded-xl hover:bg-orange/10 hover:text-orange cursor-pointer transition-colors"
                >
                  <FiUser className="text-sm text-slate-500" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  to={`/dashboard/${role?.toLowerCase()}/overview`}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 rounded-xl hover:bg-orange/10 hover:text-orange cursor-pointer transition-colors"
                >
                  <FiHome className="text-sm text-slate-500" />
                  <span>Dashboard Overview</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  to="/"
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 rounded-xl hover:bg-violet-50 hover:text-violet-700 cursor-pointer transition-colors"
                >
                  <span className="text-xs">🇩🇪</span>
                  <span>Go to German Academy</span>
                </Link>
              </DropdownMenuItem>

              {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
                <DropdownMenuItem asChild>
                  <Link
                    to="/dashboard/admin/site-settings"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 rounded-xl hover:bg-orange/10 hover:text-orange cursor-pointer transition-colors"
                  >
                    <FiSettings className="text-sm text-slate-500" />
                    <span>Site Settings</span>
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-500 rounded-xl hover:bg-rose-50 cursor-pointer mt-1 transition-colors"
              >
                <FiLogOut className="text-sm" />
                <span>Tschüss! Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
