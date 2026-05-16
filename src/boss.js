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
          r: 6,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3
        });
      }
    }
  }

  draw(r) {
    const c = r.ctx;

    // ボス本体（大きな四角）
    c.fillStyle = "#f0f";
    c.fillRect(this.x - 80, this.y - 40, 160, 80);

    // HPバー
    c.fillStyle = "rgba(0,0,0,0.6)";
    c.fillRect(40, 20, 400, 16);

    c.fillStyle = "#f0f";
    c.fillRect(40, 20, 400 * (this.hp / this.maxHp), 16);
  }
}
