import React from 'react';
import OceanBackground from '@/components/OceanBackground';
import AnimatedOwl, { type OwlState } from '@/components/owl/AnimatedOwl';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import LanguageToggle from '@/components/LanguageToggle';

interface PageWrapperProps {
  children: React.ReactNode;
  /** Page title shown in header */
  title?: string;
  owlState?: OwlState;
  owlSpeech?: string | null;
  /** Show back button */
  showBack?: boolean;
  backTo?: string;
  /** Extra content above children (e.g. subtitle) */
  subtitle?: string;
}

/**
 * Shared wrapper: ocean background, top nav with back button, owl mascot corner, language toggle.
 * Used by all 12 new pages for consistent layout.
 */
export default function PageWrapper({
  children,
  title,
  owlState = 'idle',
  owlSpeech,
  showBack = true,
  backTo = '/',
  subtitle,
}: PageWrapperProps) {
  const navigate = useNavigate();
  const { lang } = useSession();

  return (
    <div className="page-shell relative min-h-screen">
      <OceanBackground />

      {/* Top nav bar */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
        style={{ background: 'rgba(0,100,180,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(backTo)}
              className="p-2 rounded-full bg-white/20 text-white font-bold hover:bg-white/30 transition-all active:scale-90 text-sm"
            >
              ← {lang === 'ta' ? 'திரும்பு' : 'Back'}
            </button>
          )}
          {title && (
            <div>
              <h1 className="font-black text-white text-lg leading-tight" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {title}
              </h1>
              {subtitle && <p className="text-white/70 text-xs">{subtitle}</p>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button onClick={() => navigate('/')} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all text-white text-lg">
            🏠
          </button>
        </div>
      </div>

      {/* Owl in corner */}
      <div className="fixed bottom-20 right-4 z-20 hidden sm:block">
        <AnimatedOwl state={owlState} size={64} speechBubble={owlSpeech ?? undefined} />
      </div>

      {/* Page content */}
      <div className="relative z-10 pt-20 pb-24 px-4">
        {children}
      </div>
    </div>
  );
}
