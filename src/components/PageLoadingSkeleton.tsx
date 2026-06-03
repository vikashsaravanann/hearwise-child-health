import { motion } from 'framer-motion';
import mascot from '@/assets/owl-mascot.png';

export default function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2, 
          ease: "easeInOut" 
        }}
        className="relative"
      >
        <div className="absolute inset-0 bg-blue-200/50 blur-2xl rounded-full" />
        <img src={mascot} alt="Loading..." className="w-32 h-32 object-contain relative z-10" />
      </motion.div>
      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="mt-8 flex flex-col items-center gap-3"
      >
        <div className="h-4 w-48 bg-blue-100 rounded-full overflow-hidden">
          <motion.div 
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="h-full w-1/2 bg-blue-300 rounded-full"
          />
        </div>
        <p className="text-blue-600 font-bold tracking-wide">Loading HearWise...</p>
      </motion.div>
    </div>
  );
}
