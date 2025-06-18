import { ImageLoader } from '../utils/imageLoader';

export class Background {
  private backgroundX: number = 0;
  private baseX: number = 0;
  private readonly canvasWidth: number;
  private readonly canvasHeight: number;
  private readonly baseHeight: number;
  private readonly scrollSpeed: number;

  constructor(
    canvasWidth: number, 
    canvasHeight: number, 
    baseHeight: number, 
    scrollSpeed: number
  ) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.baseHeight = baseHeight;
    this.scrollSpeed = scrollSpeed;
  }

  update(deltaTime: number, isPlaying: boolean, isDead: boolean) {
    // Update scroll positions only during gameplay
    if (isPlaying && !isDead) {
      this.backgroundX -= this.scrollSpeed * deltaTime;
      this.baseX -= this.scrollSpeed * deltaTime;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const backgroundImage = ImageLoader.getImage('background');
    const baseImage = ImageLoader.getImage('base');
    
    // Use modulo to create seamless looping
    const backgroundOffset = ((this.backgroundX % this.canvasWidth) + this.canvasWidth) % this.canvasWidth;
    const baseOffset = ((this.baseX % this.canvasWidth) + this.canvasWidth) % this.canvasWidth;
    
    // Draw scrolling background
    ctx.drawImage(backgroundImage, backgroundOffset, 0, this.canvasWidth, this.canvasHeight);
    ctx.drawImage(backgroundImage, backgroundOffset - this.canvasWidth + 1, 0, this.canvasWidth, this.canvasHeight);
    
    // Draw scrolling base
    const baseY = this.canvasHeight - this.baseHeight;
    ctx.drawImage(baseImage, baseOffset, baseY, this.canvasWidth, this.baseHeight);
    ctx.drawImage(baseImage, baseOffset - this.canvasWidth + 1, baseY, this.canvasWidth, this.baseHeight);
  }

  reset() {
    this.backgroundX = 0;
    this.baseX = 0;
  }
} 