import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  Volume2,
  Sparkles,
  HelpCircle,
  Flag,
} from 'lucide-react';
import { TQuizItem, TQuizSet } from './QuizSetCard';

interface QuizPlayModeProps {
  quiz: TQuizSet;
  onExit: () => void;
  onSubmit: (answers: Record<string, string>) => void;
}

export const QuizPlayMode: React.FC<QuizPlayModeProps> = ({
  quiz,
  onExit,
  onSubmit,
}) => {
  const items = Array.isArray(quiz.items) ? quiz.items : [];
  const totalQuestions = items.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scrambleBuilt, setScrambleBuilt] = useState<Record<string, string[]>>({});

  const currentItem: TQuizItem | undefined = items[currentIndex];
  const itemId = currentItem ? currentItem.id || currentItem._id || `item_${currentIndex}` : '';
  const currentAnswer = itemId ? answers[itemId] : undefined;

  const progressPercent = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const answeredCount = Object.keys(answers).filter((k) => !!answers[k]).length;

  // Web Speech helper
  const playSpeech = (text: string) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Sound effects with Web Audio API for a playful experience
  const playSound = (type: 'tap' | 'select' | 'pop') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'select') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'pop') {
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch {
      // Audio not permitted or not supported, ignore silently
    }
  };

  const handleSelectOption = (opt: string) => {
    playSound('select');
    setAnswers((prev) => ({
      ...prev,
      [itemId]: opt,
    }));
  };

  const handleScrambleWordClick = (token: string) => {
    playSound('pop');
    const existing = scrambleBuilt[itemId] || [];
    const updated = [...existing, token];
    setScrambleBuilt((prev) => ({
      ...prev,
      [itemId]: updated,
    }));
    setAnswers((prev) => ({
      ...prev,
      [itemId]: updated.join(' '),
    }));
  };

  const handleScrambleReset = () => {
    playSound('pop');
    setScrambleBuilt((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitAll = () => {
    onSubmit(answers);
  };

  if (!currentItem) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-slate-500 font-bold">No questions found in this set.</p>
        <button
          onClick={onExit}
          className="px-6 py-2.5 rounded-xl bg-pink-500 text-white font-extrabold text-sm"
        >
          Back to Quiz Sets
        </button>
      </div>
    );
  }

  const isScramble = currentItem.type === 'sentence-scramble';
  const builtTokens = scrambleBuilt[itemId] || [];
  const builtSentence = builtTokens.join(' ');
  const scrambleTokens =
    Array.isArray(currentItem.scrambleTokens) && currentItem.scrambleTokens.length > 0
      ? currentItem.scrambleTokens
      : (currentItem.correctAnswer || '').split(' ').filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar: Exit button, set title, live question counter */}
      <div className="flex items-center justify-between gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExit}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold shadow-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Sets</span>
        </motion.button>

        <div className="text-center min-w-0">
          <p className="text-xs font-extrabold text-pink-600 uppercase tracking-wider truncate">
            {quiz.title}
          </p>
          <p className="text-[11px] text-slate-400 font-bold truncate">
            {quiz.topic} • Level {quiz.level}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs font-black text-slate-800 bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-200">
            {answeredCount}/{totalQuestions} Answered
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border-2 border-pink-100 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-slate-600">
          <span className="flex items-center gap-1.5 text-pink-600">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span>{Math.round(progressPercent)}% Completed</span>
        </div>

        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-violet-600"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Active Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -25 }}
          transition={{ duration: 0.3 }}
          className="card-playful p-6 sm:p-8 space-y-6 border-2 border-pink-200 rounded-[32px] bg-white shadow-playful"
        >
          {/* Question Category & Audio */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b-2 border-pink-100">
            <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-pink-100 text-pink-800 flex items-center gap-1.5">
              <span>{isScramble ? '🧩' : currentItem.type === 'article-drill' ? '💖' : '✏️'}</span>
              <span>{currentItem.type.replace('-', ' ').toUpperCase()}</span>
            </span>

            {currentItem.promptGerman && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => playSpeech(currentItem.promptGerman || '')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-700 text-xs font-extrabold transition-colors shadow-xs"
                title="Listen to German prompt 🔊"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen 🔊</span>
              </motion.button>
            )}
          </div>

          {/* Prompt Section */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isScramble
                ? '🧩 Click the word blocks in the correct German order:'
                : 'Select the best answer (answers will be verified at the end):'}
            </p>

            {isScramble ? (
              <div className="space-y-3">
                <div className="min-h-16 p-4 rounded-2xl bg-gradient-to-r from-pink-50/60 to-violet-50/60 border-2 border-pink-200 text-slate-800 font-extrabold flex items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2 items-center">
                    {builtTokens.length > 0 ? (
                      builtTokens.map((token, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 border-2 border-pink-300 shadow-xs font-extrabold text-sm"
                        >
                          {token}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 font-normal italic text-sm">
                        Tap word blocks below to form the sentence...
                      </span>
                    )}
                  </div>

                  {builtTokens.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: -90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleScrambleReset}
                      className="p-2 rounded-xl text-slate-400 hover:text-pink-600 hover:bg-pink-100/70 transition-colors shrink-0"
                      title="Reset Tokens"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </div>
            ) : (
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 leading-snug">
                {currentItem.promptGerman}
              </h2>
            )}
          </div>

          {/* Answer Options / Word Blocks */}
          {isScramble ? (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-500">Available Words:</span>
              <div className="flex flex-wrap gap-2.5">
                {scrambleTokens.map((token, tIdx) => {
                  const isUsed = builtTokens.includes(token);
                  return (
                    <motion.button
                      key={tIdx}
                      whileHover={!isUsed ? { scale: 1.08, y: -2 } : {}}
                      whileTap={!isUsed ? { scale: 0.95 } : {}}
                      disabled={isUsed}
                      onClick={() => handleScrambleWordClick(token)}
                      className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold border-2 transition-all ${
                        isUsed
                          ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-40'
                          : 'bg-white text-slate-800 border-pink-200 hover:border-pink-400 hover:text-pink-600 shadow-sm shadow-pink-200/50'
                      }`}
                    >
                      {token}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {(currentItem.options || []).map((opt) => {
                const isSelected = currentAnswer === opt;

                return (
                  <motion.button
                    key={opt}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-4 rounded-2xl text-sm font-bold border-2 transition-all text-left flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-600 shadow-md shadow-pink-500/25 font-extrabold'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-pink-300 hover:bg-pink-50/50 shadow-xs'
                    }`}
                  >
                    <span>{opt}</span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'border-white bg-white/20 text-white'
                          : 'border-slate-300 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Hint banner explaining answers are recorded without giving them away */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-pink-500 shrink-0" />
            <span>
              Your choice is saved! You can change it anytime before clicking <strong>Submit Quiz</strong> on the final question.
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 border-2 transition-all ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </motion.button>

        {isLastQuestion ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmitAll}
            className="px-6 sm:px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/30 flex items-center gap-2 animate-bounce-gentle"
          >
            <Flag className="w-4 h-4" />
            <span>Submit Quiz & View Results 🏁</span>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md shadow-pink-500/25 flex items-center gap-2"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default QuizPlayMode;
