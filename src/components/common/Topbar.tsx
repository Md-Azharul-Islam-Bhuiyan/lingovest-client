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
    <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-900 text-xs py-2.5 px-4 shadow-md relative overflow-hidden">
      {/* Animated background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full float-anim" />
        <div className="absolute -bottom-6 right-[20%] w-16 h-16 bg-white/10 rounded-full float-anim-slow" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
          <span className="px-3 py-1 rounded-full bg-white/30 backdrop-blur-sm font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <Star className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
            Word of the Day
          </span>
          <span className="font-extrabold text-slate-800 text-sm">
            die Gemütlichkeit
          </span>
          <span className="hidden md:inline text-slate-700/60 font-bold">—</span>
          <span className="text-slate-800 font-bold">
            Cozy contentment 🧡 (আরামদায়ক অনুভূতি)
          </span>
          <button
            onClick={playWordOfTheDay}
            title="Listen German pronunciation"
            className="p-1.5 rounded-full bg-white/40 hover:bg-white/60 text-slate-800 transition-all transform active:scale-90 hover:scale-110 shadow-sm"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link
            to="/vocabulary"
            className="font-extrabold text-slate-800 hover:text-slate-900 flex items-center gap-1.5 bg-white/30 hover:bg-white/50 px-3 py-1 rounded-full transition-all shadow-sm"
          >
            <BookOpen className="w-3 h-3" />
            Explore Words 🚀
          </Link>

          <button
            onClick={() => setShowTopbar(false)}
            className="text-slate-700/60 hover:text-slate-900 p-1 rounded-full hover:bg-white/30 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
