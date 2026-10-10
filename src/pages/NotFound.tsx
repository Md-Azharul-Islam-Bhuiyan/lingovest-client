import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-animated-gradient flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-[15%] left-[10%] text-5xl opacity-15">📚</motion.div>
        <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }} className="absolute top-[25%] right-[15%] text-4xl opacity-10">🇩🇪</motion.div>
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 7, repeat: Infinity, delay: 2 }} className="absolute bottom-[20%] left-[25%] text-4xl opacity-10">✨</motion.div>
        <motion.div animate={{ y: [0, 18, 0] }} transition={{ duration: 8, repeat: Infinity, delay: 3 }} className="absolute bottom-[30%] right-[20%] text-3xl opacity-10">🧩</motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="text-center space-y-6 max-w-lg relative z-10"
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, 0], y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-8xl sm:text-9xl"
        >
          🗺️
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-6xl sm:text-7xl font-display font-extrabold gradient-text-rainbow">
            404
          </h1>
          <h2 className="text-2xl font-display font-extrabold text-slate-800">
            Oops! Page Not Found
          </h2>
          <p className="text-sm text-slate-500 font-semibold leading-relaxed">
            Looks like this page went on a German adventure and got lost! 🏔️ Let's get you back to learning.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-extrabold text-sm shadow-lg shadow-violet-500/30 transition-all"
            >
              <Home className="w-4 h-4" />
              Back to Home 🏠
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-violet-200 text-violet-600 font-extrabold text-sm hover:bg-violet-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
