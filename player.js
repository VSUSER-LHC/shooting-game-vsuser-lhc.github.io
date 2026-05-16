export class Enemy {
  constructor(x, y, type = 1) {
    this.x = x;
    this.y = y;
    this.type = type;

    this.r = type === 1 ? 18 : 24;
    this.hp = type === 1 ? 3 : 6;

    this.vx = (Math.random() < 0.5 ? -1 : 1) * 0.6;
    this.vy = 2.0;

    this.fireTimer = 0;
  }

  update(dt, enemyBullets) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 40 || this.x > 440) this.vx *= -1;

    this.fireTimer += dt;
    if (this.fireTimer > 1.2) {
      this.fireTimer = 0;
      enemyBullets.push({
        x: this.x,
        y: this.y + 20,
        r: 4,
        vx: 0,
        vy: 4
      });
    }
  }

  draw(r) {
    const c = r.ctx;
    c.fillStyle = this.type === 1 ? "#f44" : "#f88";
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    c.fill();
  }
}
