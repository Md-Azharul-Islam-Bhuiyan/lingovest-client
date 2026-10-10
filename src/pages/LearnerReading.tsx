import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetAllReadingQuery } from '@/redux/api/readingApi';
import { useCurrentUser } from '@/redux/features/authSlice';
import { useAppSelector } from '@/redux/hook';
import { AuthRequiredGate } from '@/components/common/AuthRequiredGate';
import {
  FileText,
  BookOpen,
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Star,
  Sparkles,
} from 'lucide-react';

const CEFR_LEVELS = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'];
const LEVEL_EMOJIS: Record<string, string> = {
  ALL: '🌍', A1: '🌱', A2: '🌿', B1: '🌳', B2: '🎯', C1: '🔥',
};

const LearnerReading = () => {
  const currentUser = useAppSelector(useCurrentUser);
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const queryParams = new URLSearchParams();
  if (selectedLevel !== 'ALL') queryParams.append('level', selectedLevel);
  if (searchQuery.trim()) queryParams.append('searchTerm', searchQuery.trim());
  queryParams.append('limit', '50');

  const { data, isLoading } = useGetAllReadingQuery(queryParams.toString(), {
    skip: !currentUser,
  });
  const stories = data?.data || [];

  const handleSelectOption = (questionId: string, option: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const playSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <AuthRequiredGate
      featureTitle="German Reading Stories & Comprehension"
      featureSubtitle="Practice CEFR-graded German passages with bilingual English & Bengali summaries and authentic Goethe-Institut style comprehension checks."
    >
      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 min-h-screen">
        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 rounded-[28px] p-6 sm:p-10 text-white shadow-xl relative overflow-hidden"
        >
          <div className="relative z-10 space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-extrabold uppercase tracking-wider">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
              Leseverstehen (Goethe-Format)
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
              📖 Reading Stories & Questions
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed font-semibold">
              Read exciting German stories, then answer questions to test your understanding! 🎯
            </p>
          </div>
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-6 right-12 text-3xl opacity-20">📖</motion.div>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-[24px] p-4 sm:p-6 border-2 border-blue-100 shadow-playful flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="🔍 Search stories by title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm font-semibold rounded-xl border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-blue-50/30"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-xs w-full sm:w-auto">
            <span className="text-blue-400 font-extrabold uppercase tracking-wider shrink-0 flex items-center gap-1">
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
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/30'
                    : 'bg-blue-50 text-slate-600 hover:bg-blue-100 border border-blue-100'
                }`}
              >
                <span>{LEVEL_EMOJIS[lvl]}</span>
                {lvl}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stories */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            />
            <p className="text-sm font-bold text-blue-500">Loading stories... 📖</p>
          </div>
        ) : stories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[28px] p-12 text-center border-2 border-blue-100 shadow-playful space-y-3"
          >
            <div className="text-5xl mb-2">📖</div>
            <h3 className="text-lg font-display font-extrabold text-slate-800">No Stories Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto font-semibold">
              Try adjusting your level or search query!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {stories.map((story: any, storyIdx: number) => {
              const isExpanded = expandedId === story.id || stories.length === 1;
              const questions = Array.isArray(story.questions) ? story.questions : [];

              return (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(storyIdx * 0.1, 0.4) }}
                  className="card-playful overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-blue-100">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
                          {LEVEL_EMOJIS[story.level] || '📊'} {story.level}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          📁 {story.topic}
                        </span>
                      </div>
                      <h2 className="text-xl font-display font-extrabold text-slate-900">{story.title}</h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => playSpeech(story.contentGerman)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>🔊 Listen</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setExpandedId(isExpanded ? null : story.id)}
                        className="p-2 rounded-xl text-slate-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </motion.button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 space-y-6">
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200/50 text-slate-800 leading-relaxed text-base whitespace-pre-line font-medium">
                      {story.contentGerman}
                    </div>

                    {/* Summaries */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-100 space-y-1.5">
                        <span className="text-[11px] font-extrabold text-blue-500 uppercase">🇬🇧 English Summary</span>
                        <p className="text-xs text-slate-700 leading-relaxed font-semibold">{story.summaryEn}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-100 space-y-1.5">
                        <span className="text-[11px] font-extrabold text-emerald-600 uppercase">🇧🇩 বাংলা সারসংক্ষেপ</span>
                        <p className="text-xs text-emerald-900 leading-relaxed font-semibold">{story.summaryBn}</p>
                      </div>
                    </div>

                    {/* Questions */}
                    {questions.length > 0 && (
                      <div className="pt-4 border-t-2 border-blue-100 space-y-4">
                        <h4 className="text-sm font-display font-extrabold text-slate-900 flex items-center gap-2">
                          <span className="text-lg">❓</span>
                          Comprehension Check
                        </h4>

                        <div className="space-y-4">
                          {questions.map((q: any, qIdx: number) => {
                            const selectedOption = userAnswers[q.id || `q_${qIdx}`];
                            const hasAnswered = !!selectedOption;
                            const isCorrect = selectedOption === q.correctAnswer;

                            return (
                              <div key={q.id || qIdx} className="p-4 rounded-xl border-2 border-blue-100 bg-blue-50/30 space-y-3">
                                <p className="text-sm font-bold text-slate-800">
                                  {qIdx + 1}. {q.question}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  {(q.options || []).map((opt: string) => {
                                    const isThisSelected = selectedOption === opt;
                                    let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300';

                                    if (hasAnswered) {
                                      if (opt === q.correctAnswer) {
                                        btnStyle = 'bg-gradient-to-r from-emerald-400 to-green-500 text-white border-emerald-500 shadow-md';
                                      } else if (isThisSelected) {
                                        btnStyle = 'bg-gradient-to-r from-rose-400 to-red-500 text-white border-rose-500';
                                      }
                                    }

                                    return (
                                      <motion.button
                                        key={opt}
                                        whileHover={!hasAnswered ? { scale: 1.03 } : {}}
                                        whileTap={!hasAnswered ? { scale: 0.97 } : {}}
                                        onClick={() => handleSelectOption(q.id || `q_${qIdx}`, opt)}
                                        className={`p-3 rounded-xl text-xs font-bold border-2 text-left transition-all ${btnStyle}`}
                                      >
                                        {opt}
                                      </motion.button>
                                    );
                                  })}
                                </div>

                                <AnimatePresence>
                                  {hasAnswered && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className={`p-4 rounded-xl text-xs leading-relaxed flex items-start gap-2 border-2 ${
                                        isCorrect ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                                      }`}
                                    >
                                      {isCorrect ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                      ) : (
                                        <XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                      )}
                                      <div>
                                        <p className="font-extrabold">{isCorrect ? '🎉 Richtig! (Correct!)' : `❌ Falsch! Answer: "${q.correctAnswer}"`}</p>
                                        {q.explanationBn && (
                                          <p className="mt-1 text-slate-700 font-semibold">ব্যাখ্যা: {q.explanationBn}</p>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
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

export default LearnerReading;
