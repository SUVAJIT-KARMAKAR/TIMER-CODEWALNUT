export class TimerAudio {
  private static instance: TimerAudio;
  private audioContexts: Map<string, AudioContext> = new Map();
  private oscillators: Map<string, OscillatorNode> = new Map();
  private gainNodes: Map<string, GainNode> = new Map();

  private constructor() {}


  static getInstance(): TimerAudio {
    if (!TimerAudio.instance) {
      TimerAudio.instance = new TimerAudio();
    }
    return TimerAudio.instance;
  }

  private async initializeAudioContext(timerId: string): Promise<void> {
    if (!this.audioContexts.has(timerId)) {
      const audioContext = new AudioContext();
      this.audioContexts.set(timerId, audioContext);
    }

    const audioContext = this.audioContexts.get(timerId)!;
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
  }

  async play(timerId: string): Promise<void> {
    try {
      await this.initializeAudioContext(timerId);

      const audioContext = this.audioContexts.get(timerId)!;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.5,
        audioContext.currentTime + 0.01
      );
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      this.oscillators.set(timerId, oscillator);
      this.gainNodes.set(timerId, gainNode);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      setTimeout(() => {
        this.cleanup(timerId);
      }, 500);
    } catch (error) {
      console.error(`Failed to play audio for timer ${timerId}:`, error);
    }
  }

  async playLoop(timerId: string): Promise<void> {
    try {
      await this.initializeAudioContext(timerId);

      const audioContext = this.audioContexts.get(timerId)!;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); 

      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

    
      this.oscillators.set(timerId, oscillator);
      this.gainNodes.set(timerId, gainNode);

      oscillator.start();
    } catch (error) {
      console.error(
        `Failed to play looping audio for timer ${timerId}:`,
        error
      );
    }
  }

  stop(timerId: string): void {
    this.cleanup(timerId);
  }

  private cleanup(timerId: string): void {
    const oscillator = this.oscillators.get(timerId);
    const gainNode = this.gainNodes.get(timerId);
    const audioContext = this.audioContexts.get(timerId);

    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
      this.oscillators.delete(timerId);
    }

    if (gainNode) {
      gainNode.disconnect();
      this.gainNodes.delete(timerId);
    }

    if (audioContext) {
      audioContext.close();
      this.audioContexts.delete(timerId);
    }
  }
}