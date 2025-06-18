export class SoundLoader {
  private static sounds: Map<string, HTMLAudioElement> = new Map();
  private static isLoaded = false;
  private static volume: number = 0.3; // Default volume (0.0 to 1.0)

  static setVolume(volume: number): void {
    // Clamp volume between 0 and 1
    this.volume = Math.max(0, Math.min(1, volume));
    
    // Update volume for all loaded sounds
    this.sounds.forEach(sound => {
      sound.volume = this.volume;
    });
  }

  static getVolume(): number {
    return this.volume;
  }

  static async loadSounds(): Promise<void> {
    if (this.isLoaded) return;

    const soundFiles = [
      { name: 'point', path: '/sounds/point.wav' },
      { name: 'wing', path: '/sounds/wing.wav' },
      { name: 'hit', path: '/sounds/hit.wav' }
    ];

    const loadPromises = soundFiles.map(({ name, path }) => {
      return new Promise<void>((resolve, reject) => {
        const audio = new Audio(path);
        audio.preload = 'auto';
        audio.volume = this.volume; // Set initial volume
        
        audio.addEventListener('canplaythrough', () => {
          this.sounds.set(name, audio);
          resolve();
        }, { once: true });
        
        audio.addEventListener('error', () => {
          console.error(`Failed to load sound: ${name}`);
          reject(new Error(`Failed to load sound: ${name}`));
        }, { once: true });
        
        // Start loading
        audio.load();
      });
    });

    try {
      await Promise.all(loadPromises);
      this.isLoaded = true;
      console.log('All sounds loaded successfully');
    } catch (error) {
      console.error('Error loading sounds:', error);
      throw error;
    }
  }

  static playSound(soundName: string): void {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.currentTime = 0;
      sound.volume = this.volume; // Ensure volume is set before playing
      sound.play().catch(err => {
        console.log(`Error playing ${soundName} sound:`, err);
      });
    } else {
      console.warn(`Sound '${soundName}' not found`);
    }
  }

  static getSound(soundName: string): HTMLAudioElement | undefined {
    return this.sounds.get(soundName);
  }

  static isSoundsLoaded(): boolean {
    return this.isLoaded;
  }

  static cleanup(): void {
    this.sounds.clear();
    this.isLoaded = false;
  }
} 