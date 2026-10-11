// client/src/components/exercises/SentenceBuilderExercise.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Check } from 'lucide-react';
import { ICurriculumExercise } from '@/redux/api/curriculumApi';

interface SentenceBuilderExerciseProps {
  exercise: ICurriculumExercise;
  onAnswerSelected: (selected: string, isCorrect: boolean) => void;
  disabled?: boolean;
}

export const SentenceBuilderExercise: React.FC<SentenceBuilderExerciseProps> = ({
  exercise,
  onAnswerSelected,
  disabled = false,
}) => {
  const initialTokens = exercise.sentenceTokens && exercise.sentenceTokens.length > 0
    ? exercise.sentenceTokens
    : exercise.options;

  // Shuffle tokens initially
  const [availableTokens, setAvailableTokens] = useState<{ id: string; text: string }[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<{ id: string; text: string }[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const tokens = initialTokens.map((text, idx) => ({
      id: `${text}-${idx}-${Math.random()}`,
      text,
    }));
    // Fisher-Yates shuffle
    const shuffled = [...tokens].sort(() => Math.random() - 0.5);
    setAvailableTokens(shuffled);
    setSelectedTokens([]);
    setSubmitted(false);
  }, [exercise]);

  const handleSelectToken = (token: { id: string; text: string }) => {
    if (disabled || submitted) return;
    setAvailableTokens((prev) => prev.filter((t) => t.id !== token.id));
    setSelectedTokens((prev) => [...prev, token]);
  };

  const handleRemoveToken = (token: { id: string; text: string }) => {
    if (disabled || submitted) return;
    setSelectedTokens((prev) => prev.filter((t) => t.id !== token.id));
    setAvailableTokens((prev) => [...prev, token]);
  };

  const handleReset = () => {
    if (disabled || submitted) return;
    const all = [...availableTokens, ...selectedTokens].sort(() => Math.random() - 0.5);
    setAvailableTokens(all);
    setSelectedTokens([]);
  };

  const handleCheck = () => {
    if (disabled || submitted || selectedTokens.length === 0) return;
    setSubmitted(true);

    const assembled = selectedTokens.map((t) => t.text).join(' ').trim();
    const normalize = (str: string) =>
      str.toLowerCase().replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ').trim();

    const normalizedAssembled = normalize(assembled);
    const normalizedCorrect = normalize(exercise.correctAnswer);

    let isCorrect = normalizedAssembled === normalizedCorrect;

    // Check against acceptable answers
    if (!isCorrect && exercise.acceptableAnswers) {
      isCorrect = exercise.acceptableAnswers.some(
        (alt) => normalize(alt) === normalizedAssembled
      );
    }

    onAnswerSelected(assembled, isCorrect);
  };

  return (
    <div className="space-y-5">
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
        <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-1">
          {exercise.instruction || 'Arrange the words in the correct sentence order'}
        </p>
        <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          {exercise.prompt}
        </p>
      </div>

      {/* Assembly Dropzone */}
      <div className="min-h-[72px] p-4 bg-violet-50/50 rounded-2xl border-2 border-dashed border-violet-200 flex flex-wrap items-center gap-2 transition-all">
        {selectedTokens.length === 0 ? (
          <span className="text-slate-400 text-sm font-medium italic select-none">
            Click words below to assemble your sentence...
          </span>
        ) : (
          <AnimatePresence>
            {selectedTokens.map((token) => (
              <motion.button
                key={token.id}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={disabled || submitted ? {} : { scale: 1.05 }}
                disabled={disabled || submitted}
                onClick={() => handleRemoveToken(token)}
                className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-xl shadow-sm hover:bg-violet-700 active:scale-95 transition-all text-sm sm:text-base cursor-pointer"
              >
                {token.text}
              </motion.button>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Word Pool */}
      <div className="flex flex-wrap gap-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-100">
        <AnimatePresence>
          {availableTokens.map((token) => (
            <motion.button
              key={token.id}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={disabled || submitted ? {} : { scale: 1.05 }}
              whileTap={disabled || submitted ? {} : { scale: 0.95 }}
              disabled={disabled || submitted}
              onClick={() => handleSelectToken(token)}
              className="px-4 py-2 bg-white text-slate-800 font-semibold rounded-xl border border-slate-200 shadow-sm hover:border-violet-300 hover:bg-violet-50/40 text-sm sm:text-base cursor-pointer transition-all"
            >
              {token.text}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handleReset}
          disabled={disabled || submitted || selectedTokens.length === 0}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>

        <button
          type="button"
          onClick={handleCheck}
          disabled={disabled || submitted || selectedTokens.length === 0}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" /> Satz Prüfen (Check)
        </button>
      </div>
    </div>
  );
};
