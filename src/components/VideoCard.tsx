import React from 'react';
import { Play } from 'lucide-react';

interface VideoCardProps {
  thumbnailColor: string;
  title: string;
  description: string;
  duration: string;
  icon?: string;
  onClick: () => void;
}

export default function VideoCard({
  thumbnailColor,
  title,
  description,
  duration,
  icon,
  onClick
}: VideoCardProps) {
  return (
    <div 
      className="group cursor-pointer rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-teal-500/50 transition-all shadow-lg hover:shadow-xl hover:shadow-teal-900/20 flex flex-col"
      onClick={onClick}
    >
      <div className={`relative aspect-video w-full ${thumbnailColor} flex items-center justify-center overflow-hidden`}>
        {/* Placeholder Icon */}
        {icon && (
          <div className="absolute text-7xl opacity-20 transform group-hover:scale-110 transition-transform duration-700">
            {icon}
          </div>
        )}
        
        {/* Duration Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm z-10">
          {duration}
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10 flex items-center justify-center">
          <div className="w-[56px] h-[56px] rounded-full bg-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="text-teal-600 w-6 h-6 ml-1" fill="currentColor" />
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-white font-bold text-lg leading-tight mb-2 font-['Syne']">
          {title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}
