import { useState } from 'react';
import { toast } from 'sonner';
import { useAppSelector } from '@/redux/hook';
import { useCurrentUser } from '@/redux/features/authSlice';
import { TCurrentUser } from '@/types/commonTypes';
import CustomDropdown from '@/components/common/CustomDropdown';
import {
  useGetAllQuizzesQuery,
  useDeleteQuizMutation,
  useDeleteQuizItemMutation,
  useAiGenerateQuizMutation,
} from '@/redux/api/quizApi';
import {
  Sparkles,
  HelpCircle,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  Shuffle,
  CheckSquare,
  PenTool,
  Layers,
} from 'lucide-react';

const CEFR_LEVELS = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'];
const POPULAR_TOPICS = [
  'Artikel Übungen (der, die, das)',
  'Akkusativ und Dativ',
  'Satzbau und Wortstellung',
  'Modalverben im Alltag',
  'Präpositionen mit Dativ',
  'Perfekt und Partizip II',
];

const ManageQuizzes = () => {
  const currentUser = useAppSelector(useCurrentUser) as TCurrentUser | null;
  const userRole = (currentUser?.role || '').toUpperCase();
  const isStaff = userRole === 'STAFF';

  // Filters & Search
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Expanders
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);

  // Form State
  const [genLevel, setGenLevel] = useState('A1');
  const [genTopic, setGenTopic] = useState('Artikel Übungen (der, die, das)');
  const [genType, setGenType] = useState('mixed');
  const [genCount, setGenCount] = useState(5);
  const [customPrompt, setCustomPrompt] = useState('');

  const queryParams = new URLSearchParams();
  if (selectedLevel !== 'ALL') queryParams.append('level', selectedLevel);
  if (selectedTopic) queryParams.append('topic', selectedTopic);
  if (searchQuery.trim()) queryParams.append('searchTerm', searchQuery.trim());
  queryParams.append('limit', '50');

  const { data, isLoading, refetch } = useGetAllQuizzesQuery(queryParams.toString());
  const [deleteQuiz] = useDeleteQuizMutation();
  const [deleteQuizItem] = useDeleteQuizItemMutation();
  const [aiGenerateQuiz, { isLoading: isGenerating }] = useAiGenerateQuizMutation();

  const quizzesList = data?.data || [];
  const totalCount = data?.meta?.total || quizzesList.length;

  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isStaff) return;

    try {
      const res: any = await aiGenerateQuiz({
        level: genLevel,
        topic: genTopic,
        type: genType,
        count: Number(genCount),
        customPrompt: customPrompt.trim() || undefined,
      }).unwrap();

      toast.success(res?.message || 'Generated practice quiz successfully!', {
        duration: 4000,
        icon: '✨',
      });
      setIsGenerateModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to generate practice quiz.');
    }
  };

  const handleDeleteQuiz = async (id: string, title: string) => {
    if (!confirm(`Delete quiz "${title}" and all its questions?`)) return;
    try {
      await deleteQuiz(id).unwrap();
      toast.success(`Deleted "${title}"`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete quiz');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Delete this question?')) return;
    try {
      await deleteQuizItem(itemId).unwrap();
      toast.success('Question deleted');
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete question');
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800">Quizzes & Tests Management</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                {totalCount} Practice Quizzes
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Sentence Scrambles, Article Drills & Fill-in-the-Blanks with Bengali Explanations
            </p>
          </div>
        </div>

        {/* Action Button: Hidden for STAFF */}
        {!isStaff && (
          <button
            id="ai-generate-quiz-btn"
            onClick={() => setIsGenerateModalOpen(true)}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
          >
            <Sparkles className="w-4 h-4 animate-spin text-purple-200" style={{ animationDuration: '3s' }} />
            <span>✨ AI Generate Practice Quiz</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search quizzes by title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          {/* Topic Filter */}
          <div className="w-full md:w-auto">
            <CustomDropdown
              value={selectedTopic}
              onChange={setSelectedTopic}
              options={POPULAR_TOPICS}
              placeholder="All Topics"
              label="Topic"
              headerTitle="Quiz Topics"
              theme="purple"
              icon={<HelpCircle className="w-3.5 h-3.5" />}
              searchable={true}
              className="w-full md:w-auto"
              triggerClassName="w-full md:w-64 py-2 px-3 bg-white"
            />
          </div>
        </div>

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
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Listing */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-sm text-slate-500">Loading German practice quizzes...</p>
        </div>
      ) : quizzesList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No Quizzes Found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {isStaff
              ? 'No practice quizzes match your current filters.'
              : 'Click "AI Generate Practice Quiz" above to craft interactive German drills with Bengali explanations!'}
          </p>
          {!isStaff && (
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700"
            >
              <Sparkles className="w-4 h-4" /> Generate Practice Quiz
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {quizzesList.map((quiz: any) => {
            const isExpanded = expandedQuizId === quiz.id;
            const items = Array.isArray(quiz.items) ? quiz.items : [];

            return (
              <div
                key={quiz.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Header Row */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-100 text-purple-800">
                        {quiz.level}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                        {quiz.topic}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200">
                        {quiz.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{quiz.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => setExpandedQuizId(isExpanded ? null : quiz.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <span>Collapse</span>
                          <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>Inspect Questions ({items.length})</span>
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {!isStaff && (
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete quiz"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Questions */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-5 bg-slate-50/50 space-y-4">
                    {items.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No questions in this quiz yet.</p>
                    ) : (
                      items.map((item: any, qIdx: number) => {
                        const isScramble = item.type === 'sentence-scramble';
                        const isArticle = item.type === 'article-drill';

                        return (
                          <div
                            key={item.id || qIdx}
                            className="bg-white rounded-xl p-4 border border-slate-200 space-y-3 relative group/item"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                                  {qIdx + 1}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 flex items-center gap-1">
                                  {isScramble ? (
                                    <>
                                      <Shuffle className="w-3 h-3 text-purple-600" /> Sentence Scramble
                                    </>
                                  ) : isArticle ? (
                                    <>
                                      <CheckSquare className="w-3 h-3 text-blue-600" /> Article Drill
                                    </>
                                  ) : (
                                    <>
                                      <PenTool className="w-3 h-3 text-emerald-600" /> Fill-in-the-Blank
                                    </>
                                  )}
                                </span>
                              </div>

                              {!isStaff && (
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="text-slate-300 hover:text-rose-600 p-1 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                  title="Delete question"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {/* Prompt in German */}
                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                              <p className="text-sm font-bold text-slate-800">
                                {item.promptGerman}
                              </p>
                            </div>

                            {/* If sentence scramble, show tokens */}
                            {isScramble && item.scrambleTokens && item.scrambleTokens.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-[11px] font-medium text-slate-400">
                                  Scrambled Tokens for Learner:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {item.scrambleTokens.map((token: string, tIdx: number) => (
                                    <span
                                      key={tIdx}
                                      className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 text-xs font-semibold"
                                    >
                                      {token}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Options if article drill or MCQ */}
                            {item.options && item.options.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {item.options.map((opt: string, optIdx: number) => {
                                  const isCorrect = opt.trim().toLowerCase() === item.correctAnswer.trim().toLowerCase();
                                  return (
                                    <span
                                      key={optIdx}
                                      className={`px-3 py-1 rounded-lg border text-xs font-medium ${
                                        isCorrect
                                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                                          : 'bg-slate-50 text-slate-600 border-slate-200'
                                      }`}
                                    >
                                      {opt} {isCorrect && '✓ (Correct)'}
                                    </span>
                                  );
                                })}
                              </div>
                            )}

                            {/* Correct answer display if not in options */}
                            {(!item.options || item.options.length === 0) && (
                              <p className="text-xs font-semibold text-emerald-700">
                                Correct Answer: <span className="font-normal text-slate-800">{item.correctAnswer}</span>
                              </p>
                            )}

                            {/* Bengali Explanation */}
                            {item.explanationBn && (
                              <div className="bg-amber-50/80 border border-amber-200/60 p-2.5 rounded-lg text-xs text-slate-700 leading-relaxed">
                                <span className="font-bold text-amber-800">বাংলা ব্যাকরণ ব্যাখ্যা:</span> {item.explanationBn}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* AI GENERATION MODAL */}
      {!isStaff && isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => !isGenerating && setIsGenerateModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">AI Generate Practice Quiz</h2>
                <p className="text-xs text-slate-500">
                  Sentence Scrambles, Article Drills & Fill-in-the-Blanks
                </p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-800 leading-relaxed">
                <span className="font-semibold">Zero-Duplicate Pipeline:</span> Database pre-query excludes already generated prompts for this quiz and level, with unique constraint <code className="bg-emerald-100/70 px-1 py-0.5 rounded text-[11px]">(promptGerman, quizId)</code>.
              </div>
            </div>

            <form onSubmit={handleGenerateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CEFR Level *
                  </label>
                  <CustomDropdown
                    value={genLevel}
                    onChange={setGenLevel}
                    options={['A1', 'A2', 'B1', 'B2', 'C1']}
                    placeholder="Select Level"
                    label="Level"
                    theme="purple"
                    headerTitle="Choose CEFR Level"
                    allowClear={false}
                    className="w-full"
                    triggerClassName="w-full py-2 px-3 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Exercise Type *
                  </label>
                  <CustomDropdown
                    value={genType}
                    onChange={setGenType}
                    options={[
                      { value: 'mixed', label: 'Mixed Exercises', icon: '🔀' },
                      { value: 'article-drill', label: 'Article Drills (der/die/das)', icon: '🏷️' },
                      { value: 'sentence-scramble', label: 'Sentence Scrambles', icon: '🧩' },
                      { value: 'fill-in-blank', label: 'Fill-in-the-Blanks', icon: '✍️' },
                    ]}
                    placeholder="Exercise Type"
                    label="Type"
                    theme="purple"
                    headerTitle="Grammar Exercise Type"
                    allowClear={false}
                    className="w-full"
                    triggerClassName="w-full py-2 px-3 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Topic / Grammar Target *
                  </label>
                  <input
                    type="text"
                    value={genTopic}
                    onChange={(e) => setGenTopic(e.target.value)}
                    placeholder="e.g. Artikel Übungen (der, die, das)"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Count *
                  </label>
                  <CustomDropdown
                    value={String(genCount)}
                    onChange={(val) => setGenCount(Number(val))}
                    options={[
                      { value: '5', label: '5 Questions' },
                      { value: '10', label: '10 Questions' },
                      { value: '15', label: '15 Questions' },
                    ]}
                    placeholder="Count"
                    label="Count"
                    theme="purple"
                    headerTitle="Questions Count"
                    allowClear={false}
                    className="w-full"
                    triggerClassName="w-full py-2 px-3 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Custom Focus (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Focus on accusative pronouns and food vocabulary, provide detailed explanations in Bengali..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 text-sm transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Practice Drills...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Practice Quiz</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuizzes;
