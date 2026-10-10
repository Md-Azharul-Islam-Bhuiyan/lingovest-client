import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetAllListeningQuery } from '@/redux/api/listeningApi';
import { useCurrentUser } from '@/redux/features/authSlice';
import { useAppSelector } from '@/redux/hook';
import { AuthRequiredGate } from '@/components/common/AuthRequiredGate';
import {
  Headphones,
  Volume2,
  Play,
  Square,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';

const CEFR_LEVELS = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'];
const LEVEL_EMOJIS: Record<string, string> = {
  ALL: '🌍', A1: '🌱', A2: '🌿', B1: '🌳', B2: '🎯', C1: '🔥',
};

const LearnerListening = () => {
  const currentUser = useAppSelector(useCurrentUser);
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dictationAnswers, setDictationAnswers] = useState<Record<string, string>>({});
  const [isPlayingId, setIsPlayingId] = useState<string | null>(null);

  const queryParams = new URLSearchParams();
  if (selectedLevel !== 'ALL') queryParams.append('level', selectedLevel);
  if (searchQuery.trim()) queryParams.append('searchTerm', searchQuery.trim());
  queryParams.append('limit', '50');

  const { data, isLoading } = useGetAllListeningQuery(queryParams.toString(), {
    skip: !currentUser,
  });
  const dialogues = data?.data || [];

  const playFullDialogue = (id: string, script: string) => {
    if (!('speechSynthesis' in window)) {
      toast.info('Speech synthesis is not supported on this device.');
      return;
    }

    if (isPlayingId === id) {
      window.speechSynthesis.cancel();
      setIsPlayingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlayingId(id);

    const lines = script
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    let idx = 0;
    const speakNext = () => {
      if (idx >= lines.length) {
        setIsPlayingId(null);
        return;
      }

      const raw = lines[idx];
      const colonIdx = raw.indexOf(':');
      const text = colonIdx !== -1 ? raw.substring(colonIdx + 1).trim() : raw;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      utterance.onend = () => {
        idx++;
        speakNext();
      };
      utterance.onerror = () => {
        setIsPlayingId(null);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  const playSingleLine = (text: string) => {
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
      featureTitle="German Audio Dialogues & Dictation Lab"
      featureSubtitle="Listen to authentic German conversational exchanges, practice interactive dictation blanks, and complete Goethe listening MCQs."
    >
      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 min-h-screen">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 rounded-[28px] p-6 sm:p-10 text-white shadow-xl relative overflow-hidden"
        >
          <div className="relative z-10 space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-extrabold uppercase tracking-wider">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
              Hörverstehen & Diktat
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
              🎧 Audio Dialogues & Dictation
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed font-semibold">
              Listen to German conversations, practice dictation, and test your listening skills! 🔊
            </p>
          </div>
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-6 right-12 text-3xl opacity-20">🎧</motion.div>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-[24px] p-4 sm:p-6 border-2 border-teal-100 shadow-playful flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="🔍 Search audio dialogues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm font-semibold rounded-xl border-2 border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-teal-50/30"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-xs w-full sm:w-auto">
            <span className="text-teal-400 font-extrabold uppercase tracking-wider shrink-0 flex items-center gap-1">
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
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/30'
                    : 'bg-teal-50 text-slate-600 hover:bg-teal-100 border border-teal-100'
                }`}
              >
                <span>{LEVEL_EMOJIS[lvl]}</span>
                {lvl}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Dialogues */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full"
            />
            <p className="text-sm font-bold text-teal-500">Loading audio dialogues... 🎧</p>
          </div>
        ) : dialogues.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[28px] p-12 text-center border-2 border-teal-100 shadow-playful space-y-3"
          >
            <div className="text-5xl mb-2">🎧</div>
            <h3 className="text-lg font-display font-extrabold text-slate-800">No Dialogues Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto font-semibold">Try adjusting your level!</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {dialogues.map((item: any, itemIdx: number) => {
              const isPlaying = isPlayingId === item.id;
              const dictations = Array.isArray(item.dictationExercises) ? item.dictationExercises : [];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(itemIdx * 0.1, 0.4) }}
                  className="card-playful overflow-hidden p-4 sm:p-6 space-y-5 sm:space-y-6"
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-teal-100">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-teal-100 text-teal-800 border border-teal-200 flex items-center gap-1">
                          {LEVEL_EMOJIS[item.level] || '📊'} {item.level}
                        </span>
                        <span className="text-xs font-bold text-slate-400">📁 {item.topic}</span>
                      </div>
                      <h3 className="text-xl font-display font-extrabold text-slate-900">{item.title}</h3>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => playFullDialogue(item.id, item.dialogueScript)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md transition-all ${
                        isPlaying
                          ? 'bg-gradient-to-r from-rose-400 to-red-500 text-white shadow-rose-500/30'
                          : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-teal-500/30'
                      }`}
                    >
                      {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                      <span>{isPlaying ? '⏹ Stop' : '▶️ Play Dialogue'}</span>
                    </motion.button>
                  </div>

                  {/* Script */}
                  <div className="space-y-3">
                    <span className="text-xs font-extrabold text-teal-500 uppercase tracking-wider">
                      💬 Dialogue Script (click a line to hear it):
                    </span>
                    <div className="space-y-2 p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-100">
                      {item.dialogueScript.split('\n').map((line: string, lIdx: number) => {
                        if (!line.trim()) return null;
                        const colon = line.indexOf(':');
                        const speaker = colon !== -1 ? line.substring(0, colon) : 'Sprecher';
                        const text = colon !== -1 ? line.substring(colon + 1) : line;

                        return (
                          <motion.div
                            key={lIdx}
                            whileHover={{ scale: 1.01, x: 4 }}
                            onClick={() => playSingleLine(text)}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white hover:shadow-sm cursor-pointer transition-all group"
                          >
                            <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold bg-teal-200 text-teal-800 shrink-0">
                              {speaker}
                            </span>
                            <p className="text-sm text-slate-800 font-semibold group-hover:text-teal-800">
                              {text}
                            </p>
                            <Volume2 className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 ml-auto shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dictation */}
                  {dictations.length > 0 && (
                    <div className="pt-4 border-t-2 border-teal-100 space-y-4">
                      <h4 className="text-sm font-display font-extrabold text-slate-900 flex items-center gap-2">
                        <span className="text-lg">✏️</span>
                        Dictation Exercise
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dictations.map((d: any, dIdx: number) => {
                          const answer = dictationAnswers[d.id || `d_${dIdx}`] || '';
                          const isCorrect = answer.trim().toLowerCase() === (d.missingWord || '').trim().toLowerCase();
                          const hasAttempted = answer.trim().length > 0;

                          return (
                            <div key={d.id || dIdx} className="p-4 rounded-xl border-2 border-teal-100 bg-teal-50/30 space-y-2">
                              <p className="text-xs font-bold text-slate-800">
                                {d.blankSentence}
                              </p>
                              {d.hint && (
                                <p className="text-[11px] text-slate-500 italic font-semibold">💡 Hint: {d.hint}</p>
                              )}

                              <div className="flex items-center gap-2 pt-1">
                                <input
                                  type="text"
                                  placeholder="Type missing word..."
                                  value={answer}
                                  onChange={(e) =>
                                    setDictationAnswers({
                                      ...dictationAnswers,
                                      [d.id || `d_${dIdx}`]: e.target.value,
                                    })
                                  }
                                  className={`px-3 py-2 text-xs font-semibold rounded-xl border-2 w-full focus:outline-none transition-all ${
                                    hasAttempted
                                      ? isCorrect
                                        ? 'border-emerald-400 bg-emerald-50 text-emerald-900 font-extrabold'
                                        : 'border-rose-400 bg-rose-50'
                                      : 'border-slate-200 focus:border-teal-400'
                                  }`}
                                />
                                {hasAttempted && (
                                  isCorrect ? (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                    </motion.div>
                                  ) : (
                                    <span className="text-[10px] text-rose-600 shrink-0 font-extrabold whitespace-nowrap">
                                      → {d.missingWord}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AuthRequiredGate>
  );
};

export default LearnerListening;
