// client/src/pages/GrammarLibrary.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Volume2,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { useGetGrammarLibraryQuery } from '@/redux/api/curriculumApi';
import FelixMascot from '@/components/mascot/FelixMascot';
import { toast } from 'sonner';
import { AuthRequiredGate } from '@/components/common/AuthRequiredGate';

export const GrammarLibrary: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

  const { data: lessonsData, isLoading } = useGetGrammarLibraryQuery({
    level: selectedLevel !== 'ALL' ? selectedLevel : undefined,
    search: searchTerm.trim() ? searchTerm.trim() : undefined,
  });

  const lessons = lessonsData?.data || [];

  const speakGerman = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.info('Audio playback not supported.');
    }
  };

  const LEVEL_COLORS: Record<string, string> = {
    A1: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    A2: 'bg-sky-100 text-sky-800 border-sky-200',
    B1: 'bg-violet-100 text-violet-800 border-violet-200',
    B2: 'bg-amber-100 text-amber-800 border-amber-200',
    C1: 'bg-rose-100 text-rose-800 border-rose-200',
    C2: 'bg-indigo-100 text-indigo-900 border-indigo-200',
  };

  return (
    <AuthRequiredGate
      featureTitle="German Grammar Library & Rules"
      featureSubtitle="Comprehensive German grammar library covering A1 through C2 with sentence formulas, rules, authentic examples with native audio, and common pitfalls."
      badge="CEFR A1–C2 Grammar Encyclopedia"
    >
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-slate-50/70 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-violet-700 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 text-center md:text-left max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-violet-100">
              <BookOpen className="w-3.5 h-3.5" /> Deutsche Grammatik Referenz (A1–C2)
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
              Grammatik-Bibliothek
            </h1>
            <p className="text-violet-100 text-sm sm:text-base leading-relaxed">
              Dein umfassendes Nachschlagewerk für deutsche Grammatikregeln, Satzformeln,
              häufige Fehler und authentische Beispiele von A1 bis C2.
            </p>
          </div>

          <div className="shrink-0 hidden md:block relative z-10">
            <FelixMascot
              size="md"
              state="explaining"
              speechText="Suchst du nach einer bestimmten Regel? Nutze den Filter!"
            />
          </div>
        </div>

        {/* Search & Level Filter Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Thema oder Regel suchen (z. B. Akkusativ, Passiv, Konjunktiv)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:bg-white transition-all shadow-xs"
              />
            </div>

            {/* Total Results Counter */}
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 self-center">
              {lessons.length} Grammatik-Themen gefunden
            </span>
          </div>

          {/* Level Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
            {['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl === 'ALL' ? 'Alle Stufen (All)' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Lessons List */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-500 font-medium">
            Lade Grammatik-Bibliothek...
          </div>
        ) : lessons.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <p className="text-lg font-bold text-slate-700">Keine Themen gefunden</p>
            <p className="text-sm text-slate-500">
              Versuche einen anderen Suchbegriff oder setze den Filter auf "Alle Stufen".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedLevel('ALL');
              }}
              className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-violet-700 transition-all cursor-pointer"
            >
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson) => {
              const isExpanded = expandedLessonId === lesson.id;
              const badgeStyle = LEVEL_COLORS[lesson.levelCode] || LEVEL_COLORS.A1;

              return (
                <div
                  key={lesson.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Card Header (Clickable to toggle) */}
                  <div
                    onClick={() => setExpandedLessonId(isExpanded ? null : lesson.id)}
                    className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase border ${badgeStyle}`}>
                          {lesson.levelCode}
                        </span>
                        {lesson.day?.dayNumber && (
                          <span className="text-xs font-bold text-slate-400">
                            Tag #{lesson.day.dayNumber}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">
                          {lesson.topic}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {lesson.title}
                      </h3>

                      {lesson.formula && (
                        <p className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50/80 px-2.5 py-1 rounded-lg inline-block">
                          Formel: {lesson.formula}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      {lesson.day?.dayNumber && (
                        <Link
                          to={`/lesson/${lesson.levelCode}/${lesson.day.dayNumber}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <span>Üben</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}

                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="text-slate-400 p-1"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-5"
                      >
                        {/* Concept Overview */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Konzept-Überblick
                          </h4>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {lesson.conceptOverview}
                          </p>
                        </div>

                        {/* Rule Explanation */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Regel & Grammatikalische Bildung
                          </h4>
                          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                            {lesson.ruleExplanation}
                          </p>
                        </div>

                        {/* Examples */}
                        {lesson.examples && lesson.examples.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Beispielsätze
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {lesson.examples.slice(0, 4).map((ex, i) => (
                                <div
                                  key={i}
                                  className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-start justify-between gap-2"
                                >
                                  <div>
                                    <p className="text-sm font-bold text-slate-900">{ex.de}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{ex.en}</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => speakGerman(ex.de)}
                                    className="p-1.5 text-slate-400 hover:text-violet-600 transition-colors"
                                    title="Audio"
                                  >
                                    <Volume2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action footer */}
                        {lesson.day?.dayNumber && (
                          <div className="pt-2 flex justify-end">
                            <Link
                              to={`/lesson/${lesson.levelCode}/${lesson.day.dayNumber}`}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                            >
                              <span>Komplette Lektion mit {lesson.day.dayNumber} starten</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </AuthRequiredGate>
  );
};

export default GrammarLibrary;
