import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Headphones,
  HelpCircle,
  Heart,
  ChevronDown,
  Star,
} from 'lucide-react';
import { useGetActiveLogoQuery } from '@/redux/api/logoApi';

interface FooterItem {
  to: string;
  label: string;
  sub?: string;
  emoji: string;
}

interface FooterSection {
  id: string;
  title: string;
  emoji: string;
  items: FooterItem[];
}

const FOOTER_SECTIONS: FooterSection[] = [
  {
    id: 'cefr',
    title: 'CEFR Levels',
    emoji: '📊',
    items: [
      { to: '/vocabulary?level=A1', label: 'A1', sub: 'Beginner', emoji: '🌱' },
      { to: '/vocabulary?level=A2', label: 'A2', sub: 'Elementary', emoji: '🌿' },
      { to: '/vocabulary?level=B1', label: 'B1', sub: 'Intermediate', emoji: '🌳' },
      { to: '/vocabulary?level=B2', label: 'B2', sub: 'Professional', emoji: '🎯' },
      { to: '/vocabulary?level=C1', label: 'C1 & C2', sub: 'Mastery', emoji: '🏆' },
    ],
  },
  {
    id: 'tools',
    title: 'Learning Tools',
    emoji: '🎮',
    items: [
      { to: '/vocabulary', label: 'Vocabulary Explorer', emoji: '📚' },
      { to: '/reading', label: 'Reading Stories', emoji: '📖' },
      { to: '/listening', label: 'Audio & Dictation', emoji: '🎧' },
      { to: '/quizzes', label: 'Practice Quizzes', emoji: '🧩' },
    ],
  },
  {
    id: 'links',
    title: 'Quick Links',
    emoji: '🚀',
    items: [
      { to: '/login', label: 'Sign In', emoji: '🔑' },
      { to: '/signup', label: 'Create Account', emoji: '✏️' },
      { to: '/about-us', label: 'About Us', emoji: '💜' },
      { to: '/support', label: 'Support', emoji: '💬' },
    ],
  },
];

const Footer = () => {
  const { data: logoData } = useGetActiveLogoQuery(undefined);
  const activeLogoUrl = logoData?.data?.url;

  // Track accordion open/close state on mobile
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    cefr: false,
    tools: false,
    links: false,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-violet-950 to-slate-950 text-slate-400 pt-12 pb-8 sm:pt-16 sm:pb-10 overflow-hidden">
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="md:col-span-3 lg:col-span-2 space-y-4 sm:space-y-5">
            <Link to="/" className="flex items-center gap-3 group">
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden shrink-0 ${
                  activeLogoUrl
                    ? 'bg-white p-1 border border-violet-800/40 shadow-violet-500/20'
                    : 'bg-gradient-to-tr from-violet-500 via-purple-500 to-pink-500 text-white shadow-violet-500/30'
                }`}
              >
                {activeLogoUrl ? (
                  <img
                    src={activeLogoUrl}
                    alt="LingoVest"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl">🇩🇪</span>
                )}
              </div>
              <div>
                <span className="text-lg sm:text-xl font-display font-extrabold tracking-tight text-white group-hover:text-violet-300 transition-colors">
                  LingoVest ✨
                </span>
                <p className="text-[10px] sm:text-[11px] font-bold text-violet-400 uppercase tracking-wider">
                  Fun German Academy
                </p>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
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

          {/* Accordion / Column Sections */}
          {FOOTER_SECTIONS.map((section) => {
            const isOpen = openSections[section.id];
            return (
              <div
                key={section.id}
                className="border-b border-violet-900/40 md:border-b-0 pb-4 md:pb-0"
              >
                {/* Header (Accordion toggle on mobile, static on desktop) */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between py-1 md:py-0 text-left md:pointer-events-none group"
                >
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2 group-hover:text-violet-300 md:group-hover:text-white transition-colors">
                    <span className="text-base">{section.emoji}</span>
                    <span>{section.title}</span>
                  </h4>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="md:hidden p-1 rounded-lg text-violet-400 bg-violet-950/60 border border-violet-800/40"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                {/* Desktop List: Always Visible */}
                <div className="hidden md:block mt-4">
                  <ul className="space-y-2.5">
                    {section.items.map((item) => (
                      <li key={item.to + item.label}>
                        <Link
                          to={item.to}
                          className="group hover:text-violet-300 transition-colors flex items-center gap-2 text-sm"
                        >
                          <span className="group-hover:scale-125 transition-transform inline-block">
                            {item.emoji}
                          </span>
                          <span className="font-bold">{item.label}</span>
                          {item.sub && (
                            <span className="text-slate-500 text-xs font-semibold">
                              {item.sub}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mobile Accordion List: Collapsible with smooth animation */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="md:hidden overflow-hidden mt-3"
                    >
                      <ul className="space-y-2.5 pt-1 pb-1">
                        {section.items.map((item) => (
                          <li key={item.to + item.label}>
                            <Link
                              to={item.to}
                              className="group hover:text-violet-300 transition-colors flex items-center gap-2.5 text-sm py-1 px-2 rounded-xl hover:bg-violet-900/30"
                            >
                              <span className="text-base">{item.emoji}</span>
                              <span className="font-bold text-slate-300">
                                {item.label}
                              </span>
                              {item.sub && (
                                <span className="text-slate-500 text-xs font-semibold">
                                  {item.sub}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-violet-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-bold text-center sm:text-left">
            © {new Date().getFullYear()} LingoVest Academy. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-6 text-xs text-slate-500 font-bold">
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
