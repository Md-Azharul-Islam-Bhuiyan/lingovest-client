import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCurrentUser } from '@/redux/features/authSlice';
import { useAppSelector } from '@/redux/hook';
import { motion } from 'framer-motion';
import {
  Lock,
  GraduationCap,
  CheckCircle2,
  LogIn,
  UserPlus,
  ArrowLeft,
  Star,
} from 'lucide-react';

interface AuthRequiredGateProps {
  featureTitle: string;
  featureSubtitle: string;
  badge?: string;
  children: React.ReactNode;
}

export const AuthRequiredGate: React.FC<AuthRequiredGateProps> = ({
  featureTitle,
  featureSubtitle,
  badge = 'Goethe Learning Feature',
  children,
}) => {
  const currentUser = useAppSelector(useCurrentUser);
  const location = useLocation();

  if (currentUser) {
    return <>{children}</>;
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full bg-white rounded-[28px] border-2 border-violet-100 shadow-playful overflow-hidden"
      >
        {/* Top Gradient Banner */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 p-8 sm:p-10 text-white relative overflow-hidden text-center sm:text-left">
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-extrabold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>{badge || 'Authentication Required'}</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
                {featureTitle}
              </h1>
              <p className="text-white/80 text-sm leading-relaxed font-semibold">
                {featureSubtitle}
              </p>
            </div>

            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 3 }}
              className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0"
            >
              <span className="text-4xl">🔒</span>
            </motion.div>
          </div>

          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-4 right-20 text-2xl opacity-20">⭐</motion.div>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
              className="text-5xl"
            >
              🎓
            </motion.div>
            <h2 className="text-2xl font-display font-extrabold text-slate-900">
              Please Sign In to Continue
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-semibold">
              German vocabulary, audio playback, reading stories, listening labs, and quizzes are available for registered learners only.
            </p>
          </div>

          {/* Feature badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              { title: 'Complete CEFR A1–C2 Coverage', desc: 'Goethe-standard vocabulary with articles (der, die, das) and plurals.', emoji: '📊' },
              { title: 'Native Audio Pronunciation', desc: 'Listen at normal and slow speeds for every word and sentence.', emoji: '🔊' },
              { title: 'Bengali & English Explanations', desc: 'বাংলা অনুবাদ ও ব্যাকরণ নোট for all exercises.', emoji: '🇧🇩' },
              { title: 'Interactive Practice & Quizzes', desc: 'Sentence scrambles, fill-in-blanks, and Goethe comprehension checks.', emoji: '🧩' },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-pink-50 border-2 border-violet-100 flex items-start gap-3"
              >
                <span className="text-2xl">{feature.emoji}</span>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">{feature.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-semibold">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
            <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto flex-1">
              <Link
                to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-500/25 transition-all text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In 🔑</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto flex-1">
              <Link
                to="/signup"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-violet-700 font-extrabold bg-violet-100 hover:bg-violet-200 transition-all text-sm border-2 border-violet-200"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Free Account ✨</span>
              </Link>
            </motion.div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-violet-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Homepage</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
