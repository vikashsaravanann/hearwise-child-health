import { motion } from 'framer-motion';
import { useState } from 'react';

interface VideoCardProps {
  title: string;
  description: string;
  duration: string;
  category: string;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  stats?: { label: string; value: string }[];
}

export default function VideoCard({
  title, description, duration, category, icon,
  gradientFrom, gradientTo, stats = []
}: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative rounded-2xl overflow-hidden border border-white/10 cursor-pointer group"
      style={{ aspectRatio: '16/9', minHeight: '240px' }}
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          opacity: isHovered ? 1 : 0.85
        }}
      />

      {/* Animated wave lines at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden opacity-20">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="absolute bottom-0 left-0 right-0 h-8 border-t border-white/30 rounded-full"
            style={{
              transform: `translateY(${i * 8}px)`,
              animation: `pulse ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-white/30"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`
          }}
          animate={{
            y: [-8, 8, -8],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 2 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-black uppercase tracking-widest">
            {category}
          </span>
          <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white/80 text-xs font-semibold">
            {duration}
          </span>
        </div>

        {/* Center play button */}
        <div className="flex items-center justify-center">
          <motion.div
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center"
            animate={{ scale: isHovered ? 1.15 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl">{icon}</div>
          </motion.div>
        </div>

        {/* Bottom content */}
        <div>
          <h3 className="text-white font-black text-lg uppercase leading-tight mb-2 drop-shadow-lg">
            {title}
          </h3>
          <p className="text-white/80 text-xs leading-relaxed mb-3 line-clamp-2">
            {description}
          </p>
          {stats.length > 0 && (
            <div className="flex gap-4">
              {stats.map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-white font-black text-sm">{s.value}</div>
                  <div className="text-white/60 text-xs uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* COMING SOON ribbon */}
      <div className="absolute top-4 right-4 z-20">
        <motion.div
          className="px-3 py-1 rounded-full bg-teal-400/90 text-black text-xs font-black uppercase tracking-widest shadow-lg"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          COMING SOON
        </motion.div>
      </div>
    </motion.div>
  );
}
