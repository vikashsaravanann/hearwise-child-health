import { motion } from 'framer-motion';

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
  title,
  description,
  duration,
  category,
  icon,
  gradientFrom,
  gradientTo,
  stats = [],
}: VideoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ duration: 0.25 }}
      className="relative rounded-2xl overflow-hidden border border-white/10 cursor-pointer group bg-[#0d1a2a] flex flex-col"
      style={{ minHeight: '0' }}
    >
      {/* ── Thumbnail (16:9) ───────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ paddingTop: '56.25%' /* 16:9 */ }}
      >
        {/* gradient fill */}
        <div
          className="absolute inset-0 transition-all duration-500 group-hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
        />

        {/* subtle animated noise overlay */}
        <div className="absolute inset-0 opacity-[0.08] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

        {/* floating particles */}
        {[0.15, 0.55, 0.35, 0.75, 0.25].map((x, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            style={{ left: `${x * 100}%`, top: `${(0.2 + i * 0.15) * 100}%` }}
            animate={{ y: [-6, 6, -6], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        {/* category badge — top left */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/90 text-[10px] font-black uppercase tracking-widest">
            {category}
          </span>
        </div>

        {/* coming soon + duration — top right */}
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="px-2 py-0.5 rounded-full bg-teal-400/90 text-black text-[9px] font-black uppercase tracking-widest shadow"
          >
            COMING SOON
          </motion.span>
          <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white/80 text-[10px] font-semibold">
            {duration}
          </span>
        </div>

        {/* centre play button */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-xl"
            whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.25)' }}
            transition={{ duration: 0.18 }}
          >
            {/* play triangle */}
            <svg className="w-6 h-6 ml-1" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.div>
        </div>

        {/* large icon — bottom-right decoration */}
        <div className="absolute bottom-3 right-4 text-4xl opacity-20 select-none pointer-events-none">
          {icon}
        </div>
      </div>

      {/* ── Info panel ─────────────────────────────────── */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className="text-white font-black text-sm uppercase leading-tight tracking-wide line-clamp-2">
          {title}
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>

        {stats.length > 0 && (
          <div className="flex gap-4 mt-1 pt-3 border-t border-white/5">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-teal-400 font-black text-sm">{s.value}</div>
                <div className="text-slate-600 text-[10px] uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
