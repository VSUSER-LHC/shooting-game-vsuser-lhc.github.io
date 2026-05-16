import { Assets } from "./assets.js";

export class Powerup {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.r = 16;
    this.vy = 2;
  }

  update(dt) {
    this.y += this.vy;
  }

  draw(r) {
    r.ctx.drawImage(Assets.images.powerup, this.x - 16, this.y - 16, 32, 32);
  }
}
