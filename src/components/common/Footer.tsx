import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Star,
  Compass,
  BookOpen,
  Sparkles,
  HelpCircle,
  FileText,
  Headphones,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { useGetActiveLogoQuery } from '@/redux/api/logoApi';

interface FooterItem {
  to: string;
  label: string;
  sub?: string;
  badge?: string;
}

interface FooterSection {
  id: string;
  title: string;
  items: FooterItem[];
}

const FOOTER_SECTIONS: FooterSection[] = [
  {
    id: 'curriculum',
    title: 'Curriculum & CEFR',
    items: [
      { to: '/curriculum', label: 'All 6 Guided Worlds', sub: '60 Days per Level' },
      { to: '/curriculum/A1', label: 'A1 Starter Village', sub: 'Beginner' },
      { to: '/curriculum/A2', label: 'A2 Grammar Forest', sub: 'Elementary' },
      { to: '/curriculum/B1', label: 'B1 Vocab Island', sub: 'Intermediate' },
      { to: '/curriculum/B2', label: 'B2 Grammar Castle', sub: 'Upper-Intermediate' },
      { to: '/curriculum/C1', label: 'C1 Fluency City', sub: 'Advanced' },
      { to: '/curriculum/C2', label: 'C2 Master’s Kingdom', sub: 'Mastery' },
    ],
  },
  {
    id: 'tools',
    title: 'Learning & Practice',
    items: [
      { to: '/grammar', label: 'Grammar Library', sub: 'Rules & Declensions' },
      { to: '/vocabulary', label: 'Vocabulary Flashcards', sub: 'Visual SRS & Audio' },
      { to: '/quizzes', label: 'Quizzes Arena', sub: 'Articles & Drills' },
      { to: '/reading', label: 'Reading Stories', sub: 'Graded German Stories' },
      { to: '/listening', label: 'Listening Labs', sub: 'Dialogues & Dictation' },
    ],
  },
  {
    id: 'platform',
    title: 'Resources & About',
    items: [
      { to: '/blogs', label: 'German Learning Guides', sub: 'Blog & Study Tips' },
      { to: '/faq', label: 'Frequently Asked Questions', sub: 'Curriculum Details' },
      { to: '/about-us', label: 'About LingoVest Academy', sub: 'Pedagogy & Mission' },
      { to: '/support', label: 'Learner Support & Help', sub: 'Direct Feedback' },
      { to: '/login', label: 'Learner Sign In', sub: 'Access Account' },
    ],
  },
];

const Footer = () => {
  const { data: logoData } = useGetActiveLogoQuery(undefined);
  const activeLogoUrl = logoData?.data?.url;

  // Track accordion open/close state on mobile
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    curriculum: false,
    tools: false,
    platform: false,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <footer className="relative bg-slate-900 text-slate-400 pt-14 pb-10 border-t border-slate-800 overflow-hidden">
      {/* Subtle background ambient lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden shrink-0 ${
                  activeLogoUrl
                    ? 'bg-white p-1 border border-slate-700 shadow-sm'
                    : 'bg-indigo-600 text-white shadow-sm'
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
                <span className="text-lg sm:text-xl font-bold font-display tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                  LingoVest
                </span>
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 tracking-wider">
                  German Learning Academy
                </p>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              A modern, systematic German learning platform designed to take you from A1 absolute beginner to C2 fluent mastery. Structured daily lessons, visual flashcards, graded reading, and Goethe-aligned exercises.
            </p>

            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                Goethe-Zertifikat CEFR Standards
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs font-semibold">
                60 Days per Level
              </span>
            </div>
          </div>

          {/* 3 Section Columns */}
          {FOOTER_SECTIONS.map((section) => {
            const isOpen = openSections[section.id];
            return (
              <div
                key={section.id}
                className="border-b border-slate-800 md:border-b-0 pb-4 md:pb-0"
              >
                {/* Header (Accordion toggle on mobile, static on desktop) */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between py-1 md:py-0 text-left md:pointer-events-none group"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 group-hover:text-indigo-300 md:group-hover:text-slate-200 transition-colors">
                    {section.title}
                  </h4>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="md:hidden p-1 rounded-lg text-slate-400 bg-slate-800"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                {/* Desktop List */}
                <div className="hidden md:block mt-4">
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.to + item.label}>
                        <Link
                          to={item.to}
                          className="hover:text-white transition-colors flex items-center justify-between text-xs sm:text-sm py-0.5 group"
                        >
                          <span className="font-medium text-slate-300 group-hover:text-white">
                            {item.label}
                          </span>
                          {item.sub && (
                            <span className="text-[11px] text-slate-500 font-normal ml-2">
                              {item.sub}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mobile Accordion List */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      className="md:hidden overflow-hidden mt-3"
                    >
                      <ul className="space-y-2 pt-1 pb-1">
                        {section.items.map((item) => (
                          <li key={item.to + item.label}>
                            <Link
                              to={item.to}
                              className="hover:text-white transition-colors flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-slate-800"
                            >
                              <span className="font-semibold text-slate-300">
                                {item.label}
                              </span>
                              {item.sub && (
                                <span className="text-[10px] text-slate-500">
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
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
            © {new Date().getFullYear()} LingoVest Academy. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6 text-xs text-slate-500 font-medium">
            <Link to="/about-us" className="hover:text-slate-400 transition-colors">
              About
            </Link>
            <Link to="/faq" className="hover:text-slate-400 transition-colors">
              FAQ
            </Link>
            <Link to="/support" className="hover:text-slate-400 transition-colors">
              Support
            </Link>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">
              Built for German learners worldwide
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
