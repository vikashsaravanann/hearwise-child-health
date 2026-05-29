let ctx: AudioContext | null = null;
let waveSource: AudioBufferSourceNode | null = null;
let waveLfo: OscillatorNode | null = null;
let masterGain: GainNode | null = null;
let bubbleTimer: any = null;
let birdTimer: any = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return null;
  
  if (!ctx) {
    ctx = new AudioContextClass();
  }
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

// 1. Synthesize Coastal Ocean Waves
function startOceanWaves(audioCtx: AudioContext, dest: AudioNode) {
  // Create noise buffer
  const sampleRate = audioCtx.sampleRate;
  const bufferSize = sampleRate * 3; // 3 seconds loop
  const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  
  // Low-pass filter to sound like soft rolling waves
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(380, audioCtx.currentTime);
  filter.Q.setValueAtTime(1.5, audioCtx.currentTime);
  
  // Gain for wave volume modulation
  const waveGain = audioCtx.createGain();
  waveGain.gain.setValueAtTime(0.012, audioCtx.currentTime); // Very soft baseline
  
  // LFO (Low Frequency Oscillator) to modulate gain (the ocean wave swell)
  // One wave crests every 12.5 seconds (0.08 Hz)
  const lfo = audioCtx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(0.08, audioCtx.currentTime);
  
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.setValueAtTime(0.008, audioCtx.currentTime); // Wave height modulation depth
  
  // Modulate waveGain.gain with LFO
  lfo.connect(lfoGain);
  lfoGain.connect(waveGain.gain);
  
  // Connect chain
  noise.connect(filter);
  filter.connect(waveGain);
  waveGain.connect(dest);
  
  // Start nodes
  lfo.start();
  noise.start();
  
  waveSource = noise;
  waveLfo = lfo;
}

// 2. Synthesize Water Bubble Pops
function playBubble(audioCtx: AudioContext, dest: AudioNode) {
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    
    const startFreq = 550 + Math.random() * 350; // 550Hz to 900Hz
    const endFreq = startFreq + 250 + Math.random() * 150; // Pitch sweep up
    const duration = 0.08 + Math.random() * 0.12; // 80ms - 200ms duration
    
    osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + duration);
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.003 + Math.random() * 0.003, audioCtx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(dest);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Fail silently
  }
}

// 3. Synthesize seagull chirps
function playSeagull(audioCtx: AudioContext, dest: AudioNode) {
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    
    const startFreq = 1800 + Math.random() * 600; // High frequency chirps
    const duration = 0.25 + Math.random() * 0.15; // 250ms - 400ms duration
    
    // Seagull call pattern: swift sweep up, then slope down
    osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(startFreq + 500, audioCtx.currentTime + 0.04);
    osc.frequency.exponentialRampToValueAtTime(startFreq - 300, audioCtx.currentTime + duration);
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.0015 + Math.random() * 0.0015, audioCtx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(dest);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Fail silently
  }
}

// Public Controls
export function startAmbientSound() {
  try {
    const audioCtx = getContext();
    if (!audioCtx) return;
    
    // Stop any existing session
    stopAmbientSound();
    
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.35, audioCtx.currentTime); // Gentle default master gain
    masterGain.connect(audioCtx.destination);
    
    // 1. Roll Ocean Waves
    startOceanWaves(audioCtx, masterGain);
    
    // 2. Periodic Bubbles (every 1.2 to 2.8 seconds)
    const scheduleBubble = () => {
      const delay = 1200 + Math.random() * 1600;
      bubbleTimer = setTimeout(() => {
        const activeCtx = getContext();
        if (activeCtx && masterGain) {
          playBubble(activeCtx, masterGain);
          scheduleBubble();
        }
      }, delay);
    };
    scheduleBubble();
    
    // 3. Periodic Seagulls (every 6 to 12 seconds)
    const scheduleSeagull = () => {
      const delay = 6000 + Math.random() * 6000;
      birdTimer = setTimeout(() => {
        const activeCtx = getContext();
        if (activeCtx && masterGain) {
          playSeagull(activeCtx, masterGain);
          scheduleSeagull();
        }
      }, delay);
    };
    scheduleSeagull();
    
  } catch (e) {
    console.error('Failed to start ambient audio context:', e);
  }
}

export function stopAmbientSound() {
  try {
    if (bubbleTimer) clearTimeout(bubbleTimer);
    if (birdTimer) clearTimeout(birdTimer);
    
    if (waveSource) {
      waveSource.stop();
      waveSource.disconnect();
      waveSource = null;
    }
    if (waveLfo) {
      waveLfo.stop();
      waveLfo.disconnect();
      waveLfo = null;
    }
    if (masterGain) {
      masterGain.disconnect();
      masterGain = null;
    }
  } catch (e) {
    // Fail silently
  }
}

export function adjustAmbientVolume(volume: number) {
  // Volume scale 0.0 to 1.0
  if (masterGain && ctx) {
    masterGain.gain.linearRampToValueAtTime(volume * 0.4, ctx.currentTime + 0.1);
  }
}
