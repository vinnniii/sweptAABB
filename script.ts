//import { Vec2 } from "./vector";
import { Player } from "./classes/Player.js";
import { Rect } from "./classes/Rect.js";
import { borderWalls, tests } from "./tests.js";
import { Vec2d } from "./classes/Vec2d.js";
//import { collisionHandlerStatic , sweptAABBDynamic } from "./collision.js";
import { create_broadphasebox, game_collision } from "./collision.js";


let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let mouse = new Vec2d(0, 0);
//let player = new Player(500, 400, 40, 40, 0, 0,/* new Vec2(500,400), new Vec2(40,40), new Vec2(0,0)*/);
let rects: Array<Rect> = [];
//let posQueue: Array<Vec2d> = [];
//let bot = new Player(600, 400, 40, 40, 1, 0.5, /*new Vec2(600,400), new Vec2(40,40), new Vec2(1,0.5)*/);

export let players: Array<Player> = [];
//players.push(player); players.push(bot);
//players.push(new Player(450, 400, 40, 40, -1, 1));

let runIntervall: number = 0;


function runTest(name: string) {

  if (runIntervall) {
    clearInterval(runIntervall);
    runIntervall = 0;
  }

  players = [];
  rects = [];

  const s = parseFloat((<HTMLSelectElement>document.getElementById("speed")).value);



  const t = tests.filter(t => t.name === name)[0];
  if (t) {
    let nr = 1;
    for (const p of t.players) {
      players.push(new Player(nr++,p.x, p.y, 40, 40, p.dx * s, p.dy * s))
    }
    for (const r of t.walls) {
      rects.push(new Rect(r.x, r.y, r.w, r.h))
    }
    for (const r of borderWalls) {
      rects.push(new Rect(r.x, r.y, r.w, r.h))
    }
  }
  let interval = 100;
  switch(s) {
    case 10: interval = 400; break;
    case 50: interval = 1000; break;
    case 100: interval = 1000; break;
  }
  
  window.setInterval(run, interval)

}

window.onload = () => {

  const buttons = <HTMLDivElement>window.document.getElementById("buttons");
  if (buttons) {
    for (const t of tests) {
      const b = document.createElement("button");
      b.textContent = t.name;
      b.onclick = () => {
        runTest(t.name);
      }
      buttons.appendChild(b);
      if (t.autoStart) {
        runTest(t.name)
      }
    }
  }


  canvas = <HTMLCanvasElement>document.getElementById('cnvs');
  let ctx1 = canvas.getContext("2d");
  if (ctx1) ctx = ctx1;
  else throw ("no context");

  ctx.canvas.width = 600;
  ctx.canvas.height = 600;

  //rects.push(new Rect(0,800,100,20));
  /*rects.push(new Rect(400, 600, 100, 20));
  rects.push(new Rect(500, 600, 100, 20));
  rects.push(new Rect(600, 600, 100, 20));
  rects.push(new Rect(700, 600, 100, 20));
  rects.push(new Rect(400, 300, 20, 300));
  rects.push(new Rect(800, 300, 20, 300));
  rects.push(new Rect(420, 540, 40, 20));
  rects.push(new Rect(400, 280, 400, 20));*/

  window.addEventListener("mousemove", function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
  })

  //runIntervall = window.setInterval(run, 1000);

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    const a = 10;
    const player = players[0];
    if (player) {
      switch (e.key) {
        case "ArrowLeft":
          player.dx -= a;
          break;

        case "ArrowRight":
          player.dx += a;
          break;

        case "ArrowUp":
          player.dy -= a;
          break;

        case "ArrowDown":
          player.dy += a;
          break;
      }
    }
  })

  render();
}

function run() {
  //players[0].dx += (mouse.x - players[0].x) / 1000;
  //players[0].dy += (mouse.y - players[0].y) / 1000;

  /*
  for(const player of players)
  {
      collisionHandlerStatic(player, rects);
  }

  
  for(const player of players)
  {
      sweptAABBDynamic(player, bot);
  }

  for(const player of players)
  {
      collisionHandlerStatic(player, rects);
  }
  */

  game_collision(players, rects);

  for (const player of players) {

    player.x += player.dx*player.remainingTime;
    player.y += player.dy*player.remainingTime;

    player.remainingTime = 1;

  }


}

