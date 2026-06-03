let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

// Helper to create white noise for the water/ocean wave effect
function createNoiseBuffer(ctx: AudioContext, duration: number) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

export function playTone(
  frequency: number,
  ear: 'left' | 'right',
  duration: number = 1.5
): Promise<void> {
  return new Promise((resolve) => {
    const ctx = getAudioContext();
    
    // --- 1. THE PURE TONE (Medical Test) ---
    const oscillator = ctx.createOscillator();
    const toneGain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    // Fade in/out for pure tone to avoid clicking
    toneGain.gain.setValueAtTime(0, ctx.currentTime);
    toneGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.1);
    toneGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + duration - 0.1);
    toneGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    // --- 2. WATER / OCEAN WAVE SOUND ---
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = createNoiseBuffer(ctx, duration);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    // Sweep the filter to sound like a wave washing in and out
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + duration / 2);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + duration);
    
    const waveGain = ctx.createGain();
    waveGain.gain.setValueAtTime(0, ctx.currentTime);
    waveGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + duration / 2); // Subtle wave volume
    waveGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    // --- 3. BIRD CHIRP SOUND ---
    const birdOsc = ctx.createOscillator();
    birdOsc.type = 'sine';
    // First chirp
    birdOsc.frequency.setValueAtTime(2500, ctx.currentTime);
    birdOsc.frequency.exponentialRampToValueAtTime(3500, ctx.currentTime + 0.1);
    // Second chirp
    birdOsc.frequency.setValueAtTime(2500, ctx.currentTime + 0.3);
    birdOsc.frequency.exponentialRampToValueAtTime(3800, ctx.currentTime + 0.45);
    
    const birdGain = ctx.createGain();
    birdGain.gain.setValueAtTime(0, ctx.currentTime);
    // First chirp volume envelope
    birdGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
    birdGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
    // Second chirp volume envelope
    birdGain.gain.setValueAtTime(0, ctx.currentTime + 0.3);
    birdGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.35);
    birdGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

    // --- ROUTING ---
    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(ear === 'left' ? -1 : 1, ctx.currentTime);

    // Connect Medical Tone
    oscillator.connect(toneGain);
    toneGain.connect(panner);
    
    // Connect Water Sound
    noiseSource.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(panner);
    
    // Connect Bird Sound
    birdOsc.connect(birdGain);
    birdGain.connect(panner);
    
    // Connect to Speakers
    panner.connect(ctx.destination);

    // Start everything
    oscillator.start(ctx.currentTime);
    noiseSource.start(ctx.currentTime);
    birdOsc.start(ctx.currentTime);
    
    oscillator.stop(ctx.currentTime + duration);
    noiseSource.stop(ctx.currentTime + duration);
    birdOsc.stop(ctx.currentTime + duration);

    oscillator.onended = () => resolve();
  });
}

export function playSampleTone(): Promise<void> {
  return new Promise((resolve) => {
    const ctx = getAudioContext();
    const frequencies = [440, 554, 659]; // A4, C#5, E5
    const noteDuration = 0.2;
    const gap = 0.05;
    const startTime = ctx.currentTime;

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      const noteStart = startTime + i * (noteDuration + gap);
      const noteEnd = noteStart + noteDuration;

      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.5, noteStart + 0.05);
      gain.gain.linearRampToValueAtTime(0.5, noteEnd - 0.05);
      gain.gain.linearRampToValueAtTime(0, noteEnd);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteEnd);

      if (i === frequencies.length - 1) {
        osc.onended = () => resolve();
      }
    });
  });
}

export const TEST_FREQUENCIES = [500, 1000, 2000, 4000, 8000] as const;
export type TestFrequency = typeof TEST_FREQUENCIES[number];