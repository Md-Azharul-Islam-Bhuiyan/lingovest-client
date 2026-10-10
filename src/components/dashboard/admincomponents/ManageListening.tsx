import { useState } from 'react';
import { toast } from 'sonner';
import { useAppSelector } from '@/redux/hook';
import { useCurrentUser } from '@/redux/features/authSlice';
import { TCurrentUser } from '@/types/commonTypes';
import CustomDropdown from '@/components/common/CustomDropdown';
import {
  useGetAllListeningQuery,
  useDeleteListeningMutation,
  useAiGenerateListeningMutation,
} from '@/redux/api/listeningApi';
import {
  Sparkles,
  Headphones,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  X,
  Loader2,
  Volume2,
  ChevronDown,
  ChevronUp,
  FileEdit,
  HelpCircle,
  Play,
  Square,
} from 'lucide-react';

const CEFR_LEVELS = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'];
const POPULAR_TOPICS = [
  'Am Bahnhof nach Berlin',
  'Im Hotel einchecken',
  'Ein Telefongespräch mit dem Arzt',
  'Im Supermarkt einkaufen',
  'Wegbeschreibung in Frankfurt',
  'Flughafen und Gepäck',
  'Im Restaurant bestellen',
];

const ManageListening = () => {
  const currentUser = useAppSelector(useCurrentUser) as TCurrentUser | null;
  const userRole = (currentUser?.role || '').toUpperCase();
  const isStaff = userRole === 'STAFF';

  // Filters & Search
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Expanders
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [expandedDialogueId, setExpandedDialogueId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Form State
  const [genLevel, setGenLevel] = useState('A1');
  const [genTopic, setGenTopic] = useState('Am Bahnhof nach Berlin');
  const [genCount, setGenCount] = useState(1);
  const [customPrompt, setCustomPrompt] = useState('');

  const queryParams = new URLSearchParams();
  if (selectedLevel !== 'ALL') queryParams.append('level', selectedLevel);
  if (selectedTopic) queryParams.append('topic', selectedTopic);
  if (searchQuery.trim()) queryParams.append('searchTerm', searchQuery.trim());
  queryParams.append('limit', '50');

  const { data, isLoading, refetch } = useGetAllListeningQuery(queryParams.toString());
  const [deleteListening] = useDeleteListeningMutation();
  const [aiGenerateListening, { isLoading: isGenerating }] = useAiGenerateListeningMutation();

  const dialoguesList = data?.data || [];
  const totalCount = data?.meta?.total || dialoguesList.length;

  const playFullDialogue = (script: string) => {
    if (!('speechSynthesis' in window)) {
      toast.info('Speech synthesis not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanLines = script
      .split('\n')
      .map((line) => line.replace(/^[^:]+:\s*/, '').trim())
      .filter(Boolean);

    if (cleanLines.length === 0) return;

    setIsPlayingAudio(true);
    let currentIdx = 0;

    const speakNext = () => {
      if (currentIdx >= cleanLines.length) {
        setIsPlayingAudio(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanLines[currentIdx]);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      utterance.onend = () => {
        currentIdx++;
        speakNext();
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };
      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isStaff) return;

    try {
      const res: any = await aiGenerateListening({
        level: genLevel,
        topic: genTopic,
        count: Number(genCount),
        customPrompt: customPrompt.trim() || undefined,
      }).unwrap();

      toast.success(res?.message || 'Generated audio dialogue lesson successfully!', {
        duration: 4000,
        icon: '✨',
      });
      setIsGenerateModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to generate listening lesson.');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete listening dialogue "${title}"?`)) return;
    try {
      await deleteListening(id).unwrap();
      toast.success(`Deleted "${title}"`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete listening lesson');
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <Headphones className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800">Listening Management</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                {totalCount} Dialogues
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              German Audio Dialogue Scripts, Dictation Exercises & Comprehension MCQs
            </p>
          </div>
        </div>

        {/* Action Button: Hidden for STAFF */}
        {!isStaff && (
          <button
            id="ai-generate-listening-btn"
            onClick={() => setIsGenerateModalOpen(true)}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-600 hover:from-cyan-600 hover:to-teal-600 shadow-md shadow-teal-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
          >
            <Sparkles className="w-4 h-4 animate-spin text-teal-100" style={{ animationDuration: '3s' }} />
            <span>✨ AI Generate Audio Dialogue & Dictation</span>
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
              placeholder="Search dialogues by title, script lines, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
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
              headerTitle="Listening Topics"
              theme="teal"
              icon={<Headphones className="w-3.5 h-3.5" />}
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
                  ? 'bg-teal-600 text-white shadow-sm'
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
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <p className="text-sm text-slate-500">Loading audio dialogues...</p>
        </div>
      ) : dialoguesList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Headphones className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No Audio Dialogues Found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {isStaff
              ? 'No audio dialogues match your criteria.'
              : 'Click "AI Generate Audio Dialogue & Dictation" above to harvest German listening lesson packages!'}
          </p>
          {!isStaff && (
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700"
            >
              <Sparkles className="w-4 h-4" /> Generate Dialogue
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {dialoguesList.map((dialogue: any) => {
            const isExpanded = expandedDialogueId === dialogue.id;
            const dictations = Array.isArray(dialogue.dictationExercises) ? dialogue.dictationExercises : [];
            const mcqs = Array.isArray(dialogue.listeningQuestions) ? dialogue.listeningQuestions : [];

            return (
              <div
                key={dialogue.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Header Row */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-teal-100 text-teal-800">
                        {dialogue.level}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                        {dialogue.topic}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        slug: /{dialogue.slug}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{dialogue.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => playFullDialogue(dialogue.dialogueScript)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        isPlayingAudio
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
                      }`}
                    >
                      {isPlayingAudio ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>Stop Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Listen Script (TTS)</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setExpandedDialogueId(isExpanded ? null : dialogue.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <span>Collapse</span>
                          <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>Script & Dictation ({dictations.length + mcqs.length})</span>
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {!isStaff && (
                      <button
                        onClick={() => handleDelete(dialogue.id, dialogue.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete dialogue"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-5 bg-slate-50/50 space-y-6">
                    {/* Conversational Script */}
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-inner">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-3 flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4" /> German Dialogue Script ({dialogue.level})
                      </h4>

                      <div className="space-y-2.5">
                        {dialogue.dialogueScript.split('\n').map((line: string, lIdx: number) => {
                          const colonIdx = line.indexOf(':');
                          const speaker = colonIdx > -1 ? line.slice(0, colonIdx) : '';
                          const text = colonIdx > -1 ? line.slice(colonIdx + 1) : line;

                          return (
                            <div key={lIdx} className="flex items-start gap-2 text-xs">
                              {speaker && (
                                <span className="font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md shrink-0">
                                  {speaker}:
                                </span>
                              )}
                              <span className="text-slate-800 leading-relaxed font-medium pt-0.5">
                                {text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dictation Exercises */}
                    {dictations.length > 0 && (
                      <div className="bg-white rounded-xl p-5 border border-slate-200">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-3 flex items-center gap-1.5">
                          <FileEdit className="w-4 h-4" /> Dictation Exercises (Lückentext)
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {dictations.map((d: any, dIdx: number) => (
                            <div key={d.id || dIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                              <p className="font-medium text-slate-800">
                                {dIdx + 1}. {d.blankSentence}
                              </p>
                              <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                  Missing: {d.missingWord}
                                </span>
                                {d.hint && (
                                  <span className="text-slate-500">Hint: {d.hint}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Listening MCQs */}
                    {mcqs.length > 0 && (
                      <div className="bg-white rounded-xl p-5 border border-slate-200">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-3 flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4" /> Listening Comprehension MCQs
                        </h4>

                        <div className="space-y-3">
                          {mcqs.map((q: any, qIdx: number) => (
                            <div key={q.id || qIdx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                              <p className="font-semibold text-slate-800 mb-2">
                                {qIdx + 1}. {q.question}
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                                {(q.options || []).map((opt: string, optIdx: number) => {
                                  const isCorrect = opt === q.correctAnswer;
                                  return (
                                    <div
                                      key={optIdx}
                                      className={`p-2 rounded-lg border text-xs font-medium ${
                                        isCorrect
                                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                                          : 'bg-white text-slate-600 border-slate-200'
                                      }`}
                                    >
                                      <span className="opacity-70 mr-1">
                                        {String.fromCharCode(65 + optIdx)})
                                      </span>
                                      {opt} {isCorrect && '✓'}
                                    </div>
                                  );
                                })}
                              </div>

                              {q.explanationBn && (
                                <p className="text-slate-600 bg-amber-50/80 border border-amber-200/60 p-2 rounded-lg">
                                  <span className="font-semibold text-amber-800">ব্যাখ্যা:</span> {q.explanationBn}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">AI Generate Audio Dialogue</h2>
                <p className="text-xs text-slate-500">
                  Dialogue Scripts, Dictations & MCQs with (slug, level) Deduplication
                </p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-800 leading-relaxed">
                <span className="font-semibold">Zero-Duplicate Pipeline:</span> Existing listening items are blacklisted in prompt (Layer 1) and protected by unique compound constraint <code className="bg-emerald-100/70 px-1 py-0.5 rounded text-[11px]">(slug, level)</code> (Layer 2).
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
                    theme="teal"
                    headerTitle="Choose CEFR Level"
                    allowClear={false}
                    className="w-full"
                    triggerClassName="w-full py-2 px-3 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lesson Count *
                  </label>
                  <CustomDropdown
                    value={String(genCount)}
                    onChange={(val) => setGenCount(Number(val))}
                    options={[
                      { value: '1', label: '1 Dialogue Lesson' },
                      { value: '2', label: '2 Dialogue Lessons' },
                    ]}
                    placeholder="Count"
                    label="Count"
                    theme="teal"
                    headerTitle="Lessons to Generate"
                    allowClear={false}
                    className="w-full"
                    triggerClassName="w-full py-2 px-3 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Topic / Scenario *
                </label>
                <input
                  type="text"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  placeholder="e.g. Am Bahnhof nach Berlin"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {POPULAR_TOPICS.slice(0, 4).map((top) => (
                    <button
                      type="button"
                      key={top}
                      onClick={() => setGenTopic(top)}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-teal-50 hover:text-teal-600 text-slate-600 transition-colors"
                    >
                      {top}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Custom Guidance (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Ensure clear back-and-forth between customer and hotel receptionist, focus on dates and prices..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 shadow-md shadow-teal-500/20 text-sm transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Dialogue & Dictations...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Now</span>
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

export default ManageListening;
