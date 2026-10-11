// client/src/pages/CurriculumCalendar.tsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Filter,
  Flame,
  Award,
} from 'lucide-react';
import {
  useGetLevelScheduleQuery,
  useGetMyProgressQuery,
} from '@/redux/api/curriculumApi';
import FelixMascot from '@/components/mascot/FelixMascot';
import { AuthRequiredGate } from '@/components/common/AuthRequiredGate';

const PHASES_METADATA = [
  { name: 'All', label: 'Alle Tage (1–60)' },
  { name: 'Foundations', label: 'Tage 1–7: Grundlagen & Diagnose' },
  { name: 'Core Grammar', label: 'Tage 8–21: Kern-Grammatik' },
  { name: 'Grammar Application', label: 'Tage 22–35: Satzbau & Anwendung' },
  { name: 'Real-World Application', label: 'Tage 36–45: Alltag & Praxis' },
  { name: 'Consolidation', label: 'Tage 46–53: Vertiefung & Festigung' },
  { name: 'Comprehensive Review', label: 'Tage 54–59: Goethe-Prüfungscheck' },
  { name: 'Final Assessment', label: 'Tag 60: Abschluss-Prüfung' },
];

export const CurriculumCalendar: React.FC = () => {
  const { levelCode = 'A1' } = useParams<{ levelCode: string }>();
  const [selectedPhase, setSelectedPhase] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: scheduleData, isLoading } = useGetLevelScheduleQuery(levelCode.toUpperCase());
  const { data: progressData } = useGetMyProgressQuery();

  const level = scheduleData?.data?.level;
  const days = scheduleData?.data?.days || [];
  const progress = progressData?.data;

  // Filter days
  const filteredDays = days.filter((day) => {
    const matchesPhase = selectedPhase === 'All' || day.phase === selectedPhase;
    const matchesSearch =
      !searchQuery ||
      day.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      day.focusGrammarTopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      day.dayNumber.toString() === searchQuery.trim();
    return matchesPhase && matchesSearch;
  });

  const completedCount = days.filter((d) => d.isCompleted).length;
  const totalDays = days.length || 60;
  const progressPercent = Math.round((completedCount / totalDays) * 100);

  return (
    <AuthRequiredGate
      featureTitle={`60-Tage Lehrplan — Level ${levelCode.toUpperCase()}`}
      featureSubtitle={`Systematischer 60-Tage Grammatik- und Übungsplan für die CEFR Stufe ${levelCode.toUpperCase()}.`}
      badge={`Goethe ${levelCode.toUpperCase()} Curriculum`}
    >
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-slate-50/60 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back navigation & Level switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/curriculum"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Zurück zu den Lernwelten
          </Link>

          {/* Quick Level Pills */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
              <Link
                key={lvl}
                to={`/curriculum/${lvl}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  levelCode.toUpperCase() === lvl
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {lvl}
              </Link>
            ))}
          </div>
        </div>

        {/* Level Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-violet-100 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" /> 60-Tage Lehrplan — Level {levelCode.toUpperCase()}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
              {level?.name || `Stufe ${levelCode}`}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl">
              {level?.description || `Der vollständige 60-Tage-Lernplan für die Stufe ${levelCode}. Jeder Tag führt dich durch strukturierte Grammatikerklärungen und interaktive Übungen.`}
            </p>

            {/* Progress Bar in Header */}
            <div className="pt-3 max-w-md">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
                <span>60-Tage Fortschritt ({completedCount}/60 abgeschlossen)</span>
                <span className="text-violet-600">{progressPercent}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-violet-600 to-pink-500 rounded-full transition-all duration-500"
                />
              </div>
            </div>
          </div>

          <div className="shrink-0 hidden md:block">
            <FelixMascot
              size="md"
              state="explaining"
              speechText={`Hier sind alle 60 Tage für ${levelCode}! Wähle einen Tag zum Lernen.`}
            />
          </div>
        </div>

        {/* Phase Navigation Tabs */}
        <div className="overflow-x-auto pb-2 flex items-center gap-2">
          {PHASES_METADATA.map((phase) => (
            <button
              key={phase.name}
              type="button"
              onClick={() => setSelectedPhase(phase.name)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedPhase === phase.name
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {phase.label}
            </button>
          ))}
        </div>

        {/* Search & Counter Row */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Zeige {filteredDays.length} von {days.length} Tagen
          </p>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Thema oder Tag suchen..."
            className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-violet-500 shadow-sm max-w-xs"
          />
        </div>

        {/* 60-Day Interactive Day Cards Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-500 font-medium">
            Lade 60-Tage Lehrplan... (Loading 60-day curriculum schedule)...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDays.map((day) => {
              const isDone = day.isCompleted;
              const isCurrent = day.isCurrent;
              const isAssessment = day.type === 'assessment';
              const isReview = day.type === 'review';

              return (
                <motion.div
                  key={day.dayNumber}
                  whileHover={{ y: -3 }}
                  className={`relative p-5 rounded-3xl border-2 transition-all flex flex-col justify-between shadow-sm hover:shadow-md ${
                    isDone
                      ? 'bg-emerald-50/40 border-emerald-300'
                      : isCurrent
                      ? 'bg-violet-50/60 border-violet-500 ring-4 ring-violet-500/10'
                      : isAssessment
                      ? 'bg-amber-50/40 border-amber-300'
                      : 'bg-white border-slate-200/90'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Card Top Pill */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shadow-xs ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-violet-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          #{day.dayNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {day.phase}
                        </span>
                      </div>

                      {isDone ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Erledigt
                        </span>
                      ) : isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
                          <Flame className="w-3.5 h-3.5 text-violet-600" /> Heute
                        </span>
                      ) : isAssessment ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          <Award className="w-3.5 h-3.5 text-amber-600" /> Prüfung
                        </span>
                      ) : null}
                    </div>

                    {/* Day Title & Focus */}
                    <div>
                      <h3 className="font-bold text-base text-slate-900 tracking-tight leading-snug">
                        {day.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mt-1 line-clamp-2">
                        Fokus: {day.focusGrammarTopic}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom / Action */}
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> ~{day.estimatedMinutes || 25} Min
                    </span>

                    <Link
                      to={`/lesson/${day.levelCode}/${day.dayNumber}`}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer ${
                        isDone
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : isCurrent
                          ? 'bg-violet-600 hover:bg-violet-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>{isDone ? 'Wiederholen' : 'Starten'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </AuthRequiredGate>
  );
};

export default CurriculumCalendar;
