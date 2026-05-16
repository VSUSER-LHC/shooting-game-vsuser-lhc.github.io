import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { Boss } from "./boss.js";
import { Powerup } from "./powerup.js";
import { Assets } from "./assets.js";

export class Stage {
  constructor(renderer, input) {
    this.renderer = renderer;
    this.input = input;

    this.player = new Player(input);
    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.powerups = [];

    this.time = 0;
    this.isCleared = false;
    this.isGameOver = false;

    this.bossSpawned = false;
  }

  start() {
    this.time = 0;
    this.isCleared = false;
    this.isGameOver = false;

    this.bullets.length = 0;
    this.enemyBullets.length = 0;
    this.enemies.length = 0;
    this.powerups.length = 0;

    this.player = new Player(this.input);
  }

  update(dt) {
    this.time += dt;

    this.player.update(dt, this.bullets);

    if (this.time < 40) {
      if (Math.random() < 0.03) {
        this.enemies.push(new Enemy(Math.random() * 400 + 40, -40, 1));
      }
    } else if (this.time < 80) {
      if (Math.random() < 0.04) {
        this.enemies.push(new Enemy(Math.random() * 400 + 40, -40, 2));
      }
    } else if (!this.bossSpawned) {
      this.boss = new Boss();
      this.bossSpawned = true;
    }

    this.bullets.forEach(b => {
      b.y -= b.speed;
      b.x += b.vx;
    });

    this.enemyBullets.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
    });

    this.enemies.forEach(e => e.update(dt, this.enemyBullets));
    if (this.bossSpawned) this.boss.update(dt, this.enemyBullets);

    this.powerups.forEach(p => p.update(dt));

    this.handleCollisions();

    this.bullets = this.bullets.filter(b => b.y > -20);
    this.enemyBullets = this.enemyBullets.filter(b => b.y < 740 && b.y > -20);
    this.enemies = this.enemies.filter(e => e.y < 760);
    this.powerups = this.powerups.filter(p => p.y < 760);
  }

  handleCollisions() {
    const hit = (a, b) => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return dx * dx + dy * dy < (a.r + b.r) ** 2;
    };

    this.enemies.forEach((e, i) => {
      this.bullets.forEach((b, j) => {
        if (hit(e, b)) {
          e.hp--;
          this.bullets.splice(j, 1);

          if (e.hp <= 0) {
            Assets.sounds.explosion.cloneNode().play();
            this.enemies.splice(i, 1);

            if (Math.random() < 0.25) {
              const types = ["spread", "rapid", "shield"];
              const t = types[(Math.random() * 3) | 0];
              this.powerups.push(new Powerup(e.x, e.y, t));
            }
          }
        }
      });
    });

    if (this.bossSpawned) {
      this.bullets.forEach((b, j) => {
        if (hit(this.boss, b)) {
          this.boss.hp--;
          this.bullets.splice(j, 1);

          if (this.boss.hp <= 0) {
            this.isCleared = true;
          }
        }
      });
    }

    this.enemyBullets.forEach((b, j) => {
      if (hit(this.player, b)) {
        if (this.player.shield <= 0) {
          this.player.hp--;
          if (this.player.hp <= 0) this.isGameOver = true;
        }
        this.enemyBullets.splice(j, 1);
      }
    });

    this.powerups.forEach((p, i) => {
      if (hit(this.player, p)) {
        Assets.sounds.powerup.cloneNode().play();

        if (p.type === "spread") this.player.spread = Math.min(3, this.player.spread + 1);
        if (p.type === "rapid") this.player.fireInterval = Math.max
