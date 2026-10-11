import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  Volume2,
} from 'lucide-react';
import { TQuizItem, TQuizSet } from './QuizSetCard';

interface QuizResultScreenProps {
  quiz: TQuizSet;
  answers: Record<string, string>;
  onRetry: () => void;
  onBackToSets: () => void;
}

export const QuizResultScreen: React.FC<QuizResultScreenProps> = ({
  quiz,
  answers,
  onRetry,
  onBackToSets,
}) => {
  const items = Array.isArray(quiz.items) ? quiz.items : [];
  const totalQuestions = items.length;

  // Grade every item
  let correctCount = 0;
  const gradedItems = items.map((item, idx) => {
    const itemId = item.id || item._id || `item_${idx}`;
    const userAnswer = (answers[itemId] || '').trim();
    const correctAnswer = (item.correctAnswer || '').trim();

    // Flexible comparison for case or multi-token scrambles
    const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    if (isCorrect) correctCount += 1;

    return {
      item,
      itemId,
      userAnswer,
      correctAnswer,
      isCorrect,
      points: isCorrect ? 10 : 0,
    };
  });

  const totalPoints = correctCount * 10;
  const maxPoints = totalQuestions * 10;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const wrongCount = totalQuestions - correctCount;

  const [showConfetti, setShowConfetti] = useState(percentage >= 70);
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (percentage >= 70) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [percentage]);

  const toggleExpand = (id: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const playSpeech = (text: string) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Performance headline
  let feedback = {
    emoji: '🏆',
    title: 'Ausgezeichnet! Perfect Score!',
    subtitle: 'অসাধারণ! প্রতিটি প্রশ্নের উত্তর সঠিকভাবে দেওয়া হয়েছে!',
    color: 'from-amber-400 to-yellow-500',
    textColor: 'text-amber-600',
    badge: 'Perfect Mastery',
  };

  if (percentage >= 80 && percentage < 100) {
    feedback = {
      emoji: '🌟',
      title: 'Fantastisch! Outstanding Work!',
      subtitle: 'দারুণ ফলাফল! আপনি জার্মান ব্যাকরণে চমৎকার দক্ষতা দেখাচ্ছেন!',
      color: 'from-emerald-400 to-green-500',
      textColor: 'text-emerald-600',
      badge: 'Great Score',
    };
  } else if (percentage >= 60 && percentage < 80) {
    feedback = {
      emoji: '👍',
      title: 'Gut gemacht! Good Effort!',
      subtitle: 'ভালো প্রস্তুতি! নিয়মিত অনুশীলনে আপনি আরও ভালো করবেন!',
      color: 'from-blue-400 to-cyan-500',
      textColor: 'text-blue-600',
      badge: 'Passed',
    };
  } else if (percentage >= 40 && percentage < 60) {
    feedback = {
      emoji: '💪',
      title: 'Nicht schlecht! Keep Going!',
      subtitle: 'চেষ্টা চালিয়ে যান! নিচের ভুল উত্তরগুলোর ব্যাখ্যা দেখে নিন।',
      color: 'from-orange-400 to-amber-500',
      textColor: 'text-orange-600',
      badge: 'Needs Practice',
    };
  } else if (percentage < 40) {
    feedback = {
      emoji: '📚',
      title: 'Übung macht den Meister!',
      subtitle: 'অনুশীলনই সফলতার চাবিকাঠি! ব্যাখ্যাগুলো পড়ে আবার চেষ্টা করুন।',
      color: 'from-rose-400 to-red-500',
      textColor: 'text-rose-600',
      badge: 'Study Again',
    };
  }

  // Circular progress calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Confetti Explosion for good scores */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  background: [
                    '#FF6B9D',
                    '#C084FC',
                    '#60A5FA',
                    '#2DD4BF',
                    '#FBBF24',
                    '#4ADE80',
                    '#FB923C',
                  ][i % 7],
                  borderRadius: Math.random() > 0.5 ? '50%' : '3px',
                  width: `${8 + Math.random() * 8}px`,
                  height: `${8 + Math.random() * 8}px`,
                }}
                initial={{ y: -50, opacity: 1, rotate: 0 }}
                animate={{ y: '110vh', opacity: 0, rotate: 720 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.2 + Math.random(), delay: Math.random() * 0.4 }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Hero Summary Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card-playful p-6 sm:p-10 border-2 border-pink-200 rounded-[32px] bg-white shadow-playful space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-pink-100 via-violet-100 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Header feedback */}
        <div className="text-center space-y-2 relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="text-6xl inline-block"
          >
            {feedback.emoji}
          </motion.div>
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-black bg-pink-100 text-pink-700 uppercase tracking-wider">
            {feedback.badge} • Level {quiz.level}
          </span>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900">
            {feedback.title}
          </h1>
          <p className="text-sm font-semibold text-slate-500 max-w-xl mx-auto leading-relaxed">
            {feedback.subtitle}
          </p>
        </div>

        {/* Circular Progress & Points Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4 relative z-10">
          {/* Animated SVG Ring */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="text-slate-100"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              <motion.circle
                cx="88"
                cy="88"
                r={radius}
                className="text-pink-500"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
                stroke="url(#gradient-score)"
                fill="transparent"
              />
              <defs>
                <linearGradient id="gradient-score" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="50%" stopColor="#F43F5E" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl sm:text-4xl font-black font-display text-slate-900">
                {percentage}%
              </span>
              <span className="text-xs font-bold text-slate-400">Accuracy</span>
            </div>
          </div>

          {/* Points Breakdown Box */}
          <div className="space-y-3 min-w-[240px] text-center sm:text-left">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-violet-50 border-2 border-pink-100">
              <span className="text-xs font-extrabold text-pink-600 uppercase tracking-wider block">
                Total Earned Points
              </span>
              <div className="flex items-baseline gap-2 justify-center sm:justify-start mt-1">
                <span className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
                  {totalPoints}
                </span>
                <span className="text-sm font-bold text-slate-400">/ {maxPoints} Pts</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">
                (10 pts per correct answer)
              </p>
            </div>
          </div>
        </div>

        {/* 4 Stats Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <span className="text-lg font-black text-emerald-900 block">{correctCount}</span>
            <span className="text-xs font-bold text-emerald-700">Correct</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-center">
            <XCircle className="w-5 h-5 text-rose-600 mx-auto mb-1" />
            <span className="text-lg font-black text-rose-900 block">{wrongCount}</span>
            <span className="text-xs font-bold text-rose-700">Incorrect</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-violet-50 border border-violet-200 text-center">
            <Award className="w-5 h-5 text-violet-600 mx-auto mb-1" />
            <span className="text-lg font-black text-violet-900 block">{totalPoints}</span>
            <span className="text-xs font-bold text-violet-700">Points</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <Trophy className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <span className="text-lg font-black text-amber-900 block">{totalQuestions}</span>
            <span className="text-xs font-bold text-amber-700">Questions</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t-2 border-slate-100 relative z-10">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRetry}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake This Quiz 🔄</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBackToSets}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 shadow-xs flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Quiz Sets</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Per-Question Review Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-extrabold text-slate-900 flex items-center gap-2">
            <span>📝</span>
            <span>Question Review & Explanations</span>
          </h2>
          <span className="text-xs font-bold text-slate-400">
            Click any question to view grammar explanations
          </span>
        </div>

        <div className="space-y-3">
          {gradedItems.map(({ item, itemId, userAnswer, correctAnswer, isCorrect, points }, idx) => {
            const isExpanded = expandedReviews[itemId] ?? true; // default expanded so learners see right away

            return (
              <motion.div
                key={itemId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`rounded-2xl border-2 overflow-hidden transition-all bg-white ${
                  isCorrect
                    ? 'border-emerald-200 shadow-xs'
                    : 'border-rose-200 shadow-xs'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(itemId)}
                  className={`p-4 flex items-center justify-between gap-3 cursor-pointer select-none ${
                    isCorrect ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'bg-rose-50/50 hover:bg-rose-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}

                    <div className="min-w-0">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Q{idx + 1} • {item.type.replace('-', ' ')}
                      </span>
                      <p className="text-sm font-extrabold text-slate-900 truncate">
                        {item.promptGerman || correctAnswer}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {points > 0 ? `+${points} Pts` : '0 Pts'}
                    </span>

                    {item.promptGerman && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playSpeech(item.promptGerman || '');
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-white transition-colors"
                        title="Listen to German"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}

                    <button className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Details / Explanation */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 sm:p-5 border-t border-slate-100 space-y-3 bg-white"
                    >
                      {/* Answers comparison */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div
                          className={`p-3 rounded-xl border text-xs space-y-1 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                              : 'bg-rose-50 border-rose-200 text-rose-950'
                          }`}
                        >
                          <span className="font-extrabold uppercase text-[10px] tracking-wider block opacity-75">
                            Your Answer:
                          </span>
                          <p className="font-black text-sm">
                            {userAnswer || <span className="italic text-slate-400">(No answer given)</span>}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-950 text-xs space-y-1">
                          <span className="font-extrabold uppercase text-[10px] tracking-wider block text-emerald-700">
                            Correct Answer:
                          </span>
                          <p className="font-black text-sm text-emerald-800">
                            {correctAnswer}
                          </p>
                        </div>
                      </div>

                      {/* Bengali explanation */}
                      {item.explanationBn && (
                        <div className="p-3.5 rounded-xl bg-violet-50/70 border border-violet-200 text-xs text-slate-700 space-y-1">
                          <span className="font-black text-violet-700 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            ব্যাকরণ ব্যাখ্যা (Pedagogical Note):
                          </span>
                          <p className="font-semibold leading-relaxed text-slate-800">
                            {item.explanationBn}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizResultScreen;
