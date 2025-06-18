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
  private frame: number;
  private frameTick: number;
  private frameInterval: number;
  private rotation: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.width = 51; // Bird image width
    this.height = 36; // Bird image height
    this.x = canvasWidth / 4;
    this.y = canvasHeight / 2;
    this.velocity = 0;
    this.gravity = 0.02;
    this.jumpForce = -1.75;
    this.canvasHeight = canvasHeight;
    this.isDead = false;
    this.isIdle = true;
    this.frame = 0;
    this.frameTick = 0;
    this.frameInterval = 30; // Adjust for animation speed
    this.rotation = 0;
  }

  update() {
    if (!this.isIdle) {
      // Apply gravity only if not idle
      this.velocity += this.gravity;
      this.y += this.velocity;
      
      // Animation frame update
      this.frameTick++;
      if (this.frameTick >= this.frameInterval) {
        this.frame = (this.frame + 1) % 3;
        this.frameTick = 0;
      }

      // Tilt logic
      if (this.velocity < 0) {
        this.rotation = -0.35; // Tilt up (radians, about -20deg)
      } else {
        this.rotation = Math.min(this.rotation + 0.03, 1.0); // Tilt down, max about 57deg
      }

      // Stop falling when hitting the ground (for death animation)
      if (this.isDead && this.y + this.height >= this.canvasHeight) {
        this.y = this.canvasHeight - this.height;
        this.velocity = 0;
        this.rotation = 1.0; // Face down on ground
      }
    }
  }

  checkCollision(): boolean {
    // Check collision with top boundary
    const topCollision = this.y <= 0;
    // Check collision with bottom boundary (ground/base level)
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
      this.rotation = -0.35; // Snap up on jump
    }
  }

  setDead(dead: boolean) {
    this.isDead = dead;
  }

  draw(ctx: CanvasRenderingContext2D, isDead: boolean = false) {
    const birdFrames = [
      ImageLoader.getImage('birdDown'),
      ImageLoader.getImage('birdMid'),
      ImageLoader.getImage('birdUp'),
    ];
    const birdImage = birdFrames[this.frame];

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);
    ctx.drawImage(
      birdImage,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
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