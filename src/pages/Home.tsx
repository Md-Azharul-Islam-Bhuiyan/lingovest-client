import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Star,
  Compass,
  BookOpen,
  Sparkles,
  Layers,
  HelpCircle,
  FileText,
  Headphones,
  Check,
  RotateCcw,
  GraduationCap,
  Award,
  ChevronRight,
} from 'lucide-react';
import ScrollToTop from '@/components/ui/ToTop';
import { FelixMascot, MascotState } from '@/components/mascot/FelixMascot';

// ==========================================
// DATA: HERO MINI CHALLENGES
// ==========================================
interface HeroChallenge {
  id: string;
  level: string;
  prompt: string;
  sentencePre: string;
  blank: string;
  sentencePost: string;
  options: string[];
  correct: string;
  explanationEn: string;
  explanationBn: string;
  fullSentence: string;
}

const HERO_CHALLENGES: HeroChallenge[] = [
  {
    id: 'hero-1',
    level: 'A1 Beginner',
    prompt: 'Conjugate the verb for "ich" (I):',
    sentencePre: 'Ich',
    blank: '___',
    sentencePost: 'Deutsch.',
    options: ['lerne', 'lernst', 'lernen'],
    correct: 'lerne',
    explanationEn: '“Ich lerne” is correct because regular present-tense verbs with “ich” take the ending -e.',
    explanationBn: '‘Ich’ (আমি)-এর সাথে বর্তমান কালের নিয়মিত ক্রিয়াপদে ‘-e’ বিভক্তি যুক্ত হয়।',
    fullSentence: 'Ich lerne Deutsch.',
  },
  {
    id: 'hero-2',
    level: 'A1 Articles',
    prompt: 'Choose the correct definite article for "Katze":',
    sentencePre: '',
    blank: '___',
    sentencePost: 'Katze schläft auf dem Sofa.',
    options: ['Der', 'Die', 'Das'],
    correct: 'Die',
    explanationEn: '“Katze” is feminine in German, so the nominative singular article is always “die”.',
    explanationBn: 'জার্মান ভাষায় ‘Katze’ (বিড়াল) একটি Feminin Noun, তাই এর পূর্বে ‘die’ বসে।',
    fullSentence: 'Die Katze schläft auf dem Sofa.',
  },
  {
    id: 'hero-3',
    level: 'A2 Conjunctions',
    prompt: 'Complete the subordinate clause (verb at end):',
    sentencePre: 'Er lernt fleißig, weil er nach Berlin reisen',
    blank: '___',
    sentencePost: '.',
    options: ['will', 'wollen', 'willst'],
    correct: 'will',
    explanationEn: 'In subordinate clauses with “weil”, the conjugated verb (“will”) moves to the very end.',
    explanationBn: '‘weil’ (কারণ)-যুক্ত subordinate clause-এ প্রধান ক্রিয়াপদটি বাক্যের একেবারে শেষে বসে।',
    fullSentence: 'Er lernt fleißig, weil er nach Berlin reisen will.',
  },
];

// ==========================================
// DATA: A1–C2 CEFR LEARNING WORLDS
// ==========================================
interface CefrLevelInfo {
  code: string;
  name: string;
  germanTitle: string;
  cefrTitle: string;
  description: string;
  daysCount: number;
  topicsCount: string;
  milestone: string;
  colorScheme: {
    badge: string;
    border: string;
    accent: string;
    bgHover: string;
  };
  samplePhrase: {
    german: string;
    english: string;
    grammarNote: string;
  };
  link: string;
}

