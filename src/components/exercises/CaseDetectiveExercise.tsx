// client/src/components/exercises/CaseDetectiveExercise.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, XCircle } from 'lucide-react';
import { ICurriculumExercise } from '@/redux/api/curriculumApi';

interface CaseDetectiveExerciseProps {
  exercise: ICurriculumExercise;
  onAnswerSelected: (selected: string, isCorrect: boolean) => void;
  disabled?: boolean;
}

export const CaseDetectiveExercise: React.FC<CaseDetectiveExerciseProps> = ({
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
      {/* Header banner with detective badge */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex items-start gap-3">
        <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-md shrink-0">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Case Detective Challenge
          </span>
          <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
            {exercise.prompt}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {exercise.instruction || 'Inspect the sentence and identify the target grammatical case.'}
          </p>
        </div>
      </div>

      {/* Case Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {exercise.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrect = option.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase();

          let cardStyle = 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/40 text-slate-800';

          if (selectedOption !== null) {
            if (isCorrect) {
              cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/30';
            } else if (isSelected && !isCorrect) {
              cardStyle = 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-500/30';
            } else {
              cardStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
            }
          }

          return (
            <motion.button
              key={idx}
              whileHover={disabled || selectedOption !== null ? {} : { scale: 1.02 }}
              whileTap={disabled || selectedOption !== null ? {} : { scale: 0.98 }}
              disabled={disabled || selectedOption !== null}
              onClick={() => handleSelect(option)}
              className={`p-4 rounded-xl border-2 text-left font-semibold transition-all flex items-center justify-between gap-3 shadow-sm ${cardStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                  #{idx + 1}
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
