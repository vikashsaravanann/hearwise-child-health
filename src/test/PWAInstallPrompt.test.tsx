// @ts-nocheck
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, ...validProps } = props;
      return <div {...validProps}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  X: () => <span data-testid="icon-x">X</span>,
  Smartphone: () => <span data-testid="icon-smartphone">📱</span>,
  Waves: () => <span data-testid="icon-waves">🌊</span>,
}));

// Mock the shadcn Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className} data-testid="install-btn">
      {children}
    </button>
  ),
}));

describe('PWAInstallPrompt', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    // Restore matchMedia from the setup file (returns matches:false for all)
    window.matchMedia = Object.defineProperty(
      {} as any,
      'matchMedia',
      {
        writable: true,
        value: (query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }),
      }
    ).matchMedia as any;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders nothing when no beforeinstallprompt event has fired', () => {
    render(<PWAInstallPrompt />);
    expect(screen.queryByText('Install HearWise')).toBeNull();
  });

  it('renders nothing in standalone mode', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: query === '(display-mode: standalone)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<PWAInstallPrompt />);

    // In standalone mode, the prompt should never show even after timer
    vi.advanceTimersByTime(5000);
    expect(screen.queryByText('Install HearWise')).toBeNull();
  });

  it('appears after receiving a beforeinstallprompt event', async () => {
    render(<PWAInstallPrompt />);
    expect(screen.queryByText('Install HearWise')).toBeNull();

    await act(async () => {
      const event = new Event('beforeinstallprompt');
      (event as any).prompt = vi.fn();
      (event as any).userChoice = Promise.resolve({ outcome: 'accepted' });
      window.dispatchEvent(event);
      // Flush microtasks so React processes the state update
      await Promise.resolve();
    });

    expect(screen.getByText('Install HearWise')).toBeInTheDocument();
    expect(screen.getByText('Get the app offline, just like a native app')).toBeInTheDocument();
  });

  it('appears after the 4-second fallback timer', async () => {
    render(<PWAInstallPrompt />);
    expect(screen.queryByText('Install HearWise')).toBeNull();

    await act(async () => {
      vi.advanceTimersByTime(4000);
    });

    expect(screen.getByText('Install HearWise')).toBeInTheDocument();
  });

  it('dismisses when the close button is clicked', async () => {
    render(<PWAInstallPrompt />);

    await act(async () => { vi.advanceTimersByTime(4000); });
    expect(screen.getByText('Install HearWise')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByLabelText('Dismiss'));
    });

    expect(screen.queryByText('Install HearWise')).toBeNull();
  });

  it('dismisses when "Not now" is clicked', async () => {
    render(<PWAInstallPrompt />);

    await act(async () => { vi.advanceTimersByTime(4000); });
    expect(screen.getByText('Install HearWise')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('Not now'));
    });

    expect(screen.queryByText('Install HearWise')).toBeNull();
  });

  it('calls deferredPrompt.prompt and hides on install', async () => {
    // Use real timers for this test so async promise chains resolve properly
    vi.useRealTimers();

    const mockPrompt = vi.fn();

    render(<PWAInstallPrompt />);

    // Fire beforeinstallprompt with mocks
    await act(async () => {
      const event = new Event('beforeinstallprompt');
      (event as any).prompt = mockPrompt;
      (event as any).userChoice = Promise.resolve({ outcome: 'accepted' });
      window.dispatchEvent(event);
      await Promise.resolve();
    });

    expect(screen.getByText('Install HearWise')).toBeInTheDocument();

    // Click Install
    await act(async () => {
      fireEvent.click(screen.getByTestId('install-btn'));
    });

    expect(mockPrompt).toHaveBeenCalledTimes(1);

    // Wait for the userChoice promise to resolve and hide the prompt
    await waitFor(() => {
      expect(screen.queryByText('Install HearWise')).toBeNull();
    });
  });

  it('does not show again after permanent dismissal', async () => {
    render(<PWAInstallPrompt />);

    // Show via timer
    await act(async () => { vi.advanceTimersByTime(4000); });
    expect(screen.getByText('Install HearWise')).toBeInTheDocument();

    // Dismiss
    await act(async () => {
      fireEvent.click(screen.getByText('Not now'));
    });
    expect(screen.queryByText('Install HearWise')).toBeNull();

    // Another timer cycle — should NOT re-show since dismissed=true
    await act(async () => { vi.advanceTimersByTime(4000); });
    expect(screen.queryByText('Install HearWise')).toBeNull();
  });
});
