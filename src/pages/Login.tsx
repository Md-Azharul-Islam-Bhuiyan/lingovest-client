import ScrollToTop from '@/components/ui/ToTop';
import { decodeToken } from '@/utils/tokenHelper';
import { useLoginMutation } from '@/redux/api/authApi';
import {
  logout,
  setUser,
  useCurrentToken,
  useCurrentUser,
} from '@/redux/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { LogIn, Rocket, Eye, EyeOff, Star, Zap, LogOut as LogOutIcon } from 'lucide-react';
import { API_BASE_URL } from '@/constant/config';

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const { register, handleSubmit } = useForm();
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAppSelector(useCurrentToken);
  const currentUser = useAppSelector(useCurrentUser);

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
  }, [token, dispatch, API_BASE_URL]);

  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (loginData: FieldValues) => {
    setLoginError(null);
    if (!loginData?.email || !loginData?.password) {
      toast.error('Email or Password is missing', {
        position: 'top-right',
        icon: '😢',
        duration: 1500,
      });
    } else {
      try {
        const response = await login(loginData).unwrap();
        const accessToken = response?.data?.accessToken;
        const refreshToken = response?.data?.refreshToken;
        const decodedUser = decodeToken(accessToken);

        if (decodedUser && accessToken) {
          toast.success('Willkommen! Login Successful 🎉', {
            position: 'top-right',
            icon: '🌟',
            duration: 1500,
          });
          dispatch(
            setUser({
              user: decodedUser,
              accessToken: accessToken,
              refreshToken: refreshToken,
            })
          );
          setTimeout(() => {
            const role = (decodedUser as any)?.role?.toUpperCase();
            const redirectUrl =
              (location.state as string) ||
              (role === 'ADMIN' || role === 'SUPER_ADMIN'
                ? '/dashboard/admin/overview'
                : role === 'STAFF'
                ? '/dashboard/staff/overview'
                : '/');
            navigate(redirectUrl);
          }, 500);
        }
      } catch (err: any) {
        const msg = err?.data?.message || 'Login Failed 😢';
        setLoginError(msg);
        toast.error(msg, {
          position: 'top-right',
          icon: msg.toLowerCase().includes('pending') ? '⏳' : '😢',
          duration: 3500,
        });
      }
    }
  };

  const toggleShowingPassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };



  // Already logged in view
  if (token && currentUser) {
    const role = ((currentUser as any)?.role || '').toUpperCase();
    return (
      <>
        <ScrollToTop />
        <div className="flex justify-center items-center min-h-screen px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white rounded-[28px] p-8 border-2 border-violet-100 shadow-playful space-y-6"
          >
            <div className="text-center space-y-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-6xl"
              >
                👋
              </motion.div>
              <h2 className="text-2xl font-display font-extrabold text-slate-900">
                Welcome back, {(currentUser as any).name || (currentUser as any).email}!
              </h2>
              <p className="text-sm text-slate-500 font-semibold">You are currently logged in.</p>
            </div>

            <div className="bg-gradient-to-r from-violet-50 to-pink-50 rounded-xl p-4 border-2 border-violet-100 space-y-2">
              <p className="text-xs font-bold text-slate-600">
                <span className="text-violet-600 font-extrabold mr-2">✉️ Email:</span> {(currentUser as any).email}
              </p>
              <p className="text-xs font-bold text-slate-600">
                <span className="text-violet-600 font-extrabold mr-2">🏷️ Role:</span> {(currentUser as any).role}
              </p>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(
                  role === 'ADMIN' || role === 'SUPER_ADMIN' ? '/dashboard/admin/overview' :
                  role === 'STAFF' ? '/dashboard/staff/overview' : '/'
                )}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-extrabold text-sm shadow-md shadow-violet-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <Rocket className="w-4 h-4" />
                Go to Dashboard 🚀
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => dispatch(logout())}
                className="w-full py-3 rounded-xl border-2 border-violet-200 text-violet-600 font-extrabold text-sm hover:bg-violet-50 flex items-center justify-center gap-2 transition-all"
              >
                <LogOutIcon className="w-4 h-4" />
                Sign Out
              </motion.button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <ScrollToTop />
      <div className="flex justify-center items-center min-h-screen px-4 py-12">
        {/* Decorative background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-[10%] left-[10%] text-4xl opacity-10">📚</motion.div>
          <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }} className="absolute top-[20%] right-[15%] text-3xl opacity-10">🇩🇪</motion.div>
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 7, repeat: Infinity, delay: 2 }} className="absolute bottom-[25%] left-[20%] text-3xl opacity-10">✨</motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-[28px] border-2 border-violet-100 shadow-playful overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 p-6 text-center text-white">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                className="text-4xl mb-2"
              >
                🔑
              </motion.div>
              <h2 className="text-2xl font-display font-extrabold">Welcome Back!</h2>
              <p className="text-white/80 text-sm font-semibold mt-1">Sign in to continue learning 🇩🇪</p>
            </div>

            {/* Form */}
            <div className="p-6 sm:p-8 space-y-5">
              <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3.5 rounded-xl border text-xs font-semibold flex items-start gap-2.5 ${
                      loginError.toLowerCase().includes('pending')
                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    <span className="text-base flex-shrink-0">
                      {loginError.toLowerCase().includes('pending') ? '⏳' : '⚠️'}
                    </span>
                    <div className="flex-1">
                      <p className="font-extrabold mb-0.5">
                        {loginError.toLowerCase().includes('pending')
                          ? 'Account Pending Approval'
                          : 'Login Error'}
                      </p>
                      <p className="opacity-90 leading-relaxed">{loginError}</p>
                    </div>
                  </motion.div>
                )}

                <div>
                  <label htmlFor="email" className="block mb-1.5 text-sm font-extrabold text-slate-700">
                    ✉️ Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 text-sm font-semibold rounded-xl border-2 border-violet-200 bg-violet-50/30 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 placeholder:text-slate-400"
                    placeholder="your@email.com"
                    {...register('email')}
                  />
                </div>

                <div className="relative">
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="password" className="text-sm font-extrabold text-slate-700">
                      🔒 Password
                    </label>
                    <Link to="/forgot-password" className="text-xs font-bold text-violet-500 hover:text-violet-700">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={isPasswordVisible ? 'text' : 'password'}
                      id="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-11 text-sm font-semibold rounded-xl border-2 border-violet-200 bg-violet-50/30 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-400 hover:text-violet-600 transition-colors"
                      onClick={toggleShowingPassword}
                    >
                      {isPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 text-white font-extrabold text-sm shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In 🚀
                </motion.button>
              </form>



              {/* Signup link */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-violet-50">
                <p className="text-xs font-bold text-slate-400">Not registered yet?</p>
                <Link
                  to="/signup"
                  className="text-xs font-extrabold text-violet-600 hover:text-violet-700 flex items-center gap-1"
                >
                  <Star className="w-3 h-3 fill-violet-600" />
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
