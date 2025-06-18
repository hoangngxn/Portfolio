export class SoundLoader {
  private static sounds: Map<string, HTMLAudioElement> = new Map();
  private static isLoaded = false;
  private static volume: number = 0.2; // Default volume (0.0 to 1.0)

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
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('SoundLoader can only be used in browser environment');
    }

    if (this.isLoaded) return;

    const soundFiles = [
      { name: 'point', path: '/sounds/point.wav' },
      { name: 'wing', path: '/sounds/wing.wav' },
      { name: 'hit', path: '/sounds/hit.wav' }
    ];

    const loadPromises = soundFiles.map(({ name, path }) => {
      return new Promise<void>((resolve, reject) => {
        try {
          const audio = new Audio(path);
          audio.preload = 'auto';
          audio.volume = this.volume; // Set initial volume
          
          audio.addEventListener('canplaythrough', () => {
            this.sounds.set(name, audio);
            resolve();
          }, { once: true });
          
          audio.addEventListener('error', (error) => {
            console.error(`Failed to load sound: ${name}`, error);
            reject(new Error(`Failed to load sound: ${name}`));
          }, { once: true });
          
          // Start loading
          audio.load();
        } catch (error) {
          console.error(`Error creating audio element for ${name}:`, error);
          reject(new Error(`Failed to create audio element for ${name}`));
        }
      });
    });

    try {
      await Promise.all(loadPromises);
      this.isLoaded = true;
      console.log('All sounds loaded successfully');
    } catch (error) {
      console.error('Error loading sounds:', error);
      // Don't throw error, just log it and continue
      this.isLoaded = true; // Mark as loaded to prevent infinite retries
    }
  }

  static playSound(soundName: string): void {
    if (typeof window === 'undefined') return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      try {
        sound.currentTime = 0;
        sound.volume = this.volume; // Ensure volume is set before playing
        sound.play().catch(err => {
          console.log(`Error playing ${soundName} sound:`, err);
        });
      } catch (error) {
        console.warn(`Error playing sound ${soundName}:`, error);
      }
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
    try {
      this.sounds.clear();
      this.isLoaded = false;
    } catch (error) {
      console.warn('Error cleaning up sounds:', error);
    }
  }
} 