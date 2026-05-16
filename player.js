import { Assets } from "./assets.js";

export class Player {
  constructor(input) {
    this.input = input;
    this.x = 240;
    this.y = 600;
    this.speed = 5;
    this.r = 20;

    this.hp = 5;
    this.maxHp = 5;

    this.fireInterval = 0.15;
    this.fireTimer = 0;

    this.spread = 1;
    this.shield = 0;
  }

  update(dt, bullets) {
    if (this.input.isDown("ArrowLeft") || this.input.isDown("a")) this.x -= this.speed;
    if (this.input.isDown("ArrowRight") || this.input.isDown("d")) this.x += this.speed;
    if (this.input.isDown("ArrowUp") || this.input.isDown("w")) this.y -= this.speed;
    if (this.input.isDown("ArrowDown") || this.input.isDown("s")) this.y += this.speed;

    this.x = Math.max(20, Math.min(460, this.x));
    this.y = Math.max(20, Math.min(700, this.y));

    this.fireTimer += dt;
    if (this.input.isDown(" ") || this.input.isDown("z")) {
      if (this.fireTimer >= this.fireInterval) {
        this.fireTimer = 0;
        this.shoot(bullets);
      }
    }

    if (this.shield > 0) this.shield -= dt;
  }

  shoot(bullets) {
    Assets.sounds.shot.cloneNode().play();

    const base = { y: this.y - 20, r: 4, speed: 10 };

    if (this.spread === 1) {
      bullets.push({ x: this.x, ...base, vx: 0 });
    } else if (this.spread === 2) {
      bullets.push({ x: this.x - 6, ...base, vx: -1 });
      bullets.push({ x: this.x + 6, ...base, vx: 1 });
    } else {
      bullets.push({ x: this.x, ...base, vx: 0 });
      bullets.push({ x: this.x - 10, ...base, vx: -1.5 });
      bullets.push({ x: this.x + 10, ...base, vx: 1.5 });
    }
  }

  draw(r) {
    r.ctx.drawImage(Assets.images.player, this.x - 24, this.y - 24, 48, 48);

    if (this.shield > 0) {
      r.ctx.strokeStyle = "rgba(120,220,255,0.7)";
      r.ctx.lineWidth = 3;
      r.ctx.beginPath();
      r.ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
      r.ctx.stroke();
    }
  }
}
