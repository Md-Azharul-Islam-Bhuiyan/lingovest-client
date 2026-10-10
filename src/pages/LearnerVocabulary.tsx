import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetAllVocabularyQuery, useGetVocabularyTopicsQuery } from '@/redux/api/vocabularyApi';
import { useCurrentUser } from '@/redux/features/authSlice';
import { useAppSelector } from '@/redux/hook';
import { AuthRequiredGate } from '@/components/common/AuthRequiredGate';
import CustomDropdown from '@/components/common/CustomDropdown';
import {
  BookOpen,
  Volume2,
  Volume1,
  Search,
  Filter,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

const CEFR_LEVELS = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LEVEL_EMOJIS: Record<string, string> = {
  ALL: '🌍', A1: '🌱', A2: '🌿', B1: '🌳', B2: '🎯', C1: '🔥', C2: '🏆',
};
const FALLBACK_TOPICS = [
  'Kapitel 1: Guten Tag!',
  'Kapitel 2: Freunde, Kollegen und ich',
  'Kapitel 3: In der Stadt',
  'Kapitel 4: Guten Appetit!',
  'Kapitel 5: Tag für Tag',
  'Kapitel 6: Zeit mit Freunden',
  'Kapitel 7: Kontakte',
  'Kapitel 8: Meine Wohnung',
  'Kapitel 9: Alles neu!',
  'Kapitel 10: Umzug',
  'Kapitel 11: Stadt und Leute',
  'Kapitel 12: Fit und gesund',
  'Essen und Trinken',
  'Familie und Freunde',
  'Wohnen und Möbel',
  'Reisen und Verkehr',
  'Arbeit und Beruf',
  'Gesundheit und Körper',
  'Einkaufen und Kleidung',
  'Freizeit und Hobbys',
];

const LearnerVocabulary = () => {
  const currentUser = useAppSelector(useCurrentUser);
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: topicsData } = useGetVocabularyTopicsQuery(undefined);
  const availableTopics: string[] = (topicsData?.data && topicsData.data.length > 0)
    ? topicsData.data
    : FALLBACK_TOPICS;

  const queryParams = new URLSearchParams();
  if (selectedLevel !== 'ALL') queryParams.append('level', selectedLevel);
  if (selectedTopic) queryParams.append('topic', selectedTopic);
  if (searchQuery.trim()) queryParams.append('searchTerm', searchQuery.trim());
  queryParams.append('limit', '100');

  const { data, isLoading } = useGetAllVocabularyQuery(queryParams.toString(), {
    skip: !currentUser,
  });
  const words = data?.data || [];
  const totalCount = data?.meta?.total || words.length;

  const playSpeech = (text: string, rate: number = 1.0) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.info('Speech synthesis not available in this browser.');
    }
  };

  return (
    <AuthRequiredGate
      featureTitle="German Vocabulary & Pronunciation Deck"
      featureSubtitle="Curated German vocabulary with gender articles (der, die, das), plural forms, dual-speed native audio pronunciation, and authentic Bengali & English translations."
    >
      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 min-h-screen">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 rounded-[28px] p-6 sm:p-10 text-white shadow-xl relative overflow-hidden"
        >
          <div className="relative z-10 space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-extrabold uppercase tracking-wider">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
              Wortschatz Deck (CEFR A1–C2)
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
              📚 Vocabulary & Pronunciation
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed font-semibold">
              Learn German words with articles (<span className="text-blue-200 font-extrabold">der</span>, <span className="text-pink-200 font-extrabold">die</span>, <span className="text-green-200 font-extrabold">das</span>), plurals, native audio 🔊, and Bengali translations!
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-6 right-10 text-3xl opacity-20">📖</motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }} className="absolute bottom-6 right-32 text-2xl opacity-15">✨</motion.div>
        </motion.div>

        {/* Controls & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-[24px] p-4 sm:p-6 border-2 border-violet-100 shadow-playful space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-violet-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="🔍 Search by German word, English, or Bengali (বাংলা)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm font-semibold rounded-xl border-2 border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-violet-50/30 placeholder:text-slate-400"
              />
            </div>

            <div className="w-full sm:w-auto">
              <CustomDropdown
                value={selectedTopic}
                onChange={setSelectedTopic}
                options={availableTopics}
                placeholder={`All Topics (${availableTopics.length})`}
                label="Topic"
                headerTitle="Netzwerk neu A1 Topics"
                theme="violet"
                icon={<BookOpen className="w-3.5 h-3.5" />}
                searchable={true}
                className="w-full sm:w-auto"
                triggerClassName="w-full sm:w-64 py-2.5 px-3 bg-white"
              />
            </div>
          </div>

          {/* CEFR Level Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-violet-400 font-extrabold uppercase tracking-wider shrink-0 flex items-center gap-1">
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
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md shadow-violet-500/30'
                    : 'bg-violet-50 text-slate-600 hover:bg-violet-100 border border-violet-100'
                }`}
              >
                <span>{LEVEL_EMOJIS[lvl]}</span>
                {lvl}
              </motion.button>
            ))}
            <span className="ml-auto text-violet-500 font-extrabold shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {totalCount} Words
            </span>
          </div>

          {/* Active Filter Indicators */}
          {(selectedTopic || selectedLevel !== 'ALL' || searchQuery.trim()) && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-violet-100 text-xs">
              <span className="text-slate-400 font-bold">Active Filters:</span>

              {selectedTopic && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-800 font-extrabold border border-violet-200">
                  <span>📂 {selectedTopic}</span>
                  <button
                    onClick={() => setSelectedTopic('')}
                    className="hover:text-rose-600 transition-colors p-0.5"
                    title="Remove topic filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {selectedLevel !== 'ALL' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-800 font-extrabold border border-pink-200">
                  <span>{LEVEL_EMOJIS[selectedLevel]} Level {selectedLevel}</span>
                  <button
                    onClick={() => setSelectedLevel('ALL')}
                    className="hover:text-rose-600 transition-colors p-0.5"
                    title="Reset level"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-extrabold border border-blue-200">
                  <span>🔍 "{searchQuery}"</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-rose-600 transition-colors p-0.5"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              <button
                onClick={() => {
                  setSelectedTopic('');
                  setSelectedLevel('ALL');
                  setSearchQuery('');
                }}
                className="text-violet-600 hover:text-rose-600 font-extrabold ml-auto transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </motion.div>

        {/* Vocabulary Card Grid */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full"
            />
            <p className="text-sm font-bold text-violet-500">Loading vocabulary deck... 📚</p>
          </div>
        ) : words.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[28px] p-12 text-center border-2 border-violet-100 shadow-playful space-y-3"
          >
            <div className="text-5xl mb-2">🔍</div>
            <h3 className="text-lg font-display font-extrabold text-slate-800">No Words Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto font-semibold">
              Try a different CEFR level or search keyword!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {words.map((item: any, idx: number) => {
              const article = item.article ? item.article.toLowerCase() : '';
              const articleStyle =
                article === 'der'
                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                  : article === 'die'
                  ? 'bg-pink-100 text-pink-700 border-pink-300'
                  : article === 'das'
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border-slate-200';

              const articleEmoji = article === 'der' ? '💙' : article === 'die' ? '💖' : article === 'das' ? '💚' : '📝';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.5) }}
                  className="card-playful p-5 flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {item.article && (
                          <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold uppercase border-2 ${articleStyle} flex items-center gap-1`}>
                            <span>{articleEmoji}</span>
                            {item.article}
                          </span>
                        )}
                        <span className="px-2 py-1 rounded-xl text-xs font-bold bg-violet-100 text-violet-600 border border-violet-200">
                          {LEVEL_EMOJIS[item.level] || '📊'} {item.level}
                        </span>
                      </div>

                      <span className="text-[11px] font-bold text-slate-400 truncate max-w-[130px]">
                        {item.topic}
                      </span>
                    </div>

                    {/* German Word */}
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-display font-extrabold text-slate-900 group-hover:text-violet-600 transition-colors">
                          {item.word}
                        </h3>
                        {item.plural && (
                          <p className="text-xs font-bold text-slate-500 mt-0.5">
                            Plural: <span className="text-slate-700">{item.plural}</span>
                          </p>
                        )}
                      </div>

                      {/* Audio buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => playSpeech(item.word, 1.0)}
                          title="Normal Speed 🔊"
                          className="p-2.5 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-600 transition-colors"
                        >
                          <Volume2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => playSpeech(item.word, 0.7)}
                          title="Slow Speed 🐢"
                          className="p-2.5 rounded-xl bg-slate-100 hover:bg-violet-100 text-slate-500 hover:text-violet-600 transition-colors"
                        >
                          <Volume1 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Meanings */}
                    <div className="mt-4 pt-3 border-t-2 border-violet-50 space-y-1.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[11px] font-extrabold text-blue-500 uppercase w-6">EN</span>
                        <p className="text-sm font-bold text-slate-800">{item.meaningEn}</p>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[11px] font-extrabold text-emerald-600 uppercase w-6">বাংলা</span>
                        <p className="text-sm font-semibold text-emerald-900">{item.meaningBn}</p>
                      </div>
                    </div>

                    {/* Example Sentence */}
                    {item.exampleGerman && (
                      <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-violet-50 to-pink-50 border-2 border-violet-100 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-violet-500 uppercase text-[10px]">✏️ Beispielsatz</span>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => playSpeech(item.exampleGerman, 0.9)}
                            className="text-violet-600 hover:text-violet-700 p-1"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                        <p className="text-slate-900 font-bold italic">"{item.exampleGerman}"</p>
                        {item.exampleTranslationBn && (
                          <p className="text-slate-600 text-[11px] font-semibold">→ {item.exampleTranslationBn}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>📝 {item.partOfSpeech || 'Word'}</span>
                    <span className="text-violet-500 font-extrabold">CEFR {item.level}</span>
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

export default LearnerVocabulary;
