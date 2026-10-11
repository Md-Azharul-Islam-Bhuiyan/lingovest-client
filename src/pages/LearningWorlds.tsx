// client/src/pages/LearningWorlds.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  Flame,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Award,
  Sliders,
  Volume2,
} from 'lucide-react';
import {
  useGetCurriculumLevelsQuery,
  useGetMyProgressQuery,
  useUpdateLearnerSettingsMutation,
} from '@/redux/api/curriculumApi';
import FelixMascot from '@/components/mascot/FelixMascot';
import { toast } from 'sonner';
import { AuthRequiredGate } from '@/components/common/AuthRequiredGate';

const WORLD_THEMES: Record<
  string,
  {
    emoji: string;
    gradient: string;
    badgeColor: string;
    illustrationBg: string;
    highlightTopic: string;
  }
> = {
  A1: {
    emoji: '🏡',
    gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    illustrationBg: 'bg-emerald-50 border-emerald-100',
    highlightTopic: 'Pronunciation, der/die/das, Nominativ & Akkusativ, Present Tense',
  },
  A2: {
    emoji: '🌲',
    gradient: 'from-sky-500 via-blue-600 to-indigo-600',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    illustrationBg: 'bg-sky-50 border-sky-100',
    highlightTopic: 'Dativ case, Perfekt past tense, Wechselpräpositionen, Subordinate clauses',
  },
  B1: {
    emoji: '🏝️',
    gradient: 'from-violet-500 via-purple-600 to-fuchsia-600',
    badgeColor: 'bg-violet-100 text-violet-800 border-violet-200',
    illustrationBg: 'bg-violet-50 border-violet-100',
    highlightTopic: 'Relative clauses, Passiv, Konjunktiv II wishes, Genitiv, Two-part connectors',
  },
  B2: {
    emoji: '🏰',
    gradient: 'from-amber-500 via-orange-600 to-red-600',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    illustrationBg: 'bg-amber-50 border-amber-100',
    highlightTopic: 'Passiv alternatives, Participial attributes, Konjunktiv I, Subjective modals',
  },
  C1: {
    emoji: '🌆',
    gradient: 'from-rose-500 via-pink-600 to-rose-700',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    illustrationBg: 'bg-rose-50 border-rose-100',
    highlightTopic: 'Academic nominal style, Complex syntax embedding, Nuanced connectors',
  },
  C2: {
    emoji: '👑',
    gradient: 'from-indigo-600 via-purple-700 to-slate-900',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    illustrationBg: 'bg-indigo-50 border-indigo-100',
    highlightTopic: 'Literary cadence, Dialectic nuances, GDS Großes Deutsches Sprachdiplom',
  },
};

