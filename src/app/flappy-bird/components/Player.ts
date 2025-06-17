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

  constructor(canvasWidth: number, canvasHeight: number) {
    this.width = 50;
    this.height = 35;
    this.x = canvasWidth / 4;
    this.y = canvasHeight / 2;
    this.velocity = 0;
    this.gravity = 0.07;
    this.jumpForce = -3.5;
    this.canvasHeight = canvasHeight;
    this.isDead = false;
  }

  update() {
    // Apply gravity
    this.velocity += this.gravity;
    this.y += this.velocity;
  }

  checkCollision(): boolean {
    // Check collision with top and bottom boundaries
    const topCollision = this.y - this.width / 2 <= 0;
    const bottomCollision = this.y + this.width / 2 >= this.canvasHeight;
    
    return topCollision || bottomCollision;
  }

  reset() {
    this.y = this.canvasHeight / 2;
    this.velocity = 0;
    this.isDead = false;
  }

  jump() {
    if (!this.isDead) {
      this.velocity = this.jumpForce;
    }
  }

  setDead(dead: boolean) {
    this.isDead = dead;
  }

  draw(ctx: CanvasRenderingContext2D, isDead: boolean = false) {
    // Draw the bird (temporary yellow circle)
    ctx.fillStyle = isDead ? '#FF0000' : '#FFD700';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw the bird's eye
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(this.x + 10, this.y - 5, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw the bird's beak
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.moveTo(this.x + 20, this.y);
    ctx.lineTo(this.x + 35, this.y);
    ctx.lineTo(this.x + 20, this.y + 5);
    ctx.fill();
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