export class Pipe {
  private x: number;
  private gapY: number;
  private gapHeight: number;
  private width: number;
  private speed: number;
  private canvasHeight: number;
  private passed: boolean;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.width = 80;
    this.gapHeight = 200;
    this.speed = 0.85;
    this.canvasHeight = canvasHeight;
    this.x = canvasWidth;
    this.gapY = this.getRandomGapPosition();
    this.passed = false;
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
    // Draw top pipe
    ctx.fillStyle = '#75C147';
    ctx.fillRect(this.x, 0, this.width, this.gapY);
    
    // Draw bottom pipe
    ctx.fillRect(
      this.x,
      this.gapY + this.gapHeight,
      this.width,
      this.canvasHeight - (this.gapY + this.gapHeight)
    );

    // Draw pipe edges
    ctx.fillStyle = '#558B2F';
    // Top pipe edge
    ctx.fillRect(this.x - 2, this.gapY - 20, this.width + 4, 20);
    // Bottom pipe edge
    ctx.fillRect(this.x - 2, this.gapY + this.gapHeight, this.width + 4, 20);
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