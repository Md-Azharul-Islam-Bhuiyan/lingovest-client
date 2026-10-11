import React from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Trophy, CheckCircle2, Star, Sparkles } from 'lucide-react';

export interface TQuizItem {
  id: string;
  _id?: string;
  type: string;
  promptGerman?: string;
  options?: string[];
  correctAnswer: string;
  explanationBn?: string;
  scrambleTokens?: string[];
}

export interface TQuizSet {
  id: string;
  _id?: string;
  title: string;
  level: string;
  topic: string;
  items: TQuizItem[];
  description?: string;
}

export interface TQuizScore {
  score: number;
  totalPoints: number;
  correctCount: number;
  totalQuestions: number;
  percentage: number;
  completedAt?: string;
}

interface QuizSetCardProps {
  quiz: TQuizSet;
  index: number;
  pastScore?: TQuizScore;
  onStartQuiz: (quiz: TQuizSet) => void;
}

const LEVEL_CONFIG: Record<string, { emoji: string; bg: string; text: string; border: string }> = {
  A1: { emoji: '🌱', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  A2: { emoji: '🌿', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  B1: { emoji: '🌳', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  B2: { emoji: '🎯', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  C1: { emoji: '🔥', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  C2: { emoji: '🏆', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

export const QuizSetCard: React.FC<QuizSetCardProps> = ({
  quiz,
  index,
  pastScore,
  onStartQuiz,
}) => {
  const items = Array.isArray(quiz.items) ? quiz.items : [];
  const questionCount = items.length;
  const maxPoints = questionCount * 10;
  const levelInfo = LEVEL_CONFIG[quiz.level] || {
    emoji: '📊',
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
  };

  const hasPassed = pastScore && pastScore.percentage >= 60;
  const isPerfect = pastScore && pastScore.percentage === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="card-playful p-5 sm:p-6 flex flex-col justify-between border-2 border-pink-100 hover:border-pink-300 shadow-playful hover:shadow-playful-lg transition-all rounded-[28px] bg-white group relative overflow-hidden"
    >
      {/* Top glowing edge effect on hover */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-rose-500 to-violet-500 opacity-80" />

      <div className="space-y-4">
        {/* Header badges: Level, Topic, and Points */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-xl text-xs font-black border ${levelInfo.bg} ${levelInfo.text} ${levelInfo.border} flex items-center gap-1 shadow-sm`}
            >
              <span>{levelInfo.emoji}</span>
              <span>Level {quiz.level}</span>
            </span>

            <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
              Set #{index + 1}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>{maxPoints} Pts</span>
          </div>
        </div>

        {/* Title and Topic */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500 block truncate">
            📁 {quiz.topic || 'General Practice'}
          </span>
          <h3 className="text-lg sm:text-xl font-display font-extrabold text-slate-900 group-hover:text-pink-600 transition-colors leading-snug line-clamp-2">
            {quiz.title}
          </h3>
        </div>

        {/* Question format tags & pill counter */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 font-extrabold border border-pink-100">
            🎯 {questionCount} {questionCount === 1 ? 'Question' : 'Questions'}
          </span>

          <span className="text-slate-400 text-xs">
            10 pts per correct
          </span>
        </div>
      </div>

      {/* Footer Area: Past score and Launch button */}
      <div className="pt-5 mt-4 border-t-2 border-slate-100 space-y-3">
        {/* Past score badge if exists */}
        {pastScore && (
          <div
            className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border ${
              isPerfect
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : hasPassed
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-1.5">
              {isPerfect ? (
                <Sparkles className="w-4 h-4 text-amber-500" />
              ) : hasPassed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Star className="w-4 h-4 text-rose-500" />
              )}
              <span>
                Best Score: <strong>{pastScore.score}</strong> / {pastScore.totalPoints} pts
              </span>
            </div>
            <span className="font-extrabold px-2 py-0.5 rounded-md bg-white/80 shadow-xs">
              {pastScore.percentage}%
            </span>
          </div>
        )}

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onStartQuiz(quiz)}
          className={`w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold shadow-md flex items-center justify-center gap-2 transition-all ${
            pastScore
              ? 'bg-white hover:bg-pink-50 text-slate-800 border-2 border-pink-200 hover:border-pink-300 shadow-sm'
              : 'bg-gradient-to-r from-pink-500 via-rose-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white shadow-pink-500/25'
          }`}
        >
          {pastScore ? (
            <>
              <RotateCcw className="w-4 h-4 text-pink-500" />
              <span>Practice Again</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Start Quiz Set</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuizSetCard;
