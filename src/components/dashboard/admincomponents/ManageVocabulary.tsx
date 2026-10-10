import { useState } from 'react';
import { toast } from 'sonner';
import { useAppSelector } from '@/redux/hook';
import { useCurrentUser } from '@/redux/features/authSlice';
import { TCurrentUser } from '@/types/commonTypes';
import CustomDropdown from '@/components/common/CustomDropdown';
import {
  useGetAllVocabularyQuery,
  useGetVocabularyTopicsQuery,
  useDeleteVocabularyMutation,
  useAiHarvestVocabularyMutation,
  useCreateVocabularyMutation,
} from '@/redux/api/vocabularyApi';
import {
  Sparkles,
  Volume2,
  Trash2,
  Plus,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  X,
  Loader2,
  Volume1,
  GraduationCap,
} from 'lucide-react';

const CEFR_LEVELS = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
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

const ManageVocabulary = () => {
  const currentUser = useAppSelector(useCurrentUser) as TCurrentUser | null;
  const userRole = (currentUser?.role || '').toUpperCase();
  const isStaff = userRole === 'STAFF';

  // Filters & Search
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: topicsData } = useGetVocabularyTopicsQuery(undefined);
  const availableTopics: string[] = (topicsData?.data && topicsData.data.length > 0)
    ? topicsData.data
    : FALLBACK_TOPICS;

  // Modals
  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Harvest Form State
  const [harvestLevel, setHarvestLevel] = useState('A1');
  const [harvestTopic, setHarvestTopic] = useState('Essen und Trinken');
  const [harvestCount, setHarvestCount] = useState(10);
  const [customPrompt, setCustomPrompt] = useState('');

  // Manual Word Form State
  const [manualForm, setManualForm] = useState({
    word: '',
    article: '',
    plural: '',
    level: 'A1',
    topic: 'Essen und Trinken',
    partOfSpeech: 'Noun',
    meaningEn: '',
    meaningBn: '',
    exampleGerman: '',
    exampleTranslationEn: '',
    exampleTranslationBn: '',
  });

  // Query Params
  const queryParams = new URLSearchParams();
  if (selectedLevel !== 'ALL') queryParams.append('level', selectedLevel);
  if (selectedTopic) queryParams.append('topic', selectedTopic);
  if (searchQuery.trim()) queryParams.append('searchTerm', searchQuery.trim());
  queryParams.append('limit', '100');

  const { data, isLoading, refetch } = useGetAllVocabularyQuery(queryParams.toString());
  const [deleteVocabulary] = useDeleteVocabularyMutation();
  const [aiHarvestVocabulary, { isLoading: isHarvesting }] = useAiHarvestVocabularyMutation();
  const [createVocabulary, { isLoading: isCreating }] = useCreateVocabularyMutation();

  const vocabularyList = data?.data || [];
  const totalCount = data?.meta?.total || vocabularyList.length;

  // Speech synthesis playback helper
  const playGermanSpeech = (text: string, rate: number = 1.0) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.info('Speech synthesis not supported in this browser.');
    }
  };

  const handleHarvestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isStaff) return;

    try {
      const res: any = await aiHarvestVocabulary({
        level: harvestLevel,
        topic: harvestTopic,
        count: Number(harvestCount),
        customPrompt: customPrompt.trim() || undefined,
      }).unwrap();

      const successMsg = res?.message || `Harvested ${harvestCount} words successfully!`;
      toast.success(successMsg, {
        duration: 4000,
        icon: '✨',
      });
      setIsHarvestModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to auto-harvest vocabulary.');
    }
  };

  const handleManualCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVocabulary(manualForm).unwrap();
      toast.success('Vocabulary word added successfully!');
      setIsManualModalOpen(false);
      setManualForm({
        word: '',
        article: '',
        plural: '',
        level: 'A1',
        topic: 'Essen und Trinken',
        partOfSpeech: 'Noun',
        meaningEn: '',
        meaningBn: '',
        exampleGerman: '',
        exampleTranslationEn: '',
        exampleTranslationBn: '',
      });
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create vocabulary word.');
    }
  };

  const handleDelete = async (id: string, word: string) => {
    if (!confirm(`Are you sure you want to delete "${word}"?`)) return;
    try {
      await deleteVocabulary(id).unwrap();
      toast.success(`Deleted "${word}"`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete word');
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800">Vocabulary Management</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                {totalCount} Words
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              CEFR-Curated German Lexicon with Articles, Plurals, Bengali & English Meanings
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* STAFF RESTRICTION: Hidden if role is STAFF */}
          {!isStaff && (
            <button
              id="ai-auto-harvest-vocab-btn"
              onClick={() => setIsHarvestModalOpen(true)}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
            >
              <Sparkles className="w-4 h-4 animate-spin text-amber-200" style={{ animationDuration: '3s' }} />
              <span>✨ AI Auto-Harvest Vocabulary</span>
            </button>
          )}

          {!isStaff && (
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Word</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by German word, English, Bengali, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          {/* Topic Selector */}
          <div className="w-full md:w-auto">
            <CustomDropdown
              value={selectedTopic}
              onChange={setSelectedTopic}
              options={availableTopics}
              placeholder={`All Topics (${availableTopics.length})`}
              label="Topic"
              headerTitle="Vocabulary Topics"
              theme="orange"
              icon={<BookOpen className="w-3.5 h-3.5" />}
              searchable={true}
              className="w-full md:w-auto"
              triggerClassName="w-full md:w-64 py-2 px-3 bg-white"
            />
          </div>
        </div>

        {/* CEFR Level Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> CEFR Level:
          </span>
          {CEFR_LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1 rounded-lg font-medium transition-all shrink-0 ${
                selectedLevel === lvl
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Active Filter Indicators */}
        {(selectedTopic || selectedLevel !== 'ALL' || searchQuery.trim()) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium">Active filters:</span>

            {selectedTopic && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 font-semibold border border-orange-200">
                <span>📂 {selectedTopic}</span>
                <button
                  onClick={() => setSelectedTopic('')}
                  className="hover:text-rose-600 transition-colors"
                  title="Remove topic filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedLevel !== 'ALL' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                <span>Level {selectedLevel}</span>
                <button
                  onClick={() => setSelectedLevel('ALL')}
                  className="hover:text-rose-600 transition-colors"
                  title="Reset level"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                <span>"{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-rose-600 transition-colors"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={() => {
                setSelectedTopic('');
                setSelectedLevel('ALL');
                setSearchQuery('');
              }}
              className="text-orange-600 hover:text-rose-600 font-semibold ml-auto transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Vocabulary Cards Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-sm text-slate-500">Loading German vocabulary...</p>
        </div>
      ) : vocabularyList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No German Words Found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {isStaff
              ? 'There are no vocabulary entries matching the selected level or topic.'
              : 'Click "AI Auto-Harvest Vocabulary" above to harvest authentic words with deduplication protection!'}
          </p>
          {!isStaff && (
            <button
              onClick={() => setIsHarvestModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600"
            >
              <Sparkles className="w-4 h-4" /> Harvest Now
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vocabularyList.map((item: any) => {
            const article = item.article ? item.article.toLowerCase() : '';
            const articleColor =
              article === 'der'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : article === 'die'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : article === 'das'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-50 text-slate-600 border-slate-200';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800">
                        {item.level}
                      </span>
                      {item.partOfSpeech && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                          {item.partOfSpeech}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md text-xs text-slate-500 bg-slate-50 truncate max-w-[140px]">
                        {item.topic}
                      </span>
                    </div>

                    {!isStaff && (
                      <button
                        onClick={() => handleDelete(item.id, item.word)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 transition-all"
                        title="Delete word"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Main German Word */}
                  <div className="flex items-baseline gap-2 mb-1">
                    {item.article && (
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${articleColor}`}>
                        {item.article}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                      {item.word.replace(/^(der|die|das)s+/i, '')}
                    </h3>
                  </div>

                  {item.plural && (
                    <p className="text-xs text-slate-400 font-medium mb-3">
                      Plural: <span className="text-slate-600 font-semibold">{item.plural}</span>
                    </p>
                  )}

                  {/* Meanings */}
                  <div className="bg-slate-50/80 rounded-xl p-3 space-y-1.5 mb-3 border border-slate-100">
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="font-semibold text-slate-400 w-7 shrink-0">EN:</span>
                      <span className="text-slate-700 font-medium">{item.meaningEn}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="font-semibold text-orange-500 w-7 shrink-0">BN:</span>
                      <span className="text-slate-800 font-medium">{item.meaningBn}</span>
                    </div>
                  </div>

                  {/* Example Sentence */}
                  {item.exampleGerman && (
                    <div className="text-xs text-slate-600 space-y-1 border-l-2 border-orange-400 pl-2.5 py-0.5 mb-3">
                      <p className="font-medium italic text-slate-800">"{item.exampleGerman}"</p>
                      {item.exampleTranslationBn && (
                        <p className="text-slate-500">→ {item.exampleTranslationBn}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Audio playback controls */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playGermanSpeech(item.word, 1.0)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-medium transition-colors"
                      title="Normal Speed (1.0x)"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Audio</span>
                    </button>

                    <button
                      onClick={() => playGermanSpeech(item.word, 0.7)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-medium transition-colors"
                      title="Slow Speed (0.7x)"
                    >
                      <Volume1 className="w-3.5 h-3.5" />
                      <span>Slow</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    #{item.normalizedWord}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI AUTO-HARVEST MODAL */}
      {!isStaff && isHarvestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => !isHarvesting && setIsHarvestModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">AI Auto-Harvest Vocabulary</h2>
                <p className="text-xs text-slate-500">
                  Context-Aware German Harvester with Two-Layer Deduplication
                </p>
              </div>
            </div>

            {/* Deduplication Guarantee Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-5 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-800 leading-relaxed">
                <span className="font-semibold">Zero-Duplicate Pipeline:</span> Existing words under this level & topic are blacklisted in prompt (Layer 1) and filtered against compound unique constraint <code className="bg-emerald-100/70 px-1 py-0.5 rounded text-[11px]">(normalizedWord, level)</code> (Layer 2).
              </div>
            </div>

            <form onSubmit={handleHarvestSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CEFR Level *
                  </label>
                  <CustomDropdown
                    value={harvestLevel}
                    onChange={setHarvestLevel}
                    options={['A1', 'A2', 'B1', 'B2', 'C1', 'C2']}
                    placeholder="Select Level"
                    label="Level"
                    theme="orange"
                    headerTitle="Choose CEFR Level"
                    allowClear={false}
                    className="w-full"
                    triggerClassName="w-full py-2 px-3 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Words to Harvest *
                  </label>
                  <CustomDropdown
                    value={String(harvestCount)}
                    onChange={(val) => setHarvestCount(Number(val))}
                    options={[
                      { value: '10', label: '10 Words' },
                      { value: '20', label: '20 Words' },
                      { value: '30', label: '30 Words' },
                      { value: '40', label: '40 Words' },
                      { value: '50', label: '50 Words' },
                    ]}
                    placeholder="Count"
                    label="Count"
                    theme="orange"
                    headerTitle="Quantity to Harvest"
                    allowClear={false}
                    className="w-full"
                    triggerClassName="w-full py-2 px-3 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Topic / Theme *
                </label>
                <input
                  type="text"
                  value={harvestTopic}
                  onChange={(e) => setHarvestTopic(e.target.value)}
                  placeholder="e.g. Essen und Trinken, Im Büro, Reisen"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  required
                />
                {/* Topic quick chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {availableTopics.slice(0, 5).map((top: string) => (
                    <button
                      type="button"
                      key={top}
                      onClick={() => setHarvestTopic(top)}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-600 transition-colors"
                    >
                      {top}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Custom AI Instruction (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Focus on common kitchen verbs and fruits, ensure simple A1 example sentences..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isHarvesting}
                  onClick={() => setIsHarvestModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isHarvesting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-orange-500/20 text-sm transition-all disabled:opacity-50"
                >
                  {isHarvesting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Harvesting & Deduplicating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Start Auto-Harvest</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANUAL ADD MODAL */}
      {!isStaff && isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Add German Word Manually</h2>
              <button onClick={() => setIsManualModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualCreate} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Article</label>
                  <CustomDropdown
                    value={manualForm.article}
                    onChange={(val) => setManualForm({ ...manualForm, article: val })}
                    options={[
                      { value: '', label: 'None' },
                      { value: 'der', label: 'der (Maskulin)', badge: 'm' },
                      { value: 'die', label: 'die (Feminin)', badge: 'f' },
                      { value: 'das', label: 'das (Neutral)', badge: 'n' },
                    ]}
                    placeholder="Article"
                    label="Art."
                    theme="orange"
                    headerTitle="Gender Article"
                    allowClear={true}
                    className="w-full"
                    triggerClassName="w-full py-2 px-2.5 bg-white text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">German Word *</label>
                  <input
                    type="text"
                    value={manualForm.word}
                    onChange={(e) => setManualForm({ ...manualForm, word: e.target.value })}
                    placeholder="e.g. Apfel"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Plural Form</label>
                  <input
                    type="text"
                    value={manualForm.plural}
                    onChange={(e) => setManualForm({ ...manualForm, plural: e.target.value })}
                    placeholder="e.g. die Äpfel"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Level *</label>
                  <CustomDropdown
                    value={manualForm.level}
                    onChange={(val) => setManualForm({ ...manualForm, level: val })}
                    options={['A1', 'A2', 'B1', 'B2', 'C1', 'C2']}
                    placeholder="Select Level"
                    label="Level"
                    theme="orange"
                    headerTitle="CEFR Level"
                    allowClear={false}
                    className="w-full"
                    triggerClassName="w-full py-2 px-2.5 bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Topic *</label>
                <input
                  type="text"
                  value={manualForm.topic}
                  onChange={(e) => setManualForm({ ...manualForm, topic: e.target.value })}
                  placeholder="e.g. Essen und Trinken"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">English Meaning *</label>
                  <input
                    type="text"
                    value={manualForm.meaningEn}
                    onChange={(e) => setManualForm({ ...manualForm, meaningEn: e.target.value })}
                    placeholder="apple"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bengali Meaning *</label>
                  <input
                    type="text"
                    value={manualForm.meaningBn}
                    onChange={(e) => setManualForm({ ...manualForm, meaningBn: e.target.value })}
                    placeholder="আপেল"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">German Example *</label>
                <input
                  type="text"
                  value={manualForm.exampleGerman}
                  onChange={(e) => setManualForm({ ...manualForm, exampleGerman: e.target.value })}
                  placeholder="Ich esse einen Apfel."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Example Translation (EN) *</label>
                  <input
                    type="text"
                    value={manualForm.exampleTranslationEn}
                    onChange={(e) => setManualForm({ ...manualForm, exampleTranslationEn: e.target.value })}
                    placeholder="I eat an apple."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Example Translation (BN) *</label>
                  <input
                    type="text"
                    value={manualForm.exampleTranslationBn}
                    onChange={(e) => setManualForm({ ...manualForm, exampleTranslationBn: e.target.value })}
                    placeholder="আমি একটি আপেল খাই।"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-50"
                >
                  {isCreating ? 'Saving...' : 'Add Word'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVocabulary;