const CEFR_LEVELS_DATA: CefrLevelInfo[] = [
  {
    code: 'A1',
    name: 'Starter Village',
    germanTitle: 'Grundstufe 1',
    cefrTitle: 'Absolute Beginner',
    description: 'Master everyday foundations: introductions, present tense conjugations, definite articles (der/die/das), and basic sentence structures.',
    daysCount: 60,
    topicsCount: '60 Lessons • 180 Exercises',
    milestone: 'Hold simple daily conversations & introduce yourself',
    colorScheme: {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      border: 'border-emerald-200 hover:border-emerald-400',
      accent: 'text-emerald-700',
      bgHover: 'hover:bg-emerald-50/40',
    },
    samplePhrase: {
      german: 'Guten Tag! Ich heiße Anna und komme aus Berlin.',
      english: 'Good day! My name is Anna and I come from Berlin.',
      grammarNote: 'Present tense regular verbs: heißen (heiße) & kommen (komme).',
    },
    link: '/curriculum/A1',
  },
  {
    code: 'A2',
    name: 'Grammar Forest',
    germanTitle: 'Grundstufe 2',
    cefrTitle: 'Elementary German',
    description: 'Express past events (Perfekt tense), use modal verbs (können, müssen, dürfen), navigate directions, shopping, and everyday travel situations.',
    daysCount: 60,
    topicsCount: '60 Lessons • 180 Exercises',
    milestone: 'Describe past experiences & routine daily tasks',
    colorScheme: {
      badge: 'bg-sky-100 text-sky-800 border-sky-200',
      border: 'border-sky-200 hover:border-sky-400',
      accent: 'text-sky-700',
      bgHover: 'hover:bg-sky-50/40',
    },
    samplePhrase: {
      german: 'Gestern habe ich mit Freunden einen Film gesehen.',
      english: 'Yesterday I watched a movie with friends.',
      grammarNote: 'Perfekt tense: auxiliary “habe” + past participle “gesehen”.',
    },
    link: '/curriculum/A2',
  },
  {
    code: 'B1',
    name: 'Vocab Island',
    germanTitle: 'Zertifikat B1',
    cefrTitle: 'Intermediate Fluency',
    description: 'The Goethe-Zertifikat B1 benchmark. Connect complex thoughts using subordinate clauses (weil, dass, obwohl), express opinions, and handle workplace German.',
    daysCount: 60,
    topicsCount: '60 Lessons • 180 Exercises',
    milestone: 'Achieve Goethe-Zertifikat B1 exam readiness',
    colorScheme: {
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      border: 'border-indigo-200 hover:border-indigo-400',
      accent: 'text-indigo-700',
      bgHover: 'hover:bg-indigo-50/40',
    },
    samplePhrase: {
      german: 'Obwohl es geregnet hat, haben wir den Ausflug gemacht.',
      english: 'Although it rained, we went on the excursion.',
      grammarNote: 'Concessive clause with “obwohl” placing the verb at the end.',
    },
    link: '/curriculum/B1',
  },
  {
    code: 'B2',
    name: 'Grammar Castle',
    germanTitle: 'Mittelstufe',
    cefrTitle: 'Upper-Intermediate',
    description: 'Navigate professional German: Passive voice (Vorgangspassiv), Konjunktiv II for diplomacy and hypotheses, nominal style, and debating complex topics.',
    daysCount: 60,
    topicsCount: '60 Lessons • 180 Exercises',
    milestone: 'Work & study in German universities or companies',
    colorScheme: {
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      border: 'border-amber-200 hover:border-amber-400',
      accent: 'text-amber-700',
      bgHover: 'hover:bg-amber-50/40',
    },
    samplePhrase: {
      german: 'Wenn ich mehr Zeit hätte, würde ich mich engagieren.',
      english: 'If I had more time, I would get involved.',
      grammarNote: 'Konjunktiv II subjunctive: “hätte” + “würde... engagieren”.',
    },
    link: '/curriculum/B2',
  },
  {
    code: 'C1',
    name: 'Fluency City',
    germanTitle: 'Oberstufe 1',
    cefrTitle: 'Advanced Proficiency',
    description: 'Academic German and TestDaF preparation. Master complex sentence connectors, idiomatic formulations, stylistic nuances, and academic argumentation.',
    daysCount: 60,
    topicsCount: '60 Lessons • 180 Exercises',
    milestone: 'TestDaF / C1 Hochschule examination proficiency',
    colorScheme: {
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
      border: 'border-rose-200 hover:border-rose-400',
      accent: 'text-rose-700',
      bgHover: 'hover:bg-rose-50/40',
    },
    samplePhrase: {
      german: 'Angesichts der aktuellen Lage ist dieses Vorgehen unverzichtbar.',
      english: 'In light of the current situation, this course of action is indispensable.',
      grammarNote: 'Genitive preposition “angesichts” with nominal abstract style.',
    },
    link: '/curriculum/C1',
  },
  {
    code: 'C2',
    name: 'Master’s Kingdom',
    germanTitle: 'Oberstufe 2',
    cefrTitle: 'Mastery & Near-Native',
    description: 'Effortlessly comprehend virtually everything heard or read. Reconstruct arguments, distinguish subtle shades of meaning, and speak with native-level precision.',
    daysCount: 60,
    topicsCount: '60 Lessons • 180 Exercises',
    milestone: 'Complete near-native fluency across literature & media',
    colorScheme: {
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      border: 'border-purple-200 hover:border-purple-400',
      accent: 'text-purple-700',
      bgHover: 'hover:bg-purple-50/40',
    },
    samplePhrase: {
      german: 'Seine Ausführungen bestachen durch rhetorische Brillanz.',
      english: 'His remarks stood out for their rhetorical brilliance.',
      grammarNote: 'High-register literary idiom: “bestechen durch” (captivate with).',
    },
    link: '/curriculum/C2',
  },
];

