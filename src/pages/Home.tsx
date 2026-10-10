import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Headphones,
  HelpCircle,
  Volume2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Star,
  Rocket,
  Zap,
  Trophy,
  Heart,
} from 'lucide-react';
import ScrollToTop from '@/components/ui/ToTop';

const CEFR_TABS = [
  {
    level: 'A1',
    title: 'Absolute Beginner',
    subtitle: 'Grundlegende Kenntnisse',
    desc: 'Introduce yourself, ask simple questions, and master everyday basics: greetings, food, numbers, and core nouns.',
    sampleWord: 'der Kaffee',
    meaning: 'the coffee (কফি)',
    sampleSentence: 'Ich trinke morgens gerne einen Kaffee.',
    emoji: '🌱',
    color: 'from-emerald-400 to-green-500',
    bg: 'bg-emerald-50',
  },
  {
    level: 'A2',
    title: 'Elementary',
    subtitle: 'Elementare Sprachverwendung',
    desc: 'Communicate in routine situations: shopping, family, local geography, and basic past tense descriptions (Perfekt).',
    sampleWord: 'die Einladung',
    meaning: 'the invitation (আমন্ত্রণ)',
    sampleSentence: 'Vielen Dank für deine herzliche Einladung!',
    emoji: '🌿',
    color: 'from-blue-400 to-cyan-500',
    bg: 'bg-blue-50',
  },
  {
    level: 'B1',
    title: 'Intermediate (Goethe)',
    subtitle: 'Selbstständige Sprachverwendung',
    desc: 'Deal with most situations while traveling in Germany, discuss hobbies, express opinions, and describe experiences.',
    sampleWord: 'die Berufserfahrung',
    meaning: 'work experience (কাজের অভিজ্ঞতা)',
    sampleSentence: 'Er hat bereits fünf Jahre Berufserfahrung im IT-Bereich.',
    emoji: '🌳',
    color: 'from-amber-400 to-yellow-500',
    bg: 'bg-amber-50',
  },
  {
    level: 'B2',
    title: 'Upper Intermediate',
    subtitle: 'Berufliche Sprachkenntnisse',
    desc: 'Understand complex texts on concrete and abstract topics; communicate fluently with native speakers.',
    sampleWord: 'die Nachhaltigkeit',
    meaning: 'sustainability (টেকসই ব্যবস্থা)',
    sampleSentence: 'Nachhaltigkeit ist heute ein zentrales Thema in der Wirtschaft.',
    emoji: '🎯',
    color: 'from-orange-400 to-rose-500',
    bg: 'bg-orange-50',
  },
  {
    level: 'C1',
    title: 'Advanced Fluency',
    subtitle: 'Fachkundige Sprachkenntnisse',
    desc: 'Express ideas fluently and spontaneously for academic (TestDaF) and professional purposes.',
    sampleWord: 'das Verantwortungsbewusstsein',
    meaning: 'sense of responsibility (দায়িত্ববোধ)',
    sampleSentence: 'Diese Position erfordert ein hohes Maß an Verantwortungsbewusstsein.',
    emoji: '🔥',
    color: 'from-rose-400 to-red-500',
    bg: 'bg-rose-50',
  },
  {
    level: 'C2',
    title: 'Mastery',
    subtitle: 'Muttersprachliche Kenntnisse',
    desc: 'Understand virtually everything heard or read; summarize info and reconstruct arguments coherently.',
    sampleWord: 'die Sprachgewandtheit',
    meaning: 'eloquence (বাগ্মীতা)',
    sampleSentence: 'Ihre Sprachgewandtheit beeindruckte das gesamte Publikum.',
    emoji: '🏆',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
  },
];

