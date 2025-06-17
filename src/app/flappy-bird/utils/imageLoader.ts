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
        pipe: '/images/pipe-green.png',
        base: '/images/base.png',
        birdMid: '/images/yellowbird-midflap.png',
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