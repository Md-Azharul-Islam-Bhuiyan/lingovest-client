import { useState } from 'react';
import { Volume2, X, Sparkles, BookOpen, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Topbar = () => {
  const [showTopbar, setShowTopbar] = useState(true);

  if (!showTopbar) return null;

  const playWordOfTheDay = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance('die Gemütlichkeit');
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-900 text-xs py-1.5 sm:py-2 px-3 sm:px-4 shadow-sm relative overflow-hidden">
      {/* Animated background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full float-anim" />
        <div className="absolute -bottom-6 right-[20%] w-16 h-16 bg-white/10 rounded-full float-anim-slow" />
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap min-w-0 pr-6 sm:pr-0">
          <span className="px-2 sm:px-3 py-0.5 rounded-full bg-white/30 backdrop-blur-sm font-extrabold text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-1 shadow-sm shrink-0">
            <Star className="w-3 h-3 text-amber-800 fill-amber-800" />
            <span className="hidden xs:inline">Word of the Day</span>
            <span className="xs:hidden">Wort</span>
          </span>
          <span className="font-extrabold text-slate-900 text-xs sm:text-sm shrink-0">
            die Gemütlichkeit
          </span>
          <button
            onClick={playWordOfTheDay}
            title="Listen German pronunciation"
            className="p-1 rounded-full bg-white/40 hover:bg-white/60 text-slate-800 transition-all transform active:scale-90 hover:scale-110 shadow-sm shrink-0"
          >
            <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
          <span className="hidden md:inline text-slate-700/60 font-bold">—</span>
          <span className="text-slate-800 font-bold text-[11px] sm:text-xs truncate hidden sm:inline">
            Cozy contentment 🧡 (আরামদায়ক অনুভূতি)
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
          <Link
            to="/vocabulary"
            className="hidden sm:inline-flex font-extrabold text-slate-800 hover:text-slate-900 items-center gap-1 bg-white/30 hover:bg-white/50 px-2.5 py-0.5 rounded-full transition-all shadow-sm text-[11px]"
          >
            <BookOpen className="w-3 h-3" />
            Explore 🚀
          </Link>

          <button
            onClick={() => setShowTopbar(false)}
            title="Dismiss"
            className="text-slate-800/70 hover:text-slate-900 p-1 rounded-full hover:bg-white/30 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
