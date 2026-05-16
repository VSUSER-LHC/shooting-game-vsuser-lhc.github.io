export const Assets = {
  images: {},
  sounds: {},

  async loadAll() {
    await Promise.all([
      this.loadImage("player", "../assets/player.png"),
      this.loadImage("enemy1", "../assets/enemy1.png"),
      this.loadImage("enemy2", "../assets/enemy2.png"),
      this.loadImage("boss", "../assets/boss.png"),
      this.loadImage("bullet", "../assets/bullet.png"),
      this.loadImage("powerup", "../assets/powerup.png"),
      this.loadImage("explosion", "../assets/explosion.png"),

      this.loadSound("shot", "../assets/shot.wav"),
      this.loadSound("explosion", "../assets/explosion.wav"),
      this.loadSound("powerup", "../assets/powerup.wav"),
    ]);
  },

  loadImage(name, src) {
    return new Promise(res => {
      const img = new Image();
      img.onload = () => {
        this.images[name] = img;
        res();
      };
      img.src = src;
    });
  },

  loadSound(name, src) {
    return new Promise(res => {
      const audio = new Audio(src);
      audio.oncanplaythrough = () => {
        this.sounds[name] = audio;
        res();
      };
    });
  }
};