export const LearningWorlds: React.FC = () => {
  const { data: levelsData, isLoading: levelsLoading } = useGetCurriculumLevelsQuery();
  const { data: progressData } = useGetMyProgressQuery();
  const [updateSettings] = useUpdateLearnerSettingsMutation();

  const [activeMode, setActiveMode] = useState<'playful' | 'calm' | 'focus'>('playful');

  const levels = levelsData?.data || [];
  const progress = progressData?.data;

  const currentMode = progress?.experienceMode || activeMode;

  const handleModeChange = async (mode: 'playful' | 'calm' | 'focus') => {
    setActiveMode(mode);
    try {
      await updateSettings({ experienceMode: mode }).unwrap();
      toast.success(`Mode switched to ${mode.toUpperCase()}! 🎨`, { duration: 1500 });
    } catch {
      // Offline fallback
    }
  };

  return (
    <AuthRequiredGate
      featureTitle="German Learning Worlds (A1–C2)"
      featureSubtitle="Six immersive learning worlds covering A1 through C2 with separate 60-day curriculum paths, animated lessons, and Goethe exam preparation."
      badge="Goethe CEFR Learning Journey"
    >
      <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      currentMode === 'focus'
        ? 'bg-slate-50 text-slate-900'
        : currentMode === 'calm'
        ? 'bg-slate-50/70 text-slate-800'
        : 'bg-gradient-to-b from-violet-50/60 via-white to-slate-50 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-700 via-purple-600 to-pink-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          {/* Subtle background circles */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-0 right-1/3 w-48 h-48 bg-pink-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-pink-100">
                <Compass className="w-3.5 h-3.5" /> CEFR A1 — C2 Interactive Journey
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
                Die 6 Lernwelten <span className="text-pink-200">(6 Learning Worlds)</span>
              </h1>
              <p className="text-violet-100 text-sm sm:text-base leading-relaxed">
                6 Independent 60-Day Curriculums. 360 Structured Days of systematic German grammar,
                practical games, animated lessons, and Goethe exam preparation.
              </p>

              {/* Learner Metrics Pill */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-semibold">
                <div className="flex items-center gap-1.5 bg-black/20 px-3.5 py-1.5 rounded-xl backdrop-blur-md">
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{progress?.streakDays || 1} Tage Streak</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/20 px-3.5 py-1.5 rounded-xl backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>{progress?.xp || 0} XP Gesamt</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/20 px-3.5 py-1.5 rounded-xl backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{progress?.completedDays?.length || 0} / 360 Tage gemeistert</span>
                </div>
              </div>
            </div>

            {/* Mascot in Hero */}
            {currentMode !== 'focus' && (
              <div className="shrink-0 flex flex-col items-center">
                <FelixMascot
                  size="lg"
                  state="happy"
                  speechText="Willkommen! Wähle deine Stufe und leg los!"
                />
              </div>
            )}
          </div>
        </div>

        {/* Experience Mode Selector & Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Erlebnis-Modus:
            </span>
            <div className="inline-flex p-1 bg-slate-100 rounded-xl">
              {(['playful', 'calm', 'focus'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => handleModeChange(mode)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all cursor-pointer ${
                    currentMode === mode
                      ? 'bg-white text-violet-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/grammar"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-violet-100 text-slate-700 hover:text-violet-700 rounded-xl text-xs sm:text-sm font-bold transition-all"
            >
              <BookOpen className="w-4 h-4" /> Grammatik-Bibliothek
            </Link>
          </div>
        </div>

        {/* 6 Themed Learning Worlds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levelsLoading ? (
            <div className="col-span-full py-16 text-center text-slate-500 font-medium">
              Lade Lernwelten... (Loading 6 Learning Worlds)...
            </div>
          ) : (
            levels.map((level, idx) => {
              const theme = WORLD_THEMES[level.code] || WORLD_THEMES.A1;
              const isCurrent = (progress?.currentLevel || 'A1') === level.code;
              const completedCount = level.completedDaysCount || 0;
              const progressPct = level.progressPercent || 0;

              return (
                <motion.div
                  key={level.code}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className={`relative flex flex-col justify-between bg-white rounded-3xl border-2 transition-all shadow-sm hover:shadow-xl overflow-hidden ${
                    isCurrent
                      ? 'border-violet-400 ring-4 ring-violet-500/10'
                      : 'border-slate-200/80 hover:border-violet-300'
                  }`}
                >
                  {/* Card Header Gradient Banner */}
                  <div className={`p-6 bg-gradient-to-r ${theme.gradient} text-white relative`}>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl sm:text-4xl">{theme.emoji}</span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black tracking-wider uppercase">
                        CEFR {level.code}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight mt-3">
                      {level.name}
                    </h3>
                    <p className="text-white/80 text-xs font-medium mt-1 line-clamp-1">
                      {level.tagline}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {level.description}
                      </p>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Kern-Grammatik (Core Focus):
                        </span>
                        <p className="text-xs font-semibold text-slate-800 line-clamp-2">
                          {theme.highlightTopic}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span>Fortschritt ({completedCount}/60 Tage)</span>
                        <span className="text-violet-600">{progressPct}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                        <div
                          style={{ width: `${progressPct}%` }}
                          className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full transition-all duration-500`}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <Link
                        to={`/curriculum/${level.code}`}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/20'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <span>60-Tage Kalender öffnen</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
    </AuthRequiredGate>
  );
};

export default LearningWorlds;
