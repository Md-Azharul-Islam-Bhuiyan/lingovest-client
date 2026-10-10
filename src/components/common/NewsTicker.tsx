const GERMAN_TIPS = [
  '🇩🇪 Goethe-Zertifikat A1 to C2 Curriculum Active!',
  '💡 Fun Fact: German nouns are ALWAYS capitalized — der Hund, die Katze, das Haus!',
  '🎧 Tap the speaker icon 🔊 to hear native German pronunciation!',
  '🇧🇩 বাংলা অনুবাদ ও ব্যাকরণ ব্যাখ্যাসহ সহজে জার্মান ভাষা শিখুন!',
  '🧩 Try interactive sentence puzzles & dictation drills!',
  '⭐ Earn stars by completing vocabulary & quiz challenges!',
];

const NewsTicker = () => {
  return (
    <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white text-xs py-2.5 px-4 overflow-hidden select-none relative">
      {/* Subtle sparkle dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1 left-[10%] w-1 h-1 bg-yellow-300 rounded-full opacity-60 float-anim" />
        <div className="absolute top-2 left-[35%] w-1.5 h-1.5 bg-pink-300 rounded-full opacity-50 float-anim-slow" />
        <div className="absolute top-1 left-[60%] w-1 h-1 bg-cyan-300 rounded-full opacity-60 float-anim-reverse" />
        <div className="absolute top-2 left-[85%] w-1 h-1 bg-yellow-200 rounded-full opacity-50 float-anim" />
      </div>

      <div className="flex whitespace-nowrap animate-marquee items-center gap-10 relative z-10">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-10 items-center">
            {GERMAN_TIPS.map((tip, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-300 shadow-sm shadow-yellow-300/50" />
                <span className="font-bold text-white/95 tracking-wide">
                  {tip}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
