import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlayCircle } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  youtubeId: string;
}

export default function VideoModal({ isOpen, onClose, youtubeId }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const isPlaceholder = youtubeId.startsWith('PLACEHOLDER_');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-[900px] w-[90vw] aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            {isPlaceholder ? (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-slate-800 to-slate-900 w-full h-full">
                <PlayCircle size={64} className="text-teal-500 mb-6 opacity-50" />
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  🎬 Video coming soon
                </h3>
                <p className="text-slate-300 text-lg max-w-md mb-8">
                  HearWise is currently producing this content. Stay tuned!
                </p>
                <a 
                  href="https://hearwise.in" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Subscribe for updates &rarr; hearwise.in
                </a>
              </div>
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                title="HearWise Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
