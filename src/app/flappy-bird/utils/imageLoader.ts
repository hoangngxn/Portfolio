export class ImageLoader {
  private static images: { [key: string]: HTMLImageElement } = {};
  private static loaded = false;
  private static loadPromise: Promise<void> | null = null;

  static async loadImages() {
    if (this.loaded) return Promise.resolve();
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = new Promise((resolve) => {
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
        space: '/images/space.png',
      };

      let loadedCount = 0;
      const totalImages = Object.keys(imageFiles).length;

      const onLoad = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          this.loaded = true;
          resolve();
        }
      };

      for (const [key, src] of Object.entries(imageFiles)) {
        const img = new Image();
        img.src = src;
        img.onload = onLoad;
        this.images[key] = img;
      }
    });

    return this.loadPromise;
  }

  static getImage(key: string): HTMLImageElement {
    return this.images[key];
  }
} 