import { Engine } from "./engine.js";
import { Input } from "./input.js";
import { Renderer } from "./renderer.js";
import { Stage } from "./stage.js";
import { Assets } from "./assets.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const renderer = new Renderer(ctx, canvas.width, canvas.height);
const input = new Input();
const engine = new Engine(update, draw);

let stage;
let state = "title"; // title, play, clear, gameover

async function init() {
  await Assets.loadAll();
  stage = new Stage(renderer, input);
  engine.start();
}

function update(dt) {
  if (state === "title") {
    if (input.isPressed("start")) {
      stage.start();
      state = "play";
    }
    return;
  }

  if (state === "play") {
    stage.update(dt);
    if (stage.isCleared) state = "clear";
    if (stage.isGameOver) state = "gameover";
  }
}

function draw() {
  renderer.clear();

  if (state === "title") {
    renderer.drawTitle();
    return;
  }

  stage.draw(renderer);

  if (state === "clear") renderer.drawStageClear();
  if (state === "gameover") renderer.drawGameOver();
}

init();