const PILLARS = [
  {
    to: '/vocabulary',
    emoji: '📚',
    module: 'Module 1',
    title: 'Vocabulary',
    germanTitle: 'Wortschatz',
    desc: 'Color-coded gender articles (der, die, das), plurals, dual audio, and Bengali meanings.',
    gradient: 'from-violet-500 to-purple-600',
    hoverBorder: 'hover:border-violet-300',
    textColor: 'text-violet-600',
    shadow: 'shadow-violet-500/20',
    cta: 'Explore Words',
  },
  {
    to: '/reading',
    emoji: '📖',
    module: 'Module 2',
    title: 'Reading',
    germanTitle: 'Leseverstehen',
    desc: 'German stories graded A1–C1 with comprehension checks and bilingual summaries.',
    gradient: 'from-blue-500 to-cyan-500',
    hoverBorder: 'hover:border-blue-300',
    textColor: 'text-blue-600',
    shadow: 'shadow-blue-500/20',
    cta: 'Read Stories',
  },
  {
    to: '/listening',
    emoji: '🎧',
    module: 'Module 3',
    title: 'Listening',
    germanTitle: 'Hörverstehen',
    desc: 'Dialogue scripts with conversational turns, dictation exercises, and listening MCQs.',
    gradient: 'from-teal-500 to-emerald-500',
    hoverBorder: 'hover:border-teal-300',
    textColor: 'text-teal-600',
    shadow: 'shadow-teal-500/20',
    cta: 'Start Listening',
  },
  {
    to: '/quizzes',
    emoji: '🧩',
    module: 'Module 4',
    title: 'Quizzes',
    germanTitle: 'Übungsarena',
    desc: 'Sentence scrambles, article drills, fill-in-blanks, and Bengali grammar explanations.',
    gradient: 'from-pink-500 to-rose-500',
    hoverBorder: 'hover:border-pink-300',
    textColor: 'text-pink-600',
    shadow: 'shadow-pink-500/20',
    cta: 'Play Quizzes',
  },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState('A1');
  const [interactiveQuizChoice, setInteractiveQuizChoice] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const activeLevelData = CEFR_TABS.find((t) => t.level === activeTab) || CEFR_TABS[0];

  const playSpeech = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleQuizChoice = (choice: string) => {
    setInteractiveQuizChoice(choice);
    if (choice === 'die') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 bg-animated-gradient min-h-screen">
      <ScrollToTop />

      {/* CONFETTI BURST */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  background: ['#FF6B9D', '#C084FC', '#60A5FA', '#2DD4BF', '#FBBF24', '#4ADE80', '#FB923C'][i % 7],
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  width: `${8 + Math.random() * 8}px`,
                  height: `${8 + Math.random() * 8}px`,
                }}
                initial={{ y: -100, opacity: 1, rotate: 0 }}
                animate={{ y: '100vh', opacity: 0, rotate: 720 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.5 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
        {/* Decorative floating emojis */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-[10%] left-[8%] text-4xl opacity-20">📚</motion.div>
          <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }} className="absolute top-[25%] right-[12%] text-3xl opacity-15">🎧</motion.div>
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity, delay: 2 }} className="absolute bottom-[20%] left-[15%] text-3xl opacity-15">🧩</motion.div>
          <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} className="absolute top-[15%] left-[50%] text-2xl opacity-15">⭐</motion.div>
          <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 8, repeat: Infinity, delay: 3 }} className="absolute bottom-[30%] right-[8%] text-3xl opacity-15">🇩🇪</motion.div>

          {/* Glow blobs */}
          <div className="absolute top-0 right-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-violet-400/15 via-purple-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-[10%] left-[5%] w-[450px] h-[450px] bg-gradient-to-tr from-pink-400/10 via-rose-500/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 border-2 border-violet-200 text-violet-800 text-xs font-extrabold tracking-wide"
              >
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Goethe-Zertifikat CEFR Standards (A1 – C2)</span>
                <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>🎓</motion.span>
              </motion.div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Learn German with{' '}
                <span className="gradient-text-rainbow">
                  Fun & Games
                </span>{' '}
                <motion.span
                  className="inline-block"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 4 }}
                >
                  🚀
                </motion.span>
              </h1>

              <div className="space-y-2">
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-semibold">
                  The most fun way to learn German! Interactive vocabulary with audio, exciting reading stories, listening games, and quizzes — all with Bengali & English explanations.
                </p>
                <p className="text-xs sm:text-sm font-bold text-violet-700 bg-violet-50 px-3 sm:px-4 py-2 rounded-xl inline-block leading-relaxed">
                  🇧🇩 বাংলা অনুবাদ ও ব্যাকরণ ব্যাখ্যাসহ জার্মান ভাষা শিখুন!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                  <Link
                    to="/vocabulary"
                    className="w-full sm:w-auto px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white font-extrabold text-sm shadow-xl shadow-violet-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Start Learning! 📚</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                  <Link
                    to="/quizzes"
                    className="w-full sm:w-auto px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl bg-white hover:bg-violet-50 text-slate-800 font-extrabold text-sm border-2 border-violet-200 shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span>Quiz Arena 🧩</span>
                  </Link>
                </motion.div>
              </div>

              {/* Feature badges */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 flex-wrap">
                {[
                  { icon: '🔊', label: 'Native Audio' },
                  { icon: '✨', label: 'AI-Powered' },
                  { icon: '🇧🇩', label: 'Bengali Support' },
                ].map((badge) => (
                  <motion.div
                    key={badge.label}
                    whileHover={{ scale: 1.1, rotate: [-1, 1, 0] }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border-2 border-violet-100 shadow-sm text-xs font-bold text-slate-600"
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Interactive Flashcard */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-5"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative ring */}
                <div className="absolute -inset-2 bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 rounded-[32px] opacity-20 blur-md" />

                <div className="relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 border-violet-200 shadow-2xl space-y-5 sm:space-y-6">
                  {/* Card header with colored dots */}
                  <div className="flex items-center justify-between pb-4 border-b-2 border-violet-100">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-400 shadow-sm" />
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm" />
                      <span className="w-3.5 h-3.5 rounded-full bg-green-400 shadow-sm" />
                      <span className="ml-2 text-xs font-extrabold text-violet-500">
                        🔊 Live Pronunciation Card
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-700">
                      🌱 A1
                    </span>
                  </div>

                  {/* Word */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-3">
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className="px-3 py-1 rounded-xl text-sm font-black uppercase bg-blue-100 text-blue-700 border-2 border-blue-200 cursor-default"
                      >
                        DER
                      </motion.span>
                      <h3 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight">
                        Apfel
                      </h3>
                      <span className="text-2xl">🍎</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold">
                      Plural: <span className="font-extrabold text-slate-700">die Äpfel</span>
                    </p>
                  </div>

                  {/* Example sentence */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-pink-50 border-2 border-violet-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-violet-500 uppercase tracking-wider">
                        ✏️ Example Sentence
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => playSpeech('Ich esse jeden Morgen einen frischen Apfel.')}
                        className="p-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 transition-colors shadow-md shadow-violet-500/30"
                        title="Play German Speech"
                      >
                        <Volume2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <p className="text-sm font-bold text-slate-900 italic">
                      "Ich esse jeden Morgen einen frischen Apfel."
                    </p>
                    <p className="text-xs text-slate-600 font-semibold">
                      → আমি প্রতিদিন সকালে একটি তাজা আপেল খাই। 🍏
                    </p>
                  </div>

                  {/* Action row */}
                  <div className="pt-2 flex items-center justify-between">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => playSpeech('der Apfel')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-900 hover:to-black transition-all shadow-md"
                    >
                      <Volume2 className="w-4 h-4 text-amber-400" />
                      <span>Listen 🔊</span>
                    </motion.button>

                    <Link
                      to="/vocabulary"
                      className="text-xs font-extrabold text-violet-600 hover:text-violet-700 flex items-center gap-1 group"
                    >
                      <span>100+ Words</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ 4 CURRICULUM PILLARS ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 max-w-3xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold bg-pink-100 text-pink-700 border-2 border-pink-200 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            4 Ways to Learn
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Your German Learning Adventure 🗺️
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-semibold">
            Four fun learning paths to become a German language champion!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((pillar, idx) => (
            <motion.div
              key={pillar.to}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                to={pillar.to}
                className={`group card-playful p-6 flex flex-col justify-between space-y-5 ${pillar.hoverBorder} h-full`}
              >
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${pillar.gradient} text-white flex items-center justify-center shadow-lg ${pillar.shadow} text-3xl`}
                  >
                    {pillar.emoji}
                  </motion.div>
                  <div className="space-y-1">
                    <span className={`text-[11px] font-extrabold ${pillar.textColor} uppercase tracking-wider`}>
                      {pillar.module}
                    </span>
                    <h3 className={`text-xl font-display font-extrabold text-slate-900 group-hover:${pillar.textColor} transition-colors`}>
                      {pillar.germanTitle}
                    </h3>
                    <p className="text-xs text-violet-500 font-bold">({pillar.title})</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    {pillar.desc}
                  </p>
                </div>
                <div className={`pt-4 border-t-2 border-slate-100 flex items-center justify-between text-xs font-extrabold ${pillar.textColor}`}>
                  <span className="flex items-center gap-1">
                    <Rocket className="w-3.5 h-3.5" />
                    {pillar.cta}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ CEFR LEVEL EXPLORER ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white rounded-[32px] p-6 sm:p-10 space-y-8 relative overflow-hidden"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl" />
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-10 right-20 text-2xl opacity-20">⭐</motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-16 left-16 text-2xl opacity-15">🌟</motion.div>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  CEFR Level Explorer
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                  Choose Your Level! 🎯
                </h2>
              </div>
              <span className="text-xs text-slate-400 max-w-xs font-semibold">
                Aligned with Goethe-Institut & TestDaF examinations.
              </span>
            </div>

            {/* CEFR Level Tabs */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2 mt-4 sm:mt-6 pb-2 sm:pb-4">
              {CEFR_TABS.map((tab) => (
                <motion.button
                  key={tab.level}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.level)}
                  className={`py-2 sm:py-3 px-1 sm:px-2 rounded-xl sm:rounded-2xl font-extrabold text-center transition-all flex flex-col items-center justify-center gap-0.5 sm:gap-1 border-2 ${
                    activeTab === tab.level
                      ? 'bg-gradient-to-r ' + tab.color + ' text-white border-white/20 shadow-lg'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <span className="text-lg sm:text-xl">{tab.emoji}</span>
                  <span className="text-base sm:text-lg font-black">{tab.level}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold truncate w-full">{tab.title.split(' ')[0]}</span>
                </motion.button>
              ))}
            </div>

            {/* Level Details Panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLevelData.level}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-4"
              >
                <div className="lg:col-span-7 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{activeLevelData.emoji}</span>
                      <span className="text-2xl font-black text-white">{activeLevelData.level}</span>
                      <span className="text-lg font-bold text-white">— {activeLevelData.title}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-400 italic">
                      {activeLevelData.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {activeLevelData.desc}
                  </p>

                  <div className="pt-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                      <Link
                        to={`/vocabulary?level=${activeLevelData.level}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                      >
                        <Rocket className="w-3.5 h-3.5 text-amber-400" />
                        <span>Explore {activeLevelData.level} Vocabulary</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </motion.div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-800/80 rounded-2xl p-5 border-2 border-slate-700/60 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                    ⭐ Sample Word
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-display font-extrabold text-white">{activeLevelData.sampleWord}</h4>
                      <p className="text-xs text-slate-400 font-semibold">{activeLevelData.meaning}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => playSpeech(activeLevelData.sampleWord)}
                      className={`p-3 rounded-xl bg-gradient-to-r ${activeLevelData.color} text-white transition-colors shadow-md`}
                      title="Listen"
                    >
                      <Volume2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <div className="pt-2 border-t border-slate-700 text-xs text-slate-300 italic font-medium">
                    ✏️ "{activeLevelData.sampleSentence}"
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* ============ INTERACTIVE ARTICLE QUIZ ============ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl sm:rounded-[32px] p-4 sm:p-8 border-2 border-violet-200 shadow-playful space-y-5 sm:space-y-6 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-100 to-violet-100 rounded-full blur-xl opacity-60 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full blur-xl opacity-60 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10 gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-2xl sm:text-3xl shrink-0"
              >
                🎯
              </motion.span>
              <div>
                <h3 className="text-base sm:text-lg font-display font-extrabold text-slate-900 leading-tight">
                  Quick Quiz: Der, Die, or Das?
                </h3>
                <p className="text-[11px] sm:text-xs text-violet-500 font-bold">Test your article knowledge!</p>
              </div>
            </div>
            <span className="hidden xs:inline-flex text-[11px] sm:text-xs font-extrabold text-amber-700 bg-amber-100 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border-2 border-amber-200 items-center gap-1 shrink-0">
              <Zap className="w-3 h-3" />
              Quick Test
            </span>
          </div>

          <div className="p-3.5 sm:p-6 bg-gradient-to-r from-violet-50 to-pink-50 rounded-2xl border-2 border-violet-100 space-y-4 sm:space-y-5 relative z-10">
            <p className="text-xs sm:text-sm font-bold text-slate-500">
              Welcher Artikel passt? (Which article fits?) 🤔
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold text-slate-900 leading-snug">
              <span className="text-violet-600 underline decoration-wavy underline-offset-4 decoration-violet-300">
                {interactiveQuizChoice ? interactiveQuizChoice.toUpperCase() : '______'}
              </span>{' '}
              Katze schläft auf dem Sofa. 🐱
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 sm:pt-2">
              {[
                { article: 'der', color: 'blue', emoji: '💙' },
                { article: 'die', color: 'pink', emoji: '💖' },
                { article: 'das', color: 'emerald', emoji: '💚' },
              ].map(({ article, color, emoji }) => (
                <motion.button
                  key={article}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuizChoice(article)}
                  className={`py-2.5 sm:py-4 px-1 sm:px-3 rounded-xl sm:rounded-2xl text-xs sm:text-base font-black uppercase transition-all border-2 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 ${
                    interactiveQuizChoice === article
                      ? article === 'die'
                        ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                        : 'bg-gradient-to-r from-rose-400 to-red-500 text-white border-rose-500 shadow-lg shadow-rose-500/30'
                      : `bg-white text-slate-700 border-slate-200 hover:border-${color}-300 hover:bg-${color}-50 shadow-sm`
                  }`}
                >
                  <span className="text-base sm:text-lg">{emoji}</span>
                  <span>{article}</span>
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {interactiveQuizChoice && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-5 rounded-2xl text-sm leading-relaxed flex items-start gap-3 border-2 ${
                    interactiveQuizChoice === 'die'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border-rose-200'
                  }`}
                >
                  {interactiveQuizChoice === 'die' ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: 'spring' }}>
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                    </motion.div>
                  ) : (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                      <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                    </motion.div>
                  )}
                  <div>
                    <p className="font-extrabold text-base">
                      {interactiveQuizChoice === 'die'
                        ? '🎉 Ausgezeichnet! "die Katze" ist richtig!'
                        : '😅 Nicht ganz! Die richtige Antwort ist "die Katze".'}
                    </p>
                    <p className="mt-2 font-semibold text-xs">
                      <strong>ব্যাকরণ ব্যাখ্যা:</strong> "Katze" (বিড়াল 🐱) একটি স্ত্রীলিঙ্গ (feminin) বিশেষ্য। জার্মান ভাষায় Feminin Noun-এর ক্ষেত্রে Nominativ একবচনে সর্বদা <strong>die</strong> ব্যবহৃত হয়।
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* ============ WHY LEARN WITH US ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 max-w-3xl mx-auto mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-700 border-2 border-amber-200 uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            Why LingoVest?
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
            Learning Made Fun & Easy! ✨
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              emoji: '🎮',
              title: 'Game-Like Learning',
              desc: 'Interactive quizzes, drag-and-drop puzzles, and instant feedback make learning feel like playing a game!',
              color: 'from-violet-500 to-purple-600',
            },
            {
              emoji: '🔊',
              title: 'Native Audio',
              desc: 'Hear every word and sentence spoken by native German speakers at normal and slow speeds.',
              color: 'from-blue-500 to-cyan-500',
            },
            {
              emoji: '🇧🇩',
              title: 'Bengali Explanations',
              desc: 'Complete Bengali translations and grammar explanations to help you understand every concept deeply.',
              color: 'from-pink-500 to-rose-500',
            },
          ].map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="card-playful p-6 text-center space-y-4"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} mx-auto flex items-center justify-center text-3xl shadow-lg`}
              >
                {feature.emoji}
              </motion.div>
              <h3 className="text-lg font-display font-extrabold text-slate-900">{feature.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 rounded-[32px] p-8 sm:p-12 text-center text-white relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-6 left-[10%] text-3xl opacity-30">⭐</motion.div>
            <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute top-8 right-[15%] text-2xl opacity-25">✨</motion.div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, delay: 2 }} className="absolute bottom-6 left-[30%] text-2xl opacity-25">🌟</motion.div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 space-y-5">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-5xl"
            >
              🚀
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold">
              Ready to Start Your German Adventure?
            </h2>
            <p className="text-base text-white/80 font-semibold max-w-xl mx-auto">
              Join thousands of learners mastering German with fun, interactive lessons. It's free to get started!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block pt-2"
            >
              <Link
                to="/signup"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-violet-700 font-extrabold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                <Sparkles className="w-5 h-5 text-amber-500" />
                Start Learning for Free!
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
