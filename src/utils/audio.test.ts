import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { TimerAudio } from './audio';

describe('TimerAudio', () => {
  let timerAudio: TimerAudio;

  beforeEach(() => {
    timerAudio = TimerAudio.getInstance();
    // Mock the AudioContext
    globalThis.AudioContext = class {
      state = 'suspended';
      resume = vi.fn().mockResolvedValue(undefined);
      createOscillator = vi.fn().mockReturnValue({
        type: '',
        frequency: {
          setValueAtTime: vi.fn(),
        },
        start: vi.fn(),
        stop: vi.fn(),
        disconnect: vi.fn(),
      });
      createGain = vi.fn().mockReturnValue({
        gain: {
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
        disconnect: vi.fn(),
      });
      destination = {};
    } as unknown as typeof AudioContext;
  });

  afterEach(() => {
    // Cleanup after each test
    timerAudio.stop();
  });

  it('should create a singleton instance', () => {
    const anotherInstance = TimerAudio.getInstance();
    expect(timerAudio).toBe(anotherInstance);
  });

  it('should initialize audio context', async () => {
    await timerAudio.play();
    expect(timerAudio['audioContext']).not.toBeNull();
  });

  it('should play sound', async () => {
    const playSpy = vi.spyOn(timerAudio, 'play');
    await timerAudio.play();
    expect(playSpy).toHaveBeenCalled();
  });

  it('should cleanup resources', async () => {
    await timerAudio.play();
    timerAudio.stop();
    expect(timerAudio['oscillator']).toBeNull();
    expect(timerAudio['gainNode']).toBeNull();
  });

  it('should handle errors during play', async () => {
    const originalAudioContext = globalThis.AudioContext;
    globalThis.AudioContext = vi.fn().mockImplementation(() => {
      throw new Error('AudioContext error');
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await timerAudio.play();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to play audio:', expect.any(Error));

    globalThis.AudioContext = originalAudioContext;
  });
}); 