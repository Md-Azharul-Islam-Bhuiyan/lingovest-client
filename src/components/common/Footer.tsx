import { Link } from 'react-router-dom';
import { BookOpen, FileText, Headphones, HelpCircle, Heart, ArrowUpRight, Sparkles, Star } from 'lucide-react';
import { useGetActiveLogoQuery } from '@/redux/api/logoApi';

const Footer = () => {
  const { data: logoData } = useGetActiveLogoQuery(undefined);
  const activeLogoUrl = logoData?.data?.url;

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-violet-950 to-slate-950 text-slate-400 pt-16 pb-10 overflow-hidden">
      {/* Decorative floating shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-violet-500/5 rounded-full blur-2xl float-anim" />
        <div className="absolute top-[30%] right-[10%] w-40 h-40 bg-pink-500/5 rounded-full blur-2xl float-anim-slow" />
        <div className="absolute bottom-[15%] left-[40%] w-36 h-36 bg-cyan-500/5 rounded-full blur-2xl float-anim-reverse" />
        {/* Stars */}
        <div className="absolute top-8 right-[15%] text-yellow-400/20 text-2xl float-anim">⭐</div>
        <div className="absolute top-20 left-[12%] text-pink-400/15 text-xl float-anim-slow">✨</div>
        <div className="absolute bottom-24 right-[30%] text-violet-400/15 text-xl float-anim-reverse">🌟</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3 group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden ${
                activeLogoUrl
                  ? 'bg-white p-1 border border-violet-800/40 shadow-violet-500/20'
                  : 'bg-gradient-to-tr from-violet-500 via-purple-500 to-pink-500 text-white shadow-violet-500/30'
              }`}>
                {activeLogoUrl ? (
                  <img
                    src={activeLogoUrl}
                    alt="DeutschLernen"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-2xl">🇩🇪</span>
                )}
              </div>
              <div>
                <span className="text-xl font-display font-extrabold tracking-tight text-white group-hover:text-violet-300 transition-colors">
                  DeutschLernen ✨
                </span>
                <p className="text-[11px] font-bold text-violet-400 uppercase tracking-wider">
                  Fun German Academy
                </p>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The most fun and interactive German learning platform! Learn with games, stories, audio, and quizzes — designed for all ages with Bengali & English explanations. 🎉
            </p>

            <div className="pt-1 flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1.5 rounded-full bg-violet-900/50 border border-violet-700/30 text-violet-300 text-xs font-extrabold flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                Goethe-Zertifikat Prep
              </span>
              <span className="px-3 py-1.5 rounded-full bg-pink-900/30 border border-pink-700/30 text-pink-300 text-xs font-extrabold">
                🇧🇩 বাংলা ও English
              </span>
            </div>
          </div>

          {/* CEFR Levels */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-base">📊</span> CEFR Levels
            </h4>
            <ul className="space-y-2.5">
              {[
                { level: 'A1', name: 'Beginner', emoji: '🌱' },
                { level: 'A2', name: 'Elementary', emoji: '🌿' },
                { level: 'B1', name: 'Intermediate', emoji: '🌳' },
                { level: 'B2', name: 'Professional', emoji: '🎯' },
                { level: 'C1 & C2', name: 'Mastery', emoji: '🏆' },
              ].map(({ level, name, emoji }) => (
                <li key={level}>
                  <Link
                    to="/vocabulary"
                    className="group hover:text-violet-300 transition-colors flex items-center gap-2 text-sm"
                  >
                    <span className="group-hover:scale-125 transition-transform inline-block">{emoji}</span>
                    <span className="font-bold">{level}</span>
                    <span className="text-slate-500">{name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning Features */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-base">🎮</span> Learning Tools
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/vocabulary', label: 'Vocabulary Explorer', emoji: '📚', Icon: BookOpen, color: 'text-violet-400' },
                { to: '/reading', label: 'Reading Stories', emoji: '📖', Icon: FileText, color: 'text-blue-400' },
                { to: '/listening', label: 'Audio & Dictation', emoji: '🎧', Icon: Headphones, color: 'text-teal-400' },
                { to: '/quizzes', label: 'Practice Quizzes', emoji: '🧩', Icon: HelpCircle, color: 'text-pink-400' },
              ].map(({ to, label, emoji }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group hover:text-violet-300 transition-colors flex items-center gap-2.5 text-sm"
                  >
                    <span className="group-hover:scale-125 transition-transform inline-block">{emoji}</span>
                    <span className="font-bold">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-base">🚀</span> Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/login"
                  className="hover:text-violet-300 transition-colors flex items-center gap-2 font-bold"
                >
                  <span>🔑</span> Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="hover:text-violet-300 transition-colors flex items-center gap-2 font-bold"
                >
                  <span>✏️</span> Create Account
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="hover:text-violet-300 transition-colors flex items-center gap-2 font-bold"
                >
                  <span>💜</span> About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="hover:text-violet-300 transition-colors flex items-center gap-2 font-bold"
                >
                  <span>💬</span> Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-violet-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-bold">
            © {new Date().getFullYear()} DeutschLernen Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500 font-bold">
            <span className="flex items-center gap-1.5">
              <span>📋</span> CEFR Standards
            </span>
            <span className="flex items-center gap-1.5">
              <span>🎓</span> Goethe-Institut Prep
            </span>
            <span className="flex items-center gap-1.5">
              Made with <Heart className="w-3.5 h-3.5 text-pink-500 inline mx-0.5 fill-pink-500" /> for Learners
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
