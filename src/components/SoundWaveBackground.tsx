export default function SoundWaveBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -right-16 top-32 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-1 pb-16 opacity-20">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full bg-primary animate-sound-wave"
            style={{
              height: `${20 + Math.random() * 80}px`,
              animationDelay: `${i * 0.08}s`,
              animationDuration: `${0.7 + Math.random() * 1.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
