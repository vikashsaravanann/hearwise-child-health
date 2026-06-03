import { motion } from 'framer-motion';

interface LoaderProps {
  fullscreen?: boolean;
  text?: string;
}

export default function Loader({ fullscreen = false, text = 'LOADING' }: LoaderProps) {
  const dots = [0, 1, 2];

  const content = (
    <div className="flex flex-col items-center justify-center gap-5">

      {/* 3-dot loader */}
      <div className="flex items-center gap-2">
        {dots.map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-teal-400"
            animate={{
              y: [0, -8, 0],
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.18,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Text */}
      <motion.p
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-slate-500 text-xs uppercase tracking-[0.3em] font-semibold"
      >
        {text}
      </motion.p>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      {content}
    </div>
  );
}