// ==========================================
// DATA: LIVE LESSON TRYOUT (SECTION 3)
// ==========================================
interface LessonTryout {
  level: string;
  title: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  translation: string;
  bengaliNote: string;
}

const LESSON_TRYOUTS: Record<string, LessonTryout> = {
  A1: {
    level: 'A1',
    title: 'A1: Present Tense Verb Endings',
    question: 'Er ___ jeden Morgen um 7 Uhr auf.',
    options: ['steht', 'stehen', 'stehst'],
    correct: 'steht',
    explanation: '“Er” (he) takes the verb ending -t in the regular present tense: “er steht auf”.',
    translation: 'He gets up every morning at 7 o’clock.',
    bengaliNote: '‘Er’ (সে)-এর সাথে বর্তমান কালের ক্রিয়াপদে ‘-t’ বিভক্তি বসে (aufstehen -> steht auf)।',
  },
  A2: {
    level: 'A2',
    title: 'A2: Conversational Past (Perfekt)',
    question: 'Wir haben gestern eine neue Wohnung ___.',
    options: ['besichtigt', 'besichtigen', 'besichtigte'],
    correct: 'besichtigt',
    explanation: 'Regular inseparable verbs with prefix “be-” form the Partizip II with ending -t without “ge-”: besichtigt.',
    translation: 'We viewed a new apartment yesterday.',
    bengaliNote: '‘be-’ উপসর্গযুক্ত ক্রিয়ার Partizip II গঠনে ‘ge-’ যুক্ত হয় না (besichtigt)।',
  },
  B1: {
    level: 'B1',
    title: 'B1: Subordinate Clause Word Order',
    question: 'Ich freue mich, dass du mich besuchen ___.',
    options: ['kommst', 'kommen', 'gekommen'],
    correct: 'kommst',
    explanation: 'In subordinate clauses introduced by “dass”, the conjugated verb (“kommst”) must move to the very end.',
    translation: 'I am happy that you are coming to visit me.',
    bengaliNote: '‘dass’ (যে)-যুক্ত subordinate clause-এ verb বাক্যের একদম শেষে অবস্থান করে।',
  },
  B2: {
    level: 'B2',
    title: 'B2: Passive Voice (Vorgangspassiv)',
    question: 'Das neue Museum ___ nächste Woche eröffnet.',
    options: ['wird', 'wurde', 'worden'],
    correct: 'wird',
    explanation: 'Present tense passive voice is formed with “werden” (3rd person singular “wird”) + Partizip II (“eröffnet”).',
    translation: 'The new museum will be opened / is being opened next week.',
    bengaliNote: 'বর্তমান কালের Passive Voice-এ werden (wird) + Partizip II ব্যবহৃত হয়।',
  },
};

