// client/src/components/exercises/MatchingPairsExercise.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ICurriculumExercise } from '@/redux/api/curriculumApi';

interface MatchingPairsExerciseProps {
  exercise: ICurriculumExercise;
  onAnswerSelected: (selected: string, isCorrect: boolean) => void;
  disabled?: boolean;
}

export const MatchingPairsExercise: React.FC<MatchingPairsExerciseProps> = ({
  exercise,
  onAnswerSelected,
  disabled = false,
}) => {
  const pairs = exercise.matchingPairs || [
    { left: 'ich', right: 'bin' },
    { left: 'du', right: 'bist' },
    { left: 'er/sie/es', right: 'ist' },
    { left: 'wir', right: 'sind' },
  ];

  const [leftItems, setLeftItems] = useState<{ id: string; text: string }[]>([]);
  const [rightItems, setRightItems] = useState<{ id: string; text: string }[]>([]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [shakePair, setShakePair] = useState<boolean>(false);

  useEffect(() => {
    // Shuffle left and right independently
    const lefts = pairs.map((p, idx) => ({ id: `L-${idx}`, text: p.left }));
    const rights = pairs.map((p, idx) => ({ id: `R-${idx}`, text: p.right }));

    setLeftItems([...lefts].sort(() => Math.random() - 0.5));
    setRightItems([...rights].sort(() => Math.random() - 0.5));
    setMatchedPairs(new Set());
    setSelectedLeft(null);
    setSelectedRight(null);
  }, [exercise]);

  // Handle selection match evaluation
  useEffect(() => {
    if (selectedLeft && selectedRight) {
      // Find original index from id
      const leftIdx = parseInt(selectedLeft.split('-')[1]);
      const rightIdx = parseInt(selectedRight.split('-')[1]);

      if (leftIdx === rightIdx) {
        // Correct pair match!
        const nextMatched = new Set(matchedPairs);
        nextMatched.add(selectedLeft);
        nextMatched.add(selectedRight);
        setMatchedPairs(nextMatched);
        setSelectedLeft(null);
        setSelectedRight(null);

        // Check if all matched
        if (nextMatched.size === pairs.length * 2) {
          onAnswerSelected('all_pairs_matched', true);
        }
      } else {
        // Mismatch - shake and reset selection
        setShakePair(true);
        setTimeout(() => {
          setShakePair(false);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 600);
      }
    }
  }, [selectedLeft, selectedRight]);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
        <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-1">
          {exercise.instruction || 'Match corresponding pairs'}
        </p>
        <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          {exercise.prompt}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-2.5">
          {leftItems.map((item) => {
            const isMatched = matchedPairs.has(item.id);
            const isSelected = selectedLeft === item.id;

            return (
              <motion.button
                key={item.id}
                animate={shakePair && isSelected ? { x: [-6, 6, -6, 6, 0] } : {}}
                whileHover={isMatched || disabled ? {} : { scale: 1.02 }}
                whileTap={isMatched || disabled ? {} : { scale: 0.98 }}
                disabled={isMatched || disabled}
                onClick={() => setSelectedLeft(item.id)}
                className={`w-full p-3.5 rounded-xl border-2 font-medium text-left transition-all flex items-center justify-between text-sm sm:text-base ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 opacity-80 cursor-default'
                    : isSelected
                    ? 'bg-violet-100 border-violet-500 text-violet-900 ring-2 ring-violet-400/30'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-violet-300'
                }`}
              >
                <span>{item.text}</span>
                {isMatched && <Check className="w-4 h-4 text-emerald-600" />}
              </motion.button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-2.5">
          {rightItems.map((item) => {
            const isMatched = matchedPairs.has(item.id);
            const isSelected = selectedRight === item.id;

            return (
              <motion.button
                key={item.id}
                animate={shakePair && isSelected ? { x: [-6, 6, -6, 6, 0] } : {}}
                whileHover={isMatched || disabled ? {} : { scale: 1.02 }}
                whileTap={isMatched || disabled ? {} : { scale: 0.98 }}
                disabled={isMatched || disabled}
                onClick={() => setSelectedRight(item.id)}
                className={`w-full p-3.5 rounded-xl border-2 font-medium text-left transition-all flex items-center justify-between text-sm sm:text-base ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 opacity-80 cursor-default'
                    : isSelected
                    ? 'bg-violet-100 border-violet-500 text-violet-900 ring-2 ring-violet-400/30'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-violet-300'
                }`}
              >
                <span>{item.text}</span>
                {isMatched && <Check className="w-4 h-4 text-emerald-600" />}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
