export class Powerup {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.r = 14;
    this.vy = 2;
  }

  update(dt) {
    this.y += this.vy;
  }

  draw(r) {
    const c = r.ctx;

    if (this.type === "spread") c.fillStyle = "#4cff4c";
    else if (this.type === "rapid") c.fillStyle = "#ffb84c";
    else c.fillStyle = "#4ccfff";

    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    c.fill();
  }
}
