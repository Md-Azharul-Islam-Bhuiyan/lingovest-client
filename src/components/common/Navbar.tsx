import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Headphones,
  HelpCircle,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Star,
  Rocket,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  logout,
  useCurrentUser,
} from '@/redux/features/authSlice';
import { useGetActiveLogoQuery } from '@/redux/api/logoApi';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { TCurrentUser } from '@/types/commonTypes';
import { toast } from 'sonner';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: null, emoji: '🏠' },
  { to: '/vocabulary', label: 'Words', icon: BookOpen, emoji: '📚', color: 'text-violet-600' },
  { to: '/reading', label: 'Stories', icon: FileText, emoji: '📖', color: 'text-blue-600' },
  { to: '/listening', label: 'Listen', icon: Headphones, emoji: '🎧', color: 'text-teal-600' },
  { to: '/quizzes', label: 'Quizzes', icon: HelpCircle, emoji: '🧩', color: 'text-pink-600' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentUser = useAppSelector(useCurrentUser) as TCurrentUser | null;
  const { data: logoData } = useGetActiveLogoQuery(undefined);
  const activeLogoUrl = logoData?.data?.url;
  const role = (currentUser?.role || '').toUpperCase();
  const isSuperAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const isStaff = role === 'STAFF';

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Auf Wiedersehen! 👋 See you soon!', {
      duration: 2000,
      icon: '🌟',
    });
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b-2 border-violet-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between gap-4">
        {/* Brand Logo — Playful */}
        <Link to="/" className="flex items-center gap-3 group shrink-0 py-3">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden ${
              activeLogoUrl
                ? 'bg-white p-1 border border-violet-100 shadow-violet-500/10'
                : 'bg-gradient-to-tr from-violet-600 via-purple-500 to-pink-500 text-white shadow-violet-500/30'
            }`}
          >
            {activeLogoUrl ? (
              <img
                src={activeLogoUrl}
                alt="DeutschLernen"
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-xl">🇩🇪</span>
            )}
          </motion.div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-display font-extrabold tracking-tight text-slate-900 group-hover:text-violet-600 transition-colors">
                DeutschLernen
              </span>
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-lg"
              >
                ✨
              </motion.span>
            </div>
            <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest -mt-0.5">
              Fun German Academy
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 group ${
                  isActive
                    ? 'text-violet-700 bg-violet-50 shadow-sm shadow-violet-200'
                    : 'text-slate-600 hover:text-violet-700 hover:bg-violet-50/60'
                }`}
              >
                <span className="text-base group-hover:scale-125 transition-transform inline-block">
                  {link.emoji}
                </span>
                <span className="font-extrabold">{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navActiveIndicator"
                    className="absolute bottom-0 left-3 right-3 h-[3px] rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Suite */}
        <div className="flex items-center gap-3">
          {/* Super Admin Shortcut CTA */}
          {isSuperAdmin && (
            <Link
              to="/dashboard/admin/overview"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-md shadow-violet-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-300" />
              <span>Admin Panel</span>
            </Link>
          )}

          {/* Staff Shortcut CTA */}
          {isStaff && (
            <Link
              to="/dashboard/staff/overview"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-md shadow-teal-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-200" />
              <span>Staff Portal</span>
            </Link>
          )}

          {/* User Auth Controls */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl border-2 border-violet-200 hover:border-violet-300 bg-violet-50/50 hover:bg-violet-50 transition-all focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 text-white flex items-center justify-center font-extrabold text-xs uppercase shadow-sm">
                    {currentUser.name ? currentUser.name.charAt(0) : '🌟'}
                  </div>
                  <span className="text-xs font-bold text-slate-700 hidden sm:inline max-w-[100px] truncate">
                    {currentUser.name || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-violet-400" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-2 rounded-2xl shadow-xl border-violet-100 bg-white">
                <div className="px-3 py-2.5 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-pink-50 rounded-xl mb-1">
                  <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {currentUser.name || 'German Learner'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-violet-100 text-violet-700 uppercase">
                    {role || 'USER'}
                  </span>
                </div>

                {isSuperAdmin && (
                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard/admin/overview"
                      className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-700 rounded-xl hover:bg-violet-50 hover:text-violet-700 cursor-pointer transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-violet-500" />
                      <span>Admin Dashboard</span>
                      <Rocket className="w-3 h-3 text-amber-500 ml-auto" />
                    </Link>
                  </DropdownMenuItem>
                )}

                {isStaff && (
                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard/staff/overview"
                      className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-700 rounded-xl hover:bg-teal-50 hover:text-teal-700 cursor-pointer transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-teal-600" />
                      <span>Staff Portal</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-rose-500 rounded-xl hover:bg-rose-50 cursor-pointer mt-1 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Tschüss! Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-all"
              >
                Sign In
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 hover:from-violet-700 hover:to-pink-600 shadow-lg shadow-violet-500/25 transition-all flex items-center gap-1.5"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  Start Learning!
                </Link>
              </motion.div>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.9, rotate: 90 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-violet-600 hover:bg-violet-50 border-2 border-violet-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden border-t-2 border-violet-100 bg-gradient-to-b from-white to-violet-50/50 px-4 pt-3 pb-6 overflow-hidden"
          >
            <nav className="space-y-1">
              {NAV_LINKS.map((link, idx) => {
                const isActive = location.pathname === link.to;
                return (
                  <motion.div
                    key={link.to}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-extrabold transition-all ${
                        isActive
                          ? 'text-violet-700 bg-violet-100 shadow-sm'
                          : 'text-slate-700 hover:bg-violet-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{link.emoji}</span>
                        <span>{link.label}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {isSuperAdmin && (
              <div className="pt-3 border-t border-violet-100 mt-3">
                <Link
                  to="/dashboard/admin/overview"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-violet-600 to-purple-600 shadow-md"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-300" />
                  <span>Super Admin Panel</span>
                </Link>
              </div>
            )}

            {isStaff && (
              <div className="pt-3 border-t border-violet-100 mt-3">
                <Link
                  to="/dashboard/staff/overview"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-teal-500 to-emerald-500 shadow-md"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-200" />
                  <span>Staff Editorial Portal</span>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
