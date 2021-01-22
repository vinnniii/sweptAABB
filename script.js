"use strict";
//import { Vec2 } from "./vector";
class Player {
    //pos: Vec2;
    //dim: Vec2;
    //vel: Vec2;
    constructor(x, y, w, h, dx, dy) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dx = dx;
        this.dy = dy;
        this.dxnext = 0;
        this.dynext = 0;
        this.onSolid = false;
        //this.pos = pos;
        //this.dim = dim;
        //this.vel = vel;
    }
}
class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}
class Vec2d {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class CollisionObject {
    constructor(x, y, w, h, dx, dy) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dx = dx;
        this.dy = dy;
    }
}
function signum(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
}
let canvas;
let ctx;
let mouse = new Vec2d(0, 0);
let player = new Player(500, 400, 40, 40, 0, 0);
let rects = [];
//let posQueue: Array<Vec2d> = [];
let bot = new Player(600, 400, 40, 40, 1, 0.5);
let players = [];
players.push(player);
players.push(bot);
function GetSweptBroadphaseBox(player) {
    let broadphasebox = new Rect(0, 0, 0, 0);
    broadphasebox.x = player.dx > 0 ? player.x : player.x + player.dx;
    broadphasebox.y = player.dy > 0 ? player.y : player.y + player.dy;
    broadphasebox.w = player.dx > 0 ? player.dx + player.w : player.w - player.dx;
    broadphasebox.h = player.dy > 0 ? player.dy + player.h : player.h - player.dy;
    return broadphasebox;
}
function sweptAABB(b1, b2) {
    let entry_x, entry_y;
    let exit_x, exit_y;
    // Find the distance between the objects sides on the near and far sides for both x and y 
    if (b1.dx > 0) {
        entry_x = b2.x - (b1.x + b1.w);
        exit_x = (b2.x + b2.w) - b1.x;
    }
    else {
        entry_x = (b2.x + b2.w) - b1.x;
        exit_x = b2.x - (b1.x + b1.w);
    }
    if (b1.dy > 0) {
        entry_y = b2.y - (b1.y + b1.h);
        exit_y = (b2.y + b2.h) - b1.y;
    }
    else {
        entry_y = (b2.y + b2.h) - b1.y;
        exit_y = b2.y - (b1.y + b1.h);
    }
    // Find scalar for collision ("time")
    let entry_scalar_x, entry_scalar_y;
    let exit_scalar_x, exit_scalar_y;
    if (b1.dx === 0) {
        entry_scalar_x = -Infinity;
        exit_scalar_x = Infinity;
    }
    else {
        entry_scalar_x = entry_x / b1.dx;
        exit_scalar_x = exit_x / b1.dx;
    }
    if (b1.dy === 0) {
        entry_scalar_y = -Infinity;
        exit_scalar_y = Infinity;
    }
    else {
        entry_scalar_y = entry_y / b1.dy;
        exit_scalar_y = exit_y / b1.dy;
    }
    if (isNaN(entry_scalar_x) || isNaN(exit_scalar_x) || isNaN(entry_scalar_y) || isNaN(exit_scalar_y))
        return null;
    let entryTime = Math.max(entry_scalar_x, entry_scalar_y);
    let exitTime = Math.min(exit_scalar_x, exit_scalar_y);
    // No collision test
    if (entryTime > exitTime || entry_scalar_x < 0 && entry_scalar_y < 0 || entryTime > 1 || entryTime < 0)
        return null;
    // collision normal
    let normal = new Vec2d(0, 0);
    if (entry_scalar_x > entry_scalar_y) {
        if (entry_x < 0) {
            normal.x = 1;
            normal.y = 0;
        }
        else {
            normal.x = -1;
            normal.y = 0;
        }
    }
    else {
        if (entry_y < 0) {
            normal.x = 0;
            normal.y = 1;
        }
        else {
            normal.x = 0;
            normal.y = -1;
        }
    }
    return { normal: normal, entryTime: entryTime };
}
function resolveCollision(player, normal, entryTime) {
    if (normal.x != 0)
        player.dx -= player.dx * (1 - entryTime);
    if (normal.y != 0)
        player.dy -= player.dy * (1 - entryTime);
    //player.dx += normal.x * Math.abs(player.dx) * (1 - entryTime);
    //player.dy += normal.y * Math.abs(player.dy) * (1 - entryTime);
}
function collisionHandlerStatic(player, rects) {
    // Optimization
    let rects_to_check = [];
    let check_box = GetSweptBroadphaseBox(player);
    for (const rect of rects) {
        if (check_box.x < rect.x + rect.w && check_box.x + check_box.w > rect.x &&
            check_box.y < rect.y + rect.h && check_box.y + check_box.h > rect.y) {
            rects_to_check.push(rect);
        }
    }
    // No collisions possible
    if (rects_to_check.length === 0)
        return;
    // Add collision to array
    let arr = [];
    let index = 0;
    for (const rect of rects_to_check) {
        let collision = sweptAABB(player, rect);
        if (collision)
            arr.push({ index: index, entryTime: collision.entryTime });
        index++;
    }
    // No collisions
    if (arr.length === 0)
        return;
    // Sort by distance
    arr.sort(function (a, b) {
        return a.entryTime - b.entryTime;
    });
    if (arr.length > 1)
        console.log(rects_to_check[arr[0].index], rects_to_check[arr[1].index]);
    // resolve 
    if (arr) {
        console.log(arr.length);
        for (let i = 0; i < arr.length; i++) {
            let collision = sweptAABB(player, rects_to_check[arr[i].index]);
            if (collision) {
                resolveCollision(player, collision.normal, collision.entryTime);
                if (collision.normal.x === 0 && collision.normal.y === -1)
                    player.onSolid = true;
            }
        }
        ;
    }
    return;
}
function resolveCollisionDynamic(p1, p2, normal, entryTime) {
    let rTime = 1 - entryTime;
    // Update location
    p1.x -= p1.dx * rTime;
    p1.y -= p1.dy * rTime;
    p2.y -= p2.dy * rTime;
    p2.x -= p2.dx * rTime;
    // New velocity
    let tempx = (p1.dx + p2.dx) / 2, tempy = (p1.dy + p2.dy) / 2;
    p1.dx = tempx;
    p1.dy = tempy;
    p2.dx = tempx;
    p2.dy = tempy;
}
function sweptAABBDynamic(p1, p2) {
    let rel_vel_dx = p2.dx - p1.dx;
    let rel_vel_dy = p2.dy - p1.dy;
    let testObjDynamic = new CollisionObject(p2.x, p2.y, p2.w, p2.h, rel_vel_dx, rel_vel_dy);
    let testObjStatic = new CollisionObject(p1.x, p1.y, p1.w, p1.h, 0, 0);
    let collision = sweptAABB(testObjDynamic, testObjStatic);
    if (collision)
        resolveCollisionDynamic(p1, p2, collision.normal, collision.entryTime);
}
function collisionHandlerDynamic(p1) {
    let check_box = GetSweptBroadphaseBox(p1);
    // Player player collisions
    for (const p2 of players) {
        if (p1 == p2)
            continue;
        let check_box2 = GetSweptBroadphaseBox(p2);
        if (check_box.x < check_box2.x + check_box2.w && check_box.x + check_box.w > check_box2.x &&
            check_box.y < check_box2.y + check_box2.h && check_box.y + check_box.h > check_box2.y) {
            console.log("AAAA");
            let rel_vel_dx = p2.dx - p1.dx;
            let rel_vel_dy = p2.dy - p1.dy;
            let testObjDynamic = new CollisionObject(p2.x, p2.y, p2.w, p2.h, rel_vel_dx, rel_vel_dy);
            let collision = sweptAABB(testObjDynamic, p2);
            if (collision)
                console.log("aa");
            if (collision)
                resolveCollisionDynamic(p1, p2, collision.normal, collision.entryTime);
        }
    }
}
window.onload = () => {
    canvas = document.getElementById('cnvs');
    let ctx1 = canvas.getContext("2d");
    if (ctx1)
        ctx = ctx1;
    else
        throw ("no context");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    //rects.push(new Rect(0,800,100,20));
    rects.push(new Rect(400, 600, 100, 20));
    rects.push(new Rect(500, 600, 100, 20));
    rects.push(new Rect(600, 600, 100, 20));
    rects.push(new Rect(700, 600, 100, 20));
    rects.push(new Rect(400, 300, 20, 300));
    rects.push(new Rect(800, 300, 20, 300));
    rects.push(new Rect(420, 540, 40, 20));
    rects.push(new Rect(400, 280, 400, 20));
    window.addEventListener("mousemove", function (e) {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    window.setInterval(run, 20);
    render();
};
function run() {
    player.dx = (mouse.x - player.x) / 100;
    player.dy = (mouse.y - player.y) / 100;
    for (const player of players) {
        collisionHandlerStatic(player, rects);
    }
    for (const player of players) {
        sweptAABBDynamic(player, bot);
        //collisionHandlerDynamic(player);
    }
    for (const player of players) {
        collisionHandlerStatic(player, rects);
    }
    for (const player of players) {
        player.x += player.dx;
        player.y += player.dy;
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
    for (const player of players) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(player.x, player.y, player.w, player.h);
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
