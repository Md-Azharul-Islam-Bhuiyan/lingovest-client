// client/src/components/exercises/ExerciseEngine.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { ICurriculumExercise } from '@/redux/api/curriculumApi';
import { MultipleChoiceExercise } from './MultipleChoiceExercise';
import { SentenceBuilderExercise } from './SentenceBuilderExercise';
import { FillInBlankExercise } from './FillInBlankExercise';
import { MatchingPairsExercise } from './MatchingPairsExercise';
import { CaseDetectiveExercise } from './CaseDetectiveExercise';
import FelixMascot, { MascotState } from '../mascot/FelixMascot';

interface ExerciseEngineProps {
  exercises: ICurriculumExercise[];
  onComplete: (score: number, totalXp: number) => void;
  experienceMode?: 'playful' | 'calm' | 'focus';
}

export const ExerciseEngine: React.FC<ExerciseEngineProps> = ({
  exercises,
  onComplete,
  experienceMode = 'playful',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);

  const [hasAnswered, setHasAnswered] = useState(false);
  const [lastIsCorrect, setLastIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Mascot reactive state
  const [mascotState, setMascotState] = useState<MascotState>('thinking');
  const [mascotSpeech, setMascotSpeech] = useState<string>('Konzentrier dich, du schaffst das!');

  if (!exercises || exercises.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
        <p className="text-slate-600 font-medium">No exercises available for this session.</p>
      </div>
    );
  }

  const currentExercise = exercises[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / exercises.length) * 100);

  const handleAnswerSelected = (_selected: string, isCorrect: boolean) => {
    setHasAnswered(true);
    setLastIsCorrect(isCorrect);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      const earned = currentExercise.xpValue || 20;
      setTotalXpEarned((prev) => prev + earned);
      setMascotState('celebrating');
      setMascotSpeech('Wunderbar! Genau richtig! 🎉');
    } else {
      setMascotState('encouraging');
      setMascotSpeech('Kein Problem! Schau dir die Erklärung an. 💪');
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setHasAnswered(false);
      setLastIsCorrect(null);
      setShowHint(false);
      setMascotState('thinking');
      setMascotSpeech('Weiter so! Nächste Aufgabe:');
    } else {
      // Completed all exercises
      const finalScore = Math.round(((correctCount + (lastIsCorrect ? 1 : 0)) / exercises.length) * 100);
      onComplete(finalScore, totalXpEarned);
    }
  };

  const renderExerciseComponent = () => {
    const type = currentExercise.exerciseType;

    switch (type) {
      case 'sentence_builder':
        return (
          <SentenceBuilderExercise
            key={currentExercise.id || currentIndex}
            exercise={currentExercise}
            onAnswerSelected={handleAnswerSelected}
            disabled={hasAnswered}
          />
        );
      case 'fill_blank':
        return (
          <FillInBlankExercise
            key={currentExercise.id || currentIndex}
            exercise={currentExercise}
            onAnswerSelected={handleAnswerSelected}
            disabled={hasAnswered}
          />
        );
      case 'matching_pairs':
        return (
          <MatchingPairsExercise
            key={currentExercise.id || currentIndex}
            exercise={currentExercise}
            onAnswerSelected={handleAnswerSelected}
            disabled={hasAnswered}
          />
        );
      case 'case_detective':
        return (
          <CaseDetectiveExercise
            key={currentExercise.id || currentIndex}
            exercise={currentExercise}
            onAnswerSelected={handleAnswerSelected}
            disabled={hasAnswered}
          />
        );
      case 'multiple_choice':
      case 'find_mistake':
      case 'verb_conjugation':
      default:
        return (
          <MultipleChoiceExercise
            key={currentExercise.id || currentIndex}
            exercise={currentExercise}
            onAnswerSelected={handleAnswerSelected}
            disabled={hasAnswered}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header: Progress Bar & Mascot Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
            <span>Aufgabe {currentIndex + 1} von {exercises.length}</span>
            <span className="text-violet-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> +{totalXpEarned} XP
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
            <motion.div
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
              className="h-full bg-gradient-to-r from-violet-600 to-pink-500 rounded-full"
            />
          </div>
        </div>

        {/* Mascot in playful/calm modes */}
        {experienceMode !== 'focus' && (
          <div className="hidden sm:block shrink-0">
            <FelixMascot
              size="sm"
              state={mascotState}
              speechText={mascotSpeech}
              showBadge={true}
            />
          </div>
        )}
      </div>

      {/* Main Exercise Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-violet-100 shadow-md">
        {renderExerciseComponent()}

        {/* Hint Section */}
        {currentExercise.hints && currentExercise.hints.length > 0 && !hasAnswered && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setShowHint(!showHint);
                if (!showHint) {
                  setMascotState('hint');
                  setMascotSpeech(currentExercise.hints[0] || 'Schau genau hin!');
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? 'Tipp ausblenden (Hide Hint)' : 'Brauchst du einen Tipp? (Need a hint?)'}
            </button>

            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs sm:text-sm bg-amber-50 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200 font-medium"
              >
                💡 {currentExercise.hints[0]}
              </motion.div>
            )}
          </div>
        )}

        {/* Contextual Answer Feedback Box */}
        <AnimatePresence>
          {hasAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`mt-6 p-4 sm:p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                lastIsCorrect
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50/90 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  lastIsCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {lastIsCorrect ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <AlertCircle className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg">
                    {lastIsCorrect ? 'Ausgezeichnet! (Excellent!)' : 'Fast geschafft! (Almost!)'}
                  </h4>
                  <p className="text-sm font-medium mt-0.5 opacity-90">
                    {currentExercise.explanation || 'Hier ist die grammatikalische Erklärung zur Aufgabe.'}
                  </p>
                  {!lastIsCorrect && (
                    <p className="text-xs font-bold text-rose-700 mt-1">
                      Richtige Antwort: <span className="underline">{currentExercise.correctAnswer}</span>
                    </p>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>{currentIndex < exercises.length - 1 ? 'Weiter (Next)' : 'Ergebnis (Finish)'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExerciseEngine;
