import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetAllQuizzesQuery } from '@/redux/api/quizApi';
import { useCurrentUser } from '@/redux/features/authSlice';
import { useAppSelector } from '@/redux/hook';
import { AuthRequiredGate } from '@/components/common/AuthRequiredGate';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Filter,
  Star,
} from 'lucide-react';

const CEFR_LEVELS = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'];
const LEVEL_EMOJIS: Record<string, string> = {
  ALL: '🌍', A1: '🌱', A2: '🌿', B1: '🌳', B2: '🎯', C1: '🔥',
};

const LearnerQuizzes = () => {
  const currentUser = useAppSelector(useCurrentUser);
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scrambleBuilt, setScrambleBuilt] = useState<Record<string, string[]>>({});

  const queryParams = new URLSearchParams();
  if (selectedLevel !== 'ALL') queryParams.append('level', selectedLevel);
  queryParams.append('limit', '50');

  const { data, isLoading } = useGetAllQuizzesQuery(queryParams.toString(), {
    skip: !currentUser,
  });
  const quizzes = data?.data || [];

  const handleScrambleWordClick = (itemId: string, token: string) => {
    const current = scrambleBuilt[itemId] || [];
    setScrambleBuilt({
      ...scrambleBuilt,
      [itemId]: [...current, token],
    });
  };

  const handleScrambleReset = (itemId: string) => {
    const next = { ...scrambleBuilt };
    delete next[itemId];
    setScrambleBuilt(next);
  };

  return (
    <AuthRequiredGate
      featureTitle="Interactive German Practice Quizzes & Drills"
      featureSubtitle="Test your skills with article drills (der/die/das), sentence scrambles, and fill-in-the-blanks with detailed Bengali pedagogical explanations."
    >
      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 min-h-screen">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-pink-500 via-rose-500 to-violet-600 rounded-[28px] p-6 sm:p-10 text-white shadow-xl relative overflow-hidden"
        >
          <div className="relative z-10 space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-extrabold uppercase tracking-wider">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
              Grammatik- & Übungsarena
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
              🧩 Practice Quizzes & Drills
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed font-semibold">
              Test your German with fun article drills, sentence puzzles, and fill-in-the-blanks! 🎯
            </p>
          </div>
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-6 right-12 text-3xl opacity-20">🧩</motion.div>
        </motion.div>

        {/* Level Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-[24px] p-4 sm:p-6 border-2 border-pink-100 shadow-playful flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-pink-400 font-extrabold uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Level:
            </span>
            {CEFR_LEVELS.map((lvl) => (
              <motion.button
                key={lvl}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-4 py-2 rounded-xl font-extrabold transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedLevel === lvl
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30'
                    : 'bg-pink-50 text-slate-600 hover:bg-pink-100 border border-pink-100'
                }`}
              >
                <span>{LEVEL_EMOJIS[lvl]}</span>
                {lvl}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Quizzes */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"
            />
            <p className="text-sm font-bold text-pink-500">Loading quizzes... 🧩</p>
          </div>
        ) : quizzes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[28px] p-12 text-center border-2 border-pink-100 shadow-playful space-y-3"
          >
            <div className="text-5xl mb-2">🧩</div>
            <h3 className="text-lg font-display font-extrabold text-slate-800">No Quizzes Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto font-semibold">Try a different CEFR level!</p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {quizzes.map((quiz: any, quizIdx: number) => {
              const items = Array.isArray(quiz.items) ? quiz.items : [];

              return (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(quizIdx * 0.1, 0.3) }}
                  className="card-playful p-6 sm:p-8 space-y-6"
                >
                  {/* Quiz Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-pink-100">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-pink-100 text-pink-800 border border-pink-200 flex items-center gap-1">
                          {LEVEL_EMOJIS[quiz.level] || '📊'} {quiz.level}
                        </span>
                        <span className="text-xs font-bold text-slate-400">📁 {quiz.topic}</span>
                      </div>
                      <h2 className="text-2xl font-display font-extrabold text-slate-900">{quiz.title}</h2>
                    </div>

                    <span className="text-xs font-extrabold text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full border border-pink-200 flex items-center gap-1">
                      🎯 {items.length} Questions
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-6">
                    {items.map((item: any, idx: number) => {
                      const isScramble = item.type === 'sentence-scramble';
                      const selected = answers[item.id];
                      const hasAnswered = !!selected;
                      const isCorrect = selected === item.correctAnswer;

                      const builtTokens = scrambleBuilt[item.id] || [];
                      const builtSentence = builtTokens.join(' ');
                      const scrambleTokens = Array.isArray(item.scrambleTokens) && item.scrambleTokens.length > 0
                        ? item.scrambleTokens
                        : item.correctAnswer.split(' ');

                      return (
                        <div
                          key={item.id}
                          className="p-5 rounded-2xl bg-gradient-to-r from-pink-50/50 to-violet-50/50 border-2 border-pink-100 space-y-4"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-extrabold text-pink-500 uppercase flex items-center gap-1.5">
                              <span className="text-base">
                                {isScramble ? '🧩' : item.type === 'article-drill' ? '💖' : '✏️'}
                              </span>
                              Q{idx + 1} • {item.type.replace('-', ' ')}
                            </span>
                          </div>

                          {/* Prompt */}
                          <div className="text-base font-bold text-slate-900">
                            {isScramble ? (
                              <div className="space-y-2">
                                <p className="text-xs font-bold text-slate-500">
                                  🧩 Click words in correct German order:
                                </p>
                                <div className="min-h-12 p-3.5 rounded-xl bg-white border-2 border-pink-200 text-slate-800 font-extrabold flex items-center justify-between">
                                  <span>{builtSentence || <span className="text-slate-400 font-normal">Click tokens below...</span>}</span>
                                  {builtTokens.length > 0 && (
                                    <motion.button
                                      whileHover={{ scale: 1.1, rotate: -90 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleScrambleReset(item.id)}
                                      className="p-1.5 rounded-lg text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                                      title="Reset"
                                    >
                                      <RotateCcw className="w-4 h-4" />
                                    </motion.button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p>{item.promptGerman}</p>
                            )}
                          </div>

                          {/* Options / Word chips */}
                          {isScramble ? (
                            <div className="space-y-3">
                              <div className="flex flex-wrap gap-2">
                                {scrambleTokens.map((token: string, tIdx: number) => {
                                  const isUsed = builtTokens.includes(token);
                                  return (
                                    <motion.button
                                      key={tIdx}
                                      whileHover={!isUsed ? { scale: 1.1, y: -2 } : {}}
                                      whileTap={!isUsed ? { scale: 0.95 } : {}}
                                      disabled={isUsed}
                                      onClick={() => handleScrambleWordClick(item.id, token)}
                                      className={`px-4 py-2 rounded-xl text-xs font-extrabold border-2 transition-all ${
                                        isUsed
                                          ? 'bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed'
                                          : 'bg-white text-slate-800 border-pink-200 hover:border-pink-400 hover:text-pink-600 hover:shadow-sm shadow-pink-200'
                                      }`}
                                    >
                                      {token}
                                    </motion.button>
                                  );
                                })}
                              </div>

                              {builtTokens.length === scrambleTokens.length && (
                                <motion.button
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() =>
                                    setAnswers({ ...answers, [item.id]: builtSentence })
                                  }
                                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30 flex items-center gap-1.5"
                                >
                                  ✅ Check Answer
                                </motion.button>
                              )}
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {(item.options || []).map((opt: string) => {
                                const isThisSelected = selected === opt;
                                let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-pink-50 hover:border-pink-300';

                                if (hasAnswered) {
                                  if (opt === item.correctAnswer) {
                                    btnStyle = 'bg-gradient-to-r from-emerald-400 to-green-500 text-white border-emerald-500 shadow-md font-extrabold';
                                  } else if (isThisSelected) {
                                    btnStyle = 'bg-gradient-to-r from-rose-400 to-red-500 text-white border-rose-500';
                                  }
                                }

                                return (
                                  <motion.button
                                    key={opt}
                                    whileHover={!hasAnswered ? { scale: 1.05, y: -2 } : {}}
                                    whileTap={!hasAnswered ? { scale: 0.95 } : {}}
                                    onClick={() => setAnswers({ ...answers, [item.id]: opt })}
                                    className={`p-3.5 rounded-xl text-xs font-bold border-2 text-center transition-all ${btnStyle}`}
                                  >
                                    {opt}
                                  </motion.button>
                                );
                              })}
                            </div>
                          )}

                          {/* Feedback */}
                          <AnimatePresence>
                            {hasAnswered && (
                              <motion.div
                                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`p-4 rounded-xl text-xs leading-relaxed flex items-start gap-2.5 border-2 ${
                                  isCorrect
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                    : 'bg-rose-50 text-rose-900 border-rose-200'
                                }`}
                              >
                                {isCorrect ? (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: 'spring' }}>
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                  </motion.div>
                                ) : (
                                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <p className="font-extrabold">
                                    {isCorrect ? '🎉 Ausgezeichnet! (Correct!)' : `❌ Falsch! Answer: "${item.correctAnswer}"`}
                                  </p>
                                  {item.explanationBn && (
                                    <p className="mt-1.5 text-slate-700 font-semibold leading-relaxed">
                                      ব্যাখ্যা: {item.explanationBn}
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AuthRequiredGate>
  );
};

export default LearnerQuizzes;
