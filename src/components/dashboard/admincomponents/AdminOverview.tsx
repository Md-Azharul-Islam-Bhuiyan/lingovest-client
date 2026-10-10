import { Link } from 'react-router-dom';
import { useGetAllVocabularyQuery } from '@/redux/api/vocabularyApi';
import { useGetAllReadingQuery } from '@/redux/api/readingApi';
import { useGetAllListeningQuery } from '@/redux/api/listeningApi';
import { useGetAllQuizzesQuery } from '@/redux/api/quizApi';
import { useAppSelector } from '@/redux/hook';
import { useCurrentUser } from '@/redux/features/authSlice';
import { TCurrentUser } from '@/types/commonTypes';
import {
  BookOpen,
  FileText,
  Headphones,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Layers,
  Database,
  CheckCircle2,
  TrendingUp,
  Volume2,
} from 'lucide-react';

const CEFR_LEVELS = [
  { level: 'A1', name: 'Absolute Beginner', color: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { level: 'A2', name: 'Elementary', color: 'from-sky-500 to-blue-600', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  { level: 'B1', name: 'Intermediate', color: 'from-indigo-500 to-violet-600', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { level: 'B2', name: 'Upper Intermediate', color: 'from-purple-500 to-fuchsia-600', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  { level: 'C1', name: 'Advanced', color: 'from-amber-500 to-orange-600', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  { level: 'C2', name: 'Mastery', color: 'from-rose-500 to-red-600', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
];

const AdminOverview = () => {
  const currentUser = useAppSelector(useCurrentUser) as TCurrentUser | null;
  const isStaff = (currentUser?.role || '').toUpperCase() === 'STAFF';

  const { data: vocabData, isLoading: isVocabLoading } = useGetAllVocabularyQuery('limit=100');
  const { data: readingData, isLoading: isReadingLoading } = useGetAllReadingQuery('limit=50');
  const { data: listeningData, isLoading: isListeningLoading } = useGetAllListeningQuery('limit=50');
  const { data: quizData, isLoading: isQuizLoading } = useGetAllQuizzesQuery('limit=50');

  const totalVocab = vocabData?.meta?.total || vocabData?.data?.length || 0;
  const totalReading = readingData?.meta?.total || readingData?.data?.length || 0;
  const totalListening = listeningData?.meta?.total || listeningData?.data?.length || 0;
  const totalQuizzes = quizData?.meta?.total || quizData?.data?.length || 0;

  const vocabList = vocabData?.data || [];
  const readingList = readingData?.data || [];

  // Calculate Level Distribution for Vocabulary
  const vocabByLevel: Record<string, number> = {};
  vocabList.forEach((item: any) => {
    const lvl = (item.level || 'A1').toUpperCase();
    vocabByLevel[lvl] = (vocabByLevel[lvl] || 0) + 1;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold border border-white/10">
              <GraduationCap className="w-4 h-4" />
              <span>Goethe-Zertifikat & CEFR Aligned Curriculum</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              LingoVest Management Hub
            </h1>
            <p className="text-sm md:text-base text-slate-300">
              Modular AI content generation engine and zero-duplicate pedagogical architecture for German language learners.
            </p>
          </div>

          {!isStaff && (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard/admin/vocabulary"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold shadow-md shadow-orange-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Auto-Harvest Words</span>
              </Link>
              <Link
                to="/dashboard/admin/reading"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium border border-white/20 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Stories</span>
              </Link>
            </div>
          )}
        </div>

        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Core Curriculum Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Vocabulary Card */}
        <Link
          to="/dashboard/admin/vocabulary"
          className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-orange-200 relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vocabulary</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {isVocabLoading ? '...' : totalVocab}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Curated German Words</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-orange-600">
            <span>Manage Lexicon</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Reading Passages Card */}
        <Link
          to="/dashboard/admin/reading"
          className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-indigo-200 relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reading</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {isReadingLoading ? '...' : totalReading}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Passages & Stories</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-indigo-600">
            <span>Goethe Checks</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Listening Dialogues Card */}
        <Link
          to="/dashboard/admin/listening"
          className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-teal-200 relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Listening</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {isListeningLoading ? '...' : totalListening}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Audio Dialogues</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Headphones className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-teal-600">
            <span>Audio & Dictations</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Quizzes & Tests Card */}
        <Link
          to="/dashboard/admin/quizzes"
          className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-purple-200 relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quizzes & Drills</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {isQuizLoading ? '...' : totalQuizzes}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Practice Exercises</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-purple-600">
            <span>Interactive Tests</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Zero-Duplicate Architecture & Modular Ingestion Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 rounded-2xl border border-emerald-500/20 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900">
                Zero-Duplicate & Idempotency Pipeline Active
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                2-Layer Defense
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              <strong>Layer 1 (AI Injection):</strong> Real-time DB query generates dynamic exclusion blacklists in system prompts preventing LLM repetition. <br />
              <strong>Layer 2 (Database Level):</strong> Compound constraints on <code className="text-xs bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">(normalizedWord, level)</code>, <code className="text-xs bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">(slug, level)</code>, and <code className="text-xs bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">(promptGerman, quizId)</code> ensure zero duplicate entries.
            </p>
          </div>
        </div>
      </div>

      {/* Modular AI Harvesters Grid (Hidden for Staff) */}
      {!isStaff && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Modular AI Harvesters (No Centralized Hub)
              </h2>
              <p className="text-xs text-slate-500">
                Each management page features dedicated, context-aware AI harvesting buttons with strict deduplication.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Vocab Harvester */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Vocabulary Auto-Harvest</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Extracts words with articles (der/die/das), plural forms, EN/BN translations, example sentences, and slow/normal TTS cues.
                </p>
              </div>
              <Link
                to="/dashboard/admin/vocabulary"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-sm"
              >
                <span>[✨ AI Auto-Harvest Vocabulary]</span>
              </Link>
            </div>

            {/* 2. Reading Generator */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Reading Story & Questions</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Generates CEFR-graded German passages, bilingual summaries in Bengali & English, and Goethe-style comprehension checks.
                </p>
              </div>
              <Link
                to="/dashboard/admin/reading"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <span>[✨ AI Generate Reading Story]</span>
              </Link>
            </div>

            {/* 3. Listening Generator */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Audio Dialogue & Dictation</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Creates natural German speaker dialogues, fill-in-the-blank dictation blanks, and Goethe Hören listening MCQs.
                </p>
              </div>
              <Link
                to="/dashboard/admin/listening"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm"
              >
                <span>[✨ AI Generate Audio Dialogue]</span>
              </Link>
            </div>

            {/* 4. Quiz Generator */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                  4
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Practice Quiz Drills</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Generates sentence scrambles, article drills (der/die/das), and fill-in-the-blanks with detailed Bengali pedagogical explanations.
                </p>
              </div>
              <Link
                to="/dashboard/admin/quizzes"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm"
              >
                <span>[✨ AI Generate Practice Quiz]</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CEFR Curriculum Coverage */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">CEFR Level Progression (A1 - C2)</h3>
            <p className="text-xs text-slate-500">Distribution of vocabulary items across proficiency standards</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">Total: {totalVocab} Words</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CEFR_LEVELS.map((item) => {
            const count = vocabByLevel[item.level] || 0;
            return (
              <div
                key={item.level}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col items-center text-center space-y-1 hover:border-orange-200 transition-all"
              >
                <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${item.badge}`}>
                  {item.level}
                </span>
                <span className="text-2xl font-black text-slate-800">{count}</span>
                <span className="text-[11px] text-slate-500 font-medium">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
