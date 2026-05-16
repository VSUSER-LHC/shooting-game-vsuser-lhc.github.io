export class Renderer {
  constructor(ctx, w, h) {
    this.ctx = ctx;
    this.w = w;
    this.h = h;
  }

  clear() {
    const c = this.ctx;

    // 背景
    c.fillStyle = "#000";
    c.fillRect(0, 0, this.w, this.h);

    // 星
    c.fillStyle = "rgba(255,255,255,0.25)";
    for (let i = 0; i < 40; i++) {
      const x = (Math.random() * this.w) | 0;
      const y = (Math.random() * this.h) | 0;
      c.fillRect(x, y, 1, 1);
    }
  }

  drawTitle() {
    const c = this.ctx;
    c.fillStyle = "#fff";
    c.textAlign = "center";

    c.font = "40px sans-serif";
    c.fillText("ORIGINAL SKY SHOOTER", this.w / 2, this.h / 2 - 40);

    c.font = "20px sans-serif";
    c.fillText("Press Z / Space / Enter to START", this.w / 2, this.h / 2 + 40);
  }

  drawStageClear() {
    const c = this.ctx;
    c.fillStyle = "rgba(0,0,0,0.7)";
    c.fillRect(0, 0, this.w, this.h);

    c.fillStyle = "#fff";
    c.textAlign = "center";
    c.font = "40px sans-serif";
    c.fillText("STAGE CLEAR!", this.w / 2, this.h / 2);
  }

  drawGameOver() {
    const c = this.ctx;
    c.fillStyle = "rgba(0,0,0,0.7)";
    c.fillRect(0, 0, this.w, this.h);

    c.fillStyle = "#fff";
    c.textAlign = "center";
    c.font = "40px sans-serif";
    c.fillText("GAME OVER", this.w / 2, this.h / 2);
  }
}
