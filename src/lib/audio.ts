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

export function playTone(
  frequency: number,
  ear: 'left' | 'right',
  duration: number = 1.5
): Promise<void> {
  return new Promise((resolve) => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const panner = ctx.createStereoPanner();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    panner.pan.setValueAtTime(ear === 'left' ? -1 : 1, ctx.currentTime);

    // Fade in/out to avoid clicks
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(1, ctx.currentTime + duration - 0.05);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);

    oscillator.onended = () => resolve();
  });
}

export function playSampleTone(): Promise<void> {
  return playTone(1000, 'left', 1);
}

export const TEST_FREQUENCIES = [500, 1000, 2000, 4000] as const;
export type TestFrequency = typeof TEST_FREQUENCIES[number];
