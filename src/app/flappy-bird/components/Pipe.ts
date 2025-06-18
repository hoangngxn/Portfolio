import { ImageLoader } from '../utils/imageLoader';

export class Pipe {
  private x: number;
  private gapY: number;
  private gapHeight: number;
  private speed: number;
  private canvasHeight: number;
  private passed: boolean;

  // Pipe dimensions based on actual images
  private readonly PIPE_WIDTH = 52; // Width of pipe tip image
  private readonly PIPE_BODY_WIDTH = 48; // Width of pipe body image
  private readonly PIPE_TIP_HEIGHT = 24; // Height of pipe tip image
  private readonly PIPE_BODY_HEIGHT = 10; // Height of pipe body segment

  constructor(canvasWidth: number, canvasHeight: number) {
    this.gapHeight = 200; // Gap between top and bottom pipes
    this.speed = 0.55;
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
    const pipeBody = ImageLoader.getImage('pipeBody');
    const pipeTip = ImageLoader.getImage('pipeTip');

    // Calculate tip offset to center it on the body
    const tipOffsetX = -(this.PIPE_WIDTH - this.PIPE_BODY_WIDTH) / 2;

    // Draw top pipe (flipped)
    this.drawTopPipe(ctx, pipeBody, pipeTip, tipOffsetX);

    // Draw bottom pipe
    this.drawBottomPipe(ctx, pipeBody, pipeTip, tipOffsetX);
  }

  private drawTopPipe(ctx: CanvasRenderingContext2D, pipeBody: HTMLImageElement, pipeTip: HTMLImageElement, tipOffsetX: number) {
    ctx.save();
    ctx.translate(this.x, this.gapY);
    ctx.scale(1, -1); // Flip vertically

    // Draw pipe tip at the bottom (which becomes top when flipped)
    ctx.drawImage(
      pipeTip,
      tipOffsetX, 0,
      this.PIPE_WIDTH, this.PIPE_TIP_HEIGHT
    );

    // Draw pipe body segments from tip to top of screen
    let currentY = this.PIPE_TIP_HEIGHT;
    while (currentY < this.gapY) {
      const segmentHeight = Math.min(this.PIPE_BODY_HEIGHT, this.gapY - currentY);
      ctx.drawImage(
        pipeBody,
        0, 0, this.PIPE_BODY_WIDTH, segmentHeight,
        0, currentY, this.PIPE_BODY_WIDTH, segmentHeight
      );
      currentY += this.PIPE_BODY_HEIGHT;
    }

    ctx.restore();
  }

  private drawBottomPipe(ctx: CanvasRenderingContext2D, pipeBody: HTMLImageElement, pipeTip: HTMLImageElement, tipOffsetX: number) {
    const bottomPipeY = this.gapY + this.gapHeight;

    // Draw pipe tip at the top
    ctx.drawImage(
      pipeTip,
      this.x + tipOffsetX, bottomPipeY,
      this.PIPE_WIDTH, this.PIPE_TIP_HEIGHT
    );

    // Draw pipe body segments from tip to bottom of screen
    let currentY = bottomPipeY + this.PIPE_TIP_HEIGHT;
    while (currentY < this.canvasHeight) {
      const segmentHeight = Math.min(this.PIPE_BODY_HEIGHT, this.canvasHeight - currentY);
      ctx.drawImage(
        pipeBody,
        0, 0, this.PIPE_BODY_WIDTH, segmentHeight,
        this.x, currentY, this.PIPE_BODY_WIDTH, segmentHeight
      );
      currentY += this.PIPE_BODY_HEIGHT;
    }
  }

  checkCollision(birdX: number, birdY: number, birdWidth: number, birdHeight: number): boolean {
    // Bird bounding box
    const birdLeft = birdX;
    const birdRight = birdX + birdWidth;
    const birdTop = birdY;
    const birdBottom = birdY + birdHeight;

    // Pipe collision box (using body width for consistent collision)
    const pipeLeft = this.x;
    const pipeRight = this.x + this.PIPE_BODY_WIDTH;

    // Check if bird overlaps with pipe horizontally
    if (birdRight > pipeLeft && birdLeft < pipeRight) {
      // Top pipe collision
      const topPipeBottom = this.gapY;
      if (birdTop < topPipeBottom) {
        return true;
      }

      // Bottom pipe collision
      const bottomPipeTop = this.gapY + this.gapHeight;
      if (birdBottom > bottomPipeTop) {
        return true;
      }
    }

    return false;
  }

  isOffScreen(): boolean {
    return this.x + this.PIPE_WIDTH < 0;
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