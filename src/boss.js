import { Assets } from "./assets.js";

export class Boss {
  constructor() {
    this.x = 240;
    this.y = -120;
    this.r = 60;

    this.hp = 200;
    this.maxHp = 200;

    this.vx = 1.2;
    this.vy = 1.2;

    this.fireTimer = 0;
  }

  update(dt, enemyBullets) {
    if (this.y < 120) {
      this.y += this.vy;
      return;
    }

    this.x += this.vx;
    if (this.x < 80 || this.x > 400) this.vx *= -1;

    this.fireTimer += dt;
    if (this.fireTimer > 0.5) {
      this.fireTimer = 0;

      for (let i = -2; i <= 2; i++) {
        const angle = (-Math.PI / 2) + i * 0.2;
        enemyBullets.push({
          x: this.x,
          y: this.y + 20,
          r: 5,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3
        });
      }
    }
  }

  draw(r) {
    r.ctx.drawImage(Assets.images.boss, this.x - 80, this.y - 60, 160, 120);

    r.ctx.fillStyle = "rgba(0,0,0,0.6)";
    r.ctx.fillRect(40, 20, 400, 16);

    r.ctx.fillStyle = "#f0f";
    r.ctx.fillRect(40, 20, 400 * (this.hp / this.maxHp), 16);
  }
}

