export class Engine {
  constructor(update, draw) {
    this.update = update;
    this.draw = draw;
    this.last = performance.now();
  }

  start() {
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(now) {
    const dt = (now - this.last) / 1000;
    this.last = now;

    this.update(dt);
    this.draw();

    requestAnimationFrame(this.loop.bind(this));
  }
}
