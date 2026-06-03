import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import mascot from '@/assets/owl-mascot.png';
import ChatAssistanceModal from './ChatAssistanceModal';
import { useSession } from '@/contexts/SessionContext';

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { lang } = useSession();

  // Hide on testing screens
  const hideOnPaths = ['/ocean-test', '/active-test', '/headphone-check'];
  if (hideOnPaths.some(p => location.pathname.includes(p))) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white rounded-full p-0 w-16 h-16 shadow-2xl flex items-center justify-center border-4 border-white overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <img 
              src={mascot} 
              alt="Ask Ollie" 
              className="w-10 h-10 object-contain relative z-10 group-hover:scale-110 transition-transform"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0, 1, 0]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-0 right-0 w-4 h-4"
            >
              <MessageCircle className="text-white w-full h-full drop-shadow-md" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <ChatAssistanceModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
