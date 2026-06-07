import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hearwise.app',
  appName: 'HearWise',
  webDir: 'dist',
  // ── Android-specific settings ─────────────────────────────────────────────
  android: {
    allowMixedContent: true,
    backgroundColor: '#000b1d',
    // Capture microphone for hearing test + noise monitoring
    overrideUserAgent: 'HearWise/1.0 Android',
  },
  // ── iOS-specific settings ─────────────────────────────────────────────────
  ios: {
    backgroundColor: '#000b1d',
    contentInset: 'always',
    overrideUserAgent: 'HearWise/1.0 iOS',
  },
  // ── Plugin configurations ─────────────────────────────────────────────────
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#000b1d',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',          // White icons on dark background
      backgroundColor: '#000b1d',
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'body',         // Resize body so inputs aren't hidden
      style: 'dark',
      resizeOnFullScreen: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
