import { useState, useEffect, useRef } from 'react';
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
  Compass,
  Sparkles,
  ArrowRight,
  User,
  ShieldCheck,
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

// CEFR Level shortcuts
const CEFR_LEVEL_SHORTCUTS = [
  { level: 'A1', name: 'Starter Village', to: '/curriculum/A1', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { level: 'A2', name: 'Grammar Forest', to: '/curriculum/A2', color: 'text-sky-700 bg-sky-50 border-sky-200' },
  { level: 'B1', name: 'Vocab Island', to: '/curriculum/B1', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  { level: 'B2', name: 'Grammar Castle', to: '/curriculum/B2', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { level: 'C1', name: 'Fluency City', to: '/curriculum/C1', color: 'text-rose-700 bg-rose-50 border-rose-200' },
  { level: 'C2', name: 'Master’s Kingdom', to: '/curriculum/C2', color: 'text-purple-700 bg-purple-50 border-purple-200' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<'learn' | 'practice' | 'resources'>('learn');

  // Desktop Dropdown Open states for controlled hover/click experience
  const [openDropdown, setOpenDropdown] = useState<'learn' | 'practice' | 'resources' | null>(null);
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentUser = useAppSelector(useCurrentUser) as TCurrentUser | null;
  const { data: logoData } = useGetActiveLogoQuery(undefined);
  const activeLogoUrl = logoData?.data?.url;
  const role = (currentUser?.role || '').toUpperCase();
  const isSuperAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const isStaff = role === 'STAFF';

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Handle escape key to dismiss dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDropdownEnter = (menu: 'learn' | 'practice' | 'resources') => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setOpenDropdown(menu);
  };

  const handleDropdownLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Auf Wiedersehen! See you soon!', {
      duration: 2500,
      icon: '👋',
    });
    navigate('/');
  };

  const isLearnActive =
    location.pathname.startsWith('/curriculum') ||
    location.pathname.startsWith('/grammar') ||
    location.pathname.startsWith('/vocabulary');

  const isPracticeActive =
    location.pathname.startsWith('/quizzes') ||
    location.pathname.startsWith('/reading') ||
    location.pathname.startsWith('/listening');

  const isResourcesActive =
    location.pathname.startsWith('/blogs') ||
    location.pathname.startsWith('/faq') ||
    location.pathname.startsWith('/about-us') ||
    location.pathname.startsWith('/support');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[68px] flex items-center justify-between gap-4">
        {/* Brand Logo & Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-3 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
          aria-label="LingoVest Homepage"
        >
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden shrink-0 ${
              activeLogoUrl
                ? 'bg-white p-1 border border-slate-200 shadow-sm'
                : 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
            }`}
          >
            {activeLogoUrl ? (
              <img
                src={activeLogoUrl}
                alt="LingoVest"
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-xl">🇩🇪</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-bold font-display tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                LingoVest
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                A1–C2
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-500 tracking-wider">
              German Learning Academy
            </p>
          </div>
        </Link>

        {/* Desktop Simplified Navigation */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Primary Navigation"
        >
          {/* Learn Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter('learn')}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              onClick={() => setOpenDropdown(openDropdown === 'learn' ? null : 'learn')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isLearnActive || openDropdown === 'learn'
                  ? 'text-indigo-700 bg-indigo-50/70'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
              aria-expanded={openDropdown === 'learn'}
              aria-haspopup="true"
            >
              <span>Learn</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 text-slate-400 ${
                  openDropdown === 'learn' ? 'rotate-180 text-indigo-600' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'learn' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute top-full left-0 mt-1 w-[460px] bg-white rounded-2xl shadow-xl border border-slate-200/90 p-4 z-50 focus:outline-none"
                  role="menu"
                >
                  <div className="space-y-1 mb-3">
                    <Link
                      to="/curriculum"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      role="menuitem"
                    >
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Compass className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 flex items-center gap-1.5">
                          <span>Guided Learning Worlds</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">60 Days/Level</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Structured daily lessons from A1 foundations to C2 mastery with mascot Felix.
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/grammar"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      role="menuitem"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-600">
                          Grammar Library
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          In-depth rules, declension charts, verb conjugations, and clear explanations.
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/vocabulary"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      role="menuitem"
                    >
                      <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-amber-600">
                          Vocabulary Flashcards
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Visual cards with color-coded articles, dynamic imagery, and native German audio.
                        </p>
                      </div>
                    </Link>
                  </div>

                  {/* Direct CEFR shortcuts */}
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                      Jump to CEFR Level (60 Days Each)
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {CEFR_LEVEL_SHORTCUTS.map((item) => (
                        <Link
                          key={item.level}
                          to={item.to}
                          onClick={() => setOpenDropdown(null)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all flex items-center gap-2 group"
                        >
                          <span className={`text-[11px] font-black px-1.5 py-0.5 rounded border ${item.color}`}>
                            {item.level}
                          </span>
                          <span className="text-xs font-semibold text-slate-700 truncate group-hover:text-indigo-700">
                            {item.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Practice Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter('practice')}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              onClick={() => setOpenDropdown(openDropdown === 'practice' ? null : 'practice')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isPracticeActive || openDropdown === 'practice'
                  ? 'text-indigo-700 bg-indigo-50/70'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
              aria-expanded={openDropdown === 'practice'}
              aria-haspopup="true"
            >
              <span>Practice</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 text-slate-400 ${
                  openDropdown === 'practice' ? 'rotate-180 text-indigo-600' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'practice' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute top-full left-0 mt-1 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-3 z-50 focus:outline-none"
                  role="menu"
                >
                  <div className="space-y-1">
                    <Link
                      to="/quizzes"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      role="menuitem"
                    >
                      <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-pink-600">
                          Quizzes Arena
                        </div>
                        <p className="text-xs text-slate-500">
                          Article practice (der/die/das), sentence scrambles, and fill-in-blanks.
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/reading"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      role="menuitem"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600">
                          Reading Stories
                        </div>
                        <p className="text-xs text-slate-500">
                          Graded German short stories with comprehension checks and vocabulary tips.
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/listening"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      role="menuitem"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <Headphones className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-teal-600">
                          Listening Labs
                        </div>
                        <p className="text-xs text-slate-500">
                          Dialogue audio scripts, dictation exercises, and ear-training quizzes.
                        </p>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Resources Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter('resources')}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              onClick={() => setOpenDropdown(openDropdown === 'resources' ? null : 'resources')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isResourcesActive || openDropdown === 'resources'
                  ? 'text-indigo-700 bg-indigo-50/70'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
              aria-expanded={openDropdown === 'resources'}
              aria-haspopup="true"
            >
              <span>Resources</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 text-slate-400 ${
                  openDropdown === 'resources' ? 'rotate-180 text-indigo-600' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'resources' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute top-full left-0 mt-1 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-3 z-50 focus:outline-none"
                  role="menu"
                >
                  <div className="space-y-1">
                    <Link
                      to="/blogs"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                      role="menuitem"
                    >
                      <span className="text-base">📰</span>
                      <span>German Guides & Blog</span>
                    </Link>

                    <Link
                      to="/faq"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                      role="menuitem"
                    >
                      <span className="text-base">❓</span>
                      <span>Frequently Asked Questions</span>
                    </Link>

                    <Link
                      to="/about-us"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                      role="menuitem"
                    >
                      <span className="text-base">🏛️</span>
                      <span>About LingoVest Academy</span>
                    </Link>

                    <Link
                      to="/support"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                      role="menuitem"
                    >
                      <span className="text-base">💬</span>
                      <span>Learner Support & Feedback</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right Action Area */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Admin shortcut */}
          {isSuperAdmin && (
            <Link
              to="/dashboard/admin/overview"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}

          {/* Staff shortcut */}
          {isStaff && (
            <Link
              to="/dashboard/staff/overview"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Staff</span>
            </Link>
          )}

          {/* User Auth or CTA */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                to="/curriculum"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-label="User account menu"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 pr-0.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 p-2 rounded-2xl shadow-xl border-slate-200 bg-white">
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 rounded-xl mb-1">
                    <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-600" />
                      {currentUser.name || 'Learner'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase">
                      {role || 'LEARNER'}
                    </span>
                  </div>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/curriculum"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <Compass className="w-4 h-4 text-indigo-600" />
                      <span>My Learning Path</span>
                    </Link>
                  </DropdownMenuItem>

                  {isSuperAdmin && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/dashboard/admin/overview"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        <span>Admin Console</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {isStaff && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/dashboard/staff/overview"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-teal-600" />
                        <span>Staff Console</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Sign in
              </Link>
              <Link
                to="/curriculum"
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/25 transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-95"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 max-h-[calc(100vh-68px)] overflow-y-auto space-y-4 shadow-xl"
          >
            {/* User card if logged in */}
            {currentUser && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{currentUser.name || 'Learner'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase">
                  {role || 'USER'}
                </span>
              </div>
            )}

            {/* Mobile Tab Selectors for Groups */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setMobileSection('learn')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mobileSection === 'learn' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                Learn
              </button>
              <button
                onClick={() => setMobileSection('practice')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mobileSection === 'practice' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                Practice
              </button>
              <button
                onClick={() => setMobileSection('resources')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mobileSection === 'resources' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                Resources
              </button>
            </div>

            {/* Content for selected section */}
            <div className="space-y-1">
              {mobileSection === 'learn' && (
                <>
                  <Link
                    to="/curriculum"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 border border-slate-100"
                  >
                    <Compass className="w-4 h-4 text-indigo-600" />
                    <div className="flex-1">
                      <p className="text-xs font-bold">Guided Learning Worlds</p>
                      <p className="text-[11px] text-slate-500">60 days per level (A1–C2)</p>
                    </div>
                  </Link>

                  <Link
                    to="/grammar"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 border border-slate-100"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <div className="flex-1">
                      <p className="text-xs font-bold">Grammar Library</p>
                      <p className="text-[11px] text-slate-500">Rules & conjugations</p>
                    </div>
                  </Link>

                  <Link
                    to="/vocabulary"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 border border-slate-100"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <div className="flex-1">
                      <p className="text-xs font-bold">Vocabulary Flashcards</p>
                      <p className="text-[11px] text-slate-500">Visual cards with audio</p>
                    </div>
                  </Link>

                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                      Quick Level Jump
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {CEFR_LEVEL_SHORTCUTS.map((item) => (
                        <Link
                          key={item.level}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-2 py-1.5 rounded-lg border border-slate-100 bg-slate-50/70 text-center"
                        >
                          <span className={`text-[10px] font-extrabold px-1 py-0.5 rounded ${item.color}`}>
                            {item.level}
                          </span>
                          <span className="block text-[10px] font-semibold text-slate-600 truncate mt-0.5">
                            {item.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {mobileSection === 'practice' && (
                <>
                  <Link
                    to="/quizzes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 border border-slate-100"
                  >
                    <HelpCircle className="w-4 h-4 text-pink-600" />
                    <div>
                      <p className="text-xs font-bold">Quizzes Arena</p>
                      <p className="text-[11px] text-slate-500">Articles & sentence drills</p>
                    </div>
                  </Link>

                  <Link
                    to="/reading"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 border border-slate-100"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs font-bold">Reading Stories</p>
                      <p className="text-[11px] text-slate-500">Graded German texts</p>
                    </div>
                  </Link>

                  <Link
                    to="/listening"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 border border-slate-100"
                  >
                    <Headphones className="w-4 h-4 text-teal-600" />
                    <div>
                      <p className="text-xs font-bold">Listening Labs</p>
                      <p className="text-[11px] text-slate-500">Dialogue audio & dictation</p>
                    </div>
                  </Link>
                </>
              )}

              {mobileSection === 'resources' && (
                <>
                  <Link
                    to="/blogs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <span>📰</span>
                    <span>German Learning Guides & Blog</span>
                  </Link>
                  <Link
                    to="/faq"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <span>❓</span>
                    <span>Frequently Asked Questions</span>
                  </Link>
                  <Link
                    to="/about-us"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <span>🏛️</span>
                    <span>About LingoVest</span>
                  </Link>
                  <Link
                    to="/support"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <span>💬</span>
                    <span>Learner Support</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link
                to="/curriculum"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
              >
                <span>Start Learning Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {currentUser ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
