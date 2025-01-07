export class TimerAudio {
  private static instance: TimerAudio;
  private audioMap: Map<string, HTMLAudioElement>;

  private constructor() {
    this.audioMap = new Map();
  }

  public static getInstance(): TimerAudio {
    if (!TimerAudio.instance) {
      TimerAudio.instance = new TimerAudio();
    }
    return TimerAudio.instance;
  }

  public playLoop(id: string) {
    return new Promise<void>((resolve, reject) => {
      try {

        const audioFilePath = new URL('/resources/timerAudioThree.mp3', import.meta.url).toString();

        let audio = this.audioMap.get(id);
        if (!audio) {
          audio = new Audio(audioFilePath);
          this.audioMap.set(id, audio);
        }

        audio.loop = true;
        audio.play().then(resolve).catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  public stop(id: string) {
    const audio = this.audioMap.get(id);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      this.audioMap.delete(id);
    }
  }
}
