import { Ear } from 'lucide-react';

interface OwlIconProps {
  mood?: 'happy' | 'thoughtful' | 'concerned' | 'default';
  size?: number;
}

export default function OwlIcon({ mood = 'default', size = 80 }: OwlIconProps) {
  const colors = {
    happy: { body: '#27AE60', eyes: '#fff' },
    thoughtful: { body: '#F2C94C', eyes: '#fff' },
    concerned: { body: '#EB5757', eyes: '#fff' },
    default: { body: '#2F80ED', eyes: '#fff' },
  };
  const c = colors[mood];

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Body */}
      <ellipse cx="50" cy="58" rx="35" ry="38" fill={c.body} opacity="0.9" />
      {/* Ears/Tufts */}
      <path d="M25 30 L30 10 L40 28" fill={c.body} />
      <path d="M75 30 L70 10 L60 28" fill={c.body} />
      {/* Face circle */}
      <ellipse cx="50" cy="52" rx="25" ry="22" fill="#fff" opacity="0.9" />
      {/* Eyes */}
      <circle cx="40" cy="48" r="8" fill={c.body} />
      <circle cx="60" cy="48" r="8" fill={c.body} />
      <circle cx="40" cy="48" r="4" fill={c.eyes} />
      <circle cx="60" cy="48" r="4" fill={c.eyes} />
      {/* Pupils */}
      <circle cx={mood === 'concerned' ? 41 : 40} cy="48" r="2" fill="#333" />
      <circle cx={mood === 'concerned' ? 61 : 60} cy="48" r="2" fill="#333" />
      {/* Beak */}
      <path d="M46 56 L50 63 L54 56" fill="#F2994A" />
      {/* Mouth expression */}
      {mood === 'happy' && <path d="M42 67 Q50 73 58 67" stroke="#666" strokeWidth="1.5" fill="none" />}
      {mood === 'thoughtful' && <line x1="43" y1="68" x2="57" y2="68" stroke="#666" strokeWidth="1.5" />}
      {mood === 'concerned' && <path d="M42 70 Q50 65 58 70" stroke="#666" strokeWidth="1.5" fill="none" />}
      {/* Sound waves */}
      <path d="M85 45 Q92 50 85 55" stroke={c.body} strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M90 40 Q100 50 90 60" stroke={c.body} strokeWidth="2" fill="none" opacity="0.4" />
    </svg>
  );
}
