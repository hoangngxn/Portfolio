import { ImageLoader } from '../utils/imageLoader';

export class Player {
  private x: number;
  private y: number;
  private velocity: number;
  private gravity: number;
  private jumpForce: number;
  private width: number;
  private height: number;
  private canvasHeight: number;
  private isDead: boolean;
  private isIdle: boolean;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.width = 34; // Bird image width
    this.height = 24; // Bird image height
    this.x = canvasWidth / 4;
    this.y = canvasHeight / 2;
    this.velocity = 0;
    this.gravity = 0.03;
    this.jumpForce = -2;
    this.canvasHeight = canvasHeight;
    this.isDead = false;
    this.isIdle = true;
  }

  update() {
    if (!this.isIdle) {
      // Apply gravity only if not idle
      this.velocity += this.gravity;
      this.y += this.velocity;
    }
  }

  checkCollision(): boolean {
    // Check collision with top boundary
    const topCollision = this.y <= 0;
    // Check collision with bottom boundary (canvas height)
    const bottomCollision = this.y + this.height >= this.canvasHeight;
    
    return topCollision || bottomCollision;
  }

  reset() {
    this.y = this.canvasHeight / 2;
    this.velocity = 0;
    this.isDead = false;
    this.isIdle = true;
  }

  jump() {
    if (!this.isDead) {
      this.isIdle = false; // Exit idle state on first jump
      this.velocity = this.jumpForce;
    }
  }

  setDead(dead: boolean) {
    this.isDead = dead;
  }

  draw(ctx: CanvasRenderingContext2D, isDead: boolean = false) {
    const birdImage = ImageLoader.getImage('birdMid');
    
    // Draw the bird
    ctx.drawImage(
      birdImage,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  getPosition() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
} 