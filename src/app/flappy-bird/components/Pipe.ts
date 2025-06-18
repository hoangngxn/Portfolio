import { ImageLoader } from '../utils/imageLoader';

export class Pipe {
  private x: number;
  private gapY: number;
  private gapHeight: number;
  private width: number;
  private speed: number;
  private canvasHeight: number;
  private passed: boolean;
  private pipeHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.width = 50;
    this.gapHeight = 160;
    this.speed = 0.65;
    this.canvasHeight = canvasHeight;
    this.x = canvasWidth;
    this.gapY = this.getRandomGapPosition();
    this.passed = false;
    this.pipeHeight = 320; // Height of the pipe image
  }

  private getRandomGapPosition(): number {
    const minGap = 100;
    const maxGap = this.canvasHeight - 100 - this.gapHeight;
    return Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const pipeImage = ImageLoader.getImage('pipe');
    
    // Draw top pipe (flipped)
    ctx.save();
    ctx.translate(this.x, this.gapY);
    ctx.scale(1, -1);
    ctx.drawImage(pipeImage, 0, 0, this.width, this.pipeHeight);
    ctx.restore();

    // Draw bottom pipe - calculate height to fill remaining space
    const bottomPipeY = this.gapY + this.gapHeight;
    const bottomPipeHeight = this.canvasHeight - bottomPipeY;
    
    ctx.drawImage(
      pipeImage,
      this.x,
      bottomPipeY,
      this.width,
      bottomPipeHeight
    );
  }

  checkCollision(birdX: number, birdY: number, birdRadius: number): boolean {
    // Check if bird is within pipe's x-range
    if (birdX + birdRadius > this.x && birdX - birdRadius < this.x + this.width) {
      // Check if bird hits top or bottom pipe
      if (birdY - birdRadius < this.gapY || birdY + birdRadius > this.gapY + this.gapHeight) {
        return true;
      }
    }
    return false;
  }

  isOffScreen(): boolean {
    return this.x + this.width < 0;
  }

  markAsPassed() {
    this.passed = true;
  }

  hasPassed(): boolean {
    return this.passed;
  }

  getX(): number {
    return this.x;
  }
} 