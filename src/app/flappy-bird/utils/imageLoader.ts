export class ImageLoader {
  private static images: { [key: string]: HTMLImageElement } = {};
  private static loaded = false;
  private static loadPromise: Promise<void> | null = null;

  static async loadImages() {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('ImageLoader can only be used in browser environment');
    }

    if (this.loaded) return Promise.resolve();
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = new Promise((resolve, reject) => {
      const imageFiles = {
        background: '/images/background-night.png',
        base: '/images/base.png',
        birdMid: '/images/yellowbird-midflap.png',
        birdUp: '/images/yellowbird-upflap.png',
        birdDown: '/images/yellowbird-downflap.png',
        pipeBody: '/images/pipe.png',
        pipeTip: '/images/pipe-tip.png',
        digit0: '/images/0.png',
        digit1: '/images/1.png',
        digit2: '/images/2.png',
        digit3: '/images/3.png',
        digit4: '/images/4.png',
        digit5: '/images/5.png',
        digit6: '/images/6.png',
        digit7: '/images/7.png',
        digit8: '/images/8.png',
        digit9: '/images/9.png',
        score: '/images/score.png',
        gameover: '/images/gameover.png',
        space: '/images/Space.png',
      };

      let loadedCount = 0;
      let errorCount = 0;
      const totalImages = Object.keys(imageFiles).length;

      const onLoad = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          this.loaded = true;
          resolve();
        }
      };

      const onError = (key: string, error: Event | string) => {
        console.error(`Failed to load image: ${key}`, error);
        errorCount++;
        loadedCount++;
        
        // If all images have been processed (success or error), resolve
        if (loadedCount === totalImages) {
          if (errorCount === totalImages) {
            // All images failed
            reject(new Error('Failed to load all game images'));
          } else {
            // Some images loaded successfully
            this.loaded = true;
            resolve();
          }
        }
      };

      for (const [key, src] of Object.entries(imageFiles)) {
        const img = new Image();
        img.src = src;
        img.onload = onLoad;
        img.onerror = (error) => onError(key, error);
        this.images[key] = img;
      }
    });

    return this.loadPromise;
  }

  static getImage(key: string): HTMLImageElement | null {
    return this.images[key] || null;
  }
} 