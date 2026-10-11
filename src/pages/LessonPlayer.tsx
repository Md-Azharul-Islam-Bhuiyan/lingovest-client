// client/src/pages/LessonPlayer.tsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Volume2,
  CheckCircle2,
  Sparkles,
  Award,
  AlertTriangle,
  Lightbulb,
  RotateCcw,
} from 'lucide-react';
import {
  useGetCurriculumDayQuery,
  useCompleteDayMutation,
  useGetMyProgressQuery,
} from '@/redux/api/curriculumApi';
import { ExerciseEngine } from '@/components/exercises/ExerciseEngine';
import FelixMascot from '@/components/mascot/FelixMascot';
import { toast } from 'sonner';
import { AuthRequiredGate } from '@/components/common/AuthRequiredGate';

export const LessonPlayer: React.FC = () => {
  const { levelCode = 'A1', dayNumber = '1' } = useParams<{ levelCode: string; dayNumber: string }>();
  const navigate = useNavigate();

  const dayNum = parseInt(dayNumber);
  const { data: dayData, isLoading } = useGetCurriculumDayQuery({
    levelCode: levelCode.toUpperCase(),
    dayNumber: dayNum,
  });
  const { data: progressData } = useGetMyProgressQuery();
  const [completeDay, { isLoading: isSaving }] = useCompleteDayMutation();

  // Progressive disclosure stages:
  // 0: Concept Overview
  // 1: Rules & Formula
  // 2: Practical Examples
  // 3: Common Mistakes & Tips
  // 4: Interactive Exercise Engine
  // 5: Victory & Summary
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [completedResults, setCompletedResults] = useState<{ score: number; totalXp: number } | null>(null);

  const day = dayData?.data;
  const lesson = day?.lesson;
  const exercises = day?.exercises || [];
  const progress = progressData?.data;
  const experienceMode = progress?.experienceMode || 'playful';

  // Audio speech synthesis helper for German pronunciation
  const speakGerman = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.info('Audio playback is not supported on this device/browser.');
    }
  };

  const handleExercisesCompleted = async (score: number, totalXp: number) => {
    setCompletedResults({ score, totalXp });
    setCurrentStage(5); // Go to victory screen

    try {
      const res = await completeDay({
        levelCode: levelCode.toUpperCase(),
        dayNumber: dayNum,
        score,
        totalQuestions: exercises.length,
        xpEarned: totalXp || 50,
      }).unwrap();

      toast.success(`Tag ${dayNum} gemeistert! +${res.data?.xpEarned || 50} XP 🎉`, {
        duration: 3000,
      });
    } catch {
      // Local fallback if offline/guest
      toast.success(`Tag ${dayNum} abgeschlossen! Toll gemacht! 🌟`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 text-center bg-slate-50 text-slate-600 font-medium">
        Lade Lektion... (Loading lesson player)...
      </div>
    );
  }

  if (!day) {
    return (
      <div className="min-h-screen py-20 text-center bg-slate-50 space-y-4">
        <p className="text-slate-700 font-bold text-lg">Lektion nicht gefunden (Lesson not found).</p>
        <Link to={`/curriculum/${levelCode}`} className="text-violet-600 font-semibold underline">
          Zurück zum Lehrplan
        </Link>
      </div>
    );
  }

  const STAGES = [
    { title: 'Überblick', desc: 'Overview' },
    { title: 'Regeln', desc: 'Rules & Formula' },
    { title: 'Beispiele', desc: 'Examples' },
    { title: 'Tipps & Fallen', desc: 'Pitfalls & Tips' },
    { title: 'Übungen', desc: 'Practice Games' },
  ];

  return (
    <AuthRequiredGate
      featureTitle={`Lektion: Tag ${day.dayNumber} (${levelCode.toUpperCase()})`}
      featureSubtitle={`Interaktive Grammatik-Lektion: ${day.title} mit Satzformeln, Praxisbeispielen und Lernspielen.`}
      badge={`Goethe ${levelCode.toUpperCase()} Lektion`}
    >
      <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to={`/curriculum/${levelCode.toUpperCase()}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Zum Kalender ({levelCode.toUpperCase()})
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-violet-100 text-violet-800 font-bold rounded-full text-xs">
              {levelCode.toUpperCase()} • Tag {day.dayNumber}
            </span>
          </div>
        </div>

        {/* Stage Progress Tabs (when not on victory screen) */}
        {currentStage < 5 && (
          <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto">
            {STAGES.map((stg, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStage(idx)}
                className={`flex-1 py-2 px-2.5 rounded-xl text-center transition-all cursor-pointer shrink-0 sm:shrink ${
                  currentStage === idx
                    ? 'bg-violet-600 text-white shadow-sm font-bold'
                    : currentStage > idx
                    ? 'bg-emerald-50 text-emerald-800 font-semibold hover:bg-emerald-100'
                    : 'text-slate-500 hover:bg-slate-100 font-medium'
                }`}
              >
                <div className="text-xs truncate">{stg.title}</div>
              </button>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        <div className="bg-white rounded-3xl border-2 border-violet-100 shadow-md p-6 sm:p-10 relative overflow-hidden">
          {/* Stage 0: Overview */}
          {currentStage === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
                  Tag {day.dayNumber} • {day.phase}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-slate-900">
                  {day.title}
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                  Grammatik-Schwerpunkt: {day.focusGrammarTopic}
                </p>
              </div>

              <div className="p-5 bg-violet-50/70 rounded-2xl border border-violet-100 space-y-2">
                <h3 className="font-bold text-violet-900 text-sm uppercase tracking-wider">
                  📖 Was lernst du heute? (Concept Overview)
                </h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  {lesson?.conceptOverview || day.description}
                </p>
              </div>

              {lesson?.whyItMatters && (
                <div className="p-5 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
                  <h3 className="font-bold text-amber-900 text-sm uppercase tracking-wider">
                    💡 Warum ist das wichtig? (Why it matters)
                  </h3>
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    {lesson.whyItMatters}
                  </p>
                </div>
              )}

              {/* Felix Mascot commentary */}
              {experienceMode !== 'focus' && (
                <div className="pt-2">
                  <FelixMascot
                    size="md"
                    state="explaining"
                    speechText="Lass uns zusammen diese Grammatikregel Schritt für Schritt meistern!"
                  />
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStage(1)}
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Zur Grammatikregel (Rules)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Stage 1: Rules & Formula */}
          {currentStage === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
                  Schritt 2: Die Grammatikregel
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                  {lesson?.title || day.focusGrammarTopic}
                </h2>
              </div>

              {/* Formula Card */}
              {lesson?.formula && (
                <div className="p-6 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl shadow-md space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-200">
                    Satzformel / Grammatik-Muster (Formula):
                  </span>
                  <p className="text-xl sm:text-2xl font-mono font-bold tracking-wide">
                    {lesson.formula}
                  </p>
                </div>
              )}

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                  Erklärung & Anwendung (Rule Explanation):
                </h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {lesson?.ruleExplanation || 'Beachte die genauen Konjugationen und die Position des Verbs im Haupt- oder Nebensatz.'}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStage(0)}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-sm cursor-pointer"
                >
                  ← Zurück
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStage(2)}
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Praxisbeispiele sehen (Examples)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Stage 2: Verified Examples */}
          {currentStage === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
                  Schritt 3: Praxisbeispiele & Aussprache
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                  Echte Beispielsätze (Practical Examples)
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Klicke auf das Audio-Symbol für die deutsche Aussprache.
                </p>
              </div>

              <div className="space-y-3">
                {lesson?.examples?.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 hover:bg-violet-50/50 rounded-2xl border border-slate-200/80 transition-all flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <p className="text-base sm:text-lg font-bold text-slate-900">
                        {ex.de}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500">
                        {ex.en}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => speakGerman(ex.de)}
                      className="p-2.5 bg-white hover:bg-violet-600 text-slate-700 hover:text-white rounded-xl shadow-xs border border-slate-200 transition-all cursor-pointer shrink-0"
                      title="Audio anhören"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStage(1)}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-sm cursor-pointer"
                >
                  ← Zurück
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStage(3)}
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Typische Fehler & Tipps (Tips)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Stage 3: Common Mistakes & Quick Tips */}
          {currentStage === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
                  Schritt 4: Fehler vermeiden & Profi-Tipps
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                  Häufige Stolperfallen (Common Mistakes)
                </h2>
              </div>

              {/* Common Mistakes Cards */}
              <div className="space-y-3">
                {lesson?.commonMistakes?.map((cm, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-1.5"
                  >
                    <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Falsch: {cm.incorrect}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Richtig: {cm.correct}</span>
                    </div>
                    <p className="text-xs text-slate-600 pt-1">
                      {cm.explanation}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick Tips */}
              {lesson?.quickTips && lesson.quickTips.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                  <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4" /> Felix's Schnell-Tipps:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-700">
                    {lesson.quickTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStage(2)}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-sm cursor-pointer"
                >
                  ← Zurück
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStage(4)}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Jetzt Spielen & Üben ({exercises.length} Aufgaben)</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Stage 4: Interactive Exercise Engine */}
          {currentStage === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
                  Interaktive Grammatik-Aufgaben
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStage(1)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Regel nachschlagen
                </button>
              </div>

              <ExerciseEngine
                exercises={exercises}
                onComplete={handleExercisesCompleted}
                experienceMode={experienceMode}
              />
            </motion.div>
          )}

          {/* Stage 5: Victory Screen & Summary */}
          {currentStage === 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 text-center space-y-6"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-pink-500 to-violet-600 flex items-center justify-center text-white shadow-xl">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                  Level {levelCode.toUpperCase()} • Tag {day.dayNumber} Erfolgreich!
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
                  Hervorragend gemacht! 🎉
                </h2>
                <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto">
                  Du hast die Lektion "{day.title}" erfolgreich abgeschlossen und deine Grammatik-Fähigkeiten vertieft.
                </p>
              </div>

              {/* Score and XP Stats */}
              <div className="flex items-center justify-center gap-6 py-4">
                <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100 text-center min-w-[120px]">
                  <span className="text-xs font-bold text-violet-600 uppercase">Genauigkeit</span>
                  <p className="text-2xl font-black text-violet-900 mt-0.5">
                    {completedResults?.score || 100}%
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center min-w-[120px]">
                  <span className="text-xs font-bold text-amber-600 uppercase">Belohnung</span>
                  <p className="text-2xl font-black text-amber-900 mt-0.5 flex items-center justify-center gap-1">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    +{completedResults?.totalXp || 50} XP
                  </p>
                </div>
              </div>

              {/* Celebrating Mascot */}
              <div className="flex justify-center pt-2">
                <FelixMascot
                  size="md"
                  state="celebrating"
                  speechText="Fantastisch! Du machst großartige Fortschritte im Deutschen!"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStage(0);
                    setCompletedResults(null);
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Lektion wiederholen
                </button>

                {dayNum < 60 ? (
                  <Link
                    to={`/lesson/${levelCode}/${dayNum + 1}`}
                    onClick={() => {
                      setCurrentStage(0);
                      setCompletedResults(null);
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Nächster Tag ({dayNum + 1})</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    to={`/curriculum/${levelCode}`}
                    className="w-full sm:w-auto px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Zum Kalender</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
    </AuthRequiredGate>
  );
};

export default LessonPlayer;
