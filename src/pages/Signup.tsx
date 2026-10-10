import ScrollToTop from '@/components/ui/ToTop';
import { useLoginMutation, useSignupMutation } from '@/redux/api/authApi';
import {
  setUser,
  useCurrentToken,
  useCurrentUser,
  logout,
} from '@/redux/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { decodeToken } from '@/utils/tokenHelper';
import { motion } from 'framer-motion';
import { UserPlus, Eye, EyeOff, Star, Rocket, LogOut as LogOutIcon } from 'lucide-react';

const Signup = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const { register, handleSubmit } = useForm();
  const [login] = useLoginMutation();
  const [signup] = useSignupMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector(useCurrentToken);
  const currentUser = useAppSelector(useCurrentUser);

  const [submittedUser, setSubmittedUser] = useState<{ name: string; email: string } | null>(null);

  const handleSignup = async (signupData: FieldValues) => {
    const { name, email, password } = signupData;
    // All signups are USER role (learners) with PENDING status
    signupData = {
      ...signupData,
      role: 'USER',
    };

    if (!name || !email || !password) {
      toast.error('All fields are required', {
        position: 'top-right',
        icon: '😢',
        duration: 1500,
      });
      return;
    } else if (password.length < 6 || !/\d/.test(password)) {
      toast.error(
        'Password should be at least 6 characters long and contain a number',
        {
          position: 'top-right',
          icon: '😢',
          duration: 2500,
        }
      );
    } else {
      try {
        const signupResponse = await signup(signupData).unwrap();
        if (signupResponse?.success) {
          toast.success('Registration Request Submitted! 🎉', {
            position: 'top-right',
            icon: '🌟',
            duration: 3000,
          });
          setSubmittedUser({ name, email });
        }
      } catch (err: any) {
        toast.error(err?.data?.message || 'Signup Failed 😢', {
          position: 'top-right',
          icon: '😢',
          duration: 1500,
        });
      }
    }
  };

  const toggleShowingPassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Already logged in
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
                🎓
              </motion.div>
              <h2 className="text-2xl font-display font-extrabold text-slate-900">
                Already Registered!
              </h2>
              <p className="text-sm text-slate-500 font-semibold">
                Welcome, {(currentUser as any).name || (currentUser as any).email}
              </p>
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
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-extrabold text-sm shadow-md shadow-violet-500/25 flex items-center justify-center gap-2"
              >
                <Rocket className="w-4 h-4" />
                Go to Dashboard 🚀
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => dispatch(logout())}
                className="w-full py-3 rounded-xl border-2 border-violet-200 text-violet-600 font-extrabold text-sm hover:bg-violet-50 flex items-center justify-center gap-2"
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

  if (submittedUser) {
    return (
      <>
        <ScrollToTop />
        <div className="flex justify-center items-center min-h-screen px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white rounded-[28px] p-8 border-2 border-amber-200 shadow-playful space-y-6 text-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="text-6xl inline-block"
            >
              ⏳
            </motion.div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Registration Pending Approval
              </span>
              <h2 className="text-2xl font-display font-extrabold text-slate-900">
                Request Submitted!
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                Vielen Dank, <strong className="text-slate-800">{submittedUser.name}</strong>! Your registration request has been submitted and dispatched to the administrator approval queue.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50/50 rounded-2xl p-4 border border-amber-200/80 text-left space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="text-base">✉️</span>
                <span>Account Email:</span>
                <span className="text-amber-900 font-extrabold">{submittedUser.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="text-base">🛡️</span>
                <span>Reviewer:</span>
                <span className="text-slate-600 font-semibold">Super Admin & Staff</span>
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed pt-1 border-t border-amber-200/50">
                Once a Super Admin or Staff member reviews and accepts your request, your account will be activated and you can log in immediately.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                to="/login"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-md shadow-violet-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <span>Go to Login Page</span>
                <span>👉</span>
              </Link>
              <button
                type="button"
                onClick={() => setSubmittedUser(null)}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors"
              >
                Register another account
              </button>
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
          <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }} className="absolute top-[25%] right-[12%] text-3xl opacity-10">🇩🇪</motion.div>
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 7, repeat: Infinity, delay: 2 }} className="absolute bottom-[20%] left-[25%] text-3xl opacity-10">🌟</motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-[28px] border-2 border-violet-100 shadow-playful overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-violet-600 p-6 text-center text-white">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                className="text-4xl mb-2"
              >
                ✏️
              </motion.div>
              <h2 className="text-2xl font-display font-extrabold">Create Your Account!</h2>
              <p className="text-white/80 text-sm font-semibold mt-1">Join the German learning adventure 🚀</p>
            </div>

            {/* Form */}
            <div className="p-6 sm:p-8 space-y-5">
              <form className="space-y-4" onSubmit={handleSubmit(handleSignup)}>
                <div>
                  <label htmlFor="name" className="block mb-1.5 text-sm font-extrabold text-slate-700">
                    👤 Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 text-sm font-semibold rounded-xl border-2 border-violet-200 bg-violet-50/30 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 placeholder:text-slate-400"
                    placeholder="e.g. Babul Akter"
                    {...register('name')}
                  />
                </div>

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
                  <label htmlFor="password" className="block mb-1.5 text-sm font-extrabold text-slate-700">
                    🔒 Password
                  </label>
                  <div className="relative">
                    <input
                      type={isPasswordVisible ? 'text' : 'password'}
                      id="password"
                      placeholder="Min. 6 chars with a number"
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
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-violet-600 text-white font-extrabold text-sm shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Create Account 🎉
                </motion.button>
              </form>

              {/* Login link */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-violet-50">
                <p className="text-xs font-bold text-slate-400">Already registered?</p>
                <Link
                  to="/login"
                  className="text-xs font-extrabold text-violet-600 hover:text-violet-700 flex items-center gap-1"
                >
                  <Star className="w-3 h-3 fill-violet-600" />
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Signup;
