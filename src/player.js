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
    const c = r.ctx;

    // 自機（三角形）
    c.fillStyle = "#4af";
    c.beginPath();
    c.moveTo(this.x, this.y - this.r);
    c.lineTo(this.x + this.r * 0.7, this.y + this.r);
    c.lineTo(this.x - this.r * 0.7, this.y + this.r);
    c.closePath();
    c.fill();

    // シールド
    if (this.shield > 0) {
      c.strokeStyle = "rgba(120,220,255,0.7)";
      c.lineWidth = 3;
      c.beginPath();
      c.arc(this.x, this.y, this.r + 6, 0, Math.PI * 2);
      c.stroke();
    }
  }
}
