export class Input {
  constructor() {
    this.keys = {};
    this.prev = {};

    window.addEventListener("keydown", e => this.keys[e.key] = true);
    window.addEventListener("keyup", e => this.keys[e.key] = false);
  }

  isDown(key) {
    return !!this.keys[key];
  }

  isPressed(action) {
    const pressed =
      action === "start" &&
      (this.isDown(" ") || this.isDown("Enter") || this.isDown("z"));

    return pressed;
  }
}
