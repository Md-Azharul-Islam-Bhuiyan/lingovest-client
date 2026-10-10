import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Volume1, RotateCw, Undo2, Sparkles } from 'lucide-react';
import { getVocabularyImage } from '@/utils/vocabularyImages';

export interface TVocabularyItem {
  id: string;
  word: string;
  normalizedWord?: string;
  article?: string | null;
  plural?: string | null;
  level: string;
  topic: string;
  meaningEn: string;
  meaningBn: string;
  exampleGerman?: string | null;
  exampleTranslationEn?: string | null;
  exampleTranslationBn?: string | null;
  partOfSpeech?: string | null;
  imageUrl?: string | null;
}

interface VocabularyFlashcardProps {
  item: TVocabularyItem;
  index?: number;
  flipped?: boolean;
  onToggleFlip?: (id: string) => void;
  playSpeech: (text: string, rate?: number) => void;
}

const LEVEL_EMOJIS: Record<string, string> = {
  ALL: '🌍',
  A1: '🌱',
  A2: '🌿',
  B1: '🌳',
  B2: '🎯',
  C1: '🔥',
  C2: '🏆',
};

export const VocabularyFlashcard: React.FC<VocabularyFlashcardProps> = ({
  item,
  index = 0,
  flipped: controlledFlipped,
  onToggleFlip,
  playSpeech,
}) => {
  // Can be controlled or uncontrolled
  const [internalFlipped, setInternalFlipped] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isFlipped = controlledFlipped !== undefined ? controlledFlipped : internalFlipped;

  const handleCardClick = () => {
    if (onToggleFlip) {
      onToggleFlip(item.id);
    } else {
      setInternalFlipped((prev) => !prev);
    }
  };

  const article = (item.article || '').toLowerCase().trim();
  const articleStyle =
    article === 'der'
      ? 'bg-blue-500 text-white border-blue-600 shadow-blue-500/25'
      : article === 'die'
      ? 'bg-pink-500 text-white border-pink-600 shadow-pink-500/25'
      : article === 'das'
      ? 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/25'
      : 'bg-slate-700 text-white border-slate-800 shadow-slate-700/25';

  const articleEmoji = article === 'der' ? '💙' : article === 'die' ? '💖' : article === 'das' ? '💚' : '📝';

  const imageUrl = getVocabularyImage({
    word: item.word,
    meaningEn: item.meaningEn,
    topic: item.topic,
    imageUrl: item.imageUrl || undefined,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.4) }}
      className="flashcard-perspective w-full h-[460px] select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={handleCardClick}
        className={`flashcard-inner cursor-pointer rounded-[26px] ${
          isFlipped ? 'is-flipped' : ''
        }`}
      >
        {/* ========================================================
            FRONT SIDE (Picture + German Word + Audio + Flip Prompt)
           ======================================================== */}
        <div className="flashcard-face bg-white rounded-[26px] border-2 border-violet-100 hover:border-violet-300 shadow-playful hover:shadow-float transition-all duration-300 overflow-hidden flex flex-col justify-between">
          <div>
            {/* Image Container with Badges */}
            <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gradient-to-tr from-violet-100 via-purple-50 to-pink-100">
              {!imgError ? (
                <img
                  src={imageUrl}
                  alt={item.word}
                  loading="lazy"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{
                    transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-violet-500 via-purple-600 to-pink-500 text-white">
                  <span className="text-4xl mb-1">🇩🇪</span>
                  <p className="font-extrabold text-sm tracking-wide">{item.word}</p>
                </div>
              )}

              {/* Gradient overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

              {/* Top Left: CEFR Level */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-white/90 backdrop-blur-md text-slate-900 shadow-md flex items-center gap-1">
                  <span>{LEVEL_EMOJIS[item.level] || '📊'}</span>
                  <span>{item.level}</span>
                </span>
                {item.partOfSpeech && (
                  <span className="hidden sm:inline-block px-2 py-1 rounded-full text-[10px] font-extrabold bg-slate-900/70 backdrop-blur-md text-white">
                    {item.partOfSpeech}
                  </span>
                )}
              </div>

              {/* Top Right: Gender Article Badge */}
              <div className="absolute top-3 right-3">
                {article ? (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1 border ${articleStyle}`}
                  >
                    <span>{articleEmoji}</span>
                    <span>{article}</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-white/90 text-violet-700 shadow-md">
                    Wort
                  </span>
                )}
              </div>

              {/* Bottom Overlaid Topic */}
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-bold pointer-events-none">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900/60 backdrop-blur-md text-[11px] font-extrabold truncate max-w-[80%]">
                  📂 {item.topic}
                </span>
                <span className="text-amber-300 drop-shadow text-sm">✨</span>
              </div>
            </div>

            {/* German Word Section */}
            <div className="p-4 sm:p-5 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {article && (
                      <span
                        className={`text-sm sm:text-base font-extrabold uppercase tracking-wide ${
                          article === 'der'
                            ? 'text-blue-600'
                            : article === 'die'
                            ? 'text-pink-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {article}
                      </span>
                    )}
                    <h3 className="text-2xl sm:text-[26px] font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                      {item.word}
                    </h3>
                  </div>

                  {item.plural && (
                    <p className="text-xs font-bold text-slate-500 mt-1">
                      Plural: <span className="font-extrabold text-slate-800">die {item.plural}</span>
                    </p>
                  )}
                </div>

                {/* Audio Buttons */}
                <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => playSpeech(item.word, 1.0)}
                    title="Normal Native Pronunciation 🔊"
                    className="p-2.5 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-700 transition-colors shadow-sm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => playSpeech(item.word, 0.7)}
                    title="Slow Speed Pronunciation 🐢"
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-violet-100 text-slate-600 hover:text-violet-700 transition-colors shadow-sm"
                  >
                    <Volume1 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Flip Trigger Hint */}
          <div className="p-4 pt-0">
            <div className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-violet-500/20 group-hover:from-violet-700 group-hover:to-pink-700 transition-all">
              <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Click to reveal Meaning & Beispielsatz</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            BACK SIDE (Meaning + Beispielsatz + Translations)
           ======================================================== */}
        <div className="flashcard-face flashcard-back bg-gradient-to-b from-white via-violet-50/40 to-white rounded-[26px] border-2 border-violet-300 shadow-float p-5 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-3.5">
            {/* Header Reminder: Word + CEFR + Audio */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-violet-100">
              <div className="flex items-center gap-2 min-w-0">
                {article && (
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-black uppercase text-white ${
                      article === 'der'
                        ? 'bg-blue-600'
                        : article === 'die'
                        ? 'bg-pink-600'
                        : 'bg-emerald-600'
                    }`}
                  >
                    {article}
                  </span>
                )}
                <span className="font-display font-extrabold text-slate-900 text-lg truncate">
                  {item.word}
                </span>
                <span className="text-xs font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full shrink-0">
                  {item.level}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => playSpeech(item.word, 1.0)}
                  title="Listen again 🔊"
                  className="p-1.5 rounded-lg bg-violet-100 hover:bg-violet-200 text-violet-700"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </motion.button>
                <span className="text-xs text-slate-400 font-bold">↩️ Flip</span>
              </div>
            </div>

            {/* Meanings */}
            <div className="space-y-2">
              {/* English Meaning */}
              <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-start gap-2.5">
                <span className="px-1.5 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-black uppercase shrink-0">
                  EN
                </span>
                <p className="text-sm font-extrabold text-slate-900 leading-snug">
                  {item.meaningEn}
                </p>
              </div>

              {/* Bengali Meaning */}
              <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-2.5">
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-black uppercase shrink-0">
                  বাংলা
                </span>
                <p className="text-sm font-bold text-emerald-950 font-['Hind_Siliguri',sans-serif] leading-snug">
                  {item.meaningBn}
                </p>
              </div>
            </div>

            {/* Beispielsatz (Example Sentence in German) */}
            {item.exampleGerman ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-100/70 via-purple-50 to-pink-50 border-2 border-violet-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-violet-700">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Beispielsatz
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      playSpeech(item.exampleGerman || '', 0.9);
                    }}
                    title="Listen to full example sentence 🔊"
                    className="p-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 shadow-sm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </motion.button>
                </div>

                {/* German Sentence */}
                <p className="text-xs sm:text-sm font-extrabold text-slate-900 italic leading-relaxed">
                  "{item.exampleGerman}"
                </p>

                {/* Bengali Sentence Translation */}
                {item.exampleTranslationBn && (
                  <p className="text-xs font-bold text-violet-900 font-['Hind_Siliguri',sans-serif] pt-1 border-t border-violet-200/60">
                    → {item.exampleTranslationBn}
                  </p>
                )}

                {/* English Sentence Translation */}
                {item.exampleTranslationEn && (
                  <p className="text-[11px] font-medium text-slate-600">
                    → {item.exampleTranslationEn}
                  </p>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400 font-bold">
                Kein Beispielsatz verfügbar
              </div>
            )}
          </div>

          {/* Bottom Flip Back Button */}
          <div className="pt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-violet-100 text-slate-700 hover:text-violet-800 text-xs font-extrabold flex items-center justify-center gap-2 border border-slate-200 transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Tap to flip back</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VocabularyFlashcard;