const Home = () => {
  // Hero Interactive Preview State
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroSelectedAnswer, setHeroSelectedAnswer] = useState<string | null>(null);
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [mascotText, setMascotText] = useState('Hallo! Ready to test your German?');

  // Section 3: Try a Lesson State
  const [tryoutLevel, setTryoutLevel] = useState<'A1' | 'A2' | 'B1' | 'B2'>('A1');
  const [tryoutChoice, setTryoutChoice] = useState<string | null>(null);

  // Active level card focus in Section 2
  const [selectedCefrCode, setSelectedCefrCode] = useState<string>('A1');

  const currentHeroChallenge = HERO_CHALLENGES[heroIndex];
  const currentTryout = LESSON_TRYOUTS[tryoutLevel];

  // Web Speech API Native Pronunciation
  const playSpeech = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Handle Hero Challenge Answer
  const handleHeroSelect = (choice: string) => {
    setHeroSelectedAnswer(choice);
    if (choice === currentHeroChallenge.correct) {
      setMascotState('happy');
      setMascotText('Richtig! Ausgezeichnet! 🎉');
      playSpeech(currentHeroChallenge.fullSentence);
    } else {
      setMascotState('encouraging');
      setMascotText('Guter Versuch! Try again or see the note below.');
    }
  };

  const handleNextHeroChallenge = () => {
    setHeroSelectedAnswer(null);
    setHeroIndex((prev) => (prev + 1) % HERO_CHALLENGES.length);
    setMascotState('thinking');
    setMascotText('Here comes the next challenge! 🇩🇪');
  };

  // Handle Section 3 Tryout Answer
  const handleTryoutSelect = (choice: string) => {
    setTryoutChoice(choice);
    if (choice === currentTryout.correct) {
      playSpeech(currentTryout.question.replace('___', choice));
    }
  };

  return (
    <div className="bg-slate-50/60 min-h-screen text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <ScrollToTop />

      {/* ========================================================
          SECTION 1: HERO SECTION
          Two-column balanced desktop composition
          ======================================================== */}
      <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/80 overflow-hidden bg-white">
        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-50/60 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-32 w-80 h-80 bg-slate-100/80 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Headline, Value Proposition & Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Eyebrow Label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                <span>YOUR GERMAN JOURNEY STARTS HERE</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Learn German with confidence.{' '}
                <span className="text-indigo-600 inline-block">
                  One step at a time.
                </span>
              </h1>

              {/* Supporting Value Proposition */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Build your German grammar skills through guided daily lessons, interactive exercises, and a structured learning path designed around your exact CEFR level.
              </p>

              {/* Dual CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Link
                  to="/curriculum"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-sm shadow-indigo-600/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-98"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#learning-path"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-sm sm:text-base border border-slate-200 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 active:scale-98"
                >
                  <Compass className="w-4 h-4 text-slate-500" />
                  <span>Explore the Learning Path</span>
                </a>
              </div>

              {/* Supporting Benefit Line */}
              <p className="text-xs sm:text-sm text-slate-500 font-medium pt-1">
                From A1 beginner foundations to advanced C2 German proficiency • Dedicated 60-day curriculum per level.
              </p>

              {/* Trust & Quality Badges */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-4 sm:gap-6 flex-wrap text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Goethe-Zertifikat CEFR Standards</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Native Speech Audio</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>English & Bengali Explanations</span>
                </div>
              </div>
            </div>

            {/* Right Column: Genuine Interactive German Grammar Preview Card */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/90 shadow-md p-5 sm:p-6 space-y-4">
                {/* Header with Level & Mascot Reaction */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {currentHeroChallenge.level}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Interactive Live Preview
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-1">
                      {currentHeroChallenge.prompt}
                    </p>
                  </div>

                  {/* Compact Felix Mascot Reaction */}
                  <div className="shrink-0 flex items-center gap-1">
                    <FelixMascot
                      size="sm"
                      state={mascotState}
                      showBadge={false}
                    />
                  </div>
                </div>

                {/* Sentence with Highlighted Blank */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-wide flex items-center justify-center gap-2 flex-wrap">
                    {currentHeroChallenge.sentencePre && (
                      <span>{currentHeroChallenge.sentencePre}</span>
                    )}
                    <span className="px-3 py-1 rounded-md bg-white border border-slate-300 text-indigo-700 font-black shadow-inner min-w-[70px]">
                      {heroSelectedAnswer || currentHeroChallenge.blank}
                    </span>
                    <span>{currentHeroChallenge.sentencePost}</span>
                  </div>

                  <button
                    onClick={() => playSpeech(currentHeroChallenge.fullSentence)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline pt-1"
                    title="Listen to native pronunciation"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen: "{currentHeroChallenge.fullSentence}"</span>
                  </button>
                </div>

                {/* Answer Options */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Select the correct answer:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {currentHeroChallenge.options.map((option) => {
                      const isSelected = heroSelectedAnswer === option;
                      const isCorrect = option === currentHeroChallenge.correct;
                      return (
                        <button
                          key={option}
                          onClick={() => handleHeroSelect(option)}
                          className={`py-2.5 px-3 rounded-xl font-bold text-sm transition-all border flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? isCorrect
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-rose-600 text-white border-rose-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40'
                          }`}
                        >
                          {isSelected && isCorrect && <Check className="w-3.5 h-3.5" />}
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Immediate Rule Explanation */}
                <AnimatePresence mode="wait">
                  {heroSelectedAnswer && (
                    <motion.div
                      key={heroSelectedAnswer + heroIndex}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                        heroSelectedAnswer === currentHeroChallenge.correct
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50/70 border-rose-200 text-rose-900'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        {heroSelectedAnswer === currentHeroChallenge.correct ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Richtig! Well done!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>Not quite right yet.</span>
                          </>
                        )}
                      </div>
                      <p className="text-slate-700">{currentHeroChallenge.explanationEn}</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        🇧🇩 {currentHeroChallenge.explanationBn}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Card Footer: Rotate Question & Link to Lesson */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={handleNextHeroChallenge}
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Try another question ({heroIndex + 1}/3)</span>
                  </button>

                  <Link
                    to="/curriculum/A1"
                    className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    <span>Full A1 Lessons</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: THE A1–C2 LEARNING JOURNEY
          Visual roadmap of the 6 CEFR worlds
          ======================================================== */}
      <section id="learning-path" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 max-w-3xl mb-12 text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700">
            <Compass className="w-4 h-4" />
            <span>Structured CEFR Roadmap</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Your path to German proficiency
          </h2>
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            Start where you are and build your skills step by step. Every level features a dedicated <strong>60-day plan</strong> with guided grammar, vocabulary, audio dialogue, and Goethe exam practice.
          </p>
        </div>

        {/* 6 Level Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CEFR_LEVELS_DATA.map((lvl) => {
            const isCurrentSelected = selectedCefrCode === lvl.code;
            return (
              <div
                key={lvl.code}
                onMouseEnter={() => setSelectedCefrCode(lvl.code)}
                className={`bg-white rounded-2xl border p-6 transition-all duration-200 flex flex-col justify-between space-y-5 ${
                  lvl.colorScheme.border
                } ${isCurrentSelected ? 'shadow-md ring-1 ring-indigo-200' : 'shadow-sm'}`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Level Code & Days Count */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-md border ${lvl.colorScheme.badge}`}>
                      {lvl.code} • {lvl.cefrTitle}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {lvl.daysCount} Days
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center justify-between">
                      <span>{lvl.name}</span>
                      <span className="text-xs font-normal text-slate-400 italic">
                        {lvl.germanTitle}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {lvl.topicsCount}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {lvl.description}
                  </p>

                  {/* Sample Sentence Preview */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-800">
                        "{lvl.samplePhrase.german}"
                      </p>
                      <button
                        onClick={() => playSpeech(lvl.samplePhrase.german)}
                        className="p-1 rounded text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Pronounce sample sentence"
                        aria-label={`Listen to ${lvl.code} sample sentence`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {lvl.samplePhrase.english}
                    </p>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">
                    {lvl.milestone}
                  </span>
                  <Link
                    to={lvl.link}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline shrink-0 ml-2"
                  >
                    <span>Explore {lvl.code}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* 60-Day schedule clarification note */}
        <div className="mt-8 p-4 rounded-xl bg-slate-100/80 border border-slate-200/90 flex items-start sm:items-center gap-3">
          <GraduationCap className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Curriculum Schedule:</strong> Each CEFR stage (A1, A2, B1, B2, C1, C2) is structured with its own 60-day calendar plan. Advance at your own pace — review rules anytime or fast-track through concepts you have already mastered.
          </p>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: TRY A LESSON (INTERACTIVE GRAMMAR CHALLENGE)
          Direct exercise tryout with level selector
          ======================================================== */}
      <section className="py-16 lg:py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Interactive Grammar Sandbox
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Test your German grammar right here
            </h2>
            <p className="text-sm text-slate-600">
              Select any level below to experience our instant visual feedback and grammatical explanations.
            </p>
          </div>

          {/* Level Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 p-1 bg-slate-100 rounded-xl max-w-sm mx-auto">
            {(['A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setTryoutLevel(lvl);
                  setTryoutChoice(null);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tryoutLevel === lvl
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl} Level
              </button>
            ))}
          </div>

          {/* Interactive Question Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <span className="text-xs font-bold text-slate-700">
                {currentTryout.title}
              </span>
              <button
                onClick={() => playSpeech(currentTryout.question.replace('___', ''))}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Audio</span>
              </button>
            </div>

            {/* German Question Prompt */}
            <div className="text-center py-2">
              <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-wide">
                {currentTryout.question.split('___')[0]}
                <span className="inline-block px-3 py-0.5 mx-1.5 rounded-md bg-white border border-slate-300 text-indigo-600 underline font-black">
                  {tryoutChoice || '___'}
                </span>
                {currentTryout.question.split('___')[1]}
              </p>
              <p className="text-xs text-slate-500 italic mt-2">
                Meaning: "{currentTryout.translation}"
              </p>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto">
              {currentTryout.options.map((opt) => {
                const isSelected = tryoutChoice === opt;
                const isCorrect = opt === currentTryout.correct;
                return (
                  <button
                    key={opt}
                    onClick={() => handleTryoutSelect(opt)}
                    className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border ${
                      isSelected
                        ? isCorrect
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 shadow-sm'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Feedback Box */}
            {tryoutChoice && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                  tryoutChoice === currentTryout.correct
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <p className="font-bold">
                  {tryoutChoice === currentTryout.correct
                    ? 'Ausgezeichnet! That is correct.'
                    : 'Not quite. Check the rule explanation:'}
                </p>
                <p className="text-slate-700">{currentTryout.explanation}</p>
                <p className="text-[11px] text-slate-500 font-medium pt-0.5">
                  🇧🇩 {currentTryout.bengaliNote}
                </p>
              </motion.div>
            )}

            <div className="pt-2 text-center">
              <Link
                to={`/curriculum/${tryoutLevel}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                <span>Continue to Day 1 lessons in {tryoutLevel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4: HOW IT WORKS
          3 Pedagogical Steps
          ======================================================== */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Pedagogical Method
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            How learning with LingoVest works
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A proven three-step learning cycle that builds long-term retention and confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              1. Learn the Grammar Concept
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Each day introduces one bite-sized grammatical rule with visual tables, clear examples, and dual English & Bengali explanations.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              2. Practice with Interactive Drills
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Test your understanding immediately through sentence scrambles, article exercises (der/die/das), and listening dictations with instant feedback.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-lg">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              3. Review with Spaced Repetition
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Reinforce learned vocabulary with visual flashcards and scheduled reviews to ensure knowledge moves into permanent long-term memory.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 5: FEATURED LEARNING CAPABILITIES
          Grid of real, implemented platform features
          ======================================================== */}
      <section className="py-16 lg:py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-left max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Platform Features
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything you need to master German
            </h2>
            <p className="text-sm text-slate-600">
              Designed for serious study without unnecessary fluff or noisy distractions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Systematic CEFR Grammar
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rules, declensions, modal verbs, and subordinate clauses aligned with official Goethe-Zertifikat requirements.
              </p>
              <Link to="/grammar" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline pt-1">
                <span>View Grammar Library</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Visual Flashcard System
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dynamic vocabulary images, color-coded genders (der, die, das), example sentences, and audio pronunciation.
              </p>
              <Link to="/vocabulary" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline pt-1">
                <span>Open Flashcards</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Listening & Reading Labs
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Graded German short stories and dialogue audio tracks designed to train your ear and reading comprehension.
              </p>
              <Link to="/reading" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline pt-1">
                <span>Explore Stories</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Quizzes Arena
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Test your article recall, fill in missing verb forms, and solve sentence order challenges with instant feedback.
              </p>
              <Link to="/quizzes" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline pt-1">
                <span>Play Quizzes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 6: CLOSING CALL TO ACTION
          Motivating, clean SaaS closing banner
          ======================================================== */}
      <section className="py-16 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white space-y-6 relative overflow-hidden shadow-lg border border-slate-800">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              START YOUR 60-DAY SCHEDULE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Make your next German lesson count.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
              Build a consistent learning habit and take the next step in your German journey. Whether starting fresh at A1 or preparing for the Goethe-Zertifikat B1 exam, LingoVest guides you every day.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <Link
              to="/curriculum"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 active:scale-98"
            >
              <span>Start Learning Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/grammar"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 active:scale-98"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Browse Grammar Library</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
