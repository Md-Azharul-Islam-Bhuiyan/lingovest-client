// client/src/components/mascot/FelixMascot.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, Heart, Award } from 'lucide-react';

export type MascotState =
  | 'idle'
  | 'happy'
  | 'thinking'
  | 'explaining'
  | 'encouraging'
  | 'celebrating'
  | 'hint';

interface FelixMascotProps {
  state?: MascotState;
  speechText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onMascotClick?: () => void;
  showBadge?: boolean;
}

export const FelixMascot: React.FC<FelixMascotProps> = ({
  state = 'idle',
  speechText,
  size = 'md',
  className = '',
  onMascotClick,
  showBadge = true,
}) => {
  const sizeMap = {
    sm: { width: 64, height: 64, bubbleMax: 'max-w-[180px]', text: 'text-xs' },
    md: { width: 100, height: 100, bubbleMax: 'max-w-[240px]', text: 'text-sm' },
    lg: { width: 140, height: 140, bubbleMax: 'max-w-[280px]', text: 'text-base' },
    xl: { width: 180, height: 180, bubbleMax: 'max-w-[320px]', text: 'text-base' },
  };

  const currentSize = sizeMap[size];

  // Head and body animation variants based on state
  const headVariants: any = {
    idle: {
      y: [0, -3, 0],
      rotate: [0, 1.5, 0, -1.5, 0],
      transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
    },
    happy: {
      y: [0, -8, 0],
      rotate: [0, -4, 4, 0],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
    },
    thinking: {
      rotate: [0, -8, -6],
      y: [0, 2, 0],
      transition: { duration: 2, repeat: Infinity, repeatType: 'reverse' as const },
    },
    explaining: {
      rotate: [0, 5, 0],
      y: [0, -2, 0],
      transition: { duration: 1.8, repeat: Infinity, repeatType: 'reverse' as const },
    },
    encouraging: {
      scale: [1, 1.05, 1],
      rotate: [0, -3, 3, 0],
      transition: { duration: 1.2, repeat: Infinity },
    },
    celebrating: {
      y: [0, -14, 0],
      rotate: [0, -10, 10, -5, 5, 0],
      transition: { duration: 0.9, repeat: Infinity },
    },
    hint: {
      scale: [1, 1.04, 1],
      transition: { duration: 1.5, repeat: Infinity },
    },
  };

  // Ear wiggle animation
  const earVariants = {
    idle: { rotate: [0, 2, -2, 0], transition: { duration: 4, repeat: Infinity } },
    happy: { rotate: [0, 8, -8, 0], transition: { duration: 0.6, repeat: Infinity } },
    celebrating: { rotate: [0, 12, -12, 0], transition: { duration: 0.5, repeat: Infinity } },
  };

  return (
    <div className={`relative inline-flex items-center gap-3 select-none ${className}`}>
      {/* Mascot Graphic */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
        onClick={onMascotClick}
        className="relative cursor-pointer shrink-0"
        style={{ width: currentSize.width, height: currentSize.height }}
      >
        {/* Glow behind mascot in celebratory or hint states */}
        {state === 'celebrating' && (
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -inset-3 bg-gradient-to-r from-amber-400/30 via-pink-400/30 to-violet-400/30 rounded-full blur-xl"
          />
        )}
        {state === 'hint' && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="absolute -inset-2 bg-amber-300/40 rounded-full blur-lg"
          />
        )}

        {/* Custom SVG Illustration of Felix der Fuchs */}
        <motion.svg
          variants={headVariants}
          animate={state}
          viewBox="0 0 160 160"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            {/* Gradients for warm fox fur */}
            <linearGradient id="foxFur" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="60%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
            <linearGradient id="foxBelly" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="100%" stopColor="#FEF3C7" />
            </linearGradient>
            <linearGradient id="foxEarInner" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Left Ear */}
          <motion.path
            variants={earVariants}
            animate={state === 'celebrating' || state === 'happy' ? state : 'idle'}
            d="M 45 60 L 25 20 C 35 25 55 40 60 55 Z"
            fill="url(#foxFur)"
          />
          <path d="M 43 55 L 32 28 C 38 32 50 42 53 52 Z" fill="url(#foxEarInner)" />

          {/* Right Ear */}
          <motion.path
            variants={earVariants}
            animate={state === 'celebrating' || state === 'happy' ? state : 'idle'}
            d="M 115 60 L 135 20 C 125 25 105 40 100 55 Z"
            fill="url(#foxFur)"
          />
          <path d="M 117 55 L 128 28 C 122 32 110 42 107 52 Z" fill="url(#foxEarInner)" />

          {/* Fox Head Base */}
          <ellipse cx="80" cy="85" rx="55" ry="48" fill="url(#foxFur)" filter="url(#shadow)" />

          {/* White Cheeks */}
          <path
            d="M 30 92 C 30 115 50 128 80 128 C 110 128 130 115 130 92 C 120 98 105 102 80 102 C 55 102 40 98 30 92 Z"
            fill="url(#foxBelly)"
          />
          <path
            d="M 30 92 C 40 70 65 80 80 92 C 95 80 120 70 130 92 C 115 105 95 110 80 110 C 65 110 45 105 30 92 Z"
            fill="url(#foxBelly)"
            opacity="0.9"
          />

          {/* Eyes based on state */}
          {state === 'happy' || state === 'celebrating' ? (
            // Smiling shut eyes (joyful arcs)
            <g stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" fill="none">
              <path d="M 52 82 Q 62 72 72 82" />
              <path d="M 88 82 Q 98 72 108 82" />
            </g>
          ) : state === 'thinking' ? (
            // Looking up-right thinking eyes
            <g fill="#1E293B">
              <circle cx="62" cy="78" r="6" />
              <circle cx="98" cy="75" r="6" />
              <circle cx="64" cy="76" r="2.2" fill="#FFFFFF" />
              <circle cx="100" cy="73" r="2.2" fill="#FFFFFF" />
              {/* Curious Eyebrows */}
              <path d="M 54 70 Q 62 65 70 71" stroke="#7C2D12" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 90 68 Q 98 62 106 66" stroke="#7C2D12" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            // Big friendly open eyes with sparkles
            <g fill="#0F172A">
              <circle cx="60" cy="80" r="7.5" />
              <circle cx="100" cy="80" r="7.5" />
              {/* Eye highlights */}
              <circle cx="62.5" cy="77.5" r="2.8" fill="#FFFFFF" />
              <circle cx="58" cy="82" r="1.4" fill="#FFFFFF" />
              <circle cx="102.5" cy="77.5" r="2.8" fill="#FFFFFF" />
              <circle cx="98" cy="82" r="1.4" fill="#FFFFFF" />
            </g>
          )}

          {/* Cute Cute Fox Snout / Nose */}
          <path
            d="M 74 97 C 74 94 86 94 86 97 C 86 101 80 105 80 105 C 80 105 74 101 74 97 Z"
            fill="#0F172A"
          />

          {/* Mouth */}
          {state === 'happy' || state === 'celebrating' ? (
            <path
              d="M 72 106 Q 80 118 88 106"
              stroke="#0F172A"
              strokeWidth="3.5"
              fill="#E11D48"
              strokeLinecap="round"
            />
          ) : state === 'explaining' ? (
            <path
              d="M 74 106 Q 80 113 86 106"
              stroke="#0F172A"
              strokeWidth="3"
              fill="#E11D48"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M 74 106 Q 80 112 86 106"
              stroke="#0F172A"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Cheerful Blush */}
          <circle cx="44" cy="94" r="7" fill="#F43F5E" opacity="0.35" />
          <circle cx="116" cy="94" r="7" fill="#F43F5E" opacity="0.35" />

          {/* Party Hat when Celebrating */}
          {state === 'celebrating' && (
            <g>
              <polygon points="80,18 68,54 92,54" fill="#8B5CF6" />
              <polygon points="80,24 72,54 88,54" fill="#F59E0B" />
              <circle cx="80" cy="18" r="5" fill="#EC4899" />
            </g>
          )}

          {/* Little Scholar Glasses when Explaining */}
          {state === 'explaining' && (
            <g stroke="#334155" strokeWidth="2.5" fill="none">
              <circle cx="60" cy="80" r="11" fill="rgba(255,255,255,0.25)" />
              <circle cx="100" cy="80" r="11" fill="rgba(255,255,255,0.25)" />
              <line x1="71" y1="80" x2="89" y2="80" />
            </g>
          )}
        </motion.svg>

        {/* Small floating status icon indicator */}
        {showBadge && (
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md border border-slate-100 flex items-center justify-center">
            {state === 'celebrating' && <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
            {state === 'hint' && <Lightbulb className="w-3.5 h-3.5 text-amber-500" />}
            {state === 'happy' && <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />}
            {state === 'explaining' && <Award className="w-3.5 h-3.5 text-violet-500" />}
            {state === 'thinking' && <span className="text-[10px] leading-none">💭</span>}
            {state === 'encouraging' && <span className="text-[10px] leading-none">💪</span>}
            {state === 'idle' && <span className="text-[10px] leading-none">🦊</span>}
          </div>
        )}
      </motion.div>

      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        {speechText && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`relative bg-white text-slate-800 px-4 py-2.5 rounded-2xl shadow-lg border border-violet-100 ${currentSize.bubbleMax}`}
          >
            {/* Bubble Tail pointing to mascot */}
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-white drop-shadow-[-1px_0_1px_rgba(0,0,0,0.05)]" />

            <div className="flex items-start gap-1.5">
              <span className="font-bold text-xs uppercase tracking-wider text-orange-600 shrink-0">
                Felix:
              </span>
              <p className={`font-medium ${currentSize.text} leading-snug text-slate-700`}>
                {speechText}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FelixMascot;
