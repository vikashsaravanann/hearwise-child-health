export default function SoundWaveBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-end justify-center gap-1 overflow-hidden opacity-10 pb-20">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="w-2 rounded-full bg-primary animate-sound-wave"
          style={{
            height: `${30 + Math.random() * 60}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${0.8 + Math.random() * 0.8}s`,
          }}
        />
      ))}
    </div>
  );
}
