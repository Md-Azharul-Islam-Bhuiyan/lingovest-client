import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetAllQuizzesQuery } from '@/redux/api/quizApi';
import { useCurrentUser } from '@/redux/features/authSlice';
import { useAppSelector } from '@/redux/hook';
import { AuthRequiredGate } from '@/components/common/AuthRequiredGate';
import {
  Filter,
  Star,
  Trophy,
  Sparkles,
  Zap,
  Layers,
  Award,
} from 'lucide-react';
import QuizSetCard, { TQuizSet, TQuizScore } from '@/components/quiz/QuizSetCard';
import QuizPlayMode from '@/components/quiz/QuizPlayMode';
import QuizResultScreen from '@/components/quiz/QuizResultScreen';

const CEFR_LEVELS = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'];
const LEVEL_EMOJIS: Record<string, string> = {
  ALL: '🌍',
  A1: '🌱',
  A2: '🌿',
  B1: '🌳',
  B2: '🎯',
  C1: '🔥',
};

const STORAGE_KEY = 'lingovest_quiz_scores_v1';

const LearnerQuizzes = () => {
  const currentUser = useAppSelector(useCurrentUser);
  const [selectedLevel, setSelectedLevel] = useState('ALL');

  // Orchestration state: 'list' | 'play' | 'results'
  const [view, setView] = useState<'list' | 'play' | 'results'>('list');
  const [activeQuiz, setActiveQuiz] = useState<TQuizSet | null>(null);
  const [latestAnswers, setLatestAnswers] = useState<Record<string, string>>({});

  // Past scores record stored by quiz id
  const [completedScores, setCompletedScores] = useState<Record<string, TQuizScore>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Query quizzes
  const queryParams = new URLSearchParams();
  if (selectedLevel !== 'ALL') queryParams.append('level', selectedLevel);
  queryParams.append('limit', '50');

  const { data, isLoading } = useGetAllQuizzesQuery(queryParams.toString(), {
    skip: !currentUser,
  });
  const quizzes: TQuizSet[] = data?.data || [];

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  // Handler: Start a quiz set
  const handleStartQuiz = (quiz: TQuizSet) => {
    setActiveQuiz(quiz);
    setLatestAnswers({});
    setView('play');
  };

  // Handler: Final submission from Play Mode
  const handleSubmitQuiz = (answers: Record<string, string>) => {
    if (!activeQuiz) return;

    const items = Array.isArray(activeQuiz.items) ? activeQuiz.items : [];
    const totalQuestions = items.length;
    let correctCount = 0;

    items.forEach((item, idx) => {
      const itemId = item.id || item._id || `item_${idx}`;
      const userAns = (answers[itemId] || '').trim().toLowerCase();
      const correctAns = (item.correctAnswer || '').trim().toLowerCase();
      if (userAns === correctAns) {
        correctCount += 1;
      }
    });

    const score = correctCount * 10;
    const totalPoints = totalQuestions * 10;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const quizKey = activeQuiz.id || activeQuiz._id || 'quiz_default';
    const scoreData: TQuizScore = {
      score,
      totalPoints,
      correctCount,
      totalQuestions,
      percentage,
      completedAt: new Date().toISOString(),
    };

    const updated = {
      ...completedScores,
      [quizKey]: scoreData,
    };
    setCompletedScores(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }

    setLatestAnswers(answers);
    setView('results');
  };

  // Handler: Retry the current quiz
  const handleRetry = () => {
    setLatestAnswers({});
    setView('play');
  };

  // Handler: Return to set selection
  const handleBackToSets = () => {
    setActiveQuiz(null);
    setLatestAnswers({});
    setView('list');
  };

  // Aggregate stats across sets
  const completedKeys = Object.keys(completedScores);
  const totalEarnedPoints = completedKeys.reduce(
    (acc, key) => acc + (completedScores[key]?.score || 0),
    0
  );
  const totalCompletedSets = completedKeys.length;

  return (
    <AuthRequiredGate
      featureTitle="Interactive German Practice Quizzes & Drills"
      featureSubtitle="Test your skills set-wise with article drills, sentence scrambles, and fill-in-the-blanks. Earn points and review your performance with detailed Bengali grammar explanations."
    >
      <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 min-h-screen">
        {/* ========================================================
            VIEW 1: SET SELECTION / LIST MODE
           ======================================================== */}
        {view === 'list' && (
          <div className="space-y-8">
            {/* Hero Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-pink-500 via-rose-500 to-violet-600 rounded-[32px] p-6 sm:p-10 text-white shadow-xl relative overflow-hidden"
            >
              <div className="relative z-10 space-y-3 max-w-2xl">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-extrabold uppercase tracking-wider">
                  <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                  Set-Wise Practice Arena
                </span>
                <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
                  🧩 German Practice & Quiz Sets
                </h1>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed font-semibold">
                  Pick a practice set, complete all questions, and get your points score at the end! Earn <strong>10 points</strong> for every correct answer. 🎯
                </p>
              </div>

              {/* Live Points Counter Pill */}
              <div className="relative z-10 pt-4 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-black">
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <span>Total Earned: {totalEarnedPoints} Points</span>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-black">
                  <Award className="w-4 h-4 text-emerald-300" />
                  <span>Sets Practiced: {totalCompletedSets}</span>
                </div>
              </div>

              <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-6 right-12 text-3xl opacity-20"
              >
                🧩
              </motion.div>
            </motion.div>

            {/* Level Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white rounded-[24px] p-4 sm:p-5 border-2 border-pink-100 shadow-playful flex items-center justify-between gap-4 flex-wrap"
            >
              <div className="flex items-center gap-2 overflow-x-auto text-xs w-full sm:w-auto pb-1 sm:pb-0">
                <span className="text-pink-400 font-extrabold uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Level:
                </span>
                {CEFR_LEVELS.map((lvl) => (
                  <motion.button
                    key={lvl}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-4 py-2 rounded-xl font-extrabold transition-all shrink-0 flex items-center gap-1.5 ${
                      selectedLevel === lvl
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30'
                        : 'bg-pink-50 text-slate-600 hover:bg-pink-100 border border-pink-100'
                    }`}
                  >
                    <span>{LEVEL_EMOJIS[lvl]}</span>
                    <span>{lvl}</span>
                  </motion.button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500">
                <Layers className="w-4 h-4 text-pink-500" />
                <span>{quizzes.length} Practice Sets Available</span>
              </div>
            </motion.div>

            {/* Quizzes Grid */}
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"
                />
                <p className="text-sm font-bold text-pink-500">Loading practice sets... 🧩</p>
              </div>
            ) : quizzes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[28px] p-12 text-center border-2 border-pink-100 shadow-playful space-y-3"
              >
                <div className="text-5xl mb-2">🧩</div>
                <h3 className="text-lg font-display font-extrabold text-slate-800">
                  No Practice Sets Found
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto font-semibold">
                  Try switching the CEFR level filter to see more sets!
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz, quizIdx) => {
                  const quizKey = quiz.id || quiz._id || `quiz_${quizIdx}`;
                  const pastScore = completedScores[quizKey];

                  return (
                    <QuizSetCard
                      key={quizKey}
                      quiz={quiz}
                      index={quizIdx}
                      pastScore={pastScore}
                      onStartQuiz={handleStartQuiz}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            VIEW 2: PLAY MODE (Focused, One Question at a Time)
           ======================================================== */}
        {view === 'play' && activeQuiz && (
          <QuizPlayMode
            quiz={activeQuiz}
            onExit={handleBackToSets}
            onSubmit={handleSubmitQuiz}
          />
        )}

        {/* ========================================================
            VIEW 3: RESULTS MODE (Score Reveal & Review)
           ======================================================== */}
        {view === 'results' && activeQuiz && (
          <QuizResultScreen
            quiz={activeQuiz}
            answers={latestAnswers}
            onRetry={handleRetry}
            onBackToSets={handleBackToSets}
          />
        )}
      </div>
    </AuthRequiredGate>
  );
};

export default LearnerQuizzes;
