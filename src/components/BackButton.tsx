import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate('/')}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.05, x: -3 }}
      whileTap={{ scale: 0.95 }}
      className="group fixed top-5 left-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-teal-500/30 bg-slate-900/80 backdrop-blur-md text-white shadow-lg hover:border-teal-400/60 hover:bg-slate-800/90 transition-all duration-300"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      aria-label="Go back to home"
    >
      {/* Animated arrow */}
      <motion.div
        className="relative w-5 h-5 flex items-center justify-center"
        animate={{ x: 0 }}
        whileHover={{ x: -2 }}
      >
        {/* Left arrow SVG */}
        <svg
          className="w-4 h-4 text-teal-400 group-hover:text-teal-300 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
      </motion.div>

      {/* HearWise mini owl logo */}
      <img
        src="/hearwise-child-health/owl-mascot.png"
        alt=""
        className="w-5 h-5 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />

      {/* Label */}
      <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors tracking-wide">
        HearWise Home
      </span>

      {/* Glowing teal dot indicator */}
      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse ml-0.5" />
    </motion.button>
  );
}
