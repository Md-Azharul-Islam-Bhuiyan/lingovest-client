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
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  ListChecks,
  Languages,
} from 'lucide-react';

const StaffOverview = () => {
  const currentUser = useAppSelector(useCurrentUser) as TCurrentUser | null;

  const { data: vocabData, isLoading: isVocabLoading } = useGetAllVocabularyQuery('limit=100');
  const { data: readingData, isLoading: isReadingLoading } = useGetAllReadingQuery('limit=50');
  const { data: listeningData, isLoading: isListeningLoading } = useGetAllListeningQuery('limit=50');
  const { data: quizData, isLoading: isQuizLoading } = useGetAllQuizzesQuery('limit=50');

  const totalVocab = vocabData?.meta?.total || vocabData?.data?.length || 0;
  const totalReading = readingData?.meta?.total || readingData?.data?.length || 0;
  const totalListening = listeningData?.meta?.total || listeningData?.data?.length || 0;
  const totalQuizzes = quizData?.meta?.total || quizData?.data?.length || 0;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-semibold border border-white/10">
              <ShieldCheck className="w-4 h-4" />
              <span>Staff Curriculum Editorial Portal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Willkommen, {currentUser?.name || 'Curator'}! 🇩🇪
            </h1>
            <p className="text-sm md:text-base text-emerald-100/90 leading-relaxed">
              Curate, review, and refine Goethe-format German learning modules. Maintain grammatical accuracy, article genders (<span className="font-semibold underline">der</span>, <span className="font-semibold underline">die</span>, <span className="font-semibold underline">das</span>), and authentic Bengali pedagogical annotations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard/staff/vocabulary"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-md shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Review Vocabulary</span>
            </Link>
            <Link
              to="/dashboard/staff/reading"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium border border-white/20 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Review Stories</span>
            </Link>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Curriculum Inventory Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-orange-100 text-orange-700">
              A1–C2
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">
              {isVocabLoading ? '...' : totalVocab}
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Vocabulary Entries</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              to="/dashboard/staff/vocabulary"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              Curate Lexicon <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
              Stories
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">
              {isReadingLoading ? '...' : totalReading}
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Reading Passages</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              to="/dashboard/staff/reading"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Curate Passages <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-100 text-teal-700">
              Audio Lab
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">
              {isListeningLoading ? '...' : totalListening}
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Listening Dialogues</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              to="/dashboard/staff/listening"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              Curate Dialogues <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">
              Drills
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">
              {isQuizLoading ? '...' : totalQuizzes}
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Practice Quizzes</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              to="/dashboard/staff/quizzes"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              Curate Quizzes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Staff Editorial Guidelines & Standards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ListChecks className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Staff Quality Checklist</h2>
              <p className="text-xs text-slate-500">Essential standards before publishing German modules</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">Grammar & Gender Articles:</span> Ensure nouns include correct definite articles (<span className="text-blue-600 font-bold">der</span>, <span className="text-rose-600 font-bold">die</span>, <span className="text-emerald-600 font-bold">das</span>) and valid plural forms.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">Bengali Translations (বাংলা অনুবাদ):</span> Verify that Bengali annotations convey contextual nuances rather than literal machine-translated English idioms.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">CEFR Consistency:</span> Check that A1/A2 passages avoid complex subjunctive (Konjunktiv II) or passive structures meant for B2/C1.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Role & Responsibilities</h2>
              <p className="text-xs text-slate-500">Staff permissions and operational boundary</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-2 leading-relaxed">
            <p>
              As a staff curator, your role is focused on pedagogical quality assurance. You can view, review, edit, and fine-tune all learning materials in the curriculum.
            </p>
            <p className="font-semibold text-slate-900">
              System governance notes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>AI bulk harvesting is managed exclusively by the Super Admin to maintain API budget and dedup registry integrity.</li>
              <li>Platform settings and learner user management are restricted to Super Admin.</li>
              <li>Learners access lessons directly via the Academy portal without administrative access.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffOverview;
