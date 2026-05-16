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
    this.boss = null;
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
    this.bossSpawned = false;
    this.boss = null;
  }

  update(dt) {
    this.time += dt;

    // プレイヤー更新
    this.player.update(dt, this.bullets);

    // ステージ進行
    this.spawnEnemies();

    // 弾更新
    this.updateBullets(dt);

    // 敵更新
    this.enemies.forEach(e => e.update(dt, this.enemyBullets));

    // ボス更新
    if (this.bossSpawned && this.boss) {
      this.boss.update(dt, this.enemyBullets);
    }

    // パワーアップ更新
    this.powerups.forEach(p => p.update(dt));

    // 衝突判定
    this.handleCollisions();

    // 画面外削除
    this.cleanup();
  }

  spawnEnemies() {
    // 時間で出現パターンを変える
    if (this.time < 40) {
      // 序盤：弱い敵
      if (Math.random() < 0.03) {
        this.enemies.push(new Enemy(Math.random() * 400 + 40, -40, 1));
      }
    } else if (this.time < 80) {
      // 中盤：強い敵
      if (Math.random() < 0.04) {
        this.enemies.push(new Enemy(Math.random() * 400 + 40, -40, 2));
      }
    } else if (!this.bossSpawned) {
      // ボス登場
      this.boss = new Boss();
      this.bossSpawned = true;
    }
  }

  updateBullets(dt) {
    // 自弾
    this.bullets.forEach(b => {
      b.y -= b.speed;
      b.x += b.vx;
    });

    // 敵弾
    this.enemyBullets.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
    });
  }

  handleCollisions() {
    const hit = (a, b) => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return dx * dx + dy * dy < (a.r + b.r) ** 2;
    };

    // 自弾 vs 敵
    this.enemies.forEach((e, ei) => {
      this.bullets.forEach((b, bi) => {
        if (hit(e, b)) {
          e.hp--;
          this.bullets.splice(bi, 1);

          if (e.hp <= 0) {
            Assets.sounds.explosion.cloneNode().play();
            this.enemies.splice(ei, 1);

            // パワーアップドロップ
            if (Math.random() < 0.25) {
              const types = ["spread", "rapid", "shield"];
              const t = types[(Math.random() * 3) | 0];
              this.powerups.push(new Powerup(e.x, e.y, t));
            }
          }
        }
      });
    });

    // 自弾 vs ボス
    if (this.bossSpawned && this.boss) {
      this.bullets.forEach((b, bi) => {
        if (hit(this.boss, b)) {
          this.boss.hp--;
          this.bullets.splice(bi, 1);

          if (this.boss.hp <= 0) {
            this.isCleared = true;
          }
        }
      });
    }

    // 敵弾 vs プレイヤー
    this.enemyBullets.forEach((b, bi) => {
      if (hit(this.player, b)) {
        if (this.player.shield <= 0) {
          this.player.hp--;
          if (this.player.hp <= 0) this.isGameOver = true;
        }
        this.enemyBullets.splice(bi, 1);
      }
    });

    // パワーアップ取得
    this.powerups.forEach((p, pi) => {
      if (hit(this.player, p)) {
        Assets.sounds.powerup.cloneNode().play();

        if (p.type === "spread") this.player.spread = Math.min(3, this.player.spread + 1);
        if (p.type === "rapid") this.player.fireInterval = Math.max(0.06, this.player.fireInterval - 0.03);
        if (p.type === "shield") this.player.shield = 6;

        this.powerups.splice(pi, 1);
      }
    });
  }

  cleanup() {
    this.bullets = this.bullets.filter(b => b.y > -20);
    this.enemyBullets = this.enemyBullets.filter(b => b.y < 740 && b.y > -20);
    this.enemies = this.enemies.filter(e => e.y < 760);
    this.powerups = this.powerups.filter(p => p.y < 760);
  }

  draw(r) {
    // プレイヤー
    this.player.draw(r);

    // 自弾
    r.ctx.fillStyle = "#ffea00";
    this.bullets.forEach(b => {
      r.ctx.beginPath();
      r.ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      r.ctx.fill();
    });

    // 敵弾
    r.ctx.fillStyle = "#ff6666";
    this.enemyBullets.forEach(b => {
      r.ctx.beginPath();
      r.ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      r.ctx.fill();
    });

    // 敵
    this.enemies.forEach(e => e.draw(r));

    // ボス
    if (this.bossSpawned && this.boss) {
      this.boss.draw(r);
    }

    // パワーアップ
    this.powerups.forEach(p => p.draw(r));

    // UI
    r.ctx.fillStyle = "#fff";
    r.ctx.font = "18px sans-serif";
    r.ctx.fillText(`HP: ${this.player.hp}/${this.player.maxHp}`, 16, 28);
  }
}
