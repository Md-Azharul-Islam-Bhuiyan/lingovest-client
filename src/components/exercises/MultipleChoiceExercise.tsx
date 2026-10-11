// client/src/components/exercises/MultipleChoiceExercise.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ICurriculumExercise } from '@/redux/api/curriculumApi';

interface MultipleChoiceExerciseProps {
  exercise: ICurriculumExercise;
  onAnswerSelected: (selected: string, isCorrect: boolean) => void;
  disabled?: boolean;
}

export const MultipleChoiceExercise: React.FC<MultipleChoiceExerciseProps> = ({
  exercise,
  onAnswerSelected,
  disabled = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    if (disabled || selectedOption !== null) return;
    setSelectedOption(option);
    const isCorrect = option.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase();
    onAnswerSelected(option, isCorrect);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
        <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-1">
          {exercise.instruction || 'Select the correct option'}
        </p>
        <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          {exercise.prompt}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {exercise.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrect = option.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase();

          let btnStyle = 'border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/50 text-slate-700';

          if (selectedOption !== null) {
            if (isCorrect) {
              btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/30';
            } else if (isSelected && !isCorrect) {
              btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-500/30';
            } else {
              btnStyle = 'border-slate-200 bg-slate-50/60 text-slate-400 opacity-60';
            }
          }

          return (
            <motion.button
              key={idx}
              whileHover={disabled || selectedOption !== null ? {} : { scale: 1.02 }}
              whileTap={disabled || selectedOption !== null ? {} : { scale: 0.98 }}
              disabled={disabled || selectedOption !== null}
              onClick={() => handleSelect(option)}
              className={`p-4 rounded-xl border-2 text-left font-medium transition-all flex items-center justify-between gap-3 shadow-sm ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-base sm:text-lg">{option}</span>
              </div>

              {selectedOption !== null && (
                <div>
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : isSelected ? (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  ) : null}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