function render() {
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (const rect of rects) {

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  }

  for (const [i, player] of players.entries()) {

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(player.x, player.y, player.w, player.h);

    const bb = create_broadphasebox(player);
    ctx.strokeStyle = "red"; //"rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(bb.x, bb.y, bb.w, bb.h);

    ctx.font = '20px serif';
    ctx.fillStyle = "white";
    ctx.fillText((i + 1).toString(), player.x + player.w / 2 - 5, player.y + player.h / 2 + 5)
  }

  requestAnimationFrame(render);

}











// vector.ts
/*
export class Vec2 {

    x: number;
    y: number;

    constructor(x: number, y:number){

        this.x = x;
        this.y = y;
    }


    add(v: Vec2){

        let u: Vec2 = this;
        u.x += v.x;
        u.y += v.y;

        return u;
    }

    sub(v: Vec2){

        let u: Vec2 = this;
        u.x -= v.x;
        u.y -= v.y;

        return u;
    }

    length(){

        return Math.sqrt(this.x ** 2 + this.y ** 2);

    }

    mult(v: Vec2){

        let u: Vec2 = this;
        u.x *= v.x;
        u.y *= v.y;

        return u;

    }

    scalar(l: number){

        let u:Vec2 = this;
        u.x *= l;
        u.y *= l;

        return u;

    }

    normalize(){

        let u:Vec2 = this;
        let l = u.length();
        u = u.scalar(l);

        return u;

    }



}
*/

// SWEPT using Vec2

/*import { Player } from "./script";
import { Vec2 } from "./vector";


interface iStatic {

    pos: Vec2;
    dim: Vec2;

}

function signum(x: number): number {
    return x > 0 ? 1 : x < 0 ? -1 : 0
}

export function swept(p: Player, b: iStatic) : {entryTime: number, normal: Vec2} | null {

    let entry: Vec2, exit: Vec2;

    // Find the distance between the objects on the near and far sides for both x and y
    if(p.vel.x > 0) {

        entry.x = b.pos.x - (p.pos.x + p.dim.x);
        exit.x = (b.pos.x + b.dim.x) - p.pos.x;

    }
    else {

        entry.x = (b.pos.x + b.dim.x) - p.pos.x;
        exit.x = b.pos.x - (p.pos.x + p.dim.x);

    }
    if(p.vel.y > 0){

        entry.y = b.pos.y - (p.pos.y + p.dim.y);
        exit.y = (b.pos.y + b.dim.y) - p.pos.y;

    }
    else {

        entry.y = (b.pos.y + b.dim.y) - p.pos.y;
        exit.y = b.pos.y - (p.pos.y + p.dim.y);

    }

    let entry_s: Vec2, exit_s: Vec2;

    // Find the entry / exit scalar
    if(p.vel.x === 0){

        entry_s.x = -Infinity;
        exit_s.x = Infinity;

    }
    else {

        entry_s.x = entry.x / p.vel.x;
        exit_s.x = exit.x / p.vel.x;

    }
    if(p.vel.y === 0){

        entry_s.y = -Infinity;
        exit_s.y = Infinity;

    }
    else {

        entry_s.y = entry.y / p.vel.y;
        exit_s.y = exit.y / p.vel.y;

    }

    if(isNaN(entry_s.x) || isNaN(entry_s.y) || isNaN(exit_s.x) || isNaN(exit_s.y))
        return null;


    let entryTime:number = Math.max(entry_s.x, entry_s.y);
    let exitTime:number = Math.min(exit_s.x, exit_s.y);


    // No collision test
    if (entryTime > exitTime || entry_s.x < 0 && entry_s.y < 0 || entryTime  > 1 || entryTime < 0)
        return null;

    // Return collision normal
    let normal: Vec2;

    if(entry_s.x > entry_s.y)
        normal = new Vec2(-signum(entry.x), 0);
    else
        normal = new Vec2(0, -signum(entry.y));


    return {normal: normal, entryTime: entryTime};

}
*/