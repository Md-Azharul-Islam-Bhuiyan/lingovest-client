// client/src/components/exercises/FillInBlankExercise.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ICurriculumExercise } from '@/redux/api/curriculumApi';

interface FillInBlankExerciseProps {
  exercise: ICurriculumExercise;
  onAnswerSelected: (selected: string, isCorrect: boolean) => void;
  disabled?: boolean;
}

export const FillInBlankExercise: React.FC<FillInBlankExerciseProps> = ({
  exercise,
  onAnswerSelected,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // If there are options provided (quick-pick options), allow clicking them
  const hasOptions = exercise.options && exercise.options.length > 0;

  const handleSubmit = (answer: string) => {
    if (disabled || submitted || !answer.trim()) return;
    setSubmitted(true);
    setInputValue(answer);

    const normalize = (s: string) => s.trim().toLowerCase();
    const cleanAnswer = normalize(answer);
    let isCorrect = cleanAnswer === normalize(exercise.correctAnswer);

    if (!isCorrect && exercise.acceptableAnswers) {
      isCorrect = exercise.acceptableAnswers.some((alt) => normalize(alt) === cleanAnswer);
    }

    onAnswerSelected(answer, isCorrect);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
        <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-1">
          {exercise.instruction || 'Fill in the missing word'}
        </p>
        <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          {exercise.prompt}
        </p>
      </div>

      {/* Free text input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(inputValue);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type missing word here..."
          disabled={disabled || submitted}
          className="flex-1 px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-violet-500 shadow-sm"
        />
        <button
          type="submit"
          disabled={disabled || submitted || !inputValue.trim()}
          className="px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Check className="w-4 h-4" /> Bestätigen
        </button>
      </form>

      {/* Quick Option Pills if provided */}
      {hasOptions && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Or choose an option:
          </p>
          <div className="flex flex-wrap gap-2">
            {exercise.options.map((opt, idx) => (
              <motion.button
                key={idx}
                whileHover={disabled || submitted ? {} : { scale: 1.05 }}
                whileTap={disabled || submitted ? {} : { scale: 0.95 }}
                disabled={disabled || submitted}
                onClick={() => handleSubmit(opt)}
                className="px-4 py-2 bg-slate-100 hover:bg-violet-100 hover:text-violet-700 text-slate-700 font-semibold rounded-xl text-sm border border-slate-200/80 transition-all cursor-pointer"
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
